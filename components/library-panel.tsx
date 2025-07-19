"use client"

import { Button } from "@/components/ui/button"
import { X, Square, Circle, Triangle, Star, Heart, ArrowRight } from "lucide-react"

interface LibraryPanelProps {
  onClose: () => void
  onAddShape: (shapeType: string) => void
}

export function LibraryPanel({ onClose, onAddShape }: LibraryPanelProps) {
  const shapes = [
    { name: "Rectangle", icon: Square, type: "rectangle" },
    { name: "Circle", icon: Circle, type: "circle" },
    { name: "Triangle", icon: Triangle, type: "triangle" },
    { name: "Star", icon: Star, type: "star" },
    { name: "Heart", icon: Heart, type: "heart" },
    { name: "Arrow", icon: ArrowRight, type: "arrow" },
  ]

  return (
    <div className="absolute top-0 right-0 w-80 h-full bg-white border-l border-gray-200 shadow-lg z-50">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Library</h3>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2 text-gray-700">Basic Shapes</h4>
          <div className="grid grid-cols-3 gap-2">
            {shapes.map((shape) => (
              <Button
                key={shape.type}
                variant="outline"
                className="h-16 flex flex-col items-center justify-center gap-1 hover:bg-gray-50 bg-transparent"
                onClick={() => onAddShape(shape.type)}
              >
                <shape.icon className="h-6 w-6" />
                <span className="text-xs">{shape.name}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2 text-gray-700">Templates</h4>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full h-12 justify-start bg-transparent"
              onClick={() => onAddShape("flowchart")}
            >
              Flowchart Template
            </Button>
            <Button
              variant="outline"
              className="w-full h-12 justify-start bg-transparent"
              onClick={() => onAddShape("wireframe")}
            >
              Wireframe Template
            </Button>
            <Button
              variant="outline"
              className="w-full h-12 justify-start bg-transparent"
              onClick={() => onAddShape("mindmap")}
            >
              Mind Map Template
            </Button>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2 text-gray-700">Recent</h4>
          <div className="text-sm text-gray-500">No recent items</div>
        </div>
      </div>
    </div>
  )
}
