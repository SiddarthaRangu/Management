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

  // Mock party data
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
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">{party.title}</h1>
          <p className="text-gray-400">
            {party.date} at {party.time} • {party.location}
          </p>
        </div>
        <div className="flex space-x-4">
          <Button
            variant="outline"
            className="border-gray-700 bg-gray-800 text-white hover:bg-gray-700 flex items-center gap-2"
            onClick={sendAllInvitations}
          >
            <Mail className="h-4 w-4" />
            Send All Invitations
          </Button>
          <Link href={`/dashboard/parties/${partyId}/confirmed`}>
            <Button variant="outline" className="border-gray-700 bg-gray-800 text-white hover:bg-gray-700">
              View Confirmed List
            </Button>
          </Link>
          <Button className="bg-amber-500 text-black hover:bg-amber-400">Save Changes</Button>
        </div>
      </div>

      <Card className="border-gray-800 bg-gray-900 text-white">
        <CardHeader>
          <CardTitle className="font-bold">Manage RSVPs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {party.invitees.map((invitee) => (
              <div key={invitee.id} className="rounded-lg border border-gray-800 bg-gray-800 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{invitee.email}</div>
                    <div className="text-sm text-gray-400">WhatsApp: {invitee.whatsapp}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {invitee.allowPlusOne && (
                      <div className="rounded-full bg-gray-700 px-3 py-1 text-xs">+1 Allowed</div>
                    )}
                    {invitee.invitationSent ? (
                      <div className="rounded-full bg-gray-700 px-3 py-1 text-xs text-green-400">Invitation Sent</div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-700 bg-gray-700 text-white hover:bg-gray-600 flex items-center gap-1"
                        onClick={() => sendInvitation(invitee.id)}
                      >
                        <Mail className="h-3 w-3" />
                        <Phone className="h-3 w-3" />
                        Send Invitation
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="mb-2 block">RSVP Status</Label>
                    <RadioGroup
                      value={invitee.rsvp}
                      onValueChange={(value) => updateRSVP(invitee.id, value)}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id={`yes-${invitee.id}`} />
                        <Label htmlFor={`yes-${invitee.id}`}>Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id={`no-${invitee.id}`} />
                        <Label htmlFor={`no-${invitee.id}`}>No</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="maybe" id={`maybe-${invitee.id}`} />
                        <Label htmlFor={`maybe-${invitee.id}`}>Maybe</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pending" id={`pending-${invitee.id}`} />
                        <Label htmlFor={`pending-${invitee.id}`}>Pending</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {invitee.allowPlusOne && invitee.rsvp === "yes" && (
                    <div>
                      <Label htmlFor={`guest-${invitee.id}`} className="mb-2 block">
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
