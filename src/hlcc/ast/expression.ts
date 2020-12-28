import { HLScope } from "./scope";
import { ExpresionT, ExpresionType, HLError, HLNode } from "./node";
import { HLFunctionScope } from "./functionScope";

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

    get type(): ExpresionType {
        return "data";
    }

    constructor(ctx: any, scope: HLScope, readonly fields: HLExpression[]) {
        super(ctx, scope);
    }

    typeInfo(_: HLExpression) {
    }

    eval(): string {
        return "{ " + this.fields.map(exp => exp.eval()).join(", ") + "}";
    }
}

export class ArrayExpression extends HLExpression {

    get type(): ExpresionType {
        return (this.value?.length ? this.value[0].type + "[]" : "unknown[]") as ExpresionType;
    }

    constructor(ctx: any, scope: HLScope, readonly value: (BooleanExpression | NumericExpression | StringExpression | DataExpression)[]) {
        super(ctx, scope);
    }

    typeInfo(_: any) {
    }

    eval() {
        if (this.type === "string[]") {
            return (this.value as any[]).map(v => `'${v.eval()}'`);
        }
        return (this.value as any[]).map(v => v.eval());
    }
}

export class FunctionExpression extends HLExpression {

    get type(): ExpresionType {
        return this.func.returnType;
    }

    constructor(ctx: any, scope: HLScope, readonly func: HLFunctionScope, readonly args: HLExpression[]) {
        super(ctx, scope);
    }

    eval() {
        return this.func.calc(this.args);
    }
}
