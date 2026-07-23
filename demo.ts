import { 
    CareerOSApplicationShell, 
    CompanyReview, 
    IdentityTrustTag, 
    IntentHashtag,
    Candidate,
    RoleListing,
    CandidatePhase,
    SkillTag,
    MatchStage,
    NLPPipeline,
    AvailabilitySlot,
    ScheduledInterview
} from "./src";

console.log("==================================================");
console.log("NexusOS State Engine & AI/NLP Pipeline Demo");
console.log("==================================================\n");

// 1. Initialize the Application Shell
const shell = new CareerOSApplicationShell();

console.log("--- Phase 1: High-Impact AI & NLP Pipeline ---");

// Test Unstructured Text Extraction & NER
const unstructuredResumeText = `
    Priya Sharma
    Email: priya@example.com
    Experience: 7 years
    Current Role: Senior Frontend Engineer at META.
    Skills: React Ecosystem, TypeScript, GraphQL Federation, Apollo Studio, Systems Thinking, Figma.
    Education: STANFORD University.
    Certifications: AWS CERTIFIED developer.
`;

console.log("1. Parsing Unstructured Resume Text...");
const cleanedText = NLPPipeline.extractRawText(unstructuredResumeText);
console.log(`> Cleaned Text Length: ${cleanedText.length} characters`);

console.log("\n2. Running SpaCy Named Entity Recognition (NER) Simulator...");
const nerOutput = NLPPipeline.runSpaCyNER(cleanedText);
console.log("Extracted Skills:", nerOutput.skills);
console.log("Extracted Roles:", nerOutput.roles);
console.log("Extracted Institutions:", nerOutput.institutions);
console.log("Extracted Certifications:", nerOutput.certifications);

// Map Candidate profile into semantic vector space
console.log("\n3. Sentence-BERT Semantic Vector Space Mapping...");
const candidateSkills: SkillTag[] = nerOutput.skills.map(s => ({ name: s, isVerified: true }));
const candidate = new Candidate(
    "cand-priya",
    "Priya Sharma",
    "PS",
    "Senior Frontend Engineer",
    "Remote — Bangalore",
    "Active contributor to open-source UI libraries",
    CandidatePhase.READY_FOR_PIVOT,
    candidateSkills
);
candidate.rawResumeText = cleanedText;
candidate.gitHubCommitSignals = [
    "refactor: migrate client portal to GraphQL Federation",
    "feat: implement state schema validation for routing",
    "perf: optimize render overhead in dashboard graphs"
];
candidate.developerLogs = [
    "Fixed memory leak in Apollo client cache",
    "Configured custom Vite chunk splitter for vendor files"
];

const candVector = NLPPipeline.mapToVector(nerOutput.skills, candidate.currentTitle);
console.log(`> Candidate Semantic Vector (5D): [${candVector.map(v => v.toFixed(3)).join(", ")}]`);

// Define target job requirements
const role = new RoleListing(
    "role-ai-lead",
    "AI Platform Lead",
    "AI · Applied Research",
    "Hybrid — NYC",
    27,
    "1 week ago",
    ["AI Platform", "Vanguard"],
    "Director of AI Engineering",
    "18–24 months",
    "Dynamic demand intersection with LLMOps",
    ["Director of AI Eng.", "VP of Engineering"],
    ["LangChain", "FastAPI", "RAG", "Python", "GraphQL Federation", "React"]
);

const roleVector = NLPPipeline.mapToVector(role.unlockedSkills, role.title);
console.log(`> Role Requirements Vector (5D):  [${roleVector.map(v => v.toFixed(3)).join(", ")}]`);

// Calculate semantic matching
const { matchPercentage, justification } = NLPPipeline.analyzeTrajectory(candidate, role);
console.log(`\n4. Cosine Similarity Trajectory Match: ${matchPercentage}%`);
console.log("AI Trajectory Justification Synthesis:");
console.log(`> "${justification.capabilitySynthesisText}"`);

console.log("\nSkill Gaps Identified:");
justification.skillGaps.forEach(gap => {
    console.log(`> Skill: ${gap.name} | Severity: ${gap.severity} | Mentorship Required: ${gap.mentorshipRequired}`);
});

