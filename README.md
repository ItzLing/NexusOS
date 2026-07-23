# NexusOS — Trajectory-Matched Career OS & Match Engine

NexusOS is a next-generation career management and recruitment operating system designed to enable transparent, high-impact talent matching. It replaces black-box percentage scores and simple keyword searches with deep semantic vector matching, career trajectory projections, and structured onboarding pipelines.

---

## 🚀 Key Modules & Core AI Capabilities

### 1. Document Parsing & SpaCy NER Pipeline
- **Unstructured Extraction:** Formats and sanitizes raw candidate resumes, portfolios, and developer logs into clean text blocks.
- **SpaCy Named Entity Recognition (NER):** Extracts critical career entities including skills, roles, institutional backgrounds, and certifications into structured JSON formats.

### 2. Sentence-BERT Semantic Vector Matching
- **5-Dimensional Vector Mapping:** Represents candidates and job descriptions in a multi-dimensional semantic space (Frontend, Backend, DevOps/Data, Product/UX, AI/ML).
- **Cosine Similarity Algebra:** Computes semantic distance between vectors to capture contextual alignment rather than basic keyword counts.

### 3. Trajectory & Skill Gap Engine
- **AI Trajectory Justification:** Automatically generates plain-language alignment justifications outlining immediate readiness, capability synthesis, and developmental velocity.
- **Structured Gaps & Probation Risk:** Classifies missing skills by severity, flags mentorship requirements, highlights plateau vectors, and details custom probation guides to mitigate early turnover.

### 4. Living Portfolio & 40-Year Projections
- **GitHub Commit & Log Analytics:** Parses live developer commit logs and system telemetry to measure real-time capability velocity.
- **40-Year Horizon Timeline:** Projects future milestones (Architect, Tech Fellow, CTO) at dates accelerated or adjusted by the candidate's active velocity.

### 5. Google Calendar Overlap Service
- **Availability Matcher:** Automatically evaluates schedule windows from recruiter and candidate slots to find overlaps.
- **Smart Dispatcher:** Schedules meeting confirmation and outputs calendar invite payloads complete with embedded AI Trajectory Briefs.

### 6. Success Onboarding Gateway
- **Milestone Generator:** Automatically spins up onboarding milestone checklists when a candidate is hired.
- **Gap Bridging:** Mapped directly from the candidate's custom AI skill gaps to structure early training and buddy support.

---

## 📂 Repository Structure

- `src/domain/` — Core entities (`Candidate`, `RoleListing`, `AIJustification`, `Milestone`, `OnboardingRecord`, `ScheduledInterview`)
- `src/services/` — Core service layer (`NLPPipeline` matching engine, `MockInitializer` state seeder)
- `src/workspaces/` — Domain state managers (`TalentPipelineWorkspace`, `ActiveMatchesWorkspace`, `SchedulingWorkspace`, `OnboardingWorkspaceManager`)
- `demo.ts` — Comprehensive end-to-end command-line test and validation script
- `AI Recruitment Dashboard Layout/` — React/Vite frontend application (collapsible navigation shell, talent pipeline cards, scheduling calendar slots, and onboarding gateways)

---

## 🛠 Setup & Running

### Backend Engine Validation
Run the E2E simulation to test resume parsing, similarity vector comparisons, schedule matches, and onboarding transitions:
```bash
npx ts-node demo.ts
```

### Dashboard GUI Startup
1. Navigate to the GUI layout folder:
   ```bash
   cd "AI Recruitment Dashboard Layout"
   ```
2. Install the GUI package dependencies:
   ```bash
   npm install
   ```
3. Start the local dev server:
   ```bash
   npm run dev
   ```
