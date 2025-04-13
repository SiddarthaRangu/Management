"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Mail, Phone } from "lucide-react"

export default function PartyDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const partyId = params.id

  const [party, setParty] = useState({
    id: partyId,
    title: "Spring Networking Event",
    date: "2025-04-20",
    time: "6:00 PM",
    location: "Grand Hotel",
    invitees: [
      {
        id: 1,
        email: "john@example.com",
        whatsapp: "+1234567890",
        allowPlusOne: true,
        rsvp: "pending",
        guestName: "",
        invitationSent: false,
      },
      {
        id: 2,
        email: "sarah@example.com",
        whatsapp: "+1987654321",
        allowPlusOne: false,
        rsvp: "yes",
        guestName: "",
        invitationSent: true,
      },
      {
        id: 3,
        email: "mike@example.com",
        whatsapp: "+1122334455",
        allowPlusOne: true,
        rsvp: "no",
        guestName: "",
        invitationSent: true,
      },
      {
        id: 4,
        email: "lisa@example.com",
        whatsapp: "+1555666777",
        allowPlusOne: true,
        rsvp: "yes",
        guestName: "David Smith",
        invitationSent: true,
      },
      {
        id: 5,
        email: "alex@example.com",
        whatsapp: "+1999888777",
        allowPlusOne: false,
        rsvp: "maybe",
        guestName: "",
        invitationSent: false,
      },
    ],
  })

  // Rest of your component logic remains the same...
  const updateRSVP = (id, rsvp) => {
    const updatedInvitees = party.invitees.map((invitee) => (invitee.id === id ? { ...invitee, rsvp } : invitee))
    setParty({ ...party, invitees: updatedInvitees })
  }

  const updateGuestName = (id, guestName) => {
    const updatedInvitees = party.invitees.map((invitee) => (invitee.id === id ? { ...invitee, guestName } : invitee))
    setParty({ ...party, invitees: updatedInvitees })
  }

  const sendInvitation = (id) => {
    const updatedInvitees = party.invitees.map((invitee) =>
      invitee.id === id ? { ...invitee, invitationSent: true } : invitee,
    )
    setParty({ ...party, invitees: updatedInvitees })

    const invitee = party.invitees.find((i) => i.id === id)
    alert(`Invitation sent to ${invitee.email} and WhatsApp ${invitee.whatsapp}!`)
  }

  const sendAllInvitations = () => {
    const pendingInvitees = party.invitees.filter((invitee) => !invitee.invitationSent)

    if (pendingInvitees.length === 0) {
      alert("All invitations have already been sent!")
      return
    }

    const updatedInvitees = party.invitees.map((invitee) =>
      !invitee.invitationSent ? { ...invitee, invitationSent: true } : invitee,
    )
    setParty({ ...party, invitees: updatedInvitees })
    alert(`Invitations sent to ${pendingInvitees.length} guests via email and WhatsApp!`)
  }// ... (keep existing state and logic the same)

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold md:text-3xl">{party.title}</h1>
          <p className="text-sm text-gray-400 md:text-base">
            {party.date} at {party.time} • {party.location}
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col gap-2 sm:flex-row md:space-x-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="w-full border-gray-700 bg-gray-800 text-white hover:bg-gray-700 md:w-auto"
              onClick={sendAllInvitations}
            >
              <Mail className="h-4 w-4 md:mr-2" />
              <span className="hidden md:block">Send All</span>
            </Button>
            <Link href={`/dashboard/parties/${partyId}/confirmed`} className="w-full md:w-auto">
              <Button variant="outline" className="w-full border-gray-700 bg-gray-800 text-white hover:bg-gray-700 md:w-auto">
                Confirmed List
              </Button>
            </Link>
          </div>
          <Button className="w-full bg-amber-500 text-black hover:bg-amber-400 md:w-auto">
            Save Changes
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Card className="border-gray-800 bg-gray-900 text-white">
        <CardHeader>
          <CardTitle className="text-xl font-bold md:text-2xl">Manage RSVPs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {party.invitees.map((invitee) => (
              <div key={invitee.id} className="rounded-lg border border-gray-800 bg-gray-800 p-4">
                {/* Invitee Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-1">
                    <div className="font-medium break-all">{invitee.email}</div>
                    <div className="text-xs text-gray-400 md:text-sm">WhatsApp: {invitee.whatsapp}</div>
                  </div>
                  
                  {/* Status Badges */}
                  <div className="flex items-center gap-2">
                    {invitee.allowPlusOne && (
                      <div className="rounded-full bg-gray-700 px-2 py-1 text-xs">+1 Allowed</div>
                    )}
                    {invitee.invitationSent ? (
                      <div className="rounded-full bg-gray-700 px-2 py-1 text-xs text-green-400">Sent</div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-700 bg-gray-700 text-white hover:bg-gray-600"
                        onClick={() => sendInvitation(invitee.id)}
                      >
                        <Mail className="h-3 w-3 md:mr-1" />
                        <Phone className="h-3 w-3 md:mr-1" />
                        <span className="hidden md:inline">Send</span>
                      </Button>
                    )}
                  </div>
                </div>

                {/* RSVP Section */}
                <div className="mt-4 space-y-4">
                  <div>
                    <Label className="mb-2 block">RSVP Status</Label>
                    <RadioGroup
                      value={invitee.rsvp}
                      onValueChange={(value) => updateRSVP(invitee.id, value)}
                      className="flex flex-col gap-2 sm:flex-row sm:gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id={`yes-${invitee.id}`} />
                        <Label htmlFor={`yes-${invitee.id}`} className="text-sm">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id={`no-${invitee.id}`} />
                        <Label htmlFor={`no-${invitee.id}`} className="text-sm">No</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pending" id={`pending-${invitee.id}`} />
                        <Label htmlFor={`pending-${invitee.id}`} className="text-sm">Pending</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {invitee.allowPlusOne && invitee.rsvp === "yes" && (
                    <div>
                      <Label htmlFor={`guest-${invitee.id}`} className="mb-2 block text-sm">
                        Guest Name
                      </Label>
                      <Input
                        id={`guest-${invitee.id}`}
                        placeholder="Enter guest name"
                        value={invitee.guestName}
                        onChange={(e) => updateGuestName(invitee.id, e.target.value)}
                        className="border-gray-700 bg-gray-700 text-white"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}