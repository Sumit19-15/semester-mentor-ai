# Study Plan API Notes

This backend now has an AI study-plan pipeline for syllabus-based planning.

## Base URL

```txt
http://localhost:5000
```

All study-plan endpoints are protected. Frontend must send:

```txt
Authorization: Bearer <login_token>
```

Get the token from:

```txt
POST /api/users/login
```

## Main Endpoint: Upload Syllabus And Generate Plan

Use this for the current feature.

```txt
POST /api/study-plans/generate-from-syllabus
```

### Body Format

Use `multipart/form-data`.

Exact fields:

```txt
file              File    syllabus image or PDF
subjectName       Text    Compiler Design
courseCode        Text    CST302
startDate         Text    2026-06-12
endDate           Text    2026-09-12
dailyStudyHours   Text    2
goal              Text    Complete the syllabus in 3 months with 2 hours daily study.
```

Important:

- The file field name must be exactly `file`.
- Allowed file types are `pdf`, `jpg`, `jpeg`, and `png`.
- `startDate` and `endDate` are required.
- The request can take time because it does two AI calls: syllabus parsing, then plan generation.

### What Happens Internally

1. Uploaded syllabus file is temporarily stored in `Backend/uploads`.
2. Gemini 2.5 Flash parses the syllabus into topics.
3. Parsed topics are sent to the study-plan AI prompt.
4. AI returns monthly, weekly, and daily plan JSON.
5. Temporary uploaded file is deleted.

### Is Anything Saved?

No.

This endpoint does not save the parsed topics or generated plan to MongoDB. It returns the plan directly in the response.

The response is temporary/client-owned. If frontend wants to keep it, frontend must store it somewhere or ask backend to add a `StudyPlan` model later.

### Response Shape

```json
{
  "message": "Syllabus parsed and study plan generated successfully.",
  "provider": "gemini",
  "model": "gemini-2.5-flash",
  "parsedTopics": [
    {
      "title": "Overview of Compilation"
    }
  ],
  "contextSummary": {
    "subjects": 1,
    "topics": 1,
    "notes": 0,
    "pyqs": 0,
    "resources": 0
  },
  "plan": {
    "summary": "short plan overview",
    "monthly": [
      {
        "month": "Month 1",
        "focus": "main focus",
        "subjects": ["Compiler Design"],
        "goals": ["goal text"]
      }
    ],
    "weekly": [
      {
        "week": "Week 1",
        "focus": "main focus",
        "topics": ["Overview of Compilation"],
        "deliverables": ["deliverable text"]
      }
    ],
    "daily": [
      {
        "date": "2026-06-12",
        "subject": "Compiler Design",
        "topics": ["Overview of Compilation"],
        "durationHours": 2,
        "tasks": ["task text"],
        "revision": "revision text"
      }
    ],
    "assumptions": ["assumption text"]
  }
}
```

For a 3-month date range, `plan.daily` can contain around 90 entries, so frontend should render it in a paginated or collapsible way.

## Secondary Endpoint: Generate From Stored Syllabus

This is for later, when subjects/topics already exist in MongoDB.

```txt
POST /api/study-plans/generate
```

### Body Format

Use JSON.

```json
{
  "subjectIds": ["subject_mongodb_id"],
  "startDate": "2026-06-12",
  "endDate": "2026-09-12",
  "dailyStudyHours": 2,
  "goal": "Complete the syllabus in 3 months with 2 hours daily study.",
  "includeStoredResources": false
}
```

`subjectIds` is optional. If omitted, backend uses all subjects for the logged-in user.

### What It Uses

This endpoint reads from MongoDB:

- `Subject`
- `Topic`
- optionally notes/PYQs/resources metadata if `includeStoredResources` is `true`

### Is Anything Saved?

No.

This endpoint also only returns the generated plan. It does not save a study-plan record.

## Existing Parser Endpoint

This existed before but now reuses the shared parser service.

```txt
POST /api/topics/:subjectId/parse-topics
```

Use `multipart/form-data`:

```txt
file    File    syllabus image or PDF
```

This one does save parsed topics into MongoDB as `Topic` documents linked to the given `subjectId`.

## Error Cases Frontend Should Handle

Missing token:

```json
{
  "message": "Not authorized, no token provided"
}
```

Missing file:

```json
{
  "message": "Please upload a syllabus image or PDF."
}
```

Missing dates:

```json
{
  "message": "Please provide startDate and endDate for the study plan."
}
```

AI/provider failure:

```json
{
  "message": "Syllabus-to-plan generation failed",
  "error": "provider error text"
}
```

## Environment Variables

Backend expects these in `Backend/.env`:

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_key
AI_PROVIDER=gemini
GEMINI_MODEL=gemini-2.5-flash
```
