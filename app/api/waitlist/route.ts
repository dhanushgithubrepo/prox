import { NextResponse } from "next/server"
import { connectToDatabase, WaitingList } from "@/lib/mongodb"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 })
    }

    await connectToDatabase()

    const existing = await WaitingList.findOne({ email }).lean()
    if (existing) {
      return NextResponse.json({ message: "You are already on the list" }, { status: 200 })
    }

    await WaitingList.create({ email })

    return NextResponse.json({ message: "Successfully added to waitlist" }, { status: 201 })
  } catch (error) {
    console.error("Error in /api/waitlist:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
