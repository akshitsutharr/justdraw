import type { Element, Tool, Point, ElementStyle, Bounds, TextStyle } from "@/types/whiteboard"

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

export function createElement(type: Tool, startPoint: Point, endPoint: Point, style: ElementStyle): Element | null {
  const id = Math.random().toString(36).substr(2, 9)

  const baseElement = {
    id,
    type,
    x: startPoint.x,
    y: startPoint.y,
    x2: endPoint.x,
    y2: endPoint.y,
    ...style,
  }

  switch (type) {
    case "rectangle":
    case "diamond":
    case "circle":
    case "arrow":
    case "line":
    case "connector":
      return baseElement
    case "text":
      return {
        ...baseElement,
        text: "Text",
        width: 100,
        height: 30,
        textStyle: { ...defaultTextStyle },
      }
    case "draw":
      return {
        ...baseElement,
        points: [startPoint],
      }
    case "image":
      return {
        ...baseElement,
        width: 150,
        height: 100,
      }
    default:
      return null
  }
}

export function drawElement(ctx: CanvasRenderingContext2D, element: Element, isSelected = false) {
  ctx.save()

  // Apply element styles
  ctx.strokeStyle = element.strokeColor
  ctx.fillStyle = element.fillColor
  ctx.lineWidth = element.strokeWidth
  ctx.globalAlpha = element.opacity

  // Apply stroke style
  if (element.strokeStyle === "dashed") {
    ctx.setLineDash([5, 5])
  } else if (element.strokeStyle === "dotted") {
    ctx.setLineDash([2, 2])
  } else {
    ctx.setLineDash([])
  }

  // Apply edge style
  if (element.edge === "round") {
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
  } else {
    ctx.lineCap = "butt"
    ctx.lineJoin = "miter"
  }

  const x1 = element.x
  const y1 = element.y
  const x2 = element.x2 || element.x
  const y2 = element.y2 || element.y

  switch (element.type) {
    case "rectangle":
      drawRectangle(ctx, x1, y1, x2, y2, element)
      break
    case "circle":
      drawCircle(ctx, x1, y1, x2, y2, element)
      break
    case "diamond":
      drawDiamond(ctx, x1, y1, x2, y2, element)
      break
    case "line":
      drawLine(ctx, x1, y1, x2, y2)
      break
    case "arrow":
      drawArrow(ctx, x1, y1, x2, y2)
      break
    case "connector":
      drawConnector(ctx, x1, y1, x2, y2)
      break
    case "draw":
      drawFreehand(ctx, element.points || [])
      break
    case "text":
      drawText(ctx, element)
      break
    case "image":
      drawImage(ctx, element)
      break
  }

  // Draw selection outline
  if (isSelected) {
    ctx.restore()
    ctx.save()
    ctx.strokeStyle = "#1971c2"
    ctx.lineWidth = 2
    ctx.setLineDash([4, 4])
    ctx.globalAlpha = 0.8

    const bounds = getElementBounds(element)
    ctx.strokeRect(bounds.x - 2, bounds.y - 2, bounds.width + 4, bounds.height + 4)
  }

  ctx.restore()
}

function drawRectangle(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  element: Element,
) {
  const x = Math.min(x1, x2)
  const y = Math.min(y1, y2)
  const width = Math.abs(x2 - x1)
  const height = Math.abs(y2 - y1)

  if (element.roughness > 0) {
    drawRoughRect(ctx, x, y, width, height, element.roughness)
  } else {
    ctx.beginPath()
    if (element.edge === "round") {
      const radius = Math.min(width, height) * 0.1
      roundRect(ctx, x, y, width, height, radius)
    } else {
      ctx.rect(x, y, width, height)
    }

    if (element.fillColor !== "transparent") {
      ctx.fill()
    }
    ctx.stroke()
  }
}

function drawCircle(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, element: Element) {
  const centerX = (x1 + x2) / 2
  const centerY = (y1 + y2) / 2
  const radiusX = Math.abs(x2 - x1) / 2
  const radiusY = Math.abs(y2 - y1) / 2

  ctx.beginPath()
  ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI)

  if (element.fillColor !== "transparent") {
    ctx.fill()
  }
  ctx.stroke()
}

function drawDiamond(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, element: Element) {
  const centerX = (x1 + x2) / 2
  const centerY = (y1 + y2) / 2
  const width = Math.abs(x2 - x1)
  const height = Math.abs(y2 - y1)

  ctx.beginPath()
  ctx.moveTo(centerX, y1)
  ctx.lineTo(x2, centerY)
  ctx.lineTo(centerX, y2)
  ctx.lineTo(x1, centerY)
  ctx.closePath()

  if (element.fillColor !== "transparent") {
    ctx.fill()
  }
  ctx.stroke()
}

function drawLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
}

function drawArrow(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
  const headLength = 15
  const angle = Math.atan2(y2 - y1, x2 - x1)

  // Draw line
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()

  // Draw arrowhead
  ctx.beginPath()
  ctx.moveTo(x2, y2)
  ctx.lineTo(x2 - headLength * Math.cos(angle - Math.PI / 6), y2 - headLength * Math.sin(angle - Math.PI / 6))
  ctx.moveTo(x2, y2)
  ctx.lineTo(x2 - headLength * Math.cos(angle + Math.PI / 6), y2 - headLength * Math.sin(angle + Math.PI / 6))
  ctx.stroke()
}

