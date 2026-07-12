import { TalentPipelineWorkspace } from "../workspaces/TalentPipelineWorkspace";
import { ActiveMatchesWorkspace } from "../workspaces/ActiveMatchesWorkspace";
import { OpenRolesWorkspace } from "../workspaces/OpenRolesWorkspace";
import { DirectIntroductionsWorkspace } from "../workspaces/DirectIntroductionsWorkspace";

export enum NavigationTab {
    TALENT_PIPELINE,
    ACTIVE_MATCHES,
    OPEN_ROLES,
    DIRECT_INTRODUCTIONS
}

export class CareerOSApplicationShell {
    public pipeline = new TalentPipelineWorkspace();
    public activeMatches = new ActiveMatchesWorkspace();
    public openRoles = new OpenRolesWorkspace();
    public introductions = new DirectIntroductionsWorkspace();
    
    constructor(
        public currentTab: NavigationTab = NavigationTab.TALENT_PIPELINE,
        public currentUser: string = "Arjun K.",
        public isEmployerContext: boolean = true
    ) {}

    public switchTab(tab: NavigationTab): void {
        this.currentTab = tab;
    }
}
