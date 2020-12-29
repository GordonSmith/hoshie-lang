import { ExpresionType, HLNode } from "./node";
import { HLScope } from "./scope";

export class HLType extends HLNode {

    get type(): HLType {
        return this;
    }

    constructor(ctx: any, readonly scope: HLScope) {
        super(ctx);
    }

    eval(): ExpresionType {
        return undefined;
    }
}

export class BooleanType extends HLType {

    constructor(ctx: any, scope: HLScope) {
        super(ctx, scope);
    }

    eval(): ExpresionType {
        return "boolean";
    }
}

export class NumberType extends HLType {

    constructor(ctx: any, scope: HLScope) {
        super(ctx, scope);
    }

    eval(): ExpresionType {
        return "number";
    }
}

export class StringType extends HLType {

    constructor(ctx: any, scope: HLScope) {
        super(ctx, scope);
    }

    eval(): ExpresionType {
        return "string";
    }
}

export class RowType extends HLType {

    constructor(ctx: any, scope: HLScope, readonly fields: TypeDeclaration[]) {
        super(ctx, scope);
    }

    eval(): ExpresionType {
        return "data";
    }
}

export class ArrayType extends HLType {

    constructor(ctx: any, scope: HLScope, readonly rowType: HLType) {
        super(ctx, scope);
    }

    eval(): ExpresionType {
        return this.rowType.eval() + "[]" as ExpresionType;
    }

}

export class TypeDeclaration extends HLType {

    get type(): HLType {
        return this.rhs.type;
    }

    constructor(ctx: any, scope: HLScope, readonly id: string, private rhs: HLType) {
        super(ctx, scope);
        if (!(rhs instanceof HLType)) {

        }
    }

    eval(): ExpresionType {
        return this.type.eval();
    }
}
