import { generateStudyPlanWithAi } from "../services/aiProviderService.js";
import { buildStudyPlanContext } from "../services/studyPlanContextService.js";
const buildSystemPrompt = () => `
You are Semester Mentor AI, an academic planning assistant.
Create practical study plans from the student's stored syllabus.
Use only the supplied context. Do not invent topics that are not present.
Return only valid JSON.

The JSON must follow this shape:
{
  "summary": "short plan overview",
  "monthly": [
    {
      "month": "Month 1",
      "focus": "main focus",
      "subjects": ["subject names"],
      "goals": ["goal 1"]
    }
  ],
  "weekly": [
    {
      "week": "Week 1",
      "focus": "main focus",
      "topics": ["topic title"],
      "deliverables": ["deliverable 1"]
    }
  ],
  "daily": [
    {
      "date": "YYYY-MM-DD or Day 1",
      "subject": "subject name",
      "topics": ["topic title"],
      "durationHours": 2,
      "tasks": ["task 1"],
      "revision": "brief revision instruction"
    }
  ],
  "assumptions": ["assumption 1"]
}
`;

const buildUserPrompt = ({ context, preferences }) => `
Student profile:
${JSON.stringify(preferences.student, null, 2)}

Planning request:
${JSON.stringify(preferences.planRequest, null, 2)}

Available syllabus context:
${JSON.stringify(context.subjects, null, 2)}

Stored notes/PYQ/resource metadata:
${JSON.stringify(
  {
    notes: context.notes,
    pyqs: context.pyqs,
    resources: context.resources,
  },
  null,
  2,
)}

Make a monthly, weekly, and daily study plan for the requested timeframe.
The daily array must contain one entry for every study day in the requested date range. Do not summarize or skip days.
Prioritize incomplete topics when completion status is available.
Distribute workload realistically across available study hours.
`;

const normalizeSubjectIds = (subjectIds) => {
  if (!subjectIds) return [];
  if (Array.isArray(subjectIds)) return subjectIds.filter(Boolean);
  return [subjectIds];
};

import StudyPlan from "../models/StudyPlanModel.js";

// @desc    Generate an AI study plan from stored syllabus topics
// @route   POST /api/study-plans/generate
// @access  Private
export const generateStudyPlan = async (req, res) => {
  try {
    const {
      subjectIds,
      topicIds,
      name,
      startDate,
      endDate,
      timeframe,
      dailyStudyHours,
      goal,
      includeStoredResources = false,
    } = req.body;

    const planStartDate = startDate || timeframe?.startDate;
    const planEndDate = endDate || timeframe?.endDate;
    const availableHours =
      dailyStudyHours || req.user.dailyFreeHours || timeframe?.dailyStudyHours || 4;

    if (!subjectIds || (Array.isArray(subjectIds) && subjectIds.length === 0)) {
      return res.status(400).json({
        message: "A valid Subject ID is required to generate a study plan.",
      });
    }

    if (!planStartDate || !planEndDate) {
      return res.status(400).json({
        message: "Please provide startDate and endDate for the study plan.",
      });
    }

    const context = await buildStudyPlanContext({
      userId: req.user._id,
      subjectIds: normalizeSubjectIds(subjectIds),
      topicIds: normalizeSubjectIds(topicIds),
      includeStoredResources,
    });

    if (context.subjects.length === 0) {
      return res.status(404).json({
        message:
          "Subject not found in the database. Please select a valid Subject.",
      });
    }

    const preferences = {
      student: {
        id: req.user._id,
        name: req.user.name,
        semester: req.user.semester,
        branch: req.user.branch,
        dailyFreeHours: req.user.dailyFreeHours,
      },
      planRequest: {
        startDate: planStartDate,
        endDate: planEndDate,
        dailyStudyHours: availableHours,
        goal: goal || "Complete the syllabus with regular revision.",
      },
    };

    const aiResponse = await generateStudyPlanWithAi({
      systemPrompt: buildSystemPrompt(),
      userPrompt: buildUserPrompt({ context, preferences }),
    });

    // Save to Database
    const savedPlan = await StudyPlan.create({
      user: req.user._id,
      name: name || "Study Plan",
      subject: normalizeSubjectIds(subjectIds)[0], // Assuming generating for one subject at a time
      dailyHours: availableHours,
      startDate: planStartDate,
      endDate: planEndDate,
      planData: aiResponse.result,
    });

    res.status(200).json({
      message: "Study plan generated successfully.",
      provider: aiResponse.provider,
      model: aiResponse.model,
      contextSummary: {
        subjects: context.subjects.length,
        topics: context.subjects.reduce(
          (total, subject) => total + subject.topics.length,
          0,
        ),
        notes: context.notes.length,
        pyqs: context.pyqs.length,
        resources: context.resources.length,
      },
      plan: aiResponse.result,
      _id: savedPlan._id,
      createdAt: savedPlan.createdAt
    });
  } catch (error) {
    res.status(500).json({
      message: "Study plan generation failed",
      error: error.message,
    });
  }
};

// @desc    Get all study plans for a specific subject or all subjects
// @route   GET /api/study-plans/:subjectId
// @access  Private
export const getStudyPlans = async (req, res) => {
  try {
    const query = { user: req.user._id };
    if (req.params.subjectId && req.params.subjectId !== 'all') {
      query.subject = req.params.subjectId;
    }
    const plans = await StudyPlan.find(query).sort({ createdAt: -1 });
    
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch study plans",
      error: error.message,
    });
  }
};


// @desc    Toggle completion of a specific day in the study plan
// @route   PUT /api/study-plans/:planId/day/:dayIndex/toggle
// @access  Private
export const toggleDayCompletion = async (req, res) => {
  try {
    const { planId, dayIndex } = req.params;
    const dayIdx = parseInt(dayIndex, 10);

    const plan = await StudyPlan.findOne({ _id: planId, user: req.user._id });

    if (!plan) {
      return res.status(404).json({ message: "Study plan not found" });
    }

    const completedDays = plan.completedDays || [];
    const indexInArray = completedDays.indexOf(dayIdx);

    if (indexInArray > -1) {
      // It's already completed, so un-complete it
      completedDays.splice(indexInArray, 1);
    } else {
      // Mark as completed
      completedDays.push(dayIdx);
    }

    // Check if all days are completed
    let allCompleted = false;
    const planData = plan.planData?.plan || plan.planData;
    const totalDays = planData?.daily?.length || 0;

    if (totalDays > 0 && completedDays.length === totalDays) {
      allCompleted = true;
    }

    plan.completedDays = completedDays;
    plan.isCompleted = allCompleted;

    const updatedPlan = await plan.save();

    res.status(200).json(updatedPlan);
  } catch (error) {
    res.status(500).json({
      message: "Failed to toggle day completion",
      error: error.message,
    });
  }
};

