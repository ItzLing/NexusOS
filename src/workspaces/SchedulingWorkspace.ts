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

    /**
     * Evaluates availability overlaps between candidate slots and hiring team/recruiter slots.
     * Returns slots where both parties have isAvailable = true and time ranges overlap.
     */
    public static findOverlapSlots(
        candidateSlots: AvailabilitySlot[],
        recruiterSlots: AvailabilitySlot[]
    ): AvailabilitySlot[] {
        const overlaps: AvailabilitySlot[] = [];

        for (const cSlot of candidateSlots) {
            if (!cSlot.isAvailable) continue;
            for (const rSlot of recruiterSlots) {
                if (!rSlot.isAvailable) continue;

                // Check for time overlap
                const start = cSlot.startTime > rSlot.startTime ? cSlot.startTime : rSlot.startTime;
                const end = cSlot.endTime < rSlot.endTime ? cSlot.endTime : rSlot.endTime;

                if (start < end) {
                    overlaps.push({
                        startTime: start,
                        endTime: end,
                        isAvailable: true
                    });
                }
            }
        }

        return overlaps;
    }

    /**
     * Automatically evaluates overlaps, selects the first matching slot, transitions the stage,
     * and dispatches a simulated Google Calendar event complete with the AI Trajectory Brief.
     */
    public resolveAndConfirmMeeting(interviewId: string, recruiterSlots: AvailabilitySlot[]): void {
        const interview = this.interviews.find(i => i.id === interviewId);
        if (!interview) return;

        const overlaps = SchedulingWorkspace.findOverlapSlots(interview.availabilitySlots, recruiterSlots);
        if (overlaps.length > 0) {
            const chosenSlot = overlaps[0];
            
            // Confirm the slot and transition stage to MatchStage.SCHEDULED
            this.confirmSlot(interviewId, chosenSlot);

            // Dispatch Google Calendar invite
            const mockEventId = `gcal-evt-${Math.random().toString(36).substr(2, 9)}`;
            this.dispatchCalendarEvent(interviewId, mockEventId);

            // Simulate sending payload containing the AI Trajectory Brief
            console.log(`[Google Calendar API] Dispatched invite event ${mockEventId} for slot: ${chosenSlot.startTime.toISOString()} to ${chosenSlot.endTime.toISOString()}`);
            console.log(`[Google Calendar API] Embedded AI Trajectory Brief:\n> "${interview.aiSummaryBrief}"`);
        } else {
            console.log(`[Google Calendar API] No overlaps found for interview ${interviewId}.`);
        }
    }
}

