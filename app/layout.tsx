import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import Navigation from "@/components/navigation"
import SearchForm from "@/components/search-form"
import MiniCart from "@/components/mini-cart"
import { CartProvider } from "@/contexts/cart-context"

export const metadata: Metadata = {
  title: "My WordPress Site",
  description: "My headless WordPress site built with Next.js",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <header className="bg-white shadow-sm sticky top-0 z-10">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold">
                    <a href="/">My WordPress Site</a>
                  </h1>
                  <div className="md:hidden">{/* Mobile menu button will be inside Navigation component */}</div>
                </div>
                <Navigation />
                <div className="hidden md:flex items-center gap-4">
                  <SearchForm />
                  <MiniCart />
                </div>
              </div>
              <div className="mt-4 md:hidden flex items-center justify-between">
                <SearchForm />
                <MiniCart />
              </div>
            </div>
          </header>

          <main className="min-h-screen">{children}</main>

          <footer className="bg-gray-100 mt-12">
            <div className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">About Us</h3>
                  <p className="text-gray-600">
                    A headless WordPress site built with Next.js and the WordPress REST API.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                  <ul className="space-y-2">
                    <li>
                      <a href="/" className="text-gray-600 hover:text-blue-600">
                        Home
                      </a>
                    </li>
                    <li>
                      <a href="/shop" className="text-gray-600 hover:text-blue-600">
                        Shop
                      </a>
                    </li>
                    <li>
                      <a href="/blog" className="text-gray-600 hover:text-blue-600">
                        Blog
                      </a>
                    </li>
                    <li>
                      <a href="/about" className="text-gray-600 hover:text-blue-600">
                        About
                      </a>
                    </li>
                    <li>
                      <a href="/contact" className="text-gray-600 hover:text-blue-600">
                        Contact
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="text-gray-600 hover:text-blue-600">
                      Twitter
                    </a>
                    <a href="#" className="text-gray-600 hover:text-blue-600">
                      Facebook
                    </a>
                    <a href="#" className="text-gray-600 hover:text-blue-600">
                      Instagram
                    </a>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 mt-8 pt-8 text-center">
                <p>© {new Date().getFullYear()} My WordPress Site. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  )
}

