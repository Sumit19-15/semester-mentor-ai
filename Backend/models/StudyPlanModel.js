import mongoose from "mongoose";

const studyPlanSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Subject",
    },
    dailyHours: {
      type: Number,
      default: 4,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    planData: {
      type: mongoose.Schema.Types.Mixed, // Store the JSON response from AI
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const StudyPlan = mongoose.model("StudyPlan", studyPlanSchema);

export default StudyPlan;
