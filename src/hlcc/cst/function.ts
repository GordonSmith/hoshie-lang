import { ExpresionT, ExpresionType, HLError, isArray } from "./node";
import { RHS } from "./expression";
import { HLScope } from "./scope";
import { HLNode } from "./node";
import { HLDeclaration } from "./declaration";
import { ArrayType, RowType } from "./types";

export class HLFunction extends HLNode implements RHS {

    get type(): ExpresionType {
        throw new Error("Method not implemented.");
    }

    eval(): ExpresionT {
        throw new Error("Method not implemented.");
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

    constructor(ctx: any, readonly scope: HLScope, readonly expression: RHS) {
        super(ctx);
    }

    eval(): number {
        if (LengthFunction.hasLength(this.expression)) {
            return (this.expression.eval() as any)?.length;
        }
        return undefined;
    }
}

export class RandomFunction extends HLFunction {

    get type(): ExpresionType {
        return "number";
    }

    protected _min: number;
    protected _max: number;
    protected _round: boolean;
    protected _value: number;

    constructor(ctx: any, readonly scope: HLScope, min?: RHS, max?: RHS, round?: RHS) {
        super(ctx);
        this._min = min ? min.eval() as number : 0;
        this._max = max ? max.eval() as number : 1;
        this._round = round ? round.eval() as boolean : false;
        this._value = this._round ? this.ranomInt(this._min, this._max) : this.random(this._min, this._max);
    }

    eval(): number {
        return this._value;
    }

    random(min, max) {
        return Math.random() * (max - min) + min;
    }

    ranomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(this.random(min, max));
    }
}

export class GenerateFunction extends HLFunction {

    get type(): ExpresionType {
        return this.expression.type + "[]" as ExpresionType;
    }

    constructor(ctx: any, readonly scope: HLScope, readonly expression: RHS, readonly total: RHS) {
        super(ctx);
    }

    eval(): any[] {
        const retVal = [];
        for (let i = 0; i < this.total.eval(); ++i) {
            retVal.push(this.expression.eval());
        }
        return retVal;
    }
}

export class ReadJsonFunction extends HLFunction {

    rowType: ArrayType;

    get type(): ExpresionType {
        return "data[]";
    }

    constructor(ctx: any, readonly scope: HLScope, readonly expression: RHS) {
        super(ctx);
    }

    eval(): string {
        return "data[]";
    }

    typeInfo(_: any) {
        if (_ instanceof ArrayType) {
            this.rowType = _;
        } else {
        }
    }

}

export class WriteJsonFunction extends HLFunction {

    rowType: ArrayType;

    get type(): ExpresionType {
        return "unknown";
    }

    constructor(ctx: any, readonly scope: HLScope, readonly expression: RHS, readonly path: RHS) {
        super(ctx);
    }

    eval(): string {
        return undefined;
    }

    typeInfo(_: any) {
        if (_ instanceof ArrayType) {
            this.rowType = _;
        } else {
        }
    }

}

export class ActivityFunction extends HLFunction {
    readonly isActivity = true;
}

export class FilterFunction extends ActivityFunction {

    get type(): ExpresionType {
        return "data[]";
    }

    constructor(ctx: any, readonly scope: HLScope, readonly expression: RHS) {
        super(ctx);
    }

    typeInfo(_: RowType) {
        return this.expression.type;
    }

    eval(): number {
        return undefined;
    }
}

export class FirstNFunction extends ActivityFunction {

    readonly count: number;

    get type(): ExpresionType {
        return "data[]";
    }

    constructor(ctx: any, readonly scope: HLScope, readonly expression: RHS) {
        super(ctx);
        this.count = expression.eval() as number;
    }

    eval(): number {
        return this.count;
    }
}

export class GroupFunction extends ActivityFunction {

    get type(): ExpresionType {
        return "data[]";
    }

    constructor(ctx: any, readonly scope: HLScope, readonly expression: RHS) {
        super(ctx);
    }

    eval(): number {
        return undefined;
    }
}

export class GroupCountFunction extends ActivityFunction {

    get type(): ExpresionType {
        return "data[]";
    }

    constructor(ctx: any, readonly scope: HLScope, readonly expression: RHS) {
        super(ctx);
    }

    eval(): number {
        return undefined;
    }
}

