"""Gradio frontend for Proximity AI — calls the FastAPI backend over HTTP."""

from __future__ import annotations

import os
from typing import Any, Dict, List, Optional, Tuple

import gradio as gr
import pandas as pd
import plotly.express as px
import requests

def _api_base_url() -> str:
    explicit = os.getenv("API_URL")
    if explicit:
        return explicit.rstrip("/")
    port = os.getenv("PORT", "8000")
    return f"http://127.0.0.1:{port}"


def _fetch_cache_stats() -> str:
    try:
        resp = requests.get(f"{_api_base_url()}/cache/stats", timeout=10)
        stats = resp.json()
        if stats.get("error"):
            return f"Cache error: {stats['error']}"
        return (
            f"**Type:** {stats.get('cache_type', 'Unknown')}  \n"
            f"**Keys:** {stats.get('total_keys', 0)}  \n"
            f"**Memory:** {stats.get('used_memory', '0B')}"
        )
    except Exception as e:
        return f"Cache unavailable: {e}"


def _clear_cache() -> str:
    try:
        requests.delete(f"{_api_base_url()}/cache/clear", timeout=10)
        return "Cache cleared."
    except Exception as e:
        return f"Failed to clear cache: {e}"


def _tier_pie_html(tier_counts: Dict[str, int]) -> str:
    if not tier_counts:
        return ""
    fig = px.pie(names=list(tier_counts.keys()), values=list(tier_counts.values()), title="Customer Tiers")
    return fig.to_html(include_plotlyjs="cdn", full_html=False)


def _segment_pie_html(segment_counts: Dict[str, int]) -> str:
    if not segment_counts:
        return ""
    fig = px.pie(names=list(segment_counts.keys()), values=list(segment_counts.values()), title="Customer Segments")
    return fig.to_html(include_plotlyjs="cdn", full_html=False)


def _format_insights(ai_insights: Optional[Dict[str, Any]]) -> str:
    if not ai_insights:
        return "_No AI insights._"
    lines = [f"### Executive Summary\n{ai_insights.get('insights_summary', 'N/A')}", "\n### Recommended Actions"]
    for action in ai_insights.get("recommended_actions", []):
        lines.append(f"- {action}")
    templates = ai_insights.get("email_templates", [])
    if templates:
        lines.append("\n### Email Templates")
        for i, tmpl in enumerate(templates[:3], 1):
            lines.append(
                f"\n**Email {i}** — To: `{tmpl.get('to', '')}`  \n"
                f"Subject: {tmpl.get('subject', '')}  \n"
                f"```\n{tmpl.get('body', '')}\n```"
            )
    return "\n".join(lines)


