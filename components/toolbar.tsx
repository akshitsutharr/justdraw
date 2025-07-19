"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Lock,
  LockOpen,
  Hand,
  MousePointer2,
  Square,
  Diamond,
  Circle,
  ArrowRight,
  Minus,
  Pencil,
  Type,
  ImageIcon,
  Eraser,
  Link,
  Download,
  Undo,
  Redo,
  Menu,
  Share,
  Palette,
} from "lucide-react"
import type { Tool } from "@/types/whiteboard"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { ShareModal } from "./ShareModal"

interface ToolbarProps {
  currentTool: Tool
  onToolChange: (tool: Tool) => void
  onExportPNG: () => void
  onExportSVG: () => void
  onUndo: () => void
  onRedo: () => void
  canUndo: boolean
  canRedo: boolean
  isLocked?: boolean
  onToggleLock?: () => void
  onShare?: () => void
}

export function Toolbar({
  currentTool,
  onToolChange,
  onExportPNG,
  onExportSVG,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  isLocked = false,
  onToggleLock,
  onShare,
}: ToolbarProps) {
  const tools = [
    {
      id: "lock" as Tool,
      icon: isLocked ? Lock : LockOpen,
      label: isLocked ? "Unlock" : "Lock",
      shortcut: "",
      onClick: onToggleLock,
    },
    { id: "hand" as Tool, icon: Hand, label: "Hand", shortcut: "H" },
    { id: "select" as Tool, icon: MousePointer2, label: "Select", shortcut: "1" },
    { id: "rectangle" as Tool, icon: Square, label: "Rectangle", shortcut: "2" },
    { id: "diamond" as Tool, icon: Diamond, label: "Diamond", shortcut: "3" },
    { id: "circle" as Tool, icon: Circle, label: "Circle", shortcut: "4" },
    { id: "arrow" as Tool, icon: ArrowRight, label: "Arrow", shortcut: "5" },
    { id: "line" as Tool, icon: Minus, label: "Line", shortcut: "6" },
    { id: "draw" as Tool, icon: Pencil, label: "Draw", shortcut: "7" },
    { id: "text" as Tool, icon: Type, label: "Text", shortcut: "8" },
    { id: "image" as Tool, icon: ImageIcon, label: "Image", shortcut: "" },
    { id: "eraser" as Tool, icon: Eraser, label: "Eraser", shortcut: "9" },
    { id: "connector" as Tool, icon: Link, label: "Connector", shortcut: "" },
  ]

  const handleToolClick = (tool: (typeof tools)[0]) => {
    if (tool.onClick) {
      tool.onClick()
    } else {
      onToolChange(tool.id)
    }
  }

  const [shareOpen, setShareOpen] = useState(false)
  const [shareLink, setShareLink] = useState("")

  // Replace this with your actual drawing data getter
  function getCurrentDrawingData() {
    // Use the correct key here!
    return localStorage.getItem("justdraw-whiteboard-data") // <-- change this to your actual key
  }

  function handleShare() {
    // Generate a unique code
    const code = Math.random().toString(36).substr(2, 8)
    // Save drawing data under this code
    const data = getCurrentDrawingData()
    if (data) {
      localStorage.setItem(`drawing_${code}`, data)
      const url = `${window.location.origin}/draw/${code}`
      setShareLink(url)
      setShareOpen(true)
    } else {
      alert("No drawing to share!")
    }
  }

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center shadow-sm">
      <div className="flex items-center mr-7 -my-1">
        <img src="/icon.png" alt="JustDraw Pen Logo" className="h-10 w-10 object-contain mr-2" />
        <span
          style={{
            fontFamily: "'Indie Flower', cursive",
            fontSize: "2rem",
            color: "#222",
            lineHeight: 1,
          }}
        >
          JustDraw
        </span>
      </div>
      {/* Tools */}
      <div className="flex items-center justify-center gap-1 bg-gray-100 rounded-lg p-1">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-white">
          <Menu className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {tools.slice(0, 3).map((tool) => (
          <Button
            key={tool.id}
            variant="ghost"
            size="sm"
            className={cn(
              "relative h-8 w-8 p-0 hover:bg-white transition-all duration-150",
              currentTool === tool.id && "bg-white shadow-sm",
              tool.id === "lock" && isLocked && "bg-red-100 hover:bg-red-200",
            )}
            onClick={() => handleToolClick(tool)}
            title={`${tool.label} ${tool.shortcut ? `(${tool.shortcut})` : ""}`}
          >
            <tool.icon className="h-4 w-4" />
          </Button>
        ))}

        <Separator orientation="vertical" className="h-6 mx-1" />

        {tools.slice(3, 8).map((tool) => (
          <Button
            key={tool.id}
            variant="ghost"
            size="sm"
            className={cn(
              "relative h-8 w-8 p-0 hover:bg-white transition-all duration-150",
              currentTool === tool.id && "bg-white shadow-sm",
            )}
            onClick={() => handleToolClick(tool)}
            title={`${tool.label} (${tool.shortcut})`}
          >
            <tool.icon className="h-4 w-4" />
          </Button>
        ))}

        <Separator orientation="vertical" className="h-6 mx-1" />

        {tools.slice(8).map((tool) => (
          <Button
            key={tool.id}
            variant="ghost"
            size="sm"
            className={cn(
              "relative h-8 w-8 p-0 hover:bg-white transition-all duration-150",
              currentTool === tool.id && "bg-white shadow-sm",
            )}
            onClick={() => handleToolClick(tool)}
            title={`${tool.label} ${tool.shortcut ? `(${tool.shortcut})` : ""}`}
          >
            <tool.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
          className="h-8 w-8 p-0 transition-all duration-150"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
          className="h-8 w-8 p-0 transition-all duration-150"
        >
          <Redo className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" title="Export" className="h-8 w-8 p-0 transition-all duration-150">
              <Download className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={onExportPNG}>Export as PNG</DropdownMenuItem>
            <DropdownMenuItem onClick={onExportSVG}>Export as SVG</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 h-8 transition-all duration-150"
          onClick={handleShare}
        >
          <Share className="h-4 w-4 mr-1" />
          Share
        </Button>
      </div>
      <ShareModal open={shareOpen} link={shareLink} onClose={() => setShareOpen(false)} />
    </div>
  )
}