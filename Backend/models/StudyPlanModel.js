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
    name: {
      type: String,
      default: "Study Plan",
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
    completedDays: [{
      type: Number, // Store indexes of completed days
    }],
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const StudyPlan = mongoose.model("StudyPlan", studyPlanSchema);

export default StudyPlan;
