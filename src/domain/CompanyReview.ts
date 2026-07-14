import { IdentityTrustTag, IntentHashtag } from "./shared";

/**
 * Represents a company review submitted through the Ground-Truth Review
 * Framework (PRD §3).
 *
 * Key rules enforced by this model:
 * - "No Text, No Weight": A star rating without accompanying review text
 *   is fully excluded from the aggregate rating calculation.
 * - "Contextual Quality Audit": The `isTextQualityVerified` flag is set
 *   by the NLP background layer after evaluating whether the review body
 *   contains real qualitative substance.
 */
export class CompanyReview {
    constructor(
        public readonly id: string,

        /** The user who authored this review. */
        public authorId: string,

        /** The company this review is written about. */
        public companyId: string,

        /**
         * Unalterable trust tag derived from the platform's employment
         * history database (PRD §3).
         */
        public trustTag: IdentityTrustTag,

        /**
         * Intent-based hashtag categorising the type of feedback (PRD §3).
         * Reviews with `COMMENT_AFTER_WORKING` undergo NLP quality audits.
         */
        public intentHashtag: IntentHashtag,

        /**
         * Star rating (1–5). May be null if the author chose not to rate.
         * A rating without `reviewText` is NOT counted in the aggregate.
         */
        public starRating: number | null,

        /**
         * The descriptive review body. Must be non-empty for the rating
         * to contribute to the aggregate score ("No Text, No Weight").
         */
        public reviewText: string,

        /**
         * Set by the NLP contextual quality audit layer. When false, the
         * review is flagged for removal regardless of text length.
         */
        public isTextQualityVerified: boolean
    ) {}

    /**
     * Determines whether this review counts towards the company's
     * aggregate rating. Enforces the "No Text, No Weight" rule (PRD §3):
     * both a non-empty review body AND NLP quality verification are required.
     */
    get isCountedInAggregate(): boolean {
        return (
            this.reviewText.trim().length > 0 &&
            this.isTextQualityVerified
        );
    }
}
