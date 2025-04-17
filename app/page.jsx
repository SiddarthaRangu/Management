"use client"

import { redirect } from "next/navigation"
import Image from "next/image"

export default function Home() {
  // In a real implementation, we would check if the user is authenticated
  const isAuthenticated = false
  
  if (isAuthenticated) {
    redirect("/dashboard")
  }
  
  const handleLogoClick = () => {
    window.location.href = "/dashboard"
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-black relative">
      {/* Background logo with opacity */}
      <div className="absolute inset-0 flex items-center justify-center opacity-15">
        <Image
          src="/vkr-logo.png" // You would need to have your logo stored in the public folder
          alt="VKR Group Background"
          width={800}
          height={800}
          className="object-contain"
        />
      </div>
      
      <div className="z-10 flex flex-col items-center justify-center">
        {/* Clickable VKR logo */}
        <div 
          className="cursor-pointer mb-8 transition-transform hover:scale-105"
          onClick={handleLogoClick}
        >
          <Image
            src="/vkr-logo.png" // You would need to have your logo stored in the public folder
            alt="VKR Group"
            width={200}
            height={200}
            className="object-contain"
          />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-2">
          SCHEDULE MANAGER
        </h1>
        
        <p className="text-gray-400 text-center mb-8">
          Streamline your professional events
        </p>
      </div>
    </div>
  )
}