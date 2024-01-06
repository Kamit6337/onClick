import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: [true, "Room must be provided"],
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Need to provide Sender"],
    },
    message: {
      type: String,
      default: null,
    },
    isFile: {
      type: Boolean,
      default: false,
    },
    fileType: {
      type: String,
      enum: ["image", "video", "pdf"],
      default: null,
    },
    file: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

chatSchema.pre("save", function (next) {
  if (this.photo) {
    this.isPhoto = true;
  }

  next();
});

export const Chat = mongoose.model("Chat", chatSchema);
