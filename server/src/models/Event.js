import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    externalEventId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    eventType: {
      type: String,
      required: true,
      index: true,
    },
    source: {
      type: String,
      enum: ["RAZORPAY_WEBHOOK", "SIMULATOR", "INTERNAL", "MANUAL"],
      default: "RAZORPAY_WEBHOOK",
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    processed: {
      type: Boolean,
      default: false,
      index: true,
    },
    processedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const Event = mongoose.model("Event", eventSchema);
