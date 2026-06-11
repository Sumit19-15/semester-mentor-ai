import { generateStudyPlanWithAi } from "../services/aiProviderService.js";
import { parseTopicsFromSyllabusFile } from "../services/syllabusParserService.js";
import { buildStudyPlanContext } from "../services/studyPlanContextService.js";
import fs from "fs";

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

// @desc    Generate an AI study plan from stored syllabus topics
// @route   POST /api/study-plans/generate
// @access  Private
export const generateStudyPlan = async (req, res) => {
  try {
    const {
      subjectIds,
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
      dailyStudyHours || req.user.dailyFreeHours || timeframe?.dailyStudyHours;

    if (!planStartDate || !planEndDate) {
      return res.status(400).json({
        message: "Please provide startDate and endDate for the study plan.",
      });
    }

    const context = await buildStudyPlanContext({
      userId: req.user._id,
      subjectIds: normalizeSubjectIds(subjectIds),
      includeStoredResources,
    });

    if (context.subjects.length === 0) {
      return res.status(404).json({
        message:
          "No syllabus subjects found. Parse or create subjects/topics before generating a plan.",
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
    });
  } catch (error) {
    res.status(500).json({
      message: "Study plan generation failed",
      error: error.message,
    });
  }
};

// @desc    Upload a syllabus file, parse it, and generate a study plan
// @route   POST /api/study-plans/generate-from-syllabus
// @access  Private
export const generateStudyPlanFromSyllabus = async (req, res) => {
  try {
    const { subjectName, courseCode, startDate, endDate, dailyStudyHours, goal } =
      req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a syllabus image or PDF.",
      });
    }

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: "Please provide startDate and endDate for the study plan.",
      });
    }

    const topicsArray = await parseTopicsFromSyllabusFile({
      filePath: req.file.path,
      mimeType: req.file.mimetype,
    });

    const subject = {
      id: "uploaded-syllabus",
      name: subjectName || "Uploaded Syllabus",
      courseCode: courseCode || "",
      topics: topicsArray.map((topic) => ({
        title: topic.title,
        completed: false,
      })),
    };

    const preferences = {
      student: {
        id: req.user._id,
        name: req.user.name,
        semester: req.user.semester,
        branch: req.user.branch,
        dailyFreeHours: req.user.dailyFreeHours,
      },
      planRequest: {
        startDate,
        endDate,
        dailyStudyHours: dailyStudyHours || req.user.dailyFreeHours || 2,
        goal: goal || "Complete the syllabus with regular revision.",
      },
    };

    const aiResponse = await generateStudyPlanWithAi({
      systemPrompt: buildSystemPrompt(),
      userPrompt: buildUserPrompt({
        context: {
          subjects: [subject],
          notes: [],
          pyqs: [],
          resources: [],
        },
        preferences,
      }),
    });

    fs.unlinkSync(req.file.path);

    res.status(200).json({
      message: "Syllabus parsed and study plan generated successfully.",
      provider: aiResponse.provider,
      model: aiResponse.model,
      parsedTopics: topicsArray,
      contextSummary: {
        subjects: 1,
        topics: topicsArray.length,
        notes: 0,
        pyqs: 0,
        resources: 0,
      },
      plan: aiResponse.result,
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      message: "Syllabus-to-plan generation failed",
      error: error.message,
    });
  }
};
