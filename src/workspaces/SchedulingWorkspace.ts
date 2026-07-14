import { ScheduledInterview } from "../domain/ScheduledInterview";
import { AvailabilitySlot, MatchStage } from "../domain/shared";

/**
 * State manager for the Google Calendar Integration dispatcher (PRD §4).
 *
 * Orchestrates the automated interview routing flow: availability overlap
 * analysis → slot confirmation → state transition to `MatchStage.SCHEDULED`
 * → calendar event dispatch.
 */
export class SchedulingWorkspace {
    private interviews: ScheduledInterview[] = [];

    /** Register a new interview scheduling request. */
    public scheduleInterview(interview: ScheduledInterview): void {
        this.interviews.push(interview);
    }

    /**
     * Confirms a specific availability slot for an interview after the
     * engine resolves a mutually available window. Automatically transitions
     * the interview stage to `MatchStage.SCHEDULED` (PRD §4).
     */
    public confirmSlot(interviewId: string, slot: AvailabilitySlot): void {
        const interview = this.interviews.find(i => i.id === interviewId);
        if (interview) {
            interview.confirmedSlot = slot;
            interview.stage = MatchStage.SCHEDULED;
        }
    }

    /**
     * Records the Google Calendar event ID after the dispatcher successfully
     * delivers the structured event invite (PRD §4).
     */
    public dispatchCalendarEvent(interviewId: string, eventId: string): void {
        const interview = this.interviews.find(i => i.id === interviewId);
        if (interview) {
            interview.calendarEventId = eventId;
        }
    }

    /** Returns all scheduled interviews. */
    public getInterviews(): ScheduledInterview[] {
        return this.interviews;
    }

    /** Returns the interview record for a specific candidate, if one exists. */
    public getInterviewByCandidate(candidateId: string): ScheduledInterview | null {
        return this.interviews.find(i => i.candidateId === candidateId) ?? null;
    }

    /** Returns all interviews that have been dispatched to Google Calendar. */
    public getDispatchedInterviews(): ScheduledInterview[] {
        return this.interviews.filter(i => i.isDispatched);
    }

    /** Returns interviews awaiting slot confirmation. */
    public getPendingInterviews(): ScheduledInterview[] {
        return this.interviews.filter(i => i.confirmedSlot === null);
    }
}
