import { SignalPost } from "../domain/SignalPost";
import { IdentityTrustTag, IntentHashtag } from "../domain/shared";

/**
 * State manager for the Signal Stream social feed (PRD §1, §3).
 *
 * Handles the media-rich community feed where candidates share personal
 * insights and companies publish engineering logs, culture streams, and
 * infrastructure roadmaps. Enforces identity trust tag filtering and
 * intent-based hashtag bucketing.
 */
export class SignalStreamWorkspace {
    private posts: SignalPost[] = [];

    /** Add a new post to the Signal Stream. */
    public addPost(post: SignalPost): void {
        this.posts.push(post);
    }

    /** Returns all posts in the stream, ordered as added (newest last). */
    public getPosts(): SignalPost[] {
        return this.posts;
    }

    /** Returns all posts authored by a specific user or company. */
    public getPostsByAuthor(authorId: string): SignalPost[] {
        return this.posts.filter(p => p.authorId === authorId);
    }

    /**
     * Authorizes a candidate's post as a portfolio "Signal Share" (PRD §1).
     * This makes the candidate's profile directly accessible via the feed item.
     */
    public authorizeSignalShare(postId: string): void {
        const post = this.posts.find(p => p.id === postId);
        if (post) {
            post.isSignalShare = true;
        }
    }

    /**
     * Filters the stream by a specific identity trust tag (PRD §3).
     * Useful for surfacing only `#WorkingHere` or `#PastWorker` perspectives.
     */
    public filterByTrustTag(tag: IdentityTrustTag): SignalPost[] {
        return this.posts.filter(p => p.trustTags.includes(tag));
    }

    /**
     * Filters the stream by an intent-based hashtag (PRD §3).
     * Useful for separating technical queries from verified workplace feedback.
     */
    public filterByIntent(hashtag: IntentHashtag): SignalPost[] {
        return this.posts.filter(p => p.intentHashtag === hashtag);
    }

    /** Returns only posts that are authorized portfolio Signal Shares. */
    public getSignalShares(): SignalPost[] {
        return this.posts.filter(p => p.isSignalShare);
    }
}
