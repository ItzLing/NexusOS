import { IdentityTrustTag, IntentHashtag } from "./shared";

/**
 * Represents a single post in the Signal Stream social feed (PRD §1).
 *
 * Candidates share personal insights and portfolio "Signal Shares" here,
 * while companies publish engineering logs, culture streams, and
 * infrastructure roadmaps. Each post carries unalterable identity trust
 * tags and intent-based hashtags (PRD §3).
 */
export class SignalPost {
    constructor(
        public readonly id: string,

        /** The user or company account that authored this post. */
        public authorId: string,
        public authorName: string,

        /** The main content body of the post. */
        public content: string,

        /**
         * Whether the candidate has authorized this post as a portfolio
         * "Signal Share", making their profile directly accessible
         * from the feed stream (PRD §1).
         */
        public isSignalShare: boolean,

        /**
         * Identity trust tags appended by the platform based on verified
         * employment history (PRD §3). These are read-only after being set.
         */
        public trustTags: IdentityTrustTag[],

        /**
         * Intent-based hashtag that buckets the post into a specific
         * interaction category (PRD §3).
         */
        public intentHashtag: IntentHashtag,

        /** Timestamp of when this post was published. */
        public timestamp: Date,

        /**
         * For company-authored posts: the company context being shared
         * (e.g., "Engineering Log", "Culture Stream", "Infrastructure Roadmap").
         * Null for candidate posts.
         */
        public companyContext: string | null = null
    ) {}
}
