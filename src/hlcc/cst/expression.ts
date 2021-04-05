import { HLScope } from "./scope";
import { ExpresionT, ExpresionType, HLError, HLNode } from "./node";
import { HLFunctionScope } from "./scopes/function";
import { ArrayType, HLType, RowType, TypeDeclaration } from "./types";
import { Declaration, HLDeclaration } from "./declaration";

export interface RHS {
    type: ExpresionType;
    eval(): ExpresionT;
    errors(): HLError[];
}

export function isRHS(_: any): _ is RHS {
    return (_ as RHS)?.type !== undefined && (_ as RHS)?.eval !== undefined;
}

export class HLExpression extends HLNode implements RHS {

    get type(): ExpresionType {
        return undefined;
    }

    constructor(ctx: any, readonly scope: HLScope) {
        super(ctx);
    }

    eval(): ExpresionT {
        return undefined;
    }

    errors(): HLError[] {
        return [];
    }
}

export class NotExpression extends HLExpression {

    get type(): ExpresionType {
        return "boolean";
    }

    constructor(ctx: any, scope: HLScope, readonly expression: HLExpression) {
        super(ctx, scope);
    }

    eval(): boolean | number | string {
        return !this.expression.eval();
    }
}

type MultiplicativeT = "*" | "/" | "%";
export class MultiplicativeExpression extends HLExpression {

    get type(): ExpresionType {
        return this.lhs.type;
    }

    constructor(ctx: any, scope: HLScope, readonly lhs: HLExpression, readonly rhs: HLExpression, readonly multiplicative: MultiplicativeT) {
        super(ctx, scope);
    }

    eval(): boolean | number | string {
        const lhs = this.lhs.eval();
        const rhs = this.rhs.eval();
        if (typeof lhs === "number" && typeof rhs === "number") {
            switch (this.multiplicative) {
                case "*":
                    return lhs * rhs;
                case "/":
                    return lhs / rhs;
                case "%":
                    return lhs % rhs;
            }
        }
    }
}

type AdditiveT = "+" | "-";
export class AdditiveExpression extends HLExpression {

    get type(): ExpresionType {
        return this.lhs.type;
    }

    constructor(ctx: any, scope: HLScope, readonly lhs: HLExpression, readonly rhs: HLExpression, readonly action: AdditiveT) {
        super(ctx, scope);
    }

    eval(): boolean | number | string {
        const lhs = this.lhs.eval();
        const rhs = this.rhs.eval();
        if (typeof lhs === "number" && typeof rhs === "number") {
            return this.action === "-" ? lhs - rhs : lhs + rhs;
        } else if (typeof lhs === "string" && typeof rhs === "string" && this.action === "+") {
            return lhs + rhs;
        }
    }
}

type RelationalT = "<" | ">" | "<=" | ">=";
export class RelationalExpression extends HLExpression {

    get type(): ExpresionType {
        return "boolean";
    }

    constructor(ctx: any, scope: HLScope, readonly lhs: HLExpression, readonly rhs: HLExpression, readonly action: RelationalT) {
        super(ctx, scope);
    }

    eval(): boolean | number | string {
        const lhs = this.lhs.eval();
        const rhs = this.rhs.eval();
        if (typeof lhs === "boolean" && typeof rhs === "boolean" ||
            typeof lhs === "number" && typeof rhs === "number") {
            switch (this.action) {
                case "<":
                    return lhs < rhs;
                case ">":
                    return lhs > rhs;
                case "<=":
                    return lhs <= rhs;
                case ">=":
                    return lhs >= rhs;
            }
        } else if (typeof lhs === "string" && typeof rhs === "string") {
            switch (this.action) {
                case "<":
                    return lhs.localeCompare(rhs) < 0;
                case ">":
                    return lhs.localeCompare(rhs) > 0;
                case "<=":
                    return lhs.localeCompare(rhs) <= 0;
                case ">=":
                    return lhs.localeCompare(rhs) >= 0;
            }
        }
    }
}

type EqualityT = "==" | "!=";
export class EqualityExpression extends HLExpression {

    get type(): ExpresionType {
        return "boolean";
    }

    constructor(ctx: any, scope: HLScope, readonly lhs: HLExpression, readonly rhs: HLExpression, readonly action: EqualityT) {
        super(ctx, scope);
    }

    eval(): boolean | number | string {
        const lhs = this.lhs.eval();
        const rhs = this.rhs.eval();
        if (typeof lhs === "boolean" && typeof rhs === "boolean" ||
            typeof lhs === "number" && typeof rhs === "number" ||
            typeof lhs === "string" && typeof rhs === "string") {
            return this.action === "==" ? lhs === rhs : lhs !== rhs;
        } else {
            debugger;
        }
    }
}

type LogicalT = "&&" | "||";
export class LogicalExpression extends HLExpression {

    get type(): ExpresionType {
        return "boolean";
    }

    constructor(ctx: any, scope: HLScope, readonly lhs: HLExpression, readonly rhs: HLExpression, readonly action: LogicalT) {
        super(ctx, scope);
    }

    eval(): boolean | number | string {
        const lhs = this.lhs.eval();
        const rhs = this.rhs.eval();
        if (typeof lhs === "boolean" && typeof rhs === "boolean") {
            return this.action === "&&" ? lhs && rhs : lhs || rhs;
        }
    }
}

