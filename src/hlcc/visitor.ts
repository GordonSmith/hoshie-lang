import { HLVisitor } from "./grammar/HLVisitor"

export class Visitor extends HLVisitor {

    constructor() {
        super();
    }

    visitProgram(ctx) {
        return super.visitProgram(ctx);
    }

    visitBlock(ctx) {
        return super.visitBlock(ctx);
    }

}