export class MapFunction extends ActivityFunction {

    get type(): ExpresionType {
        return "data[]";
    }

    constructor(ctx: any, readonly scope: HLScope, readonly expression: RHS) {
        super(ctx);
    }

    typeInfo(_: RowType) {
        return this.expression.type;
    }

    eval(): number {
        return undefined;
    }
}

export class PipelineFunction extends ActivityFunction {

    get type(): ExpresionType {
        return "function";
    }

    constructor(ctx: any, scope: HLScope, readonly items: any[]) {
        super(ctx);
    }

    eval() {
        return "data[]";
    }
}

export class SkipNFunction extends ActivityFunction {

    readonly count: number;

    get type(): ExpresionType {
        return "data[]";
    }

    constructor(ctx: any, readonly scope: HLScope, readonly expression: RHS) {
        super(ctx);
        this.count = expression.eval() as number;
    }

    eval(): number {
        return this.count;
    }
}

export class SortFunction extends ActivityFunction {

    get type(): ExpresionType {
        return "data[]";
    }

    constructor(ctx: any, readonly scope: HLScope, readonly expression: RHS) {
        super(ctx);
    }

    typeInfo(_: RowType) {
        return this.expression.type;
    }

    eval(): number {
        return undefined;
    }
}

export class SensorFunction extends HLFunction {
    readonly isSensor = true;
}

export class CountFunction extends SensorFunction {

    get type(): ExpresionType {
        return "number";
    }

    constructor(ctx: any, readonly scope: HLScope, readonly expression: RHS) {
        super(ctx);
    }

    eval(): number {
        return undefined;
    }
}

export class DeviationFunction extends SensorFunction {

    get type(): ExpresionType {
        return "number";
    }

    constructor(ctx: any, readonly scope: HLScope, readonly expression: RHS) {
        super(ctx);
    }

    eval(): number {
        return undefined;
    }
}

export class DistributionFunction extends SensorFunction {

    get type(): ExpresionType {
        return "number";
    }

    constructor(ctx: any, readonly scope: HLScope, readonly expression: RHS) {
        super(ctx);
    }

    eval(): number {
        return undefined;
    }
}

export class ExtentFunction extends SensorFunction {

    get type(): ExpresionType {
        return "number";
    }

    constructor(ctx: any, readonly scope: HLScope, readonly expression: RHS) {
        super(ctx);
    }

    eval(): number {
        return undefined;
    }
}

export class MaxFunction extends SensorFunction {

    get type(): ExpresionType {
        return "number";
    }

    constructor(ctx: any, readonly scope: HLScope, readonly expression: RHS) {
        super(ctx);
    }

    eval(): number {
        return undefined;
    }
}

export class MeanFunction extends SensorFunction {

    get type(): ExpresionType {
        return "number";
    }

    constructor(ctx: any, readonly scope: HLScope, readonly expression: RHS) {
        super(ctx);
    }

    eval(): number {
        return undefined;
    }
}

export class MedianFunction extends SensorFunction {

    get type(): ExpresionType {
        return "number";
    }

    constructor(ctx: any, readonly scope: HLScope, readonly expression: RHS) {
        super(ctx);
    }

    eval(): number {
        return undefined;
    }
}

export class MinFunction extends SensorFunction {

    get type(): ExpresionType {
        return "number";
    }

    constructor(ctx: any, readonly scope: HLScope, readonly expression: RHS) {
        super(ctx);
    }

    eval(): number {
        return undefined;
    }
}

export class QuartileFunction extends SensorFunction {

    get type(): ExpresionType {
        return "number";
    }

    constructor(ctx: any, readonly scope: HLScope, readonly expression: RHS) {
        super(ctx);
    }

    eval(): number {
        return undefined;
    }
}

export class ReduceFunction extends SensorFunction {

    get type(): ExpresionType {
        return "number";
    }

    constructor(ctx: any, readonly scope: HLScope, readonly expression: RHS) {
        super(ctx);
    }

    eval(): number {
        return undefined;
    }
}

export class VarianceFunction extends SensorFunction {

    get type(): ExpresionType {
        return "number";
    }

    constructor(ctx: any, readonly scope: HLScope, readonly expression: RHS) {
        super(ctx);
    }

    eval(): number {
        return undefined;
    }
}
