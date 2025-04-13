"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Bell, X } from "lucide-react"
import { saveData, loadData } from "@/lib/storage"

const NOTIFICATION_TIMES = [
  { id: 1, ms: 24 * 60 * 60 * 1000, label: "24 hours" },
  { id: 2, ms: 5 * 60 * 60 * 1000, label: "5 hours" },
  { id: 3, ms: 60 * 60 * 1000, label: "1 hour" },
  { id: 4, ms: 10 * 60 * 1000, label: "10 minutes" },
]

const parseEventDateTime = (dateString, timeString) => {
  const [year, month, day] = dateString.split("-").map(Number)
  const timeParts = timeString.replace(/[^0-9]/g, " ").split(" ").filter(Boolean)
  
  let hours = parseInt(timeParts[0], 10) || 0
  let minutes = parseInt(timeParts[1], 10) || 0

  // Handle PM times without colon (e.g., 6PM)
  if (timeString.toLowerCase().includes("pm") && hours < 12) hours += 12
  if (timeString.toLowerCase().includes("am") && hours === 12) hours = 0

  const date = new Date(year, month - 1, day, hours, minutes)
  return isNaN(date) ? null : date
}

export default function PartiesPage() {
  const [filter, setFilter] = useState("all")
  const [parties, setParties] = useState([])
  const [notifications, setNotifications] = useState([])
  const [browserNotifications, setBrowserNotifications] = useState(false)

  useEffect(() => {
    const savedParties = loadData("parties") || []
    setParties(savedParties.length ? savedParties : initializeParties())
    
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      setBrowserNotifications(true)
    }
    
    const interval = setInterval(checkForEvents, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const initializeParties = () => {
    const initialParties = [
      {
        id: 1,
        title: "Sample Event",
        date: new Date().toISOString().split('T')[0],
        time: "16:04",
        location: "Test Location",
        invitees: 10,
        confirmed: 5,
        type: "national"
      }
    ]
    saveData("parties", initialParties)
    return initialParties
  }

  const checkForEvents = () => {
    const now = Date.now()
    const newNotifications = []

    parties.forEach(party => {
      const eventDate = parseEventDateTime(party.date, party.time)
      if (!eventDate || eventDate < now) return

      NOTIFICATION_TIMES.forEach(notification => {
        const timeDiff = eventDate - now
        if (timeDiff <= notification.ms && timeDiff > 0) {
          const exists = notifications.some(n => 
            n.partyId === party.id && n.interval === notification.ms
          )
          
          if (!exists) {
            newNotifications.push({
              id: `${party.id}-${notification.ms}-${now}`,
              partyId: party.id,
              title: party.title,
              message: `"${party.title}" starts in ${notification.label}`,
              interval: notification.ms
            })
          }
        }
      })
    })

    if (newNotifications.length > 0) {
      setNotifications(prev => [...newNotifications, ...prev])
      
      if (browserNotifications) {
        newNotifications.forEach(({ message }) => {
          new Notification("Event Reminder", { body: message })
        })
      }
    }
  }

  const handleDeleteParty = (partyId) => {
    if (confirm("Delete this party?")) {
      const updated = parties.filter(p => p.id !== partyId)
      setParties(updated)
      saveData("parties", updated)
    }
  }

  const requestNotifications = () => {
    Notification.requestPermission().then(permission => {
      setBrowserNotifications(permission === "granted")
      if (permission === "granted") {
        new Notification("Notifications Enabled", {
          body: "You'll receive reminders for upcoming events",
        })
      }
    })
  }

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const filteredParties = parties.filter(p => 
    filter === "all" ? true : p.type === filter
  )

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* In-App Notifications */}
      <div className="fixed top-4 right-4 space-y-2 z-50 w-80">
        {notifications.map(n => (
          <div key={n.id} className="p-4 bg-gray-800 border-2 border-amber-400 rounded-lg shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-white">{n.title}</p>
                <p className="text-amber-400 text-sm mt-1">{n.message}</p>
              </div>
              <button 
                onClick={() => removeNotification(n.id)}
                className="text-gray-400 hover:text-amber-500 ml-2"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Header Section */}
      <div className="flex items-center justify-between gap-4 flex-wrap mb-8">
        <h1 className="text-3xl font-bold text-white">Events</h1>
        <div className="flex gap-4 items-center">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded-md border border-gray-700 focus:ring-2 focus:ring-amber-400"
          >
            <option value="all">All Events</option>
            <option value="national">National</option>
            <option value="international">International</option>
          </select>

          <Button
            onClick={requestNotifications}
            className={`${browserNotifications ? "bg-green-600" : "bg-gray-800"} hover:bg-opacity-80 text-white`}
          >
            <Bell className="mr-2 h-4 w-4" />
            {browserNotifications ? "Notifications Enabled" : "Enable Notifications"}
          </Button>

          <Link href="/dashboard/parties/new">
            <Button className="bg-amber-400 hover:bg-amber-300 text-gray-900">
              New Event
            </Button>
          </Link>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {filteredParties.map(party => {
          const eventDate = parseEventDateTime(party.date, party.time)
          const isPast = eventDate ? eventDate < new Date() : false

          return (
            <Card key={party.id} className="border-gray-700 bg-gray-800">
              <CardHeader className="pb-2 relative">
                <CardTitle className="text-xl text-white">
                  {party.title}
                  <span className={`ml-2 text-sm ${
                    party.type === "international" ? "text-amber-400" : "text-gray-400"
                  }`}>
                    ({party.type})
                  </span>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 right-4 text-red-400 hover:bg-red-900/20"
                  onClick={() => handleDeleteParty(party.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="text-white">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Date & Time</p>
                    <p>{party.date} {party.time}</p>
                    {isPast && <span className="text-red-400 text-xs">(Past Event)</span>}
                  </div>
                  <div>
                    <p className="text-gray-400">Location</p>
                    <p>{party.location}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Invitees</p>
                    <p>{party.invitees} ({party.confirmed} confirmed)</p>
                  </div>
                  <div className="space-y-2">
                    <Link href={`/dashboard/parties/${party.id}`}>
                      <Button className="w-full bg-gray-700 hover:bg-gray-600 text-white">
                        Manage Event
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}