"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { CalendarIcon } from "@/components/icons"
import { toast } from "sonner"
import { saveData, loadData } from "@/lib/storage"

export default function NewPartyPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [location, setLocation] = useState("")
  const [invitees, setInvitees] = useState([{ email: "", whatsapp: "", allowPlusOne: false }])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [demoMode, setDemoMode] = useState(true)
  const [sentEmails, setSentEmails] = useState([])

  const addInvitee = () => {
    setInvitees([...invitees, { email: "", whatsapp: "", allowPlusOne: false }])
  }

  const updateInvitee = (index, field, value) => {
    const updatedInvitees = [...invitees]
    updatedInvitees[index] = { ...updatedInvitees[index], [field]: value }
    setInvitees(updatedInvitees)
  }

  const removeInvitee = (index) => {
    const updatedInvitees = [...invitees]
    updatedInvitees.splice(index, 1)
    setInvitees(updatedInvitees)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!title || !date || !startTime || !endTime || !location) {
        throw new Error("Please fill all party details")
      }

      if (invitees.some((invitee) => !invitee.email)) {
        throw new Error("Please fill all invitee emails")
      }

      // Create party object
      const newParty = {
        id: Date.now(),
        title,
        date,
        time: `${startTime} - ${endTime}`,
        location,
        invitees: invitees.length,
        confirmed: 0,
        type: location.includes("Hotel") ? "national" : "international",
        createdAt: new Date().toISOString(),
      }

      // Save to localStorage
      const existingParties = loadData("parties") || []
      const updatedParties = [...existingParties, newParty]
      saveData("parties", updatedParties)

      // Simulate email sending
      const emailResults = []
      for (const invitee of invitees) {
        const result = demoMode
          ? await simulateDemoEmail(invitee.email, invitee.whatsapp)
          : await simulateRealEmail(invitee.email, invitee.whatsapp)
        emailResults.push(result)
      }

      setSentEmails(emailResults)
      showSuccessMessage()
      redirectToPartiesList()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const simulateDemoEmail = async (email, whatsapp) => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    return { email, whatsapp, demo: true }
  }

  const simulateRealEmail = async (email, whatsapp) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { email, whatsapp }
  }

  const showSuccessMessage = () => {
    toast.success(
      demoMode
        ? "Demo invitations sent! (Real emails and WhatsApp messages would be sent in production)"
        : "Invitations sent successfully via email and WhatsApp!",
    )
  }

  const redirectToPartiesList = () => {
    setTimeout(() => router.push("/dashboard/parties"), 2000)
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold">Create Party</h1>
          <p className="text-gray-400">Plan a new party and manage invitations</p>
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="demo-mode">Demo Mode</Label>
          <Checkbox
            id="demo-mode"
            checked={demoMode}
            onCheckedChange={(checked) => setDemoMode(checked)}
            className="border-gray-700 bg-gray-800"
          />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="border-gray-800 bg-gray-900 text-white">
          <CardHeader>
            <CardTitle className="font-bold">Party Details</CardTitle>
            <CardDescription className="text-gray-400">Fill in the details for your party</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Party Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border-gray-700 bg-gray-800 pl-10 text-white"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="border-gray-700 bg-gray-800 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="border-gray-700 bg-gray-800 text-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Party Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border-gray-700 bg-gray-800 text-white"
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Invitees ({demoMode ? "Demo Mode" : "Real Emails & WhatsApp"})</Label>
                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-700 bg-gray-800 text-white hover:bg-gray-700"
                  onClick={addInvitee}
                >
                  Add Invitee
                </Button>
              </div>

              {invitees.map((invitee, index) => (
                <div key={index} className="space-y-3 p-3 border border-gray-800 rounded-md">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Label htmlFor={`email-${index}`} className="text-sm mb-1 block">
                        Email
                      </Label>
                      <Input
                        id={`email-${index}`}
                        placeholder="Email address"
                        type="email"
                        value={invitee.email}
                        onChange={(e) => updateInvitee(index, "email", e.target.value)}
                        className="border-gray-700 bg-gray-800 text-white"
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor={`whatsapp-${index}`} className="text-sm mb-1 block">
                        WhatsApp
                      </Label>
                      <Input
                        id={`whatsapp-${index}`}
                        placeholder="WhatsApp number with country code"
                        type="tel"
                        value={invitee.whatsapp}
                        onChange={(e) => updateInvitee(index, "whatsapp", e.target.value)}
                        className="border-gray-700 bg-gray-800 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`allow-plus-one-${index}`}
                        checked={invitee.allowPlusOne}
                        onCheckedChange={(checked) => updateInvitee(index, "allowPlusOne", checked)}
                        className="border-gray-700 bg-gray-800"
                      />
                      <Label htmlFor={`allow-plus-one-${index}`} className="text-sm">
                        Allow +1
                      </Label>
                    </div>

                    {invitees.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        className="h-8 w-8 border-gray-700 bg-gray-800 p-0 text-white hover:bg-gray-700"
                        onClick={() => removeInvitee(index)}
                      >
                        ×
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {sentEmails.length > 0 && (
              <div className="rounded-lg border border-amber-500 bg-amber-900/20 p-4">
                <h3 className="font-medium text-amber-400">{demoMode ? "Demo" : ""} Invitations Sent</h3>
                <ul className="mt-2 space-y-1">
                  {sentEmails.map((result, index) => (
                    <li key={index} className="text-sm">
                      {result.email} / {result.whatsapp} {result.demo && "(Demo)"}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t border-gray-800 pt-6">
            <Button
              type="button"
              variant="outline"
              className="border-gray-700 bg-gray-800 text-white hover:bg-gray-700"
              onClick={() => router.push("/dashboard/parties")}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-amber-500 text-black hover:bg-amber-400" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Create & Send Invitations"}
            </Button>
          </CardFooter>
        </Card>
      </form>

      {demoMode && (
        <div className="mt-6 rounded-lg border border-amber-500 bg-amber-900/20 p-4">
          <h3 className="font-medium text-amber-400">Demo Mode Active</h3>
          <p className="mt-1 text-sm text-amber-300">
            In demo mode, no real emails or WhatsApp messages are sent. The system will simulate the sending process.
          </p>
          <p className="mt-2 text-sm text-amber-300">
            To send real invitations, turn off demo mode and configure your email and WhatsApp service.
          </p>
        </div>
      )}
    </div>
  )
}
