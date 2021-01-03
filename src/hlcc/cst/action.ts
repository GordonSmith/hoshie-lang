import { HLScope } from "./scope";
import { HLNode, HLError, ExpresionT, removeQuotes } from "./node";
import { HLDeclaration } from "./declaration";
import { HLExpression } from "./expression";

export class HLAction extends HLNode {

    eval(): ExpresionT {
        return undefined;
    }
}

export class InlineAction extends HLAction {

    protected _declaration: HLDeclaration;

    constructor(ctx: any, readonly scope: HLScope, readonly id: string) {
        super(ctx);
        this._declaration = scope.resolve(id);
    }

    check(): HLError | undefined {
        return undefined;
    }

    eval() {
        return this._declaration.eval();
    }
}

export class Test extends HLAction {

    constructor(ctx: any, readonly scope: HLScope, readonly actual: HLExpression, readonly expected: HLExpression, readonly message?: string) {
        super(ctx);
        this.message = message !== ";" ? message : "";
    }

    test() {
        if (this.expected.eval() !== this.actual.eval()) {
            return `\
Test failed${this.message ? ` ${this.message}` : ""} ./${this.scope.path}:${this.line}
    Expected: ${this.expected.eval()}
    Actual: ${this.actual.eval()}
`;
        }
        return "";
    }
}