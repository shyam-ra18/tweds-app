import mongoose from "mongoose";

const twedsSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  partnerId: {
    type: String,
  },
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tweds",
    },
  ],
});

const Tweds = mongoose.models.Tweds || mongoose.model("Tweds", twedsSchema);

export default Tweds;
