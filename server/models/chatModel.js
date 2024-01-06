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
    file: {
      fileType: {
        type: String,
        enum: ["image", "video", "pdf"],
        default: null,
      },
      originalName: {
        type: String,
        default: null,
      },
      destination: {
        type: String,
        default: null,
      },
      fileName: {
        type: String,
        default: null,
      },
      size: {
        type: Number,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

chatSchema.pre("save", function (next) {
  if (!!this.file.fileType) {
    this.isFile = true;
  }

  next();
});

export const Chat = mongoose.model("Chat", chatSchema);
