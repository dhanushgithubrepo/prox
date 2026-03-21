// API service for connecting to FastAPI backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

export interface AnalysisResult {
  summary: {
    tier_counts: Record<string, number>
    segment_counts: Record<string, number>
    top_at_risk_emails: string[]
  }
  customers: Array<{
    name: string
    email: string
    spend: number
    visits: number
    last_order: string
    churn_risk: number
    tier: string
    segment: string
    rfm_score: string
  }>
  ai_insights: {
    insights_summary: string
    recommended_actions: string[]
    email_templates: Array<{
      to: string
      subject: string
      body: string
    }>
  } | null
  agent: {
    metadata: {
      total_customers: number
      routed_customers: number
      generated_discounts: number
      run_at: string
      workflow_latency_ms: number
      traced_actions: number
    }
    actions: Array<{
      customer_id: string
      customer_email: string
      customer_name: string
      tier: string
      segment: string
      churn_risk: number
      action_type: string
      discount_code: string | null
      email_subject: string
      email_body: string
      priority: number
    }>
    discount_codes: string[]
  }
  cached: boolean
}

export const apiService = {
  async analyzeCSV(file: File, useAI: boolean = true): Promise<AnalysisResult> {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(`${API_BASE_URL}/analyze/rfm?use_ai=${useAI}`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Failed to analyze CSV")
    }

    return response.json()
  },

  async getCacheStats(): Promise<{
    cache_type: string
    total_keys: number
    memory_used: string
    error?: string
  }> {
    const response = await fetch(`${API_BASE_URL}/cache/stats`)
    return response.json()
  },

  async getTraces(limit: number = 20): Promise<{
    traces: Array<{
      run_id: string
      timestamp: string
      customer_email: string
      tier: string
      action_type: string
      discount_code: string
      priority: number
    }>
    total_traced: number
  }> {
    const response = await fetch(`${API_BASE_URL}/traces?limit=${limit}`)
    return response.json()
  },

  async getAgentConfig(): Promise<{
    routing_rules: Record<string, string>
    priority_weights: Record<string, number>
    discount_generation: boolean
    tracer_enabled: boolean
  }> {
    const response = await fetch(`${API_BASE_URL}/agent/config`)
    return response.json()
  },
}