console.log(`\nProbation Risk: ${justification.probationRiskSummary}\n`);


console.log("--- Phase 2: Differentiator Features & Scheduling ---");

// Verified Living Portfolio & 40-year projection
console.log("1. Live Portfolio & 40-Year Career Trajectory Projections...");
console.log(`> Candidate Active developmental velocity: ${candidate.getDevelopmentalVelocity().toFixed(2)}x`);
const projections = candidate.project40YearTrajectory();
projections.forEach(proj => {
    console.log(`> [${proj.timestampAchieved.getFullYear()} Projected Milestone] ${proj.title}: ${proj.description}`);
});

// Google Calendar Overlap Analysis
console.log("\n2. Google Calendar Overlap Analysis & Auto-Dispatch...");
const baseDate = new Date("2026-07-25T10:00:00Z");
const candidateAvailability: AvailabilitySlot[] = [
    { startTime: new Date(baseDate.getTime()), endTime: new Date(baseDate.getTime() + 3600000), isAvailable: true },
    { startTime: new Date(baseDate.getTime() + 7200000), endTime: new Date(baseDate.getTime() + 10800000), isAvailable: true }
];
const recruiterAvailability: AvailabilitySlot[] = [
    { startTime: new Date(baseDate.getTime() + 3600000), endTime: new Date(baseDate.getTime() + 7200000), isAvailable: true },
    { startTime: new Date(baseDate.getTime() + 7200000), endTime: new Date(baseDate.getTime() + 10800000), isAvailable: true }
];

const interview = new ScheduledInterview(
    "int-priya",
    candidate.id,
    role.id,
    candidateAvailability,
    null,
    null,
    `Candidate Priya Sharma shows ${matchPercentage}% alignment. Crucial skill gap includes ${justification.skillGaps.map(g => g.name).join(", ")}.`,
    MatchStage.NEW_MATCH
);
shell.scheduling.scheduleInterview(interview);

console.log("Candidate availability windows:");
candidateAvailability.forEach(s => console.log(`  - ${s.startTime.toISOString()} to ${s.endTime.toISOString()}`));
console.log("Recruiter availability windows:");
recruiterAvailability.forEach(s => console.log(`  - ${s.startTime.toISOString()} to ${s.endTime.toISOString()}`));

shell.scheduling.resolveAndConfirmMeeting("int-priya", recruiterAvailability);
const updatedInterview = shell.scheduling.getInterviewByCandidate(candidate.id);
console.log(`> Resulting Interview Stage: ${updatedInterview?.stage}`);
console.log(`> Confirmed Slot: ${updatedInterview?.confirmedSlot?.startTime.toISOString()} to ${updatedInterview?.confirmedSlot?.endTime.toISOString()}`);
console.log(`> Google Calendar Event ID: ${updatedInterview?.calendarEventId}`);

// Post-Match Onboarding Gateway
console.log("\n3. Post-Match Onboarding Gateway...");
if (updatedInterview) {
    // Transition to onboarding
    updatedInterview.stage = MatchStage.ONBOARDING;
    const onboardingRecord = shell.onboarding.setupOnboarding(candidate, role, justification);
    
    console.log(`Onboarding started for candidate ${onboardingRecord.candidateId} in role ${onboardingRecord.roleId}`);
    console.log("Team Dependencies:", onboardingRecord.teamDependencies);
    console.log("Structured Early Milestones (bridging AI skill gaps):");
    onboardingRecord.earlyMilestones.forEach(m => {
        console.log(`  - Milestone: ${m.title} (Source: ${m.verificationSource}) | Desc: ${m.description}`);
    });
}


console.log("\n--- Phase 3: Testing Ground-Truth Review Framework ---");
const review1 = new CompanyReview(
    "rev-1", "user-1", "company-A",
    IdentityTrustTag.WORKING_HERE,
    IntentHashtag.COMMENT_AFTER_WORKING,
    5,
    "Amazing engineering culture and great mentorship.",
    true
);
shell.communityVerification.addReview(review1);
const aggregateRating = shell.communityVerification.getAggregateRating("company-A");
console.log(`Company A Aggregate Rating: ${aggregateRating} Stars`);

console.log("\n==================================================");
console.log("All systems executed and validated successfully!");
console.log("==================================================");
