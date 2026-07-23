import { Candidate } from "../domain/Candidate";
import { RoleListing } from "../domain/RoleListing";
import { AIJustification } from "../domain/AIJustification";
import { SkillGap, SkillTag, GrowthTradeOff } from "../domain/shared";

// Define standard semantic coordinates for skills (5D: [Frontend, Backend, DevOps/Data, Product/UX, AI/ML])
const SKILL_EMBEDDINGS: Record<string, number[]> = {
    // Frontend
    "react": [1.0, 0.1, 0.0, 0.3, 0.1],
    "react ecosystem": [1.0, 0.1, 0.0, 0.3, 0.1],
    "typescript": [0.9, 0.7, 0.1, 0.1, 0.1],
    "graphql": [0.8, 0.8, 0.1, 0.1, 0.0],
    "graphql federation": [0.7, 0.9, 0.2, 0.0, 0.0],
    "apollo studio": [0.7, 0.7, 0.2, 0.0, 0.0],
    "figma": [0.9, 0.0, 0.0, 0.8, 0.0],
    "figma prototyping": [0.9, 0.0, 0.0, 0.9, 0.0],
    "protopie": [0.8, 0.0, 0.0, 0.9, 0.0],
    "api design": [0.4, 0.9, 0.2, 0.2, 0.0],
    "systems thinking": [0.3, 0.7, 0.7, 0.5, 0.2],

    // Backend
    "node.js": [0.5, 1.0, 0.3, 0.1, 0.0],
    "fastapi": [0.3, 1.0, 0.3, 0.1, 0.4],
    "redis": [0.1, 1.0, 0.6, 0.0, 0.0],
    "celery": [0.1, 0.9, 0.7, 0.0, 0.1],
    "grpc": [0.1, 1.0, 0.5, 0.0, 0.0],
    "protocol buffers": [0.1, 0.9, 0.5, 0.0, 0.0],
    "python": [0.3, 0.8, 0.5, 0.1, 0.8],
    "aws": [0.1, 0.6, 1.0, 0.1, 0.1],

    // DevOps / Data
    "kubernetes": [0.0, 0.5, 1.0, 0.0, 0.0],
    "istio": [0.0, 0.5, 1.0, 0.0, 0.0],
    "service mesh": [0.0, 0.6, 1.0, 0.0, 0.0],
    "dbt": [0.0, 0.4, 1.0, 0.2, 0.1],
    "dbt core": [0.0, 0.4, 1.0, 0.2, 0.1],
    "airflow": [0.0, 0.5, 1.0, 0.1, 0.2],
    "snowflake": [0.0, 0.3, 1.0, 0.2, 0.0],
    "sql": [0.2, 0.6, 0.8, 0.2, 0.0],
    "sql analytics": [0.1, 0.4, 0.8, 0.6, 0.1],
    "apache spark": [0.0, 0.6, 1.0, 0.0, 0.3],
    "pyspark": [0.0, 0.6, 1.0, 0.0, 0.5],
    "delta lake": [0.0, 0.4, 1.0, 0.0, 0.2],
    "kafka": [0.1, 0.9, 0.8, 0.0, 0.1],
    "flink": [0.0, 0.8, 0.9, 0.0, 0.2],
    "kinesis": [0.0, 0.7, 0.9, 0.0, 0.1],

    // Product / UX
    "cognitive ux": [0.5, 0.0, 0.0, 1.0, 0.2],
    "research methods": [0.2, 0.0, 0.0, 1.0, 0.2],
    "mixed methods": [0.1, 0.0, 0.0, 1.0, 0.1],
    "dovetail": [0.1, 0.0, 0.0, 0.9, 0.0],
    "maze": [0.3, 0.0, 0.0, 0.9, 0.0],
    "lookback": [0.2, 0.0, 0.0, 0.9, 0.0],
    "product sense": [0.4, 0.2, 0.1, 1.0, 0.2],
    "behavioral econ": [0.2, 0.0, 0.0, 1.0, 0.3],
    "roadmap strategy": [0.1, 0.1, 0.0, 1.0, 0.1],
    "a/b testing": [0.3, 0.3, 0.3, 0.9, 0.1],
    "statsig": [0.3, 0.4, 0.4, 0.8, 0.1],
    "launchdarkly": [0.3, 0.5, 0.5, 0.7, 0.0],
    "storytelling": [0.2, 0.0, 0.0, 0.9, 0.1],
    "amplitude": [0.2, 0.2, 0.4, 0.9, 0.1],
    "mixpanel": [0.2, 0.2, 0.4, 0.9, 0.1],

    // AI / ML
    "ml pipelines": [0.1, 0.6, 0.7, 0.1, 1.0],
    "langchain": [0.2, 0.8, 0.3, 0.1, 1.0],
    "llamaindex": [0.2, 0.8, 0.3, 0.1, 1.0],
    "rag": [0.1, 0.8, 0.4, 0.1, 1.0],
    "hugging face": [0.1, 0.5, 0.4, 0.1, 1.0],
    "peft": [0.0, 0.4, 0.4, 0.0, 1.0],
    "lora": [0.0, 0.4, 0.4, 0.0, 1.0],
    "ai explainability": [0.4, 0.2, 0.1, 0.6, 1.0],
    "lime": [0.2, 0.3, 0.2, 0.4, 1.0],
    "shap": [0.2, 0.3, 0.2, 0.4, 1.0],
    "attention viz": [0.5, 0.2, 0.1, 0.5, 1.0],
};

