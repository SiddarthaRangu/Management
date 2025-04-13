"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MeetingIcon, PartyIcon } from "@/components/icons"
import { useEffect, useState } from "react"
import { loadData } from "@/lib/storage"

export default function Dashboard() {
  const [upcomingMeetings, setUpcomingMeetings] = useState([])
  const [upcomingParties, setUpcomingParties] = useState([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Set client-side flag
    setIsClient(true)

    // Load data from client-side storage
    const meetings = loadData("meetings") || []
    const parties = loadData("parties") || []

    // Sort and slice meetings
    const sortedMeetings = meetings.sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 2)
    setUpcomingMeetings(sortedMeetings.length > 0 ? sortedMeetings : [
      { id: 1, title: "Product Strategy Meeting", date: "2025-04-15", time: "10:00 AM", company: "Acme Corp" },
      { id: 2, title: "Quarterly Review", date: "2025-04-18", time: "2:00 PM", company: "TechGiant Inc" },
    ])

    // Sort and slice parties
    const sortedParties = parties.sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 2)
    setUpcomingParties(sortedParties.length > 0 ? sortedParties : [
      { id: 1, title: "Spring Networking Event", date: "2025-04-20", time: "6:00 PM", location: "Grand Hotel" },
      { id: 2, title: "Product Launch Celebration", date: "2025-04-25", time: "7:30 PM", location: "Skyline Lounge" },
    ])

    // Notification permission check
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        console.log("Notification permission not yet granted")
      }
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex space-x-4">
          {isClient && typeof window !== "undefined" && "Notification" in window && Notification.permission !== "granted" && (
            <Button
              onClick={() => Notification.requestPermission()}
              className="border-gray-700 bg-gray-800 text-white hover:bg-gray-700 hover:text-amber-400 transform hover:-translate-y-1 hover:scale-110 transition-all duration-300"
            >
              Enable Notifications
            </Button>
          )}
          <Link href="/dashboard/meetings/new">
            <Button
              variant="outline"
              className="border-gray-700 bg-gray-800 text-white hover:bg-gray-700 hover:text-amber-400 transform hover:-translate-y-1 hover:scale-110 transition-all duration-300"
            >
              New Meeting
            </Button>
          </Link>
          <Link href="/dashboard/parties/new">
            <Button className="bg-amber-500 text-black hover:bg-amber-400 transform hover:-translate-y-1 hover:scale-110 transition-all duration-300">New Party</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-2 border-gray-800 bg-gray-900 text-white hover:border-amber-500 hover:border-3 transform hover:-translate-y-3 hover:shadow-2xl hover:shadow-amber-500/30 transition-all duration-300 cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold">Upcoming Meetings</CardTitle>
              <CardDescription className="text-gray-400">Your scheduled professional meetings</CardDescription>
            </div>
            <MeetingIcon className="h-5 w-5 text-amber-400 group-hover:animate-bounce" />
          </CardHeader>
          <CardContent>
            {upcomingMeetings.length > 0 ? (
              <div className="space-y-4">
                {upcomingMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="rounded-md border-2 border-gray-800 bg-gray-800 p-4 hover:border-amber-500 hover:border-3 transform hover:-translate-y-2 hover:scale-105 hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-300"
                  >
                    <div className="mb-2 text-lg font-medium">{meeting.title}</div>
                    <div className="text-sm text-gray-400">
                      <div>{meeting.company}</div>
                      <div>
                        {meeting.date} at {meeting.time}
                      </div>
                    </div>
                  </div>
                ))}
                <Link href="/dashboard/meetings">
                  <Button variant="link" className="mt-2 px-0 text-amber-400 hover:text-amber-300 transform hover:-translate-y-1 hover:scale-110 transition-all duration-300">
                    View all meetings →
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="py-4 text-center text-gray-400">No upcoming meetings</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-800 bg-gray-900 text-white hover:border-amber-500 hover:border-3 transform hover:-translate-y-3 hover:shadow-2xl hover:shadow-amber-500/30 transition-all duration-300 cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold">Upcoming Parties</CardTitle>
              <CardDescription className="text-gray-400">Your scheduled business parties</CardDescription>
            </div>
            <PartyIcon className="h-5 w-5 text-amber-400 group-hover:animate-bounce" />
          </CardHeader>
          <CardContent>
            {upcomingParties.length > 0 ? (
              <div className="space-y-4">
                {upcomingParties.map((party) => (
                  <div
                    key={party.id}
                    className="rounded-md border-2 border-gray-800 bg-gray-800 p-4 hover:border-amber-500 hover:border-3 transform hover:-translate-y-2 hover:scale-105 hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-300"
                  >
                    <div className="mb-2 text-lg font-medium">{party.title}</div>
                    <div className="text-sm text-gray-400">
                      <div>{party.location}</div>
                      <div>
                        {party.date} at {party.time}
                      </div>
                    </div>
                  </div>
                ))}
                <Link href="/dashboard/parties">
                  <Button variant="link" className="mt-2 px-0 text-amber-400 hover:text-amber-300 transform hover:-translate-y-1 hover:scale-110 transition-all duration-300">
                    View all parties →
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="py-4 text-center text-gray-400">No upcoming parties</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}