"use client";

import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Mail, Phone, Trash2 } from "lucide-react";

export default function PartyDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const partyId = params.id;
  const [timeoutId, setTimeoutId] = useState(null);

  // ✅ Missing states added here
  const [meetings, setMeetings] = useState([]);
  const [filter, setFilter] = useState("all");

  const [party, setParty] = useState({
    id: partyId,
    title: "Spring Networking Event",
    date: "2025-04-20",
    time: "18:00",
    location: "Grand Hotel",
    invitees: [],
  });

  useEffect(() => {
    const initialMeetings = [
      {
        id: 1,
        title: "Spring Networking Event",
        date: "2025-04-20",
        time: "18:00",
        location: "Grand Hotel",
        company: "Hotel Group",
        host: "VKR",
        attendees: ["john@example.com"],
        type: "national",
      },
      {
        id: 2,
        title: "Quarterly Review",
        date: "2025-04-18",
        time: "2:00 PM",
        company: "TechGiant Inc",
        host: "VKR",
        attendees: ["ceo@techgiant.com", "cfo@techgiant.com"],
        type: "international",
      },
      {
        id: 3,
        title: "Partnership Discussion",
        date: "2025-04-22",
        time: "11:30 AM",
        company: "Innovate LLC",
        host: "VKR",
        attendees: ["partner@innovate.com", "legal@innovate.com"],
        type: "international",
      },
    ];

    setMeetings(initialMeetings);
    localStorage.setItem("meetings", JSON.stringify(initialMeetings));
  }, []);

  const handleDelete = (meetingId) => {
    if (confirm("Are you sure you want to permanently delete this meeting?")) {
      const updatedMeetings = meetings.filter((meeting) => meeting.id !== meetingId);
      setMeetings(updatedMeetings);
      localStorage.setItem("meetings", JSON.stringify(updatedMeetings));
      toast.success("Meeting deleted successfully!");
    }
  };

  const filteredMeetings = meetings.filter((meeting) =>
    filter === "all" ? true : meeting.type === filter
  );

  return (
    <div className="space-y-6">
      <ToastContainer />
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-3xl font-extrabold">Professional Meetings</h1>
        <div className="flex gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-800 text-amber-400 rounded-md px-4 py-2 border border-gray-700 
            transition-all duration-300 hover:border-amber-400 focus:ring-2 focus:ring-amber-500 
            focus:border-amber-500 outline-none [&_option]:bg-gray-800 [&_option]:text-white"
          >
            <option value="all">All Meetings</option>
            <option value="national">National</option>
            <option value="international">International</option>
          </select>
          <Link href="/dashboard/meetings/new">
            <Button className="bg-amber-500 text-gray-900 hover:bg-amber-400 
            transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-amber-500/20">
              New Meeting
            </Button>
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        {filteredMeetings.length === 0 ? (
          <Card className="border-2 border-gray-800 bg-gray-900 text-white cursor-pointer 
          transition-all duration-300 hover:border-3 hover:border-amber-400 
          hover:-translate-y-3 hover:shadow-2xl hover:shadow-amber-500/30">
            <CardContent className="text-white p-6">
              <p className="text-center">No meetings found. Create a new meeting to get started.</p>
            </CardContent>
          </Card>
        ) : (
          filteredMeetings.map((meeting) => (
            <Card
              key={meeting.id}
              className="border-2 border-gray-800 bg-gray-900 text-white relative cursor-pointer 
              transition-all duration-300 hover:border-3 hover:border-amber-400 
              hover:-translate-y-3 hover:shadow-2xl hover:shadow-amber-500/30"
            >
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-3 right-3 text-red-500 hover:bg-red-900/20 p-1.5 
                transition-all duration-300 hover:scale-110"
                onClick={() => handleDelete(meeting.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>

              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold">
                  {meeting.title}
                  <span
                    className={`ml-2 text-sm ${
                      meeting.type === "international" ? "text-amber-400" : "text-gray-400"
                    }`}
                  >
                    ({meeting.type})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="transition-all duration-300 p-2 rounded border border-gray-700
                  hover:border-amber-400 hover:-translate-y-1 hover:shadow-md hover:shadow-amber-500/10 hover:scale-105">
                    <div className="text-sm font-medium text-gray-400">Company</div>
                    <div>{meeting.company}</div>
                  </div>
                  <div className="transition-all duration-300 p-2 rounded border border-gray-700
                  hover:border-amber-400 hover:-translate-y-1 hover:shadow-md hover:shadow-amber-500/10 hover:scale-105">
                    <div className="text-sm font-medium text-gray-400">Date & Time</div>
                    <div>
                      {meeting.date} at {meeting.time}
                    </div>
                  </div>
                  <div className="transition-all duration-300 p-2 rounded border border-gray-700
                  hover:border-amber-400 hover:-translate-y-1 hover:shadow-md hover:shadow-amber-500/10 hover:scale-105">
                    <div className="text-sm font-medium text-gray-400">Host</div>
                    <div>{meeting.host}</div>
                  </div>
                  <div className="md:col-span-3 transition-all duration-300 p-2 rounded border border-gray-700
                  hover:border-amber-400 hover:-translate-y-1 hover:shadow-md hover:shadow-amber-500/10 hover:scale-105">
                    <div className="text-sm font-medium text-gray-400">Attendees</div>
                    <div className="flex flex-wrap gap-2">
                      {meeting.attendees.map((attendee, index) => (
                        <span key={index} className="rounded-full bg-gray-800 px-3 py-1 text-sm
                        transition-all duration-300 hover:bg-gray-700 hover:scale-105 hover:shadow-sm hover:shadow-amber-500/10">
                          {attendee}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}