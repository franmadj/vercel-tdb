"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface MenuItem {
  id: number
  title: string
  url: string
  children?: MenuItem[]
}

export default function Navigation() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    async function fetchMenu() {
      try {
        // Fetch primary menu from WordPress
        const res = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/menus/v1/menus/primary`)

        if (res.ok) {
          const data = await res.json()
          setMenuItems(data.items || [])
        } else {
          // Fallback to hardcoded menu if the WordPress menu API is not available
          setMenuItems([
            { id: 1, title: "Home", url: "/" },
            { id: 2, title: "Blog", url: "/blog" },
            { id: 3, title: "Shop", url: "/shop" },
            { id: 4, title: "About", url: "/about" }
          ])
        }
      } catch (error) {
        console.error("Error fetching menu:", error)
        // Fallback menu
        setMenuItems([
          { id: 1, title: "Home", url: "/" },
          { id: 2, title: "Blog", url: "/blog" },
          { id: 3, title: "Shop", url: "/shop" },
          { id: 4, title: "About", url: "/about" }
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchMenu()
  }, [])

  // Convert WordPress URLs to Next.js paths
  const formatPath = (url: string) => {
    try {
      const parsedUrl = new URL(url)
      return parsedUrl.pathname
    } catch {
      return url
    }
  }

  return (
    <nav className="w-full">
      {/* Desktop Navigation */}
      <div className="hidden md:flex space-x-6">
        {!isLoading &&
          menuItems.map((item) => (
            <Link
              key={item.id}
              href={formatPath(item.url)}
              className={`text-gray-700 hover:text-blue-600 transition-colors ${
                pathname === formatPath(item.url) ? "font-semibold text-blue-600" : ""
              }`}
            >
              {item.title}
            </Link>
          ))}
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-700 hover:text-blue-600">
          {mobileMenuOpen ? "Close" : "Menu"}
        </button>

        {mobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white shadow-md p-4 z-50">
            {!isLoading &&
              menuItems.map((item) => (
                <Link
                  key={item.id}
                  href={formatPath(item.url)}
                  className={`block py-2 text-gray-700 hover:text-blue-600 ${
                    pathname === formatPath(item.url) ? "font-semibold text-blue-600" : ""
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.title}
                </Link>
              ))}
          </div>
        )}
      </div>
    </nav>
  )
}

