export class RoleListing {
    constructor(
        public readonly id: string,
        public title: string,
        public department: string,
        public locationType: string, // e.g., "Remote (US)"
        public totalApplications: number,
        public postAgeDescription: string, // e.g., "3 days ago"
        public tags: string[], // e.g., ["Dynamic Demand Signal", "Foundation"]
        public leadRoleTarget: string, // e.g., "Staff Engineer, Data Systems"
        public timelineDescription: string, // e.g., "12–18 months"
        public intersectionSummary: string,
        public arcPathways: string[], // ["Staff Engineer", "Principal Architect", ...]
        public unlockedSkills: string[]
    ) {}
}
