import { HLScope } from "./scope";
import { HLNode, HLError } from "./node";

export class InlineAction extends HLNode {

    constructor(ctx: any, readonly file: HLScope, readonly id: string) {
        super(ctx);
    }

    check(): HLError | undefined {
        return undefined;
    }
}

