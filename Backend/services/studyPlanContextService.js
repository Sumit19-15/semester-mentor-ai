import Note from "../models/noteModel.js";
import Pyq from "../models/pyqModel.js";
import Resource from "../models/resourceModel.js";
import Subject from "../models/subjectModel.js";
import Topic from "../models/topicModel.js";

export const buildStudyPlanContext = async ({
  userId,
  subjectIds = [],
  topicIds = [],
  includeStoredResources = false,
}) => {
  const subjectQuery = { user: userId };

  if (subjectIds.length > 0) {
    subjectQuery._id = { $in: subjectIds };
  }

  const subjects = await Subject.find(subjectQuery).lean();

  if (subjects.length === 0) {
    return {
      subjects: [],
      notes: [],
      pyqs: [],
      resources: [],
    };
  }

  const selectedSubjectIds = subjects.map((subject) => subject._id);

  const topicQuery = {
    user: userId,
    subject: { $in: selectedSubjectIds },
  };

  if (topicIds && topicIds.length > 0) {
    topicQuery._id = { $in: topicIds };
  }

  const topics = await Topic.find(topicQuery)
    .sort({ createdAt: 1 })
    .lean();

  const topicsBySubject = topics.reduce((acc, topic) => {
    const subjectId = topic.subject.toString();
    if (!acc[subjectId]) acc[subjectId] = [];
    acc[subjectId].push({
      id: topic._id,
      title: topic.title,
      description: topic.description || "",
      completed: topic.completed,
    });
    return acc;
  }, {});

  const syllabus = subjects.map((subject) => ({
    id: subject._id,
    name: subject.name,
    courseCode: subject.courseCode || "",
    topics: topicsBySubject[subject._id.toString()] || [],
  }));

  if (!includeStoredResources) {
    return {
      subjects: syllabus,
      notes: [],
      pyqs: [],
      resources: [],
    };
  }

  const [notes, pyqs, resources] = await Promise.all([
    Note.find({ user: userId, subject: { $in: selectedSubjectIds } })
      .select("subject topic title description fileUrl")
      .lean(),
    Pyq.find({ user: userId, subject: { $in: selectedSubjectIds } })
      .select("subject year fileUrl")
      .lean(),
    Resource.find({ user: userId, subject: { $in: selectedSubjectIds } })
      .select("subject topic title type description link")
      .lean(),
  ]);

  return {
    subjects: syllabus,
    notes,
    pyqs,
    resources,
  };
};
