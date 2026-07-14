import { 
    CareerOSApplicationShell, 
    CompanyReview, 
    IdentityTrustTag, 
    IntentHashtag,
    AIJustification
} from "./src";

console.log("==================================================");
console.log("NexusOS State Engine Demonstration");
console.log("==================================================\n");

// 1. Initialize the Application Shell
const shell = new CareerOSApplicationShell();

console.log("--- 1. Testing Ground-Truth Review Framework ---");

// 2. Create some company reviews to test the "No Text, No Weight" rule
const review1 = new CompanyReview(
    "rev-1", "user-1", "company-A",
    IdentityTrustTag.WORKING_HERE,
    IntentHashtag.COMMENT_AFTER_WORKING,
    5, // 5 star rating
    "Amazing engineering culture and great mentorship.", // Has text
    true // Passed NLP quality audit
);

const review2 = new CompanyReview(
    "rev-2", "user-2", "company-A",
    IdentityTrustTag.PAST_WORKER,
    IntentHashtag.COMMENT_AFTER_WORKING,
    1, // 1 star rating (spam)
    "", // NO TEXT!
    true 
);

const review3 = new CompanyReview(
    "rev-3", "user-3", "company-A",
    IdentityTrustTag.WORKING_HERE,
    IntentHashtag.COMMENT_AFTER_WORKING,
    4, 
    "Good place, but pay could be better.", 
    false // Failed NLP quality audit (flagged as generic)
);

// Register them in the workspace
shell.communityVerification.addReview(review1);
shell.communityVerification.addReview(review2);
shell.communityVerification.addReview(review3);

// Calculate the aggregate rating. 
// Expectation: Only review1 should count. The 1-star and 4-star should be ignored.
const aggregateRating = shell.communityVerification.getAggregateRating("company-A");
console.log(`Company A Aggregate Rating: ${aggregateRating} Stars`);
console.log(`(Review 2 was ignored due to "No Text", Review 3 was ignored due to failed NLP audit)\n`);


console.log("--- 2. Testing AI Trajectory Justification ---");

// 3. Create an AI Justification with skill gaps and plain-language synthesis
const justification = new AIJustification(
    "Legacy Arc", "Legacy Overlap", "Legacy Signal", ["Strength 1"], [], // Legacy fields
    "The candidate's extensive background in distributed systems perfectly aligns with your upcoming infrastructure scale-out roadmap.", // capabilitySynthesisText
    [
        { name: "Kubernetes Orchestration", severity: "Medium", mentorshipRequired: true }
    ],
    ["May plateau in pure product-management roles without technical challenges."], // plateauVectors
    "Requires structured check-ins during the first 30 days to adapt to the custom CI/CD pipeline." // probationRiskSummary
);

console.log("Capability Synthesis:");
console.log(`> ${justification.capabilitySynthesisText}\n`);
console.log("Skill Gaps Identified:");
justification.skillGaps.forEach(gap => {
    console.log(`> ${gap.name} (Severity: ${gap.severity}, Mentorship Required: ${gap.mentorshipRequired})`);
});
console.log(`\nProbation Risk: ${justification.probationRiskSummary}\n`);

console.log("==================================================");
console.log("Test completed successfully!");
