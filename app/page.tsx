"use client"

import { RouterProvider } from "@tanstack/react-router"
import { router } from "@/lib/router"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <RouterProvider router={router} />
    </div>
  )
}

