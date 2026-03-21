require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

const MONGODB_URI = process.env.MONGODB_URI
const PORT = process.env.PORT || 5000

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set in environment variables")
  process.exit(1)
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected")
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err)
    process.exit(1)
  })

const waitingListSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true }
)

const WaitingList = mongoose.models.WaitingList || mongoose.model("WaitingList", waitingListSchema)

app.post("/api/waitlist", async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: "Email is required" })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" })
    }

    const existing = await WaitingList.findOne({ email }).lean()
    if (existing) {
      return res.status(200).json({ message: "You are already on the list" })
    }

    await WaitingList.create({ email })

    return res.status(201).json({ message: "Successfully added to waitlist" })
  } catch (error) {
    console.error("Error saving email:", error)
    return res.status(500).json({ message: "Server error" })
  }
})

app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`)
})
