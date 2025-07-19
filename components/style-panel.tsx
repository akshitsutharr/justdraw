"use client"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import {
  ChevronUp,
  ChevronDown,
  SkipForward,
  SkipBack,
  Copy,
  Trash2,
  Square,
  SquareIcon as CornerSquare,
} from "lucide-react"
import type { ElementStyle } from "@/types/whiteboard"
import { cn } from "@/lib/utils"

interface StylePanelProps {
  currentStyle: ElementStyle
  onStyleChange: (style: Partial<ElementStyle>) => void
  selectedElements: string[]
  onMoveToFront: () => void
  onMoveToBack: () => void
  onMoveForward: () => void
  onMoveBackward: () => void
  hasSelection: boolean
  onDuplicate: () => void
  onDelete: () => void
}

export function StylePanel({
  currentStyle,
  onStyleChange,
  selectedElements,
  onMoveToFront,
  onMoveToBack,
  onMoveForward,
  onMoveBackward,
  hasSelection,
  onDuplicate,
  onDelete,
}: StylePanelProps) {
  const strokeColors = [
    { name: "Black", value: "#000000" },
    { name: "Red", value: "#e03131" },
    { name: "Green", value: "#2f9e44" },
    { name: "Blue", value: "#1971c2" },
    { name: "Orange", value: "#f76707" },
    { name: "Gray", value: "#868e96" },
  ]

  const backgroundColors = [
    { name: "Transparent", value: "transparent" },
    { name: "Light Pink", value: "#ffc9c9" },
    { name: "Light Green", value: "#b2f2bb" },
    { name: "Light Blue", value: "#a5f3fc" },
    { name: "Light Yellow", value: "#ffec99" },
    { name: "Light Purple", value: "#d0bfff" },
  ]

  const strokeWidths = [
    { name: "Thin", value: 1 },
    { name: "Medium", value: 2 },
    { name: "Thick", value: 4 },
  ]

  const strokeStyles = [
    { name: "Solid", value: "solid" as const },
    { name: "Dashed", value: "dashed" as const },
    { name: "Dotted", value: "dotted" as const },
  ]

  const sloppinessLevels = [
    { name: "Architect", value: 0 },
    { name: "Artist", value: 1 },
    { name: "Cartoonist", value: 2 },
  ]

  const edgeStyles = [
    { name: "Sharp", value: "sharp" as const, icon: Square },
    { name: "Round", value: "round" as const, icon: CornerSquare },
  ]

  return (
    <div className="w-52 bg-white border-r border-gray-200 p-3 overflow-y-auto text-sm">
      <div className="space-y-4">
        {/* Stroke Color */}
        <div>
          <Label className="text-xs font-medium mb-2 block text-gray-700">Stroke</Label>
          <div className="grid grid-cols-6 gap-1">
            {strokeColors.map((color) => (
              <button
                key={color.value}
                className={cn(
                  "w-6 h-6 rounded border-2 transition-all",
                  currentStyle.strokeColor === color.value
                    ? "border-blue-500 scale-110"
                    : "border-gray-300 hover:border-gray-400",
                )}
                style={{ backgroundColor: color.value }}
                onClick={() => onStyleChange({ strokeColor: color.value })}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Background Color */}
        <div>
          <Label className="text-xs font-medium mb-2 block text-gray-700">Background</Label>
          <div className="grid grid-cols-6 gap-1">
            {backgroundColors.map((color) => (
              <button
                key={color.value}
                className={cn(
                  "w-6 h-6 rounded border-2 transition-all relative",
                  currentStyle.fillColor === color.value
                    ? "border-blue-500 scale-110"
                    : "border-gray-300 hover:border-gray-400",
                )}
                style={{
                  backgroundColor: color.value === "transparent" ? "#ffffff" : color.value,
                }}
                onClick={() => onStyleChange({ fillColor: color.value })}
                title={color.name}
              >
                {color.value === "transparent" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-0.5 bg-red-500 rotate-45"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Stroke Width */}
        <div>
          <Label className="text-xs font-medium mb-2 block text-gray-700">Stroke width</Label>
          <div className="flex gap-1">
            {strokeWidths.map((width) => (
              <Button
                key={width.value}
                variant={currentStyle.strokeWidth === width.value ? "default" : "outline"}
                size="sm"
                className="flex-1 text-xs h-7"
                onClick={() => onStyleChange({ strokeWidth: width.value })}
              >
                <div
                  className="bg-current rounded-full"
                  style={{
                    width: `${Math.max(width.value * 2, 2)}px`,
                    height: `${Math.max(width.value, 1)}px`,
                  }}
                />
              </Button>
            ))}
          </div>
        </div>

        {/* Stroke Style */}
        <div>
          <Label className="text-xs font-medium mb-2 block text-gray-700">Stroke style</Label>
          <div className="flex gap-1">
            {strokeStyles.map((style) => (
              <Button
                key={style.value}
                variant={currentStyle.strokeStyle === style.value ? "default" : "outline"}
                size="sm"
                className="flex-1 text-xs h-7"
                onClick={() => onStyleChange({ strokeStyle: style.value })}
              >
                <div
                  className="w-4 h-0.5 bg-current"
                  style={{
                    backgroundImage:
                      style.value === "dashed"
                        ? "repeating-linear-gradient(to right, currentColor 0, currentColor 2px, transparent 2px, transparent 4px)"
                        : style.value === "dotted"
                          ? "repeating-linear-gradient(to right, currentColor 0, currentColor 1px, transparent 1px, transparent 3px)"
                          : "none",
                  }}
                />
              </Button>
            ))}
          </div>
        </div>

        {/* Sloppiness */}
        <div>
          <Label className="text-xs font-medium mb-2 block text-gray-700">Sloppiness</Label>
          <div className="flex gap-1">
            {sloppinessLevels.map((level) => (
              <Button
                key={level.value}
                variant={currentStyle.roughness === level.value ? "default" : "outline"}
                size="sm"
                className="flex-1 text-xs h-7"
                onClick={() => onStyleChange({ roughness: level.value })}
                title={level.name}
              >
                {level.name.charAt(0)}
              </Button>
            ))}
          </div>
        </div>

        {/* Edge Style */}
        <div>
          <Label className="text-xs font-medium mb-2 block text-gray-700">Edges</Label>
          <div className="flex gap-1">
            {edgeStyles.map((style) => (
              <Button
                key={style.value}
                variant={currentStyle.edge === style.value ? "default" : "outline"}
                size="sm"
                className="flex-1 text-xs h-7"
                onClick={() => onStyleChange({ edge: style.value })}
              >
                <style.icon className="h-3 w-3" />
              </Button>
            ))}
          </div>
        </div>

        {/* Opacity */}
        <div>
          <Label className="text-xs font-medium mb-2 block text-gray-700">Opacity</Label>
          <div className="px-1">
            <Slider
              value={[currentStyle.opacity * 100]}
              onValueChange={([value]) => onStyleChange({ opacity: value / 100 })}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>{Math.round(currentStyle.opacity * 100)}</span>
              <span>100</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Layer Controls */}
        <div>
          <Label className="text-xs font-medium mb-2 block text-gray-700">Layers</Label>
          <div className="grid grid-cols-2 gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={onMoveToBack}
              disabled={!hasSelection}
              className="text-xs h-7 bg-transparent"
              title="Send to back"
            >
              <SkipBack className="h-3 w-3 mr-1" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onMoveBackward}
              disabled={!hasSelection}
              className="text-xs h-7 bg-transparent"
              title="Send backward"
            >
              <ChevronDown className="h-3 w-3 mr-1" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onMoveForward}
              disabled={!hasSelection}
              className="text-xs h-7 bg-transparent"
              title="Bring forward"
            >
              <ChevronUp className="h-3 w-3 mr-1" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onMoveToFront}
              disabled={!hasSelection}
              className="text-xs h-7 bg-transparent"
              title="Bring to front"
            >
              <SkipForward className="h-3 w-3 mr-1" />
            </Button>
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div>
          <Label className="text-xs font-medium mb-2 block text-gray-700">Actions</Label>
          <div className="grid grid-cols-2 gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={onDuplicate}
              disabled={!hasSelection}
              className="text-xs h-7 bg-transparent"
              title="Duplicate (Ctrl+D)"
            >
              <Copy className="h-3 w-3 mr-1" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              disabled={!hasSelection}
              className="text-xs h-7 bg-transparent"
              title="Delete (Del)"
            >
              <Trash2 className="h-3 w-3 mr-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
