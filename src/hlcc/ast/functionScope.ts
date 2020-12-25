import { ExpresionT, ExpresionType } from "./node";
import { HLExpression, isRHS, RHS } from "./expression";
import { HLScope } from "./scope";
import { ArrowBody, ArrowParamater } from "./function";
import { Declaration } from "./declaration";

export class HLFunctionScope extends HLScope implements RHS {

    private _params: ArrowParamater[] = [];
    private _body: ArrowBody;

    get type(): ExpresionType {
        return "function";
    }

    get returnType(): ExpresionType {
        return this._body?.returnExpression?.type;
    }

    constructor(readonly path: string, readonly ctx, readonly paramsScope: HLScope) {
        super("", path);
        this.visitArrowFunction(this.ctx);
    }

    eval(): ExpresionT {
        return this._body?.returnExpression?.eval();
    }

    calc(args: HLExpression[]): ExpresionT {
        const defaultExpressions = this._params.map(p => p.defaultExpression());
        this._params.forEach((param, i) => param.defaultExpression(args[i] || param.defaultExpression()));
        const retVal = this._body?.returnExpression?.eval();
        this._params.forEach((param, i) => param.defaultExpression(defaultExpressions[i]));
        return retVal;
    }

    //  Visitors  ---

    visitArrowFunction(ctx) {
        const retVal = super.visitArrowFunction(ctx);
        const [_, _1, body] = retVal;
        this._body = body;
        return retVal;
    }

    visitFormalParameterArg(ctx) {
        const [, , , expression] = this.paramsScope.visitFormalParameterArg(ctx);
        const id = ctx.identifier();
        const rhs = new ArrowParamater(ctx, this, ctx.paramaterType().getText(), id.getText(), expression);
        this._params.push(rhs);
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
        const returnExpression = items[1].pop();
        return new ArrowBody(ctx, this, items[1], returnExpression);
    }

    visitFunctionBody(ctx) {
        const items = super.visitFunctionBody(ctx);
        return items.map(row => {
            if (Array.isArray(row) && !!row[0]) {
                return row[0][0];
            } else if (isRHS(row)) {
                return row;
            }
            return undefined;
        }).filter(row => typeof row !== "string");
    }
}