export class IdentifierExpression extends HLExpression {

    get type(): ExpresionType {
        return this.ref?.type;
    }

    constructor(ctx: any, scope: HLScope, readonly id: string, readonly ref: RHS) {
        super(ctx, scope);
    }

    eval() {
        return this.ref?.eval();
    }
}

//  LiteralExpressions
export class BooleanExpression extends HLExpression {

    get type(): ExpresionType {
        return "boolean";
    }

    constructor(ctx: any, scope: HLScope, readonly value: boolean) {
        super(ctx, scope);
    }

    eval(): boolean {
        return this.value;
    }
}

export class NumericExpression extends HLExpression {

    get type(): ExpresionType {
        return "number";
    }

    constructor(ctx: any, scope: HLScope, readonly value: number) {
        super(ctx, scope);
    }

    eval(): number {
        return this.value;
    }
}

export class StringExpression extends HLExpression {

    get type(): ExpresionType {
        return "string";
    }

    constructor(ctx: any, scope: HLScope, readonly value: string) {
        super(ctx, scope);
    }

    eval(): string {
        return this.value;
    }
}

export class DataExpression extends HLExpression {

    rowType: RowType;

    get type(): ExpresionType {
        return "data";
    }

    constructor(ctx: any, scope: HLScope, readonly fields: HLExpression[]) {
        super(ctx, scope);
    }

    typeInfo(_: RowType) {
        if (_ instanceof RowType) {
            this.rowType = _;
        } else {
        }
    }

    eval(): string {
        return "{ " + this.fields.map((exp, i) => {
            const id = this.rowType?.fields[i]?.id || i;
            const isString = exp.type === "string";
            return `${id}: ${isString ? `"${exp.eval()}"` : exp.eval()}`;
        }).join(", ") + " }";
    }

    resolve(id: string) {
        //  TODO nested scopes
        let retVal;
        this.rowType?.fields.some((rowType, idx) => {
            if (rowType.id === id) {
                retVal = { expression: this.fields[idx] };
                return true;
            }
        });
        return retVal;
    }
}

export class ArrayExpression extends HLExpression {

    rowType: ArrayType;

    get type(): ExpresionType {
        return (this.values?.length ? this.values[0].type + "[]" : "unknown[]") as ExpresionType;
    }

    constructor(ctx: any, scope: HLScope, readonly values: (BooleanExpression | NumericExpression | StringExpression | DataExpression)[]) {
        super(ctx, scope);
    }

    typeInfo(_: any) {
        if (_ instanceof ArrayType) {
            this.rowType = _;
        } else {
        }
    }

    eval() {
        if (this.type === "string[]") {
            return (this.values as any[]).map(v => `'${v.eval()}'`);
        } else if (this.type === "data[]") {
            return "[ " + (this.values as DataExpression[]).map(v => {
                v.typeInfo(this.rowType?.rowType as RowType);
                return v.eval();
            }).join(", ") + " ]";
        }

        return (this.values as any[]).map(v => v.eval());
    }
}

export class FunctionCallExpression extends HLExpression {

    get type(): ExpresionType {
        return this.func?.returnType;
    }

    constructor(ctx: any, scope: HLScope, readonly id: string, readonly func: HLFunctionScope, readonly args: HLExpression[]) {
        super(ctx, scope);
    }

    eval() {
        return this.func?.calc(this.args);
    }
}

class FutureExpression extends HLExpression {

    get type(): ExpresionType {
        return this.fieldType.eval();
    }

    constructor(ctx: any, scope: HLScope, readonly fieldType: TypeDeclaration) {
        super(ctx, scope);
    }
}

export class ArrowParamater extends HLNode implements RHS {

    private _defaultExpression?: RHS;

    get type(): ExpresionType {
        return this._type;
    }

    constructor(ctx: any, readonly outerScope: HLScope, readonly innerScope: HLScope, readonly _type: ExpresionType, readonly id: string, defaultExpression?: RHS) {
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

    resolve(id: string) {
        //  TODO nested scopes
        let retVal;
        const type = this.outerScope.types[this._type];
        (type?.rhs as RowType)?.fields.some((rowType, idx) => {
            if (rowType.id === id) {
                retVal = { expression: new FutureExpression(this.ctx, this.outerScope, rowType) };
                return true;
            }
        });
        return retVal;
    }
}

export class ArrowBody extends HLNode {

    get type(): ExpresionType {
        return this.returnExpression.type;
    }

    constructor(ctx: any, readonly scope: HLScope, readonly items: HLDeclaration[], readonly returnExpression: RHS) {
        super(ctx);
    }

    contains(line: number, column: number) {
        if (line < this.ctx.start.line) return false;
        if (line > this.ctx.stop.line) return false;
        if (line === this.ctx.start.line && column < this.ctx.start.column) return false;
        if (line === this.ctx.stop.line && column > this.ctx.stop.column) return false;
        return true;
    }
}

export class PipeExpression extends HLExpression {

    get type(): ExpresionType {
        return "function";
    }

    constructor(ctx: any, scope: HLScope, readonly items: HLExpression[]) {
        super(ctx, scope);
    }

    eval() {
        return [];
    }
}
