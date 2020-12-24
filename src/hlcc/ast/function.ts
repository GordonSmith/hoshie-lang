import { ExpresionT, ExpresionType, HLError, isArray } from "./node";
import { RHS } from "./expression";
import { HLScope } from "./scope";
import { HLNode } from "./node";
import { HLDeclaration } from "./declaration";

export class HLFunction extends HLNode implements RHS {

    get type(): ExpresionType {
        debugger;
        return undefined;
    }

    eval(): ExpresionT {
        debugger;
        return undefined;
    }

    errors(): HLError[] {
        return [];
    }
}

export class LengthFunction extends HLFunction {

    static hasLength(expression: RHS): boolean {
        return isArray(expression.type) || expression.type === "string";
    }

    get type(): ExpresionType {
        return "number";
    }

    constructor(ctx: any, readonly file: HLScope, readonly expression: RHS) {
        super(ctx);
    }

    eval(): number {
        if (LengthFunction.hasLength(this.expression)) {
            return (this.expression.eval() as any)?.length;
        }
        return undefined;
    }
}

export class ArrowParamater extends HLNode implements RHS {

    private _defaultExpression?: RHS;

    get type(): ExpresionType {
        return this._type;
    }

    constructor(ctx: any, readonly file: HLScope, readonly _type: ExpresionType, readonly id: string, defaultExpression?: RHS) {
        super(ctx);
        this._defaultExpression = defaultExpression;
    }

    defaultExpression(): RHS | undefined;
    defaultExpression(_: RHS | undefined): this;
    defaultExpression(_?: RHS | undefined): this | RHS | undefined {
        if (!arguments.length) return this._defaultExpression;
        this._defaultExpression = _;
        return this;
    }

    eval(): ExpresionT {
        return this.defaultExpression()?.eval();
    }

    errors(): HLError[] {
        return [];
    }
}

export class ArrowBody extends HLNode {

    get type(): ExpresionType {
        return this.returnExpression.type;
    }

    constructor(ctx: any, readonly file: HLScope, readonly items: HLDeclaration[], readonly returnExpression: RHS) {
        super(ctx);
    }
}
