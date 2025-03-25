"use client"

import { useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export default function LoadingIndicator() {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // When the route changes, set loading to false
    setIsLoading(false)
  }, [pathname, searchParams])

  // Listen for navigation start
  useEffect(() => {
    const handleStart = () => {
      setIsLoading(true)
    }

    const handleStop = () => {
      setIsLoading(false)
    }

    // Add event listeners for route change start and complete
    window.addEventListener("beforeunload", handleStart)
    window.addEventListener("load", handleStop)

    // Create a MutationObserver to detect when the body content changes
    // This helps detect navigation in the App Router
    const observer = new MutationObserver(() => {
      setIsLoading(false)
    })

    // Start observing the document body for changes
    observer.observe(document.body, { childList: true, subtree: true })

    // Intercept link clicks to show loading state
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest("a")

      // Only handle internal links (same origin)
      if (link && link.origin === window.location.origin && !link.hasAttribute("download")) {
        setIsLoading(true)
      }
    }

    document.addEventListener("click", handleLinkClick)

    return () => {
      window.removeEventListener("beforeunload", handleStart)
      window.removeEventListener("load", handleStop)
      document.removeEventListener("click", handleLinkClick)
      observer.disconnect()
    }
  }, [])

  if (!isLoading) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="h-1 bg-blue-600 animate-[loading_2s_ease-in-out_infinite]"></div>
      <style jsx>{`
        @keyframes loading {
          0% { width: 0; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  )
}

