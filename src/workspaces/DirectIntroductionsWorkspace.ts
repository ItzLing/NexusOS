import { Candidate } from "../domain/Candidate";
import { MatchStage } from "../domain/shared";

export interface ChatMessage {
    senderName: string;
    text: string;
    timestamp: Date;
}

export interface ConversationThread {
    candidate: Candidate;
    stage: MatchStage;
    unreadCount: number;
    messages: ChatMessage[];
    suggestedAIPromptChips: string[];
}

export class DirectIntroductionsWorkspace {
    private threads: ConversationThread[] = [];
    private activeThreadIndex: number = 0;

    public addThread(thread: ConversationThread): void {
        this.threads.push(thread);
    }

    public selectThread(index: number): void {
        if (index >= 0 && index < this.threads.length) {
            this.activeThreadIndex = index;
        }
    }

    public getThreads(): ConversationThread[] {
        return this.threads;
    }

    public getActiveThread(): ConversationThread | null {
        return this.threads[this.activeThreadIndex] || null;
    }

    public appendMessage(text: string, sender: string): void {
        const activeThread = this.getActiveThread();
        if (activeThread) {
            activeThread.messages.push({
                senderName: sender,
                text,
                timestamp: new Date()
            });
        }
    }
}
