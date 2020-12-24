import { ExpresionType, HLNode } from "./node";
import { RHS } from "./expression";
import { HLScope } from "./scope";

export class HLDeclaration extends HLNode {

    get type(): ExpresionType {
        return undefined;
    }

    get expression(): RHS {
        return undefined;
    }

    constructor(ctx: any, readonly file: HLScope, readonly id: string) {
        super(ctx);
    }

    eval() {
        return undefined;
    }
}

export class Declaration extends HLDeclaration {

    get type(): ExpresionType {
        return this.expression.type;
    }

    get expression(): RHS {
        return this._expression;
    }

    constructor(ctx: any, file: HLScope, id: string, private _expression: RHS) {
        super(ctx, file, id);
        if (Array.isArray(_expression)) {
            // debugger;
        }
    }

    eval() {
        return this.expression.eval();
    }
}

export class Alias extends HLDeclaration {

    get type(): ExpresionType {
        return this.declaration.type;
    }

    get expression(): RHS {
        return this.declaration.expression;
    }

    constructor(ctx: any, file: HLScope, id: string, readonly declaration: HLDeclaration) {
        super(ctx, file, id);
    }

    eval() {
        return this.declaration.eval();
    }
}
