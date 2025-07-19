export type Tool =
  | "select"
  | "hand"
  | "rectangle"
  | "diamond"
  | "circle"
  | "arrow"
  | "line"
  | "draw"
  | "text"
  | "image"
  | "eraser"
  | "connector"
  | "lock"

export interface Point {
  x: number
  y: number
}

export interface ElementStyle {
  strokeColor: string
  fillColor: string
  strokeWidth: number
  strokeStyle: "solid" | "dashed" | "dotted"
  roughness: number
  opacity: number
  edge: "sharp" | "round"
  fillPattern: "none" | "hachure" | "solid"
}

export interface TextStyle {
  fontFamily: string
  fontSize: number
  fontWeight: "normal" | "bold" | "lighter"
  fontStyle: "normal" | "italic"
  textAlign: "left" | "center" | "right"
  textColor: string
  backgroundColor: string
  textDecoration: "none" | "underline" | "line-through"
  lineHeight: number
}

export interface Element extends ElementStyle {
  id: string
  type: Tool
  x: number
  y: number
  x2?: number
  y2?: number
  width?: number
  height?: number
  text?: string
  points?: Point[]
  imageData?: string
  textStyle?: TextStyle
}

export interface ViewTransform {
  x: number
  y: number
  zoom: number
}

export interface Bounds {
  x: number
  y: number
  width: number
  height: number
}