def analyze_customers(
    file: Optional[str],
    use_ai: bool,
) -> Tuple[str, str, str, pd.DataFrame, pd.DataFrame, str, str]:
    empty_df = pd.DataFrame()
    if file is None:
        return (
            "Upload a CSV or Excel file to begin.",
            "",
            "",
            empty_df,
            empty_df,
            "_No insights yet._",
            _fetch_cache_stats(),
        )

    filename = os.path.basename(file)
    try:
        with open(file, "rb") as f:
            files = {"file": (filename, f, "application/octet-stream")}
            resp = requests.post(
                f"{_api_base_url()}/analyze/rfm",
                files=files,
                params={"use_ai": use_ai},
                timeout=120,
            )
    except requests.exceptions.ConnectionError:
        return (
            "Could not reach the API. Start the server with `uvicorn main:app --reload`.",
            "",
            "",
            empty_df,
            empty_df,
            "_Backend offline._",
            _fetch_cache_stats(),
        )

    if resp.status_code != 200:
        detail = resp.json().get("detail", resp.text) if resp.headers.get("content-type", "").startswith("application/json") else resp.text
        return (
            f"API error ({resp.status_code}): {detail}",
            "",
            "",
            empty_df,
            empty_df,
            "_Analysis failed._",
            _fetch_cache_stats(),
        )

    data = resp.json()
    summary = data.get("summary", {})
    tier_counts = summary.get("tier_counts", {})
    segment_counts = summary.get("segment_counts", {})
    customers = pd.DataFrame(data.get("customers", []))
    agent = data.get("agent", {})
    agent_actions = agent.get("actions", [])
    agent_metadata = agent.get("metadata", {})
    discount_codes = agent.get("discount_codes", [])
    is_cached = data.get("cached", False)

    total = sum(tier_counts.values())
    status = "Loaded from cache" if is_cached else "Computed fresh"
    summary_md = (
        f"**{total}** customers analyzed ({status})  \n\n"
        f"| Tier | Count |\n|------|-------|\n"
        + "\n".join(f"| {k} | {v} |" for k, v in tier_counts.items())
        + "\n\n"
        f"**Agent:** {agent_metadata.get('routed_customers', 0)} routed · "
        f"{agent_metadata.get('generated_discounts', 0)} discounts · "
        f"{len(agent_actions)} actions"
    )
    if discount_codes:
        summary_md += f"\n\n**Discount codes:** `{', '.join(discount_codes[:10])}`"

    actions_df = pd.DataFrame(agent_actions) if agent_actions else pd.DataFrame()
    if not actions_df.empty:
        display_cols = [c for c in [
            "customer_name", "customer_email", "tier", "segment",
            "action_type", "discount_code", "priority", "email_subject",
        ] if c in actions_df.columns]
        actions_df = actions_df[display_cols]

    customer_cols = [c for c in [
        "name", "email", "spend", "visits", "last_order",
        "churn_risk", "tier", "segment", "rfm_score",
    ] if c in customers.columns]
    customers_display = customers[customer_cols] if customer_cols else customers

    return (
        summary_md,
        _tier_pie_html(tier_counts),
        _segment_pie_html(segment_counts),
        customers_display,
        actions_df,
        _format_insights(data.get("ai_insights")),
        _fetch_cache_stats(),
    )


def build_demo() -> gr.Blocks:
    with gr.Blocks(title="Proximity AI") as demo:
        gr.Markdown(
            "# Proximity AI — Customer Intelligence\n"
            "Upload customer data (CSV/Excel) for **RFM segmentation**, **churn risk**, "
            "**AI insights** (Gemini), and **autonomous agent actions**."
        )

        with gr.Row():
            file_input = gr.File(label="Customer data", file_types=[".csv", ".xlsx", ".xls"])
            use_ai = gr.Checkbox(label="Enable AI insights (Gemini)", value=True)
            analyze_btn = gr.Button("Analyze", variant="primary")

        with gr.Row():
            cache_stats = gr.Markdown(value=_fetch_cache_stats())
            clear_cache_btn = gr.Button("Clear cache", size="sm")

        summary_out = gr.Markdown()

        with gr.Row():
            tier_chart = gr.HTML(label="Tier distribution")
            segment_chart = gr.HTML(label="Segment distribution")

        with gr.Tabs():
            with gr.Tab("Customers"):
                customers_table = gr.Dataframe(label="Customers")
            with gr.Tab("Agent actions"):
                actions_table = gr.Dataframe(label="Agent actions")
            with gr.Tab("AI insights"):
                insights_out = gr.Markdown()

        outputs = [summary_out, tier_chart, segment_chart, customers_table, actions_table, insights_out, cache_stats]

        analyze_btn.click(fn=analyze_customers, inputs=[file_input, use_ai], outputs=outputs)
        file_input.change(fn=analyze_customers, inputs=[file_input, use_ai], outputs=outputs)
        clear_cache_btn.click(fn=lambda: (_clear_cache(), _fetch_cache_stats())[1], outputs=cache_stats)

        gr.Markdown(
            "---\n"
            "API docs: [`/docs`](/docs) · Agent config: [`/agent/config`](/agent/config)"
        )

    return demo
