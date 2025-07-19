"use client"

import { useRef, useEffect } from "react"
import { Toolbar } from "@/components/toolbar"
import { StylePanel } from "@/components/style-panel"
import { Canvas } from "@/components/canvas"
import { TextPanel } from "@/components/text-panel"
import { useWhiteboard } from "@/hooks/use-whiteboard"
import { ZoomControls } from "@/components/zoom-controls"

export function WhiteboardApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const {
    elements,
    selectedElements,
    currentTool,
    isDrawing,
    currentStyle,
    currentTextStyle,
    viewTransform,
    isLocked,
    showTextPanel,
    setCurrentTool,
    setCurrentStyle,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleKeyDown,
    clearSelection,
    deleteSelected,
    moveToFront,
    moveToBack,
    moveForward,
    moveBackward,
    exportAsPNG,
    exportAsSVG,
    undo,
    redo,
    canUndo,
    canRedo,
    zoomIn,
    zoomOut,
    resetZoom,
    duplicateSelected,
    selectAll,
    toggleLock,
    shareWhiteboard,
    updateTextStyle,
    updateText,
    closeTextPanel,
    getEditingText,
  } = useWhiteboard()

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Don't interfere with text input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      const isCtrlOrCmd = e.ctrlKey || e.metaKey

      if (isCtrlOrCmd) {
        switch (e.key.toLowerCase()) {
          case "z":
            e.preventDefault()
            if (e.shiftKey) {
              redo()
            } else {
              undo()
            }
            break
          case "y":
            e.preventDefault()
            redo()
            break
          case "a":
            e.preventDefault()
            selectAll()
            break
          case "d":
            e.preventDefault()
            duplicateSelected()
            break
        }
        return
      }

      // Tool shortcuts
      switch (e.key) {
        case "1":
          e.preventDefault()
          setCurrentTool("select")
          break
        case "2":
          e.preventDefault()
          setCurrentTool("rectangle")
          break
        case "3":
          e.preventDefault()
          setCurrentTool("diamond")
          break
        case "4":
          e.preventDefault()
          setCurrentTool("circle")
          break
        case "5":
          e.preventDefault()
          setCurrentTool("arrow")
          break
        case "6":
          e.preventDefault()
          setCurrentTool("line")
          break
        case "7":
          e.preventDefault()
          setCurrentTool("draw")
          break
        case "8":
          e.preventDefault()
          setCurrentTool("text")
          break
        case "9":
          e.preventDefault()
          setCurrentTool("eraser")
          break
        case "h":
        case "H":
          e.preventDefault()
          setCurrentTool("hand")
          break
        case "Delete":
        case "Backspace":
          if (selectedElements.length > 0) {
            e.preventDefault()
            deleteSelected()
          }
          break
        case "Escape":
          e.preventDefault()
          clearSelection()
          break
      }

      handleKeyDown(e)
    }

    window.addEventListener("keydown", handleGlobalKeyDown)
    return () => window.removeEventListener("keydown", handleGlobalKeyDown)
  }, [
    selectedElements,
    handleKeyDown,
    setCurrentTool,
    deleteSelected,
    undo,
    redo,
    clearSelection,
    selectAll,
    duplicateSelected,
  ])

  // Load shared data from URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const sharedData = urlParams.get("shared")

    if (sharedData) {
      try {
        const decodedData = JSON.parse(atob(sharedData))
        console.log("Loading shared data:", decodedData)
      } catch (error) {
        console.error("Failed to load shared data:", error)
      }
    }
  }, [])

  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col overflow-hidden select-none">
      {/* Top Toolbar */}
      <Toolbar
        currentTool={currentTool}
        onToolChange={setCurrentTool}
        onExportPNG={exportAsPNG}
        onExportSVG={exportAsSVG}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        isLocked={isLocked}
        onToggleLock={toggleLock}
        onShare={shareWhiteboard}
      />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Style Panel */}
        <StylePanel
          currentStyle={currentStyle}
          onStyleChange={setCurrentStyle}
          selectedElements={selectedElements}
          onMoveToFront={moveToFront}
          onMoveToBack={moveToBack}
          onMoveForward={moveForward}
          onMoveBackward={moveBackward}
          hasSelection={selectedElements.length > 0}
          onDuplicate={duplicateSelected}
          onDelete={deleteSelected}
        />

        {/* Main Canvas Area */}
        <div ref={containerRef} className="flex-1 relative overflow-hidden bg-white">
          <Canvas
            ref={canvasRef}
            elements={elements}
            selectedElements={selectedElements}
            currentTool={currentTool}
            isDrawing={isDrawing}
            currentStyle={currentStyle}
            viewTransform={viewTransform}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onClearSelection={clearSelection}
          />

          {/* Zoom Controls */}
          <ZoomControls zoom={viewTransform.zoom} onZoomIn={zoomIn} onZoomOut={zoomOut} onResetZoom={resetZoom} />
        </div>

        {/* Text Panel */}
        <TextPanel
          isVisible={showTextPanel}
          onClose={closeTextPanel}
          textStyle={currentTextStyle}
          onTextStyleChange={updateTextStyle}
          selectedText={getEditingText()}
          onTextChange={updateText}
        />
      </div>
    </div>
  )
}
