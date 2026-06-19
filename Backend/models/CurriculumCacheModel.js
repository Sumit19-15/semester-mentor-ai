import mongoose from "mongoose";

const curriculumCacheSchema = new mongoose.Schema(
  {
    hash: {
      type: String,
      required: true,
      unique: true,
    },
    subjects: {
      type: [
        {
          name: String,
          courseCode: String,
        },
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CurriculumCache = mongoose.model("CurriculumCache", curriculumCacheSchema);

export default CurriculumCache;
