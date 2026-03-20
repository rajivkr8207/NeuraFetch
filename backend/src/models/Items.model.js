import mongoose from "mongoose";

const savedItemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    type: {
      type: String,
      enum: ["webpage", "image", "article", "video", "pdf"],
      required: true
    },

    title: {
      type: String,
      trim: true
    },

    url: {
      type: String,
      required: true
    },

    notes: {
      type: String,
      default: ""
    },

    tags: [
      {
        type: String,
        trim: true
      }
    ],

    collection: {
      type: String,
      default: "inbox"
    },

    source: {
      type: String 
    },

    metadata: {
      pageUrl: String,
      pageTitle: String,
      imageUrl: String,
      author: String,
      description: String,
      thumbnail: String
    },

    aiData: {
      summary: String,
      embeddings: [Number], 
      keywords: [String]
    }
  },
  { timestamps: true }
);

export default mongoose.model("SavedItem", savedItemSchema);