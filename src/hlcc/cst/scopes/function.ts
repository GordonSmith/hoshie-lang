import { ExpresionT, ExpresionType } from "../node";
import { ArrowBody, ArrowParamater, HLExpression, isRHS, RHS } from "../expression";
import { HLScope, resolveRef } from "../scope";
import { Declaration } from "../declaration";
import { TypeDeclaration } from "../types";

function nullOrArray(item) {
    if (Array.isArray(item)) {
        return item[0];
    }
    return undefined;
}
export class HLFunctionScope extends HLScope implements RHS {

    params: ArrowParamater[] = [];
    body: ArrowBody;

    get type(): ExpresionType {
        return "function";
    }

    get returnType(): ExpresionType {
        return this.body?.returnExpression?.type;
    }

    constructor(readonly path: string, readonly ctx, readonly paramsScope: HLScope) {
        super("", path);
        this.visitArrowFunctionExpression(this.ctx);
    }

    resolveType(id: string): TypeDeclaration | undefined {
        return super.resolveType(id) || this.paramsScope.resolveType(id);
    }

    eval(): ExpresionT {
        return this.body?.returnExpression?.eval();
    }

    calc(args: HLExpression[]): ExpresionT {
        const defaultExpressions = this.params.map(p => p.defaultExpression());
        this.params.forEach((param, i) => param.defaultExpression(args[i] || param.defaultExpression()));
        const retVal = this.body?.returnExpression?.eval();
        this.params.forEach((param, i) => param.defaultExpression(defaultExpressions[i]));
        return retVal;
    }

    contains(line: number, column: number) {
        return this.body.contains(line, column);
    }

    //  Visitors  ---

    visitArrowFunctionExpression(ctx) {
        const children = super.visitArrowFunctionExpression(ctx);
        const [[_, _1, body]] = children;
        this.body = body;
        return children;
    }

    visitFormalParameterArg(ctx) {
        const children = this.paramsScope.visitFormalParameterArg(ctx);
        const [, , , expression] = children;
        const id = ctx.identifier();
        const rhs = new ArrowParamater(ctx, this.paramsScope, this, ctx.singleTypeExpression().getText(), id.getText(), expression);
        this.params.push(rhs);
        const decl = new Declaration(ctx, this, id.getText(), rhs);
        this.appendDeclaration(ctx, id.getText(), decl);
        return undefined;
    }

    visitArrowFunctionBody(ctx) {
        const items = super.visitArrowFunctionBody(ctx);
        if (items.length === 1) {
            //  singleExpression implicit return
            return new ArrowBody(ctx, this, [], items[0]);
        }
        //  functionBody, last item is return
        return new ArrowBody(ctx, this, items[1].body, items[1].returnValue, items[1].asType);
    }

    visitFunctionBody(ctx) {
        const children = super.visitFunctionBody(ctx);
        const body = [];
        let returnValue;
        let foundReturn = false;
        for (const item of children) {
            if (item === "return") {
                foundReturn = true;
            } else if (foundReturn) {
                returnValue = item[0];
                break;
            } else {
                body.push(item[0]);
            }
        }
        const retType = ctx.returnTypeExpression();
        return {
            body,
            returnValue,
            asType: retType ? nullOrArray(this.visitReturnExpression(retType)) : returnValue?.rowType
        };
    }
}
