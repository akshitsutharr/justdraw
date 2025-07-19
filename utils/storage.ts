import type { Element, ViewTransform } from "@/types/whiteboard"

interface StorageData {
  elements: Element[]
  viewTransform: ViewTransform
  timestamp: number
}

const STORAGE_KEY = "justdraw-whiteboard-data"
const SHARED_STORAGE_PREFIX = "justdraw-shared-"

export function saveToStorage(data: Omit<StorageData, "timestamp">): void {
  try {
    const storageData: StorageData = {
      ...data,
      timestamp: Date.now(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData))
  } catch (error) {
    console.error("Failed to save to localStorage:", error)
  }
}

export function loadFromStorage(): Omit<StorageData, "timestamp"> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const data: StorageData = JSON.parse(stored)
      return {
        elements: data.elements || [],
        viewTransform: data.viewTransform || { x: 0, y: 0, zoom: 1 },
      }
    }
  } catch (error) {
    console.error("Failed to load from localStorage:", error)
  }

  return {
    elements: [],
    viewTransform: { x: 0, y: 0, zoom: 1 },
  }
}

export function saveSharedData(shareId: string, data: StorageData): void {
  try {
    localStorage.setItem(SHARED_STORAGE_PREFIX + shareId, JSON.stringify(data))
  } catch (error) {
    console.error("Failed to save shared data:", error)
  }
}

export function loadSharedData(shareId: string): StorageData | null {
  try {
    const stored = localStorage.getItem(SHARED_STORAGE_PREFIX + shareId)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error("Failed to load shared data:", error)
  }
  return null
}

export function clearStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error("Failed to clear localStorage:", error)
  }
}
