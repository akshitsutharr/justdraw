"use client"

import { Button } from "@/components/ui/button"
import { Minus, Plus, RotateCcw } from "lucide-react"

interface ZoomControlsProps {
  zoom: number
  onZoomIn: () => void
  onZoomOut: () => void
  onResetZoom: () => void
}

export function ZoomControls({ zoom, onZoomIn, onZoomOut, onResetZoom }: ZoomControlsProps) {
  return (
    <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-white border border-gray-200 rounded-lg shadow-sm p-1">
      <Button variant="ghost" size="sm" onClick={onZoomOut} className="h-7 w-7 p-0" title="Zoom out">
        <Minus className="h-3 w-3" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onResetZoom}
        className="h-7 px-2 text-xs font-mono min-w-12"
        title="Reset zoom"
      >
        {Math.round(zoom * 100)}%
      </Button>

      <Button variant="ghost" size="sm" onClick={onZoomIn} className="h-7 w-7 p-0" title="Zoom in">
        <Plus className="h-3 w-3" />
      </Button>

      <Button variant="ghost" size="sm" onClick={onResetZoom} className="h-7 w-7 p-0" title="Reset view">
        <RotateCcw className="h-3 w-3" />
      </Button>
    </div>
  )
}