export interface StructuredNEROutput {
    skills: string[];
    roles: string[];
    institutions: string[];
    certifications: string[];
}

export class NLPPipeline {
    /**
     * Parses unstructured documents (PDF/Word resumes, developer logs, markdown text) 
     * and extracts raw clean text.
     */
    public static extractRawText(documentContent: string): string {
        return documentContent
            .replace(/[\r\n]+/g, "\n")
            .replace(/\s+/g, " ")
            .trim();
    }

    /**
     * Simulates SpaCy Named Entity Recognition (NER) by matching candidate text against 
     * dictionaries of entities (Skills, Roles, Institutions, Certifications).
     */
    public static runSpaCyNER(text: string): StructuredNEROutput {
        const lowerText = text.toLowerCase();
        const extractedSkills: string[] = [];
        const extractedRoles: string[] = [];
        const extractedInstitutions: string[] = [];
        const extractedCertifications: string[] = [];

        // 1. Skill Extraction
        for (const skill of Object.keys(SKILL_EMBEDDINGS)) {
            const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, "i");
            if (regex.test(lowerText)) {
                extractedSkills.push(skill);
            }
        }

        // 2. Role Extraction
        const knownRoles = [
            "frontend engineer", "senior frontend engineer", "full-stack generalist", "full stack developer", 
            "ux researcher", "principal ux researcher", "data engineer", "data platform engineer", 
            "product manager", "senior product manager", "growth engineering lead", "systems architect",
            "staff engineer", "engineering manager", "technical product manager"
        ];
        for (const role of knownRoles) {
            const regex = new RegExp(`\\b${role}\\b`, "i");
            if (regex.test(lowerText)) {
                extractedRoles.push(role);
            }
        }

        // 3. Institution Extraction
        const knownInstitutions = [
            "stanford", "mit", "university of waterloo", "lagos", "mexico city", "berkeley",
            "google", "databricks", "meta", "netflix", "stripe", "uber", "amazon", "microsoft"
        ];
        for (const inst of knownInstitutions) {
            const regex = new RegExp(`\\b${inst}\\b`, "i");
            if (regex.test(lowerText)) {
                extractedInstitutions.push(inst.toUpperCase());
            }
        }

        // 4. Certification Extraction
        const knownCertifications = [
            "aws certified", "aws certified developer", "certified kubernetes administrator", 
            "cka", "pmp", "scrum master", "csm", "google cloud architect"
        ];
        for (const cert of knownCertifications) {
            const regex = new RegExp(`\\b${cert}\\b`, "i");
            if (regex.test(lowerText)) {
                extractedCertifications.push(cert.toUpperCase());
            }
        }

