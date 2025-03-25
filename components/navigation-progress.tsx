"use client"

import { useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import NProgress from "nprogress"
import "nprogress/nprogress.css"

// Configure NProgress
NProgress.configure({
  showSpinner: false,
  minimum: 0.1,
  speed: 300,
  easing: "ease",
  trickleSpeed: 200,
})

export default function NavigationProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [prevPathname, setPrevPathname] = useState(pathname)
  const [prevSearchParams, setPrevSearchParams] = useState(searchParams)

  useEffect(() => {
    // Check if the route has changed
    if (pathname !== prevPathname || searchParams !== prevSearchParams) {
      // Complete any in-progress loading
      NProgress.done()
      setPrevPathname(pathname)
      setPrevSearchParams(searchParams)
    }
  }, [pathname, searchParams, prevPathname, prevSearchParams])

  useEffect(() => {
    // Handle route change start
    const handleStart = () => {
      NProgress.start()
    }

    // Handle route change complete
    const handleComplete = () => {
      NProgress.done()
    }

    // Intercept link clicks to show loading state
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest("a")

      // Only handle internal links (same origin)
      if (link && link.origin === window.location.origin && !link.hasAttribute("download")) {
        NProgress.start()
      }
    }

    document.addEventListener("click", handleLinkClick)

    return () => {
      document.removeEventListener("click", handleLinkClick)
      NProgress.done()
    }
  }, [])

  return null
}

