"use client"

import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { GoogleIcon } from "@/components/icons"
import Image from "next/image"

export default function Home() {
  // In a real implementation, we would check if the user is authenticated
  const isAuthenticated = false

  if (isAuthenticated) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white relative">
      {/* Background logo with opacity */}
      <div className="absolute inset-0 flex items-center justify-center opacity-25 pointer-events-none">
        <Image src="/images/vkr-logo.png" alt="VKR Group" width={600} height={600} className="object-contain" />
      </div>

      <div className="w-full max-w-md space-y-8 rounded-lg border border-gray-800 bg-gray-900/80 p-8 shadow-lg backdrop-blur-sm z-10">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Image src="/images/vkr-logo.png" alt="VKR Group" width={180} height={100} className="object-contain" />
          </div>
          <h1 className="text-3xl font-bold">Event Manager</h1>
          <p className="mt-2 text-gray-400">Streamline your professional events</p>
        </div>

        <div className="mt-8">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 bg-amber-500 text-black hover:bg-amber-400 border-amber-600"
            onClick={() => (window.location.href = "/dashboard")}
          >
            <GoogleIcon className="h-5 w-5" />
            <span>Sign in with Google</span>
          </Button>

          <p className="mt-4 text-center text-sm text-gray-500">
            Sign in to connect your Google Calendar and manage your events
          </p>
        </div>
      </div>
    </div>
  )
}