        return {
            skills: Array.from(new Set(extractedSkills)),
            roles: Array.from(new Set(extractedRoles)),
            institutions: Array.from(new Set(extractedInstitutions)),
            certifications: Array.from(new Set(extractedCertifications))
        };
    }

    /**
     * Maps a profile (defined by its skills/title) to a 5-dimensional semantic vector.
     */
    public static mapToVector(skills: string[], title: string = ""): number[] {
        const vector = [0, 0, 0, 0, 0];
        
        // Add coordinates from title
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes("frontend") || lowerTitle.includes("ux") || lowerTitle.includes("design")) {
            vector[0] += 0.5; // Frontend/UI
        }
        if (lowerTitle.includes("backend") || lowerTitle.includes("systems") || lowerTitle.includes("generalist")) {
            vector[1] += 0.5; // Backend
        }
        if (lowerTitle.includes("data") || lowerTitle.includes("devops") || lowerTitle.includes("infrastructure")) {
            vector[2] += 0.5; // DevOps/Data
        }
        if (lowerTitle.includes("product") || lowerTitle.includes("manager") || lowerTitle.includes("lead")) {
            vector[3] += 0.5; // PM/Business
        }
        if (lowerTitle.includes("ai") || lowerTitle.includes("ml") || lowerTitle.includes("machine learning")) {
            vector[4] += 0.5; // AI/ML
        }

        // Accumulate skill vectors
        let count = 0;
        for (const skill of skills) {
            const skillLower = skill.toLowerCase();
            if (SKILL_EMBEDDINGS[skillLower]) {
                const emb = SKILL_EMBEDDINGS[skillLower];
                for (let i = 0; i < 5; i++) {
                    vector[i] += emb[i];
                }
                count++;
            }
        }

        // Normalize if has signals
        const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
        if (magnitude > 0) {
            return vector.map(v => v / magnitude);
        }
        return [0.2, 0.2, 0.2, 0.2, 0.2]; // Equal spread fallback
    }

    /**
     * Calculates Cosine Similarity between two 5D semantic vectors.
     * Replaces standard keyword matching with true vector proximity.
     */
    public static calculateCosineSimilarity(v1: number[], v2: number[]): number {
        if (v1.length !== v2.length) return 0;
        
        let dotProduct = 0;
        let mag1 = 0;
        let mag2 = 0;
        
        for (let i = 0; i < v1.length; i++) {
            dotProduct += v1[i] * v2[i];
            mag1 += v1[i] * v1[i];
            mag2 += v2[i] * v2[i];
        }
        
        mag1 = Math.sqrt(mag1);
        mag2 = Math.sqrt(mag2);
        
        if (mag1 === 0 || mag2 === 0) return 0;
        
        return dotProduct / (mag1 * mag2);
    }

    /**
     * Skill Gap & Trajectory Analysis Engine.
     * Computes the exact matching details, identifies skill gaps, potential plateaus,
     * and compiles the AIJustification model.
     */
    public static analyzeTrajectory(candidate: Candidate, role: RoleListing): { matchPercentage: number; justification: AIJustification } {
        const candSkills = candidate.verifiedSkills.map(s => s.name);
        const candVector = this.mapToVector(candSkills, candidate.currentTitle);
        const roleVector = this.mapToVector(role.unlockedSkills, role.title);
        
        const similarity = this.calculateCosineSimilarity(candVector, roleVector);
        // Map [-1, 1] similarity space to [0, 100] percentage score
        const matchPercentage = Math.round(((similarity + 1) / 2) * 100);

        // 1. Identify missing skills
        const candidateSkillSet = new Set(candSkills.map(s => s.toLowerCase()));
        const skillGaps: SkillGap[] = [];
        
        for (const skill of role.unlockedSkills) {
            const skillLower = skill.toLowerCase();
            if (!candidateSkillSet.has(skillLower)) {
                // Determine severity based on job requirements vector
                const skillEmb = SKILL_EMBEDDINGS[skillLower] || [0.2, 0.2, 0.2, 0.2, 0.2];
                let severity: "Low" | "Medium" | "High" = "Medium";
                
                // If the skill is highly aligned with the target role's dominant vector dimension, it's High severity
                const maxDimIndex = roleVector.indexOf(Math.max(...roleVector));
                if (skillEmb[maxDimIndex] > 0.6) {
                    severity = "High";
                } else if (skillEmb[maxDimIndex] < 0.2) {
                    severity = "Low";
                }

                skillGaps.push({
                    name: skill,
                    severity,
                    mentorshipRequired: severity === "High" || severity === "Medium"
                });
            }
        }

        // 2. Tradeoffs & Plateau vectors
        const plateauVectors: string[] = [];
        if (roleVector[3] < 0.3) {
            plateauVectors.push("May plateau in pure product-management roles without technical challenges.");
        }
        if (roleVector[0] < 0.3) {
            plateauVectors.push("Might experience execution friction in pure front-end client-facing environments.");
        }
        if (roleVector[2] < 0.3) {
            plateauVectors.push("Potential growth limitations in high-scale data infrastructure or orchestration systems.");
        }
        if (plateauVectors.length === 0) {
            plateauVectors.push("Requires strategic leadership scope expansion to transition to director levels.");
        }

        // 3. Probation Risk Narrative
        let probationRiskSummary = "Requires standard 30-day onboarding checkpoints to adapt to internal toolchains.";
        if (skillGaps.some(g => g.severity === "High")) {
            const highGaps = skillGaps.filter(g => g.severity === "High").map(g => g.name).join(", ");
            probationRiskSummary = `Highly dependent on early team support to ramp up on: ${highGaps}. Structured mentorship is recommended for the first 45 days.`;
        } else if (skillGaps.some(g => g.severity === "Medium")) {
            const medGaps = skillGaps.filter(g => g.severity === "Medium").map(g => g.name).join(", ");
            probationRiskSummary = `Needs support adapting to the stack relating to: ${medGaps}. Suggest pairing with a senior buddy during the initial 30 days.`;
        }

        // 4. Capability Synthesis Text
        const strengths = candidate.verifiedSkills.slice(0, 3).map(s => s.name).join(" and ");
        const capabilitySynthesisText = `The candidate's core expertise in ${strengths} aligns with the organizational demand for ${role.title}. The trajectory highlights readiness for ${role.leadRoleTarget || 'the next level'} in a ${role.timelineDescription || '12-18 months'} timeframe.`;

        // Map trade-offs
        const tradeOffs: GrowthTradeOff[] = skillGaps.slice(0, 3).map(gap => ({
            skillAcquired: gap.name,
            potentialPlateau: plateauVectors[0] || "Scope plateau in non-scaling environments."
        }));

        const justification = new AIJustification(
            "Synthesized Arc", "Aligned Overlap", "Strong Forward Signal",
            candidate.verifiedSkills.slice(0, 3).map(s => s.name),
            tradeOffs,
            capabilitySynthesisText,
            skillGaps,
            plateauVectors,
            probationRiskSummary
        );

        return {
            matchPercentage,
            justification
        };
    }
}
