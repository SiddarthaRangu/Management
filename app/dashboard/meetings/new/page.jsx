"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon } from "@/components/icons"
import { saveData, loadData } from "@/lib/storage"

export default function NewMeetingPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    companyGroup: "",
    attendees: "",
    host: "VKR",
    agenda: "",
    expectedOutcome: "",
    date: "",
    startTime: "",
    endTime: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Generate unique ID
    const newId = Date.now()

    // Create new meeting object
    const newMeeting = {
      id: newId,
      title: formData.title,
      company: formData.companyGroup,
      date: formData.date,
      time: `${formData.startTime} - ${formData.endTime}`,
      host: formData.host,
      attendees: formData.attendees.split(",").map((email) => email.trim()),
      agenda: formData.agenda,
      expectedOutcome: formData.expectedOutcome,
      type: "national", // Add your type detection logic
      createdAt: new Date().toISOString(),
    }

    // Get existing meetings from localStorage
    const existingMeetings = loadData("meetings") || []

    // Add new meeting
    const updatedMeetings = [...existingMeetings, newMeeting]

    // Save to localStorage
    saveData("meetings", updatedMeetings)

    // Schedule notification reminders
    scheduleNotifications(newMeeting)

    // Redirect to meetings list
    router.push("/dashboard/meetings")
  }

  const scheduleNotifications = (meeting) => {
    if (!("Notification" in window) || Notification.permission !== "granted") return

    try {
      // Parse the meeting date and time
      const timeStr = meeting.time.split(" - ")[0]
      const [hours, minutes] = timeStr.split(":").map((num) => Number.parseInt(num, 10))
      const [year, month, day] = meeting.date.split("-").map((num) => Number.parseInt(num, 10))

      const meetingDate = new Date(year, month - 1, day, hours, minutes)
      const now = new Date()

      if (meetingDate <= now) return

      // Store timeouts in window object so they can be cleared if needed
      window.meetingNotificationTimeouts = window.meetingNotificationTimeouts || []

      // Schedule notifications at different intervals
      const notificationTimes = [
        { time: 24 * 60 * 60 * 1000, message: "tomorrow" }, // 1 day before
        { time: 60 * 60 * 1000, message: "in 1 hour" }, // 1 hour before
      ]

      notificationTimes.forEach(({ time, message }) => {
        const notifyTime = new Date(meetingDate.getTime() - time)

        if (notifyTime > now) {
          const timeUntilNotification = notifyTime.getTime() - now.getTime()

          const timeout = setTimeout(() => {
            new Notification(`Meeting Reminder: ${meeting.title}`, {
              body: `Your meeting starts ${message}`,
              icon: "/images/vkr-logo.png",
            })
          }, timeUntilNotification)

          window.meetingNotificationTimeouts.push(timeout)
        }
      })
    } catch (error) {
      console.error("Error scheduling notifications:", error)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold">Create Professional Meeting</h1>
        <p className="text-gray-400">Schedule a new professional meeting and add it to your calendar</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="border-gray-800 bg-gray-900 text-white">
          <CardHeader>
            <CardTitle className="font-bold">Meeting Details</CardTitle>
            <CardDescription className="text-gray-400">
              Fill in the details for your professional meeting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Meeting Title"
                value={formData.title}
                onChange={handleChange}
                className="border-gray-700 bg-gray-800 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyGroup">Company Group</Label>
              <Input
                id="companyGroup"
                name="companyGroup"
                placeholder="Company or Group Name"
                value={formData.companyGroup}
                onChange={handleChange}
                className="border-gray-700 bg-gray-800 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="attendees">Attendees (comma-separated emails)</Label>
              <Input
                id="attendees"
                name="attendees"
                placeholder="email1@example.com, email2@example.com"
                value={formData.attendees}
                onChange={handleChange}
                className="border-gray-700 bg-gray-800 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="host">Host</Label>
              <Input
                id="host"
                name="host"
                value={formData.host}
                onChange={handleChange}
                className="border-gray-700 bg-gray-800 text-white"
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="border-gray-700 bg-gray-800 pl-10 text-white"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  name="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="border-gray-700 bg-gray-800 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  name="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="border-gray-700 bg-gray-800 text-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="agenda">Agenda</Label>
              <Textarea
                id="agenda"
                name="agenda"
                placeholder="Meeting agenda and topics to discuss"
                value={formData.agenda}
                onChange={handleChange}
                className="min-h-[100px] border-gray-700 bg-gray-800 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedOutcome">Expected Outcome</Label>
              <Textarea
                id="expectedOutcome"
                name="expectedOutcome"
                placeholder="What do you hope to achieve from this meeting?"
                value={formData.expectedOutcome}
                onChange={handleChange}
                className="min-h-[100px] border-gray-700 bg-gray-800 text-white"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t border-gray-800 pt-6">
            <Button
              type="button"
              variant="outline"
              className="border-gray-700 bg-gray-800 text-white hover:bg-gray-700"
              onClick={() => router.push("/dashboard/meetings")}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-amber-500 text-black hover:bg-amber-400">
              Create Meeting
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
