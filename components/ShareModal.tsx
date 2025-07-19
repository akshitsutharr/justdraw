import React from "react"
import { Button } from "@/components/ui/button"

export function ShareModal({ open, link, onClose }: { open: boolean, link: string, onClose: () => void }) {
  if (!open) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(link)
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg min-w-[320px]">
        <h2 className="text-lg font-semibold mb-2">Share your drawing</h2>
        <input
          type="text"
          value={link}
          readOnly
          className="w-full border rounded px-2 py-1 mb-3 text-sm"
        />
        <div className="flex gap-2">
          <Button onClick={handleCopy}>Copy Link</Button>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  )
}