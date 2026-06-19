import mongoose from "mongoose";

const syllabusCacheSchema = new mongoose.Schema(
  {
    hash: {
      type: String,
      required: true,
      unique: true,
    },
    topics: {
      type: [
        {
          title: String,
          description: String,
        },
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const SyllabusCache = mongoose.model("SyllabusCache", syllabusCacheSchema);

export default SyllabusCache;
