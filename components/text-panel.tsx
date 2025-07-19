"use client"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight, Type, X } from "lucide-react"
import type { TextStyle } from "@/types/whiteboard"
import { cn } from "@/lib/utils"

interface TextPanelProps {
  isVisible: boolean
  onClose: () => void
  textStyle: TextStyle
  onTextStyleChange: (style: Partial<TextStyle>) => void
  selectedText: string
  onTextChange: (text: string) => void
}

export function TextPanel({
  isVisible,
  onClose,
  textStyle,
  onTextStyleChange,
  selectedText,
  onTextChange,
}: TextPanelProps) {
  if (!isVisible) return null

  const fontFamilies = [
    { name: "Arial", value: "Arial, sans-serif" },
    { name: "Helvetica", value: "Helvetica, sans-serif" },
    { name: "Times New Roman", value: "Times New Roman, serif" },
    { name: "Georgia", value: "Georgia, serif" },
    { name: "Courier New", value: "Courier New, monospace" },
    { name: "Verdana", value: "Verdana, sans-serif" },
    { name: "Comic Sans MS", value: "Comic Sans MS, cursive" },
    { name: "Impact", value: "Impact, sans-serif" },
    { name: "Trebuchet MS", value: "Trebuchet MS, sans-serif" },
    { name: "Palatino", value: "Palatino, serif" },
  ]

  const textColors = [
    { name: "Black", value: "#000000" },
    { name: "White", value: "#ffffff" },
    { name: "Red", value: "#e03131" },
    { name: "Green", value: "#2f9e44" },
    { name: "Blue", value: "#1971c2" },
    { name: "Orange", value: "#f76707" },
    { name: "Purple", value: "#7c2d12" },
    { name: "Gray", value: "#868e96" },
    { name: "Pink", value: "#d6336c" },
    { name: "Teal", value: "#0ca678" },
    { name: "Yellow", value: "#fab005" },
    { name: "Indigo", value: "#4c6ef5" },
  ]

  const backgroundColors = [
    { name: "Transparent", value: "transparent" },
    { name: "White", value: "#ffffff" },
    { name: "Light Gray", value: "#f8f9fa" },
    { name: "Light Pink", value: "#ffc9c9" },
    { name: "Light Green", value: "#b2f2bb" },
    { name: "Light Blue", value: "#a5f3fc" },
    { name: "Light Yellow", value: "#ffec99" },
    { name: "Light Purple", value: "#d0bfff" },
    { name: "Light Orange", value: "#ffd8a8" },
  ]

  return (
    <div className="top-16 right-4 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Type className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Text Editor</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {/* Text Input */}
        <div>
          <Label className="text-sm font-medium mb-2 block text-gray-700">Text Content</Label>
          <textarea
            value={selectedText}
            onChange={(e) => onTextChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md resize-none h-20 text-sm"
            placeholder="Enter your text here..."
          />
        </div>

        {/* Font Family */}
        <div>
          <Label className="text-sm font-medium mb-2 block text-gray-700">Font Family</Label>
          <Select value={textStyle.fontFamily} onValueChange={(value) => onTextStyleChange({ fontFamily: value })}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fontFamilies.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  <span style={{ fontFamily: font.value }}>{font.name}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Font Size */}
        <div>
          <Label className="text-sm font-medium mb-2 block text-gray-700">Font Size</Label>
          <div className="flex items-center gap-2">
            <Slider
              value={[textStyle.fontSize]}
              onValueChange={([value]) => onTextStyleChange({ fontSize: value })}
              max={72}
              min={8}
              step={1}
              className="flex-1"
            />
            <Input
              type="number"
              value={textStyle.fontSize}
              onChange={(e) => onTextStyleChange({ fontSize: Number.parseInt(e.target.value) || 16 })}
              className="w-16 h-8 text-sm"
              min={8}
              max={72}
            />
          </div>
        </div>

        {/* Text Formatting */}
        <div>
          <Label className="text-sm font-medium mb-2 block text-gray-700">Formatting</Label>
          <div className="flex gap-1">
            <Button
              variant={textStyle.fontWeight === "bold" ? "default" : "outline"}
              size="sm"
              onClick={() =>
                onTextStyleChange({
                  fontWeight: textStyle.fontWeight === "bold" ? "normal" : "bold",
                })
              }
              className="h-8 w-8 p-0"
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant={textStyle.fontStyle === "italic" ? "default" : "outline"}
              size="sm"
              onClick={() =>
                onTextStyleChange({
                  fontStyle: textStyle.fontStyle === "italic" ? "normal" : "italic",
                })
              }
              className="h-8 w-8 p-0"
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant={textStyle.textDecoration === "underline" ? "default" : "outline"}
              size="sm"
              onClick={() =>
                onTextStyleChange({
                  textDecoration: textStyle.textDecoration === "underline" ? "none" : "underline",
                })
              }
              className="h-8 w-8 p-0"
              title="Underline"
            >
              <Underline className="h-4 w-4" />
            </Button>
            <Button
              variant={textStyle.textDecoration === "line-through" ? "default" : "outline"}
              size="sm"
              onClick={() =>
                onTextStyleChange({
                  textDecoration: textStyle.textDecoration === "line-through" ? "none" : "line-through",
                })
              }
              className="h-8 w-8 p-0"
              title="Strikethrough"
            >
              <Strikethrough className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Text Alignment */}
        <div>
          <Label className="text-sm font-medium mb-2 block text-gray-700">Alignment</Label>
          <div className="flex gap-1">
            <Button
              variant={textStyle.textAlign === "left" ? "default" : "outline"}
              size="sm"
              onClick={() => onTextStyleChange({ textAlign: "left" })}
              className="h-8 w-8 p-0"
              title="Align Left"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              variant={textStyle.textAlign === "center" ? "default" : "outline"}
              size="sm"
              onClick={() => onTextStyleChange({ textAlign: "center" })}
              className="h-8 w-8 p-0"
              title="Align Center"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              variant={textStyle.textAlign === "right" ? "default" : "outline"}
              size="sm"
              onClick={() => onTextStyleChange({ textAlign: "right" })}
              className="h-8 w-8 p-0"
              title="Align Right"
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Text Color */}
        <div>
          <Label className="text-sm font-medium mb-2 block text-gray-700">Text Color</Label>
          <div className="grid grid-cols-6 gap-1">
            {textColors.map((color) => (
              <button
                key={color.value}
                className={cn(
                  "w-8 h-8 rounded border-2 transition-all",
                  textStyle.textColor === color.value
                    ? "border-blue-500 scale-110"
                    : "border-gray-300 hover:border-gray-400",
                )}
                style={{ backgroundColor: color.value }}
                onClick={() => onTextStyleChange({ textColor: color.value })}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Background Color */}
        <div>
          <Label className="text-sm font-medium mb-2 block text-gray-700">Background Color</Label>
          <div className="grid grid-cols-6 gap-1">
            {backgroundColors.map((color) => (
              <button
                key={color.value}
                className={cn(
                  "w-8 h-8 rounded border-2 transition-all relative",
                  textStyle.backgroundColor === color.value
                    ? "border-blue-500 scale-110"
                    : "border-gray-300 hover:border-gray-400",
                )}
                style={{
                  backgroundColor: color.value === "transparent" ? "#ffffff" : color.value,
                }}
                onClick={() => onTextStyleChange({ backgroundColor: color.value })}
                title={color.name}
              >
                {color.value === "transparent" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-0.5 bg-red-500 rotate-45"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Line Height */}
        <div>
          <Label className="text-sm font-medium mb-2 block text-gray-700">Line Height</Label>
          <div className="flex items-center gap-2">
            <Slider
              value={[textStyle.lineHeight]}
              onValueChange={([value]) => onTextStyleChange({ lineHeight: value })}
              max={3}
              min={0.8}
              step={0.1}
              className="flex-1"
            />
            <span className="text-sm text-gray-500 w-8">{textStyle.lineHeight.toFixed(1)}</span>
          </div>
        </div>

        <Separator />

        {/* Preview */}
        <div>
          <Label className="text-sm font-medium mb-2 block text-gray-700">Preview</Label>
          <div
            className="p-3 border border-gray-200 rounded-md min-h-16 flex items-center"
            style={{
              fontFamily: textStyle.fontFamily,
              fontSize: `${textStyle.fontSize}px`,
              fontWeight: textStyle.fontWeight,
              fontStyle: textStyle.fontStyle,
              textAlign: textStyle.textAlign,
              color: textStyle.textColor,
              backgroundColor: textStyle.backgroundColor === "transparent" ? "transparent" : textStyle.backgroundColor,
              textDecoration: textStyle.textDecoration,
              lineHeight: textStyle.lineHeight,
            }}
          >
            {selectedText || "Sample text preview"}
          </div>
        </div>
      </div>
    </div>
  )
}
