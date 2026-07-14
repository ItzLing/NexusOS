import { AvailabilitySlot, MatchStage } from "./shared";

/**
 * Models the output of the Google Calendar Integration dispatcher (PRD §4).
 *
 * When a match is flagged or authorized via the employer dashboard, the
 * scheduling engine analyses availability overlaps and populates this record.
 * Once a slot is confirmed, the engine dispatches a structured event invite
 * to Google Calendar and stores the resulting `calendarEventId` here.
 */
export class ScheduledInterview {
    constructor(
        public readonly id: string,

        /** The candidate involved in this interview. */
        public candidateId: string,

        /** The role listing this interview is for. */
        public roleId: string,

        /**
         * Raw availability windows queried from both the hiring team's
         * and the candidate's calendars. The engine evaluates overlaps
         * to determine valid meeting times.
         */
        public availabilitySlots: AvailabilitySlot[],

        /**
         * The slot confirmed after overlap analysis. Null until the engine
         * resolves a mutually available window.
         */
        public confirmedSlot: AvailabilitySlot | null,

        /**
         * The Google Calendar event ID returned after the invite is dispatched.
         * Null until the calendar API call succeeds.
         */
        public calendarEventId: string | null,

        /**
         * A pre-populated summary brief derived from the AI Trajectory
         * Justification panel and included in the calendar event body (PRD §4).
         */
        public aiSummaryBrief: string,

        /**
         * The current match stage. Expected to transition to
         * `MatchStage.SCHEDULED` once a slot is confirmed.
         */
        public stage: MatchStage
    ) {}

    /** Indicates whether the interview has been fully dispatched to Google Calendar. */
    get isDispatched(): boolean {
        return this.calendarEventId !== null;
    }
}
