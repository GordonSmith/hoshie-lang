import { ExpresionType, HLNode } from "./node";
import { ArrowParamater, DataExpression, isRHS, RHS } from "./expression";
import { HLScope } from "./scope";

export class HLDeclaration extends HLNode {

    get type(): ExpresionType {
        return undefined;
    }

    get expression(): RHS {
        return undefined;
    }

    constructor(ctx: any, readonly scope: HLScope, readonly id: string) {
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

    constructor(ctx: any, scope: HLScope, id: string, private _expression: RHS) {
        super(ctx, scope, id);
        if (!isRHS(_expression)) {
        }
        if (Array.isArray(_expression)) {
        }
    }

    eval() {
        return this.expression.eval();
    }

    declaration(id: string) {
        if (this.expression instanceof DataExpression || this.expression instanceof ArrowParamater) {
            return this.expression.resolve(id);
        }
        return undefined;
    }
}

export class Alias extends HLDeclaration {

    get type(): ExpresionType {
        return this.declaration.type;
    }

    get expression(): RHS {
        return this.declaration.expression;
    }

    constructor(ctx: any, scope: HLScope, id: string, readonly declaration: HLDeclaration) {
        super(ctx, scope, id);
    }

    eval() {
        return this.declaration.eval();
    }
}
