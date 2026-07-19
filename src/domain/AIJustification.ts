import { GrowthTradeOff, SkillGap } from "./shared";

/**
 * Models the AI Trajectory Justification Module (PRD §2).
 *
 * Replaces black-box percentage scores with transparent, plain-language
 * explanations that detail alignment rationale, skill gaps, growth trade-offs,
 * and probation-phase risk vectors.
 */
export class AIJustification {
    constructor(
        // Legacy arc/role overlap fields — kept for backward compatibility
        public arcPatternText: string,
        public roleOverlapText: string,
        public forwardSignalText: string,
        public forwardStrengths: string[],
        public tradeOffs: GrowthTradeOff[],

        // --- AI Trajectory Justification Module (PRD §2) ---

        /**
         * Plain-language synthesis explaining exactly why the candidate's
         * future trajectory aligns with the organization's upcoming roadmap.
         * This is the primary human-readable output — no percentage score.
         */
        public capabilitySynthesisText: string = "",

        /**
         * Near-term skill gaps the candidate must bridge, each flagged
         * with severity and whether deliberate mentorship is required.
         */
        public skillGaps: SkillGap[] = [],

        /**
         * Areas where the candidate's growth may plateau without
         * proactive organisational support.
         */
        public plateauVectors: string[] = [],

        /**
         * A concise probation-phase risk narrative highlighting where
         * the candidate will need structured support to prevent early turnover.
         */
        public probationRiskSummary: string = ""
    ) {}
}
