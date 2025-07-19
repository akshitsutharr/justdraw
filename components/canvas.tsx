"use client"

import type React from "react"

import { forwardRef, useEffect, useRef, useState, useCallback } from "react"
import type { Element, Tool, ViewTransform, ElementStyle } from "@/types/whiteboard"
import { drawElement, getElementBounds } from "@/utils/drawing"

interface CanvasProps {
  elements: Element[]
  selectedElements: string[]
  currentTool: Tool
  isDrawing: boolean
  currentStyle: ElementStyle
  viewTransform: ViewTransform
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void
  onMouseUp: (e: React.MouseEvent<HTMLCanvasElement>) => void
  onClearSelection: () => void
}

export const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(
  (
    {
      elements,
      selectedElements,
      currentTool,
      isDrawing,
      currentStyle,
      viewTransform,
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onClearSelection,
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 })
    const animationFrameRef = useRef<number>()

    // Update canvas size on window resize
    useEffect(() => {
      const updateCanvasSize = () => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect()
          setCanvasSize({ width: rect.width, height: rect.height })
        }
      }

      updateCanvasSize()
      const resizeObserver = new ResizeObserver(updateCanvasSize)
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current)
      }

      return () => resizeObserver.disconnect()
    }, [])

    // Optimized drawing with requestAnimationFrame
    const draw = useCallback(() => {
      const canvas = ref as React.RefObject<HTMLCanvasElement>
      if (!canvas.current) return

      const ctx = canvas.current.getContext("2d", { alpha: false })
      if (!ctx) return

      // Clear canvas with white background
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height)

      // Apply view transform
      ctx.save()
      ctx.translate(viewTransform.x, viewTransform.y)
      ctx.scale(viewTransform.zoom, viewTransform.zoom)

      // Draw grid
      drawGrid(ctx, viewTransform)

      // Draw elements in order
      elements.forEach((element) => {
        const isSelected = selectedElements.includes(element.id)
        drawElement(ctx, element, isSelected)
      })

      // Draw selection handles for selected elements
      selectedElements.forEach((elementId) => {
        const element = elements.find((el) => el.id === elementId)
        if (element && currentTool === "select") {
          drawSelectionHandles(ctx, element)
        }
      })

      ctx.restore()
    }, [elements, selectedElements, canvasSize, viewTransform, ref, currentTool])

    // Use requestAnimationFrame for smooth rendering
    useEffect(() => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      animationFrameRef.current = requestAnimationFrame(draw)

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
      }
    }, [draw])

    const drawGrid = (ctx: CanvasRenderingContext2D, transform: ViewTransform) => {
      const gridSize = 20
      const scaledGridSize = gridSize * transform.zoom

      if (scaledGridSize < 5) return // Don't draw grid when too zoomed out

      const offsetX = ((transform.x % scaledGridSize) + scaledGridSize) % scaledGridSize
      const offsetY = ((transform.y % scaledGridSize) + scaledGridSize) % scaledGridSize

      ctx.strokeStyle = "#f1f3f4"
      ctx.lineWidth = 0.5
      ctx.beginPath()

      // Vertical lines
      for (let x = offsetX; x < canvasSize.width; x += scaledGridSize) {
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvasSize.height)
      }

      // Horizontal lines
      for (let y = offsetY; y < canvasSize.height; y += scaledGridSize) {
        ctx.moveTo(0, y)
        ctx.lineTo(canvasSize.width, y)
      }

      ctx.stroke()
    }

    const drawSelectionHandles = (ctx: CanvasRenderingContext2D, element: Element) => {
      const bounds = getElementBounds(element)
      const handleSize = 8 / viewTransform.zoom

      ctx.fillStyle = "#1971c2"
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2 / viewTransform.zoom

      const handles = [
        { x: bounds.x, y: bounds.y }, // top-left
        { x: bounds.x + bounds.width, y: bounds.y }, // top-right
        { x: bounds.x + bounds.width, y: bounds.y + bounds.height }, // bottom-right
        { x: bounds.x, y: bounds.y + bounds.height }, // bottom-left
        { x: bounds.x + bounds.width / 2, y: bounds.y }, // top-center
        { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height }, // bottom-center
        { x: bounds.x, y: bounds.y + bounds.height / 2 }, // left-center
        { x: bounds.x + bounds.width, y: bounds.y + bounds.height / 2 }, // right-center
      ]

      handles.forEach((handle) => {
        ctx.beginPath()
        ctx.rect(handle.x - handleSize / 2, handle.y - handleSize / 2, handleSize, handleSize)
        ctx.fill()
        ctx.stroke()
      })
    }

    const getCursor = () => {
      switch (currentTool) {
        case "hand":
          return isDrawing ? "grabbing" : "grab"
        case "select":
          return "default"
        case "text":
          return "text"
        case "eraser":
          return "crosshair"
        default:
          return "crosshair"
      }
    }

    // Handle wheel events for zooming
    const handleWheel = useCallback((e: React.WheelEvent) => {
      e.preventDefault()
      // Zoom functionality would be handled by the parent component
    }, [])

    return (
      <div
        ref={containerRef}
        className="w-full h-full relative overflow-hidden bg-white"
        style={{ cursor: getCursor() }}
      >
        <canvas
          ref={ref}
          width={canvasSize.width}
          height={canvasSize.height}
          className="absolute inset-0 touch-none"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onWheel={handleWheel}
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>
    )
  },
)

Canvas.displayName = "Canvas"
