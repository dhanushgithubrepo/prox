"use client"

import type React from "react"
import { ArrowRight } from "lucide-react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UploadCloud, FileText, X, CheckCircle2, ArrowLeft, MapPin, AlertCircle } from "lucide-react"
import { apiService, type AnalysisResult } from "@/lib/api"

export default function UploadPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return
    setIsUploading(true)
    setError(null)

    try {
      // Call FastAPI backend
      const result = await apiService.analyzeCSV(file, true)
      
      // Store result in sessionStorage for dashboard to access
      sessionStorage.setItem("analysisResult", JSON.stringify(result))
      
      // Navigate to dashboard
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze data. Please try again.")
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-background p-4 md:p-8 flex items-center justify-center">
      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>
      <Card className="w-full max-w-lg shadow-2xl border-primary/20 bg-card">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <MapPin className="h-7 w-7 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-serif font-medium">Upload Sales Data</CardTitle>
          <CardDescription className="text-base">
            Drop your customer CSV and we'll unlock proximity-driven growth in seconds.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!file ? (
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-primary/30 rounded-2xl hover:bg-primary/5 hover:border-primary/50 transition-all cursor-pointer group">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-14 h-14 text-primary/60 group-hover:text-primary transition-colors mb-4" />
                <p className="mb-2 text-sm text-foreground font-medium">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">CSV files only • Max 10MB</p>
              </div>
              <input type="file" className="hidden" accept=".csv" onChange={handleFileChange} />
            </label>
          ) : (
            <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/20">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/15 rounded-lg">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground truncate max-w-[200px]">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setFile(null)} className="hover:bg-primary/20">
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <Button
            className="w-full py-6 text-base bg-primary hover:bg-primary/90"
            disabled={!file || isUploading}
            onClick={handleUpload}
          >
            {isUploading ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Analyzing Data...
              </>
            ) : (
              <>
                Unlock Proximity Insights
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>

          {isUploading && (
            <div className="flex items-center justify-center text-xs text-muted-foreground animate-pulse">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Segmenting customers • Predicting churn • Generating campaigns
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 rounded-xl border border-red-200 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="bg-muted/50 rounded-xl p-4 border border-border">
            <p className="text-xs text-muted-foreground text-center">
              <span className="font-medium text-foreground">Pro tip:</span> Include columns like purchase date, amount,
              product category, and visit frequency.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