function drawConnector(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
  // Draw curved connector line
  const midX = (x1 + x2) / 2
  const midY = (y1 + y2) / 2
  const controlOffset = 50

  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.quadraticCurveTo(midX, midY - controlOffset, x2, y2)
  ctx.stroke()

  // Draw connection points
  ctx.beginPath()
  ctx.arc(x1, y1, 4, 0, 2 * Math.PI)
  ctx.fill()

  ctx.beginPath()
  ctx.arc(x2, y2, 4, 0, 2 * Math.PI)
  ctx.fill()
}

function drawFreehand(ctx: CanvasRenderingContext2D, points: Point[]) {
  if (points.length < 2) return

  ctx.beginPath()
  ctx.moveTo(points[0].x, points[0].y)

  // Use quadratic curves for smoother lines
  for (let i = 1; i < points.length - 1; i++) {
    const xc = (points[i].x + points[i + 1].x) / 2
    const yc = (points[i].y + points[i + 1].y) / 2
    ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc)
  }

  // Draw the last segment
  if (points.length > 1) {
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y)
  }

  ctx.stroke()
}

function drawText(ctx: CanvasRenderingContext2D, element: Element) {
  if (!element.text) return

  const textStyle = element.textStyle || defaultTextStyle
  const lines = element.text.split("\n")

  // Apply text background if not transparent
  if (textStyle.backgroundColor !== "transparent") {
    ctx.fillStyle = textStyle.backgroundColor
    const textWidth = element.width || 100
    const textHeight = element.height || 30
    ctx.fillRect(element.x, element.y, textWidth, textHeight)
  }

  // Set text styles
  let fontString = ""
  if (textStyle.fontStyle === "italic") fontString += "italic "
  if (textStyle.fontWeight === "bold") fontString += "bold "
  fontString += `${textStyle.fontSize}px ${textStyle.fontFamily}`

  ctx.font = fontString
  ctx.fillStyle = textStyle.textColor
  ctx.textAlign = textStyle.textAlign
  ctx.textBaseline = "middle"

  // Calculate text position
  const textWidth = element.width || 100
  const textHeight = element.height || 30
  let textX = element.x

  switch (textStyle.textAlign) {
    case "left":
      textX = element.x + 5
      break
    case "center":
      textX = element.x + textWidth / 2
      break
    case "right":
      textX = element.x + textWidth - 5
      break
  }

  const lineHeight = textStyle.fontSize * textStyle.lineHeight
  const totalTextHeight = lines.length * lineHeight
  const startY = element.y + textHeight / 2 - totalTextHeight / 2 + lineHeight / 2

  // Draw each line
  lines.forEach((line, index) => {
    const y = startY + index * lineHeight

    // Apply text decoration
    if (textStyle.textDecoration === "underline") {
      const textMetrics = ctx.measureText(line)
      const underlineY = y + textStyle.fontSize * 0.1
      ctx.beginPath()
      ctx.moveTo(textX - textMetrics.width / 2, underlineY)
      ctx.lineTo(textX + textMetrics.width / 2, underlineY)
      ctx.strokeStyle = textStyle.textColor
      ctx.lineWidth = 1
      ctx.stroke()
    } else if (textStyle.textDecoration === "line-through") {
      const textMetrics = ctx.measureText(line)
      const strikeY = y - textStyle.fontSize * 0.2
      ctx.beginPath()
      ctx.moveTo(textX - textMetrics.width / 2, strikeY)
      ctx.lineTo(textX + textMetrics.width / 2, strikeY)
      ctx.strokeStyle = textStyle.textColor
      ctx.lineWidth = 1
      ctx.stroke()
    }

    ctx.fillText(line, textX, y)
  })
}

function drawImage(ctx: CanvasRenderingContext2D, element: Element) {
  if (!element.imageData) return

  const img = new Image()
  img.crossOrigin = "anonymous"
  img.onload = () => {
    const width = element.width || 150
    const height = element.height || 100
    ctx.drawImage(img, element.x, element.y, width, height)
  }
  img.src = element.imageData
}

function drawRoughRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  roughness: number,
) {
  const offset = roughness * 2

  ctx.beginPath()
  ctx.moveTo(x + Math.random() * offset, y + Math.random() * offset)
  ctx.lineTo(x + width + Math.random() * offset, y + Math.random() * offset)
  ctx.lineTo(x + width + Math.random() * offset, y + height + Math.random() * offset)
  ctx.lineTo(x + Math.random() * offset, y + height + Math.random() * offset)
  ctx.closePath()
  ctx.stroke()
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
}

export function isPointInElement(point: Point, element: Element): boolean {
  const bounds = getElementBounds(element)
  const padding = 5 // Add some padding for easier selection

  return (
    point.x >= bounds.x - padding &&
    point.x <= bounds.x + bounds.width + padding &&
    point.y >= bounds.y - padding &&
    point.y <= bounds.y + bounds.height + padding
  )
}

export function getElementBounds(element: Element): Bounds {
  if (element.points && element.points.length > 0) {
    // For freehand drawings
    let minX = element.points[0].x
    let minY = element.points[0].y
    let maxX = element.points[0].x
    let maxY = element.points[0].y

    element.points.forEach((point) => {
      minX = Math.min(minX, point.x)
      minY = Math.min(minY, point.y)
      maxX = Math.max(maxX, point.x)
      maxY = Math.max(maxY, point.y)
    })

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    }
  }

  const x1 = element.x
  const y1 = element.y
  const x2 = element.x2 || element.x + (element.width || 0)
  const y2 = element.y2 || element.y + (element.height || 0)

  return {
    x: Math.min(x1, x2),
    y: Math.min(y1, y2),
    width: Math.abs(x2 - x1),
    height: Math.abs(y2 - y1),
  }
}
