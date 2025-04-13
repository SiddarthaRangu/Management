"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useParams } from "next/navigation"

const SEATING_CONFIG = {
  tables: {
    total: 9,
    vipLetters: ["A", "B", "C"],
    standardLetters: ["D", "E", "F", "G", "H", "I"],
    seatsPerTable: 6,
    reservedTables: ["C", "F"],
  },
  venue: {
    columns: 3,
  },
}

const Seat = ({ seatId, isReserved, isSelected, isVip, onClick, style }) => {
  return (
    <div
      className={`absolute w-7 h-7 flex items-center justify-center rounded-full text-xs cursor-pointer transition-all
        ${
          isReserved
            ? "bg-red-500 cursor-not-allowed"
            : isSelected
              ? "bg-gray-100 text-gray-900"
              : isVip
                ? "bg-amber-500 hover:bg-amber-400"
                : "bg-gray-600 hover:bg-gray-500"
        }`}
      onClick={!isReserved ? onClick : undefined}
      style={style}
    >
      {seatId}
    </div>
  )
}

const Table = ({ tableId, isVip, onSeatClick, selectedSeats }) => {
  const isReserved = SEATING_CONFIG.tables.reservedTables.includes(tableId)
  const rotationDegrees = [0, 60, 120, 180, 240, 300]

  return (
    <div className="relative flex items-center justify-center w-40 h-40 m-4">
      {/* Table Center */}
      <div
        className={`absolute w-24 h-24 rounded-full flex items-center justify-center 
        ${isReserved ? "bg-red-500" : isVip ? "bg-amber-900" : "bg-gray-800"}`}
      >
        <span className={`text-xl font-bold ${isVip ? "text-amber-400" : "text-gray-300"}`}>{tableId}</span>
      </div>

      {/* Seats arranged around the table */}
      {Array.from({ length: SEATING_CONFIG.tables.seatsPerTable }).map((_, index) => {
        const seatNumber = index + 1
        const seatId = `${tableId}${seatNumber}`
        const isSelected = selectedSeats.includes(seatId)

        return (
          <Seat
            key={seatId}
            seatId={seatId}
            isVip={isVip}
            isReserved={isReserved}
            isSelected={isSelected}
            onClick={() => onSeatClick(seatId, isVip)}
            style={{
              transform: `rotate(${rotationDegrees[index]}deg) translate(70px) rotate(-${rotationDegrees[index]}deg)`,
            }}
          />
        )
      })}
    </div>
  )
}

export default function SeatingPage() {
  const params = useParams()
  const partyId = params.id
  const [selectedSeats, setSelectedSeats] = useState([])
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleSeatSelect = (seatId) => {
    setSelectedSeats((prev) => (prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]))
  }

  const handleConfirmSeats = () => {
    alert(`Seats confirmed: ${selectedSeats.join(", ")}`)
    // In a real app, you would save this to your backend
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold">Seating Arrangement</h1>
        <Link href={`/dashboard/parties/${partyId}`}>
          <Button variant="outline" className="border-gray-700 bg-gray-800 text-white hover:bg-gray-700">
            Back to Party Details
          </Button>
        </Link>
      </div>

      {/* Main Stage */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-center py-6 mb-8 rounded-lg border-2 border-amber-500 w-full max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-amber-500 mb-2">MAIN STAGE</h1>
        <p className="text-gray-400">Live Performances & DJ Booth</p>
      </div>

      {/* Overall Layout */}
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        {/* Bar (Left) */}
        <div className="w-full lg:w-1/5 flex justify-center">
          <div className="bg-amber-900/30 p-4 rounded-lg text-center w-full max-w-xs">
            <div className="text-3xl mb-2">🍸</div>
            <h2 className="text-xl font-bold text-amber-400">BAR</h2>
          </div>
        </div>

        {/* Seating Area (Center) */}
        <div className="w-full lg:w-3/5 flex flex-col gap-8 items-center">
          {/* VIP Tables */}
          <div className="w-full">
            <h2 className="text-2xl font-bold text-amber-400 text-center mb-4">VIP TABLES</h2>
            <div className="flex flex-wrap justify-center gap-6">
              {SEATING_CONFIG.tables.vipLetters.map((letter) => (
                <Table
                  key={letter}
                  tableId={letter}
                  isVip={true}
                  onSeatClick={handleSeatSelect}
                  selectedSeats={selectedSeats}
                />
              ))}
            </div>
          </div>

          {/* Standard Tables */}
          <div className="w-full">
            <h2 className="text-2xl font-bold text-gray-300 text-center mb-4">STANDARD TABLES</h2>
            <div className="flex flex-wrap justify-center gap-6">
              {SEATING_CONFIG.tables.standardLetters.map((letter) => (
                <Table
                  key={letter}
                  tableId={letter}
                  isVip={false}
                  onSeatClick={handleSeatSelect}
                  selectedSeats={selectedSeats}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Dance Floor (Right) */}
        <div className="w-full lg:w-1/5 flex justify-center">
          <div className="bg-amber-800/30 p-4 rounded-lg text-center w-full max-w-xs">
            <div className="text-3xl mb-2">💃</div>
            <h2 className="text-xl font-bold text-amber-300">DANCE FLOOR</h2>
          </div>
        </div>
      </div>

      {/* Selection Panel */}
      <div
        className={`fixed bottom-4 right-4 bg-gray-800 rounded-lg p-4 shadow-xl 
        ${selectedSeats.length > 0 ? "opacity-100" : "opacity-0"} transition-opacity`}
      >
        <div className="flex items-center gap-4">
          <div className="text-amber-400 font-bold">{selectedSeats.length} Selected</div>
          <button
            className={`px-4 py-2 rounded font-bold transition-colors ${
              selectedSeats.length === 0 ? "bg-gray-600 cursor-not-allowed" : "bg-amber-600 hover:bg-amber-700"
            }`}
            disabled={selectedSeats.length === 0}
            onClick={handleConfirmSeats}
          >
            Confirm Seats
          </button>
        </div>
      </div>
    </div>
  )
}
