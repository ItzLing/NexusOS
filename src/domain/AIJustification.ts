import { GrowthTradeOff } from "./shared";

export class AIJustification {
    constructor(
        public arcPatternText: string,
        public roleOverlapText: string,
        public forwardSignalText: string,
        public forwardStrengths: string[],
        public tradeOffs: GrowthTradeOff[]
    ) {}
}
