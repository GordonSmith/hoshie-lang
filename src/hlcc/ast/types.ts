import { HLNode } from "./node";
import { HLScope } from "./scope";

export class HLType extends HLNode {

    constructor(ctx: any, readonly scope: HLScope) {
        super(ctx);
    }
}

export class BooleanType extends HLType {

    constructor(ctx: any, scope: HLScope) {
        super(ctx, scope);
    }

}

export class NumberType extends HLType {

    constructor(ctx: any, scope: HLScope) {
        super(ctx, scope);
    }

}

export class StringType extends HLType {

    constructor(ctx: any, scope: HLScope) {
        super(ctx, scope);
    }

}

export class RowType extends HLType {

    constructor(ctx: any, scope: HLScope, fields: TypeDeclaration[]) {
        super(ctx, scope);
    }

}

export class ArrayType extends HLType {

    constructor(ctx: any, scope: HLScope, type: HLType) {
        super(ctx, scope);
    }

}

export class TypeDeclaration extends HLType {

    constructor(ctx: any, scope: HLScope, readonly id: string, private rhs: HLType) {
        super(ctx, scope);
        if (!(rhs instanceof HLType)) {
            debugger;
        }
    }
}
