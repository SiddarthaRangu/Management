"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { DashboardIcon, MeetingIcon, PartyIcon, LogoutIcon, MenuIcon, XIcon } from "@/components/icons"

export default function DashboardLayout({ children }) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-gray-800 hover:bg-gray-700"
      >
        {isMobileMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:relative z-40 w-64 h-full transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
          border-r border-gray-800 bg-gray-900`}
      >
        <div className="flex h-20 items-center border-b border-gray-800 px-6">
          <Image 
            src="/images/vkr-logo.png" 
            alt="VKR Group" 
            width={100} 
            height={30} 
            className="object-contain"
          />
        </div>
        <div className="p-4 h-[calc(100vh-8rem)] overflow-y-auto">
          <div className="space-y-1">
            <Link
              href="/dashboard"
              className={`flex items-center rounded-md px-3 py-3 text-sm
                ${pathname === "/dashboard"
                  ? "bg-gray-800 text-amber-400"
                  : "text-gray-400 hover:bg-gray-800 hover:text-amber-400"
                }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <DashboardIcon className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
            <Link
              href="/dashboard/meetings"
              className={`flex items-center rounded-md px-3 py-3 text-sm
                ${pathname.includes("/meetings")
                  ? "bg-gray-800 text-amber-400"
                  : "text-gray-400 hover:bg-gray-800 hover:text-amber-400"
                }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <MeetingIcon className="mr-3 h-5 w-5" />
              Meetings
            </Link>
            <Link
              href="/dashboard/parties"
              className={`flex items-center rounded-md px-3 py-3 text-sm
                ${pathname.includes("/parties")
                  ? "bg-gray-800 text-amber-400"
                  : "text-gray-400 hover:bg-gray-800 hover:text-amber-400"
                }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <PartyIcon className="mr-3 h-5 w-5" />
              Parties
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 w-full border-t border-gray-800 p-4 bg-gray-900">
          <Link
            href="/"
            className="flex items-center rounded-md px-3 py-3 text-sm text-gray-400 hover:bg-gray-800 hover:text-amber-400"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <LogoutIcon className="mr-3 h-5 w-5" />
            Logout
          </Link>
        </div>
      </div>

      {/* Backdrop for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="flex h-16 items-center border-b border-gray-800 bg-gray-900 px-4 md:px-6">
          <div className="ml-auto flex items-center">
            <div className="flex items-center">
              <Image 
                src="/images/vkr-logo.png" 
                alt="VKR Group" 
                width={40} 
                height={20} 
                className="object-contain"
              />
            </div>
          </div>
        </div>
        <div className="p-4 md:p-6">{children}</div>
      </div>
    </div>
  )
}