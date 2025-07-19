"use client"

import type React from "react"

import { useState, useCallback, useRef, useEffect } from "react"
import type { Element, Tool, Point, ElementStyle, ViewTransform, TextStyle } from "@/types/whiteboard"
import { createElement, isPointInElement, getElementBounds, drawElement } from "@/utils/drawing"
import { saveToStorage, loadFromStorage } from "@/utils/storage"

const defaultStyle: ElementStyle = {
  strokeColor: "#000000",
  fillColor: "transparent",
  strokeWidth: 2,
  strokeStyle: "solid",
  roughness: 0,
  opacity: 1,
  edge: "sharp",
  fillPattern: "none",
}

const defaultTextStyle: TextStyle = {
  fontFamily: "Arial, sans-serif",
  fontSize: 16,
  fontWeight: "normal",
  fontStyle: "normal",
  textAlign: "center",
  textColor: "#000000",
  backgroundColor: "transparent",
  textDecoration: "none",
  lineHeight: 1.2,
}

export function useWhiteboard() {
  const [elements, setElements] = useState<Element[]>([])
  const [selectedElements, setSelectedElements] = useState<string[]>([])
  const [currentTool, setCurrentTool] = useState<Tool>("select")
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentStyle, setCurrentStyle] = useState<ElementStyle>(defaultStyle)
  const [currentTextStyle, setCurrentTextStyle] = useState<TextStyle>(defaultTextStyle)
  const [viewTransform, setViewTransform] = useState<ViewTransform>({ x: 0, y: 0, zoom: 1 })
  const [history, setHistory] = useState<Element[][]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isLocked, setIsLocked] = useState(false)
  const [showTextPanel, setShowTextPanel] = useState(false)
  const [editingTextId, setEditingTextId] = useState<string | null>(null)

  const drawingElementRef = useRef<Element | null>(null)
  const lastMousePos = useRef<Point>({ x: 0, y: 0 })
  const dragOffset = useRef<Point>({ x: 0, y: 0 })
  const isDragging = useRef(false)

  // Load from storage on mount
  useEffect(() => {
    const saved = loadFromStorage()
    if (saved.elements.length > 0) {
      setElements(saved.elements)
      setHistory([saved.elements])
      setHistoryIndex(0)
    }
    if (saved.viewTransform) {
      setViewTransform(saved.viewTransform)
    }
  }, [])

  // Auto-save to storage with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveToStorage({ elements, viewTransform })
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [elements, viewTransform])

  const addToHistory = useCallback(
    (newElements: Element[]) => {
      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1)
        newHistory.push([...newElements])
        return newHistory.slice(-50)
      })
      setHistoryIndex((prev) => Math.min(prev + 1, 49))
    },
    [historyIndex],
  )

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1)
      setElements([...history[historyIndex - 1]])
      setSelectedElements([])
    }
  }, [history, historyIndex])

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1)
      setElements([...history[historyIndex + 1]])
      setSelectedElements([])
    }
  }, [history, historyIndex])

  const getMousePos = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>): Point => {
      const canvas = e.currentTarget
      const rect = canvas.getBoundingClientRect()
      return {
        x: (e.clientX - rect.left - viewTransform.x) / viewTransform.zoom,
        y: (e.clientY - rect.top - viewTransform.y) / viewTransform.zoom,
      }
    },
    [viewTransform],
  )

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (isLocked && currentTool !== "select" && currentTool !== "hand") {
        return
      }

      const point = getMousePos(e)
      lastMousePos.current = point
      setIsDrawing(true)

      if (currentTool === "select") {
        const clickedElement = elements
          .slice()
          .reverse()
          .find((el) => isPointInElement(point, el))

        if (clickedElement) {
          // Double click on text element to edit
          if (clickedElement.type === "text" && selectedElements.includes(clickedElement.id)) {
            setEditingTextId(clickedElement.id)
            setShowTextPanel(true)
            setCurrentTextStyle(clickedElement.textStyle || defaultTextStyle)
            setIsDrawing(false)
            return
          }

          if (!selectedElements.includes(clickedElement.id)) {
            setSelectedElements([clickedElement.id])
          }
          const bounds = getElementBounds(clickedElement)
          dragOffset.current = {
            x: point.x - bounds.x,
            y: point.y - bounds.y,
          }
          isDragging.current = true
        } else {
          setSelectedElements([])
          isDragging.current = false
          setShowTextPanel(false)
          setEditingTextId(null)
        }
      } else if (currentTool === "hand") {
        // Pan mode
      } else if (currentTool === "eraser") {
        const elementToErase = elements
          .slice()
          .reverse()
          .find((el) => isPointInElement(point, el))

        if (elementToErase) {
          const newElements = elements.filter((el) => el.id !== elementToErase.id)
          setElements(newElements)
          addToHistory(newElements)
        }
      } else if (currentTool === "image") {
        const input = document.createElement("input")
        input.type = "file"
        input.accept = "image/*"
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0]
          if (file) {
            const reader = new FileReader()
            reader.onload = (event) => {
              const imageElement = createElement("image", point, { x: point.x + 150, y: point.y + 100 }, currentStyle)
              if (imageElement) {
                imageElement.imageData = event.target?.result as string
                imageElement.width = 150
                imageElement.height = 100
                const newElements = [...elements, imageElement]
                setElements(newElements)
                addToHistory(newElements)
                setSelectedElements([imageElement.id])
              }
            }
            reader.readAsDataURL(file)
          }
        }
        input.click()
        setIsDrawing(false)
      } else if (currentTool === "text") {
        // Create text element and open text panel
        const textElement = createElement("text", point, { x: point.x + 100, y: point.y + 30 }, currentStyle)
        if (textElement) {
          textElement.text = "Text"
          textElement.textStyle = { ...currentTextStyle }
          textElement.width = 100
          textElement.height = 30
          const newElements = [...elements, textElement]
          setElements(newElements)
          addToHistory(newElements)
          setSelectedElements([textElement.id])
          setEditingTextId(textElement.id)
          setShowTextPanel(true)
        }
        setIsDrawing(false)
      } else {
        const drawingStyle = { ...currentStyle, fillColor: "transparent" }
        const newElement = createElement(currentTool, point, point, drawingStyle)
        if (newElement) {
          drawingElementRef.current = newElement
          setElements((prev) => [...prev, newElement])
          setSelectedElements([])
        }
      }
    },
    [currentTool, elements, selectedElements, getMousePos, currentStyle, currentTextStyle, isLocked, addToHistory],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const point = getMousePos(e)

      if (!isDrawing) return

      if (currentTool === "hand") {
        const dx = (point.x - lastMousePos.current.x) * viewTransform.zoom
        const dy = (point.y - lastMousePos.current.y) * viewTransform.zoom
        setViewTransform((prev) => ({
          ...prev,
          x: prev.x + dx,
          y: prev.y + dy,
        }))
      } else if (currentTool === "select" && selectedElements.length > 0 && isDragging.current) {
        const dx = point.x - lastMousePos.current.x
        const dy = point.y - lastMousePos.current.y

        setElements((prev) =>
          prev.map((el) => {
            if (selectedElements.includes(el.id)) {
              return {
                ...el,
                x: el.x + dx,
                y: el.y + dy,
                x2: el.x2 ? el.x2 + dx : undefined,
                y2: el.y2 ? el.y2 + dy : undefined,
                points: el.points?.map((p) => ({ x: p.x + dx, y: p.y + dy })),
              }
            }
            return el
          }),
        )
      } else if (currentTool === "eraser") {
        const elementToErase = elements
          .slice()
          .reverse()
          .find((el) => isPointInElement(point, el))

        if (elementToErase) {
          const newElements = elements.filter((el) => el.id !== elementToErase.id)
          setElements(newElements)
        }
      } else if (drawingElementRef.current) {
        if (currentTool === "draw" && drawingElementRef.current.points) {
          const lastPoint = drawingElementRef.current.points[drawingElementRef.current.points.length - 1]
          const distance = Math.sqrt(Math.pow(point.x - lastPoint.x, 2) + Math.pow(point.y - lastPoint.y, 2))

          if (distance > 2) {
            drawingElementRef.current.points.push(point)
          }
        } else {
          drawingElementRef.current.x2 = point.x
          drawingElementRef.current.y2 = point.y
        }

        setElements((prev) =>
          prev.map((el) => (el.id === drawingElementRef.current?.id ? { ...drawingElementRef.current } : el)),
        )
      }

      lastMousePos.current = point
    },
    [isDrawing, currentTool, selectedElements, getMousePos, viewTransform.zoom, elements],
  )

  const handleMouseUp = useCallback(() => {
    if (isDrawing && drawingElementRef.current) {
      addToHistory(elements)
    }

    setIsDrawing(false)
    drawingElementRef.current = null
    isDragging.current = false
  }, [isDrawing, elements, addToHistory])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Additional keyboard handling can be added here
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedElements([])
    setShowTextPanel(false)
    setEditingTextId(null)
  }, [])

  const selectAll = useCallback(() => {
    setSelectedElements(elements.map((el) => el.id))
  }, [elements])

  const deleteSelected = useCallback(() => {
    if (selectedElements.length > 0) {
      const newElements = elements.filter((el) => !selectedElements.includes(el.id))
      setElements(newElements)
      addToHistory(newElements)
      setSelectedElements([])
      setShowTextPanel(false)
      setEditingTextId(null)
    }
  }, [elements, selectedElements, addToHistory])

  const duplicateSelected = useCallback(() => {
    if (selectedElements.length === 0) return

    const selectedEls = elements.filter((el) => selectedElements.includes(el.id))
    const duplicated = selectedEls.map((el) => ({
      ...el,
      id: Math.random().toString(36).substr(2, 9),
      x: el.x + 20,
      y: el.y + 20,
      x2: el.x2 ? el.x2 + 20 : undefined,
      y2: el.y2 ? el.y2 + 20 : undefined,
      points: el.points?.map((p) => ({ x: p.x + 20, y: p.y + 20 })),
    }))

    const newElements = [...elements, ...duplicated]
    setElements(newElements)
    addToHistory(newElements)
    setSelectedElements(duplicated.map((el) => el.id))
  }, [elements, selectedElements, addToHistory])

  const moveToFront = useCallback(() => {
    if (selectedElements.length === 0) return

    const selected = elements.filter((el) => selectedElements.includes(el.id))
    const others = elements.filter((el) => !selectedElements.includes(el.id))
    const newElements = [...others, ...selected]

    setElements(newElements)
    addToHistory(newElements)
  }, [elements, selectedElements, addToHistory])

  const moveToBack = useCallback(() => {
    if (selectedElements.length === 0) return

    const selected = elements.filter((el) => selectedElements.includes(el.id))
    const others = elements.filter((el) => !selectedElements.includes(el.id))
    const newElements = [...selected, ...others]

    setElements(newElements)
    addToHistory(newElements)
  }, [elements, selectedElements, addToHistory])

  const moveForward = useCallback(() => {
    if (selectedElements.length === 0) return

    const newElements = [...elements]
    for (let i = newElements.length - 2; i >= 0; i--) {
      if (selectedElements.includes(newElements[i].id)) {
        const temp = newElements[i]
        newElements[i] = newElements[i + 1]
        newElements[i + 1] = temp
      }
    }

    setElements(newElements)
    addToHistory(newElements)
  }, [elements, selectedElements, addToHistory])

  const moveBackward = useCallback(() => {
    if (selectedElements.length === 0) return

    const newElements = [...elements]
    for (let i = 1; i < newElements.length; i++) {
      if (selectedElements.includes(newElements[i].id)) {
        const temp = newElements[i]
        newElements[i] = newElements[i - 1]
        newElements[i - 1] = temp
      }
    }

    setElements(newElements)
    addToHistory(newElements)
  }, [elements, selectedElements, addToHistory])

  const zoomIn = useCallback(() => {
    setViewTransform((prev) => ({
      ...prev,
      zoom: Math.min(prev.zoom * 1.2, 5),
    }))
  }, [])

  const zoomOut = useCallback(() => {
    setViewTransform((prev) => ({
      ...prev,
      zoom: Math.max(prev.zoom / 1.2, 0.1),
    }))
  }, [])

  const resetZoom = useCallback(() => {
    setViewTransform({ x: 0, y: 0, zoom: 1 })
  }, [])

  const toggleLock = useCallback(() => {
    setIsLocked((prev) => !prev)
  }, [])

  const shareWhiteboard = useCallback(async () => {
    // Compose share payload
    const shareData = {
      elements,
      viewTransform,
      timestamp: Date.now(),
    }
    const encodedData = btoa(JSON.stringify(shareData))
    const shareUrl = `${window.location.origin}${window.location.pathname}?shared=${encodedData}`

    // Helper to copy URL to clipboard and show toast-like message
    const copyToClipboard = async () => {
      await navigator.clipboard.writeText(shareUrl)
      const notice = document.createElement("div")
      notice.textContent = "Share link copied to clipboard!"
      notice.className = "fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-[9999]"
      document.body.appendChild(notice)
      setTimeout(() => notice.remove(), 3000)
    }

    // Try Web Share API if available and allowed
    if (navigator.share) {
      try {
        await navigator.share({
          title: "JustDraw Whiteboard",
          text: "Check out my whiteboard!",
          url: shareUrl,
        })
        return
      } catch (err) {
        // Permission denied or user cancelled – silently fall back
        console.warn("navigator.share failed, falling back to clipboard:", err)
      }
    }

    // Fallback → clipboard
    try {
      await copyToClipboard()
    } catch (err) {
      console.error("Clipboard copy failed:", err)
      alert(`Share URL:\n${shareUrl}`)
    }
  }, [elements, viewTransform])

  const exportAsPNG = useCallback(() => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    if (elements.length === 0) return

    let minX = Number.POSITIVE_INFINITY,
      minY = Number.POSITIVE_INFINITY,
      maxX = Number.NEGATIVE_INFINITY,
      maxY = Number.NEGATIVE_INFINITY

    elements.forEach((element) => {
      const bounds = getElementBounds(element)
      minX = Math.min(minX, bounds.x)
      minY = Math.min(minY, bounds.y)
      maxX = Math.max(maxX, bounds.x + bounds.width)
      maxY = Math.max(maxY, bounds.y + bounds.height)
    })

    const padding = 20
    canvas.width = maxX - minX + padding * 2
    canvas.height = maxY - minY + padding * 2

    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.translate(-minX + padding, -minY + padding)
    elements.forEach((element) => {
      drawElement(ctx, element, false)
    })

    const link = document.createElement("a")
    link.download = "justdraw-whiteboard.png"
    link.href = canvas.toDataURL()
    link.click()
  }, [elements])

  const exportAsSVG = useCallback(() => {
    if (elements.length === 0) return

    let minX = Number.POSITIVE_INFINITY,
      minY = Number.POSITIVE_INFINITY,
      maxX = Number.NEGATIVE_INFINITY,
      maxY = Number.NEGATIVE_INFINITY

    elements.forEach((element) => {
      const bounds = getElementBounds(element)
      minX = Math.min(minX, bounds.x)
      minY = Math.min(minY, bounds.y)
      maxX = Math.max(maxX, bounds.x + bounds.width)
      maxY = Math.max(maxY, bounds.y + bounds.height)
    })

    const padding = 20
    const width = maxX - minX + padding * 2
    const height = maxY - minY + padding * 2

    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`
    svg += `<rect width="100%" height="100%" fill="white"/>`

    elements.forEach((element) => {
      const x = element.x - minX + padding
      const y = element.y - minY + padding
      const x2 = element.x2 ? element.x2 - minX + padding : x
      const y2 = element.y2 ? element.y2 - minY + padding : y

      const strokeDasharray =
        element.strokeStyle === "dashed" ? "5,5" : element.strokeStyle === "dotted" ? "2,2" : "none"

      switch (element.type) {
        case "rectangle":
          svg += `<rect x="${x}" y="${y}" width="${x2 - x}" height="${y2 - y}" 
                   fill="${element.fillColor}" stroke="${element.strokeColor}" 
                   stroke-width="${element.strokeWidth}" opacity="${element.opacity}"
                   stroke-dasharray="${strokeDasharray}"/>`
          break
        case "circle":
          const rx = Math.abs(x2 - x) / 2
          const ry = Math.abs(y2 - y) / 2
          const cx = x + rx
          const cy = y + ry
          svg += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" 
                   fill="${element.fillColor}" stroke="${element.strokeColor}" 
                   stroke-width="${element.strokeWidth}" opacity="${element.opacity}"
                   stroke-dasharray="${strokeDasharray}"/>`
          break
        case "line":
          svg += `<line x1="${x}" y1="${y}" x2="${x2}" y2="${y2}" 
                   stroke="${element.strokeColor}" stroke-width="${element.strokeWidth}" 
                   opacity="${element.opacity}" stroke-dasharray="${strokeDasharray}"/>`
          break
      }
    })

    svg += "</svg>"

    const blob = new Blob([svg], { type: "image/svg+xml" })
    const link = document.createElement("a")
    link.download = "justdraw-whiteboard.svg"
    link.href = URL.createObjectURL(blob)
    link.click()
  }, [elements])

  const applyStyleToSelected = useCallback(
    (newStyle: Partial<ElementStyle>) => {
      if (selectedElements.length > 0) {
        const newElements = elements.map((el) => {
          if (selectedElements.includes(el.id)) {
            return { ...el, ...newStyle }
          }
          return el
        })
        setElements(newElements)
        addToHistory(newElements)
      }
      setCurrentStyle((prev) => ({ ...prev, ...newStyle }))
    },
    [selectedElements, elements, addToHistory],
  )

  const updateTextStyle = useCallback(
    (newTextStyle: Partial<TextStyle>) => {
      setCurrentTextStyle((prev) => ({ ...prev, ...newTextStyle }))

      if (editingTextId) {
        const newElements = elements.map((el) => {
          if (el.id === editingTextId) {
            return {
              ...el,
              textStyle: { ...el.textStyle, ...newTextStyle },
            }
          }
          return el
        })
        setElements(newElements)
        addToHistory(newElements)
      }
    },
    [editingTextId, elements, addToHistory],
  )

  const updateText = useCallback(
    (newText: string) => {
      if (editingTextId) {
        const newElements = elements.map((el) => {
          if (el.id === editingTextId) {
            return { ...el, text: newText }
          }
          return el
        })
        setElements(newElements)
        addToHistory(newElements)
      }
    },
    [editingTextId, elements, addToHistory],
  )

  const closeTextPanel = useCallback(() => {
    setShowTextPanel(false)
    setEditingTextId(null)
  }, [])

  const getEditingText = useCallback(() => {
    if (editingTextId) {
      const element = elements.find((el) => el.id === editingTextId)
      return element?.text || ""
    }
    return ""
  }, [editingTextId, elements])

  return {
    elements,
    selectedElements,
    currentTool,
    isDrawing,
    currentStyle,
    currentTextStyle,
    viewTransform,
    isLocked,
    showTextPanel,
    editingTextId,
    setCurrentTool,
    setCurrentStyle: applyStyleToSelected,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleKeyDown,
    clearSelection,
    selectAll,
    deleteSelected,
    duplicateSelected,
    moveToFront,
    moveToBack,
    moveForward,
    moveBackward,
    exportAsPNG,
    exportAsSVG,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    zoomIn,
    zoomOut,
    resetZoom,
    toggleLock,
    shareWhiteboard,
    updateTextStyle,
    updateText,
    closeTextPanel,
    getEditingText,
  }
}
