"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { WhiteboardApp } from "@/components/whiteboard-app" // <-- default import, no curly braces

export default function DrawPage() {
  const params = useParams()
  const code = params.code as string
  const [drawing, setDrawing] = useState<any>(null)

  useEffect(() => {
    if (code) {
      const data = localStorage.getItem(`drawing_${code}`)
      if (data) {
        try {
          setDrawing(JSON.parse(data))
        } catch {
          setDrawing(null)
        }
      }
    }
  }, [code])

  if (!drawing) {
    return <div className="p-8 text-center text-lg">No drawing found for this link.</div>
  }

  return (
    <div className="h-screen w-screen">
      <WhiteboardApp initialData={drawing} />
    </div>
  )
}