"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { DashboardIcon, MeetingIcon, PartyIcon, LogoutIcon } from "@/components/icons"

export default function DashboardLayout({ children }) {
  const pathname = usePathname()

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-800 bg-gray-900">
        <div className="flex h-20 items-center border-b border-gray-800 px-6">
          <Image src="/images/vkr-logo.png" alt="VKR Group" width={100} height={30} className="object-contain" />
        </div>
        <div className="p-4">
          <div className="space-y-1">
            <Link
              href="/dashboard"
              className={`flex items-center rounded-md px-3 py-2 ${
                pathname === "/dashboard"
                  ? "bg-gray-800 text-amber-400"
                  : "text-gray-400 hover:bg-gray-800 hover:text-amber-400"
              }`}
            >
              <DashboardIcon className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
            <Link
              href="/dashboard/meetings"
              className={`flex items-center rounded-md px-3 py-2 ${
                pathname.includes("/meetings")
                  ? "bg-gray-800 text-amber-400"
                  : "text-gray-400 hover:bg-gray-800 hover:text-amber-400"
              }`}
            >
              <MeetingIcon className="mr-3 h-5 w-5" />
              Meetings
            </Link>
            <Link
              href="/dashboard/parties"
              className={`flex items-center rounded-md px-3 py-2 ${
                pathname.includes("/parties")
                  ? "bg-gray-800 text-amber-400"
                  : "text-gray-400 hover:bg-gray-800 hover:text-amber-400"
              }`}
            >
              <PartyIcon className="mr-3 h-5 w-5" />
              Parties
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 w-64 border-t border-gray-800 p-4">
          <Link
            href="/"
            className="flex items-center rounded-md px-3 py-2 text-gray-400 hover:bg-gray-800 hover:text-amber-400"
          >
            <LogoutIcon className="mr-3 h-5 w-5" />
            Logout
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="flex h-16 items-center border-b border-gray-800 bg-gray-900 px-6">
          <div className="ml-auto flex items-center">
            <div className="flex items-center">
              <Image src="/images/vkr-logo.png" alt="VKR Group" width={40} height={20} className="object-contain" />
            </div>
          </div>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
