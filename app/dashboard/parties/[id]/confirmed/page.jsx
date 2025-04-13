import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ConfirmedListPage({ params }) {
  const partyId = params.id

  // Mock party data
  const party = {
    id: partyId,
    title: "Spring Networking Event",
    date: "2025-04-20",
    time: "6:00 PM",
    location: "Grand Hotel",
    confirmedAttendees: [
      { id: 1, name: "Sarah Johnson", email: "sarah@example.com", hasGuest: false },
      { id: 2, name: "Lisa Brown", email: "lisa@example.com", hasGuest: true, guestName: "David Smith" },
      { id: 3, name: "Robert Chen", email: "robert@example.com", hasGuest: true, guestName: "Emma Chen" },
      { id: 4, name: "James Wilson", email: "james@example.com", hasGuest: false },
      { id: 5, name: "Maria Garcia", email: "maria@example.com", hasGuest: true, guestName: "Carlos Lopez" },
      { id: 6, name: "Thomas Lee", email: "thomas@example.com", hasGuest: false },
      { id: 7, name: "Jennifer Kim", email: "jennifer@example.com", hasGuest: true, guestName: "Michael Park" },
      { id: 8, name: "Daniel Taylor", email: "daniel@example.com", hasGuest: false },
    ],
  }

  // Count total attendees (including guests)
  const totalAttendees = party.confirmedAttendees.length + party.confirmedAttendees.filter((a) => a.hasGuest).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Confirmed Attendees</h1>
          <p className="text-gray-400">
            {party.title} • {party.date} at {party.time}
          </p>
        </div>
        <Link href={`/dashboard/parties/${partyId}`}>
          <Button variant="outline" className="border-gray-700 bg-gray-800 text-white hover:bg-gray-700">
            Back to Party Details
          </Button>
        </Link>
      </div>

      <Card className="border-gray-800 bg-gray-900 text-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Confirmed List</CardTitle>
          <div className="text-sm text-gray-400">Total: {totalAttendees} attendees</div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {party.confirmedAttendees.map((attendee) => (
              <div key={attendee.id}>
                <div className="rounded-md border border-gray-800 bg-gray-800 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{attendee.name}</div>
                      <div className="text-sm text-gray-400">{attendee.email}</div>
                    </div>
                    {attendee.hasGuest && (
                      <div className="rounded-md bg-gray-700 px-3 py-1 text-sm">+1: {attendee.guestName}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
