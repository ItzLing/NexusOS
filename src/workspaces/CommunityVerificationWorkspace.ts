import { CompanyReview } from "../domain/CompanyReview";

/**
 * State manager for the Ground-Truth Review Framework (PRD §3).
 *
 * Manages company reviews, enforces the "No Text, No Weight" aggregate
 * rating rule, and coordinates the NLP contextual quality audit workflow.
 */
export class CommunityVerificationWorkspace {
    private reviews: CompanyReview[] = [];

    /** Register a new review submitted by a verified community member. */
    public addReview(review: CompanyReview): void {
        this.reviews.push(review);
    }

    /** Returns all reviews for a given company, regardless of quality status. */
    public getReviewsForCompany(companyId: string): CompanyReview[] {
        return this.reviews.filter(r => r.companyId === companyId);
    }

    /**
     * Calculates the aggregate star rating for a company.
     *
     * Enforces the "No Text, No Weight" rule (PRD §3): only reviews where
     * `isCountedInAggregate === true` (non-empty text + NLP quality verified)
     * are included in the average. Returns null if no qualifying reviews exist.
     */
    public getAggregateRating(companyId: string): number | null {
        const qualifying = this.getReviewsForCompany(companyId).filter(
            r => r.isCountedInAggregate && r.starRating !== null
        );

        if (qualifying.length === 0) return null;

        const total = qualifying.reduce((sum, r) => sum + (r.starRating ?? 0), 0);
        return total / qualifying.length;
    }

    /**
     * Flags a review for re-evaluation by the NLP contextual quality audit
     * layer (PRD §3). Marking `isTextQualityVerified = false` removes it
     * from the aggregate until the audit passes it.
     */
    public flagForQualityAudit(reviewId: string): void {
        const review = this.reviews.find(r => r.id === reviewId);
        if (review) {
            review.isTextQualityVerified = false;
        }
    }

    /**
     * Marks a review as having passed the NLP quality audit.
     * Called by the background NLP audit layer after evaluation.
     */
    public passQualityAudit(reviewId: string): void {
        const review = this.reviews.find(r => r.id === reviewId);
        if (review) {
            review.isTextQualityVerified = true;
        }
    }

    /**
     * Returns all reviews currently pending NLP quality audit
     * (flagged but not yet verified).
     */
    public getPendingAuditReviews(): CompanyReview[] {
        return this.reviews.filter(r => !r.isTextQualityVerified);
    }
}
