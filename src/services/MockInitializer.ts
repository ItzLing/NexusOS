import { CareerOSApplicationShell } from "../shell/CareerOSApplicationShell";
import { Candidate } from "../domain/Candidate";
import { RoleListing } from "../domain/RoleListing";
import { CandidatePhase, SkillTag, MatchStage, AvailabilitySlot } from "../domain/shared";
import { NLPPipeline } from "./NLPPipeline";
import { ScheduledInterview } from "../domain/ScheduledInterview";

export class MockInitializer {
    public static initializeDemoState(shell: CareerOSApplicationShell): {
        candidatesList: any[];
        roleListings: RoleListing[];
    } {
        // 1. Initialize Open Roles
        const r1 = new RoleListing(
            "r1",
            "Senior Data Infrastructure Engineer",
            "Platform · Infrastructure",
            "Remote (US)",
            41,
            "3 days ago",
            ["Data Platform", "Infrastructure"],
            "Staff Engineer, Data Systems",
            "12–18 months",
            "This role sits at the intersection of data reliability and platform evolution.",
            ["Staff Engineer", "Principal Architect", "Engineering Lead"],
            ["Kafka", "Flink", "dbt core", "Airflow", "Snowflake", "SQL", "Python", "Apache Spark", "Delta Lake", "Systems Thinking"]
        );

        const r2 = new RoleListing(
            "r2",
            "AI Platform Lead",
            "AI · Applied Research",
            "Hybrid — NYC",
            27,
            "1 week ago",
            ["AI", "Applied Research"],
            "Director of AI Engineering",
            "18–24 months",
            "Greenfield AI platform build serving multiple core product pipelines.",
            ["Director of AI Eng.", "VP of Engineering", "Founding CTO track"],
            ["LangChain", "LlamaIndex", "FastAPI", "Redis", "Celery", "RAG", "Hugging Face", "PEFT", "LoRA", "Python", "GraphQL Federation", "React Ecosystem"]
        );

        const r3 = new RoleListing(
            "r3",
            "Product Manager, Data Experience",
            "Product · Data",
            "Remote (Global)",
            88,
            "5 days ago",
            ["Product", "Data"],
            "Group Product Manager",
            "14–20 months",
            "Own the internal data platform discoverability and user experience dashboard.",
            ["Group PM", "VP of Product", "Head of Data Product"],
            ["Amplitude", "Mixpanel", "SQL Analytics", "A/B Testing", "Statsig", "Launchdarkly", "Roadmap Strategy", "Storytelling", "Behavioral Econ"]
        );

        shell.openRoles.addRole(r1);
        shell.openRoles.addRole(r2);
        shell.openRoles.addRole(r3);

        // 2. Define Raw Unstructured Resume Templates
        const resumePriya = `
            Priya Sharma.
            Senior Frontend Engineer with 7 years of experience.
            Skills: React Ecosystem, TypeScript, GraphQL Federation, Apollo Studio, Systems Thinking, Figma, API Design.
            Location: Remote — Bangalore.
            Focused on building high-performance UI components and federated API architectures.
        `;

        const resumeMarcus = `
            Marcus Webb.
            Full-Stack Generalist with 5 years of experience in early-stage startups.
            Skills: Node.js, Python, FastAPI, Redis, Celery, ML Pipelines, RAG, Hugging Face, LangChain, LlamaIndex, AWS, Product Sense.
            Location: London, UK.
            Experienced at building scalable microservices and rapid ML prototypes.
        `;

        const resumeNneka = `
            Nneka Okonkwo.
            UX Researcher with 6 years of experience.
            Skills: Cognitive UX, Research Methods, Dovetail, Maze, Lookback, Figma Prototyping, ProtoPie, AI Explainability, Mixed Methods.
            Location: Lagos, NG.
            Specialized in bridging user cognitive load models with interactive AI visualization systems.
        `;

        const resumeDavid = `
            David Lin.
            Data Engineer with 8 years of experience.
            Skills: dbt, Airflow, Snowflake, SQL, PySpark, Apache Spark, Delta Lake, Kafka, Flink, Kinesis, Business Analysis.
            Location: Austin, TX.
            Built robust high-throughput batch and real-time streaming data warehouse architectures.
        `;

        const resumeSofia = `
            Sofia Reyes.
            Product Manager with 5 years of experience.
            Skills: Behavioral Econ, Roadmap Strategy, A/B Testing, statsig, launchdarkly, Amplitude, Mixpanel, SQL Analytics, Storytelling.
            Location: Mexico City, MX.
            Leverages experimental design and user psychology to steer growth products.
        `;

        const candidatesRaw = [
            { id: "c1", name: "Priya Sharma", initials: "PS", title: "Senior Frontend Engineer", loc: "Remote — Bangalore", resume: resumePriya, avatarBg: "#7C5C4A", exp: 7, primaryRole: r2, momentum: "rising" as const },
            { id: "c2", name: "Marcus Webb", initials: "MW", title: "Full-Stack Generalist", loc: "London, UK", resume: resumeMarcus, avatarBg: "#4A6741", exp: 5, primaryRole: r2, momentum: "rising" as const },
            { id: "c3", name: "Nneka Okonkwo", initials: "NO", title: "UX Researcher", loc: "Lagos, NG", resume: resumeNneka, avatarBg: "#4A5568", exp: 6, primaryRole: r3, momentum: "pivoting" as const },
            { id: "c4", name: "David Lin", initials: "DL", title: "Data Engineer", loc: "Austin, TX", resume: resumeDavid, avatarBg: "#6B4F6B", exp: 8, primaryRole: r1, momentum: "stable" as const },
            { id: "c5", name: "Sofia Reyes", initials: "SR", title: "Product Manager", loc: "Mexico City, MX", resume: resumeSofia, avatarBg: "#7A4545", exp: 5, primaryRole: r3, momentum: "rising" as const }
        ];

        const mappedList: any[] = [];

        // 3. Process each Candidate through the NLP Matching Pipeline
        for (const raw of candidatesRaw) {
            const rawText = NLPPipeline.extractRawText(raw.resume);
            const ner = NLPPipeline.runSpaCyNER(rawText);
            const skillTags: SkillTag[] = ner.skills.map(s => ({ name: s, isVerified: true }));

            // Map phase based on current profile
            let phase = CandidatePhase.READY_FOR_PIVOT;
            if (raw.id === "c2") phase = CandidatePhase.ACCELERATING;
            if (raw.id === "c4") phase = CandidatePhase.DEEP_SPECIALIZING;
            if (raw.id === "c5") phase = CandidatePhase.EXPLORING;

            const candidateObj = new Candidate(
                raw.id,
                raw.name,
                raw.initials,
                raw.title,
                raw.loc,
                rawText.slice(0, 100),
                phase,
                skillTags
            );
            candidateObj.rawResumeText = rawText;

            // Wire commits / logs based on candidate ID
            if (raw.id === "c1") {
                candidateObj.gitHubCommitSignals = [
                    "refactor: migrate client portal to GraphQL Federation",
                    "feat: implement state schema validation for routing"
                ];
                candidateObj.developerLogs = [
                    "Configured custom Vite chunk splitter for vendor files",
                    "Optimized render pipeline for massive React context trees"
                ];
            } else if (raw.id === "c2") {
                candidateObj.gitHubCommitSignals = [
                    "feat: implement langchain memory routing for chatbot",
                    "perf: optimize redis task queue processing velocity"
                ];
                candidateObj.developerLogs = [
                    "Configured fastapi background worker for LLM inference",
                    "Implemented custom LlamaIndex vector retriever"
                ];
            } else if (raw.id === "c4") {
                candidateObj.gitHubCommitSignals = [
                    "feat: write pyspark delta lake compaction workflow",
                    "fix: resolve snowflake connection pool limits in Airflow"
                ];
                candidateObj.developerLogs = [
                    "Created custom dbt model schemas for data warehouse ingestion",
                    "Resolved kafka consumer lag spikes on streaming cluster"
                ];
            }

            // Run trajectory analysis similarity match against target role
            const { matchPercentage, justification } = NLPPipeline.analyzeTrajectory(candidateObj, raw.primaryRole);
            
            // Add to shell pipeline
            shell.pipeline.addCandidate(candidateObj, matchPercentage, justification);

            // Populate schedule interview with availability slots
            const baseDate = new Date();
            baseDate.setHours(10, 0, 0, 0);
            const candidateSlots: AvailabilitySlot[] = [
                { startTime: new Date(baseDate.getTime() + 86400000), endTime: new Date(baseDate.getTime() + 86400000 + 3600000), isAvailable: true },
                { startTime: new Date(baseDate.getTime() + 86400000 * 2), endTime: new Date(baseDate.getTime() + 86400000 * 2 + 3600000), isAvailable: true }
            ];
            
            const interview = new ScheduledInterview(
                `int-${raw.id}`,
                candidateObj.id,
                raw.primaryRole.id,
                candidateSlots,
                null,
                null,
                justification.capabilitySynthesisText,
                MatchStage.NEW_MATCH
            );
            shell.scheduling.scheduleInterview(interview);

            // Save in react mapped list
            mappedList.push({
                id: raw.id,
                initials: raw.initials,
                avatarBg: raw.avatarBg,
                name: raw.name,
                currentTitle: raw.title,
                trajectoryScore: matchPercentage,
                trajectoryLabel: justification.capabilitySynthesisText,
                momentum: raw.momentum,
                phase: raw.primaryRole.title, // Map phase label to matching target role listing title
                skills: ner.skills,
                location: raw.loc,
                yearsExp: raw.exp,
                backendCandidate: candidateObj,
                justification: justification
            });
        }

        return {
            candidatesList: mappedList,
            roleListings: [r1, r2, r3]
        };
    }
}
