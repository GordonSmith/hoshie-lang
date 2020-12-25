import { HLError, HLNode, removeQuotes } from "./node";
import { Declaration, HLDeclaration } from "./declaration";
import { AdditiveExpression, ArrayExpression, BooleanExpression, EqualityExpression, IdentifierExpression, LogicalExpression, MultiplicativeExpression, NotExpression, NumericExpression, RelationalExpression, StringExpression, isRHS, FunctionExpression, HLExpression } from "./expression";
import { HLAction, InlineAction, Test } from "./action";
import { LengthFunction, ArrowParamater, ArrowBody } from "./function";
import { HLParserVisitor } from "../grammar/HLParserVisitor";

export interface Range {
    line: number,
    column: number,
    length: number
}

export class HLScope extends HLParserVisitor {

    private _errors: HLError[] = [];
    private _actions: HLAction[] = [];
    private _tests: Test[] = [];

    readonly declarations: { [id: string]: HLDeclaration } = {};

    constructor(readonly label: string, readonly path: string, readonly text?: string) {
        super();
    }

    appendError(node: HLNode, message: string, source: string = "src/hlcc/file.ts") {
        this._errors.push({
            ...node.createError(source, message),
            filePath: this.path
        });
    }

    ctxError(ctx, message: string, source: string = "src/hlcc/file.ts") {
        let length = ctx.stop.stop - ctx.start.start + 1;
        if (length < 0) {
            length = 0;
        }
        this._errors.push({
            column: ctx.start.column,
            line: ctx.start.line,
            length,
            filePath: this.path,
            source,
            message
        });
    }

    tokError(tok, message: string, source: string = "src/hlcc/file.ts") {
        let length = tok.symbol.stop - tok.symbol.start + 1;
        if (length < 0) {
            length = 0;
        }
        this._errors.push({
            column: tok.symbol.column,
            line: tok.symbol.line,
            length,
            filePath: this.path,
            source,
            message
        });
    }

    declarationErrors(): HLError[] {
        let retVal: HLError[] = [];
        for (const key in this.declarations) {
            if (this.declarations[key]?.expression?.errors) {
                retVal = [...retVal, ...this.declarations[key]?.expression?.errors()];
            }
        }
        return retVal;
    }

    errors(): HLError[] {
        return [
            ...this.declarationErrors(),
            ...this._errors
        ];
    }

    actions(): HLAction[] {
        return this._actions;
    }

    tests(): Test[] {
        return this._tests;
    }

    resolve(id: string): HLDeclaration | undefined {
        const retVal = this.declarations[id];
        return retVal;
    }

    appendDeclaration(ctx, id: string, decl: HLDeclaration) {
        if (this.declarations[id]) {
            this.ctxError(ctx, `Duplicate Symbol "${id}"`);
        } else {
            this.declarations[id] = decl;
        }
    }

    //  Visitor overrides  ---

    visitTerminal(ctx) {
        return ctx.symbol.text;
    }

    visitProgram(ctx) {
        return super.visitProgram(ctx);
    }

    visitBlock(ctx) {
        return super.visitBlock(ctx);
    }

    visitArguments(ctx) {
        const children = super.visitArguments(ctx);
        const args = [];
        let argPos = 0;
        let arg = undefined;
        children.forEach(item => {
            switch (item) {
                case "[":
                case "]":
                    break;
                case ",":
                    args.push(arg);
                    argPos++;
                    arg = undefined;
                    break;
                default:
                    if (Array.isArray(item)) {
                        arg = item[0];
                    }
            }
        });
        if (children.length > 2) {
            args.push(arg);
        }
        return args;
    }

    visitFunctionExpression(ctx) {
        const children = super.visitFunctionExpression(ctx);
        const [identifier, args] = children;
        const decl = this.resolve(identifier.id);
        if (decl.type !== "function") {
            this.appendError(decl, `${identifier.id} is not a function.`);
        }
        return new FunctionExpression(ctx, this, decl.expression as any, args);
    }

    visitNotExpression(ctx) {
        const [, expression] = super.visitNotExpression(ctx);
        if (expression.type !== "boolean") {
            this.ctxError(ctx, "Expression is not boolean");
        }
        return new NotExpression(ctx, this, expression);
    }

    visitMultiplicativeExpression(ctx) {
        const [lhs, , rhs] = super.visitMultiplicativeExpression(ctx);
        if (lhs.type === "number" && rhs.type === "number") {
        } else {
            this.ctxError(ctx, "Multiplicative Expression is not valid");
        }
        return new MultiplicativeExpression(ctx, this, lhs, rhs, !!ctx.Multiply() ? "*" : !!ctx.Divide() ? "/" : !!ctx.Modulus() ? "%" : undefined);
    }

    visitAdditiveExpression(ctx) {
        const [lhs, , rhs] = super.visitAdditiveExpression(ctx);
        if (lhs.type === "number" && rhs.type === "number") {
        } else if (lhs.type === "string" && rhs.type === "string" && !ctx.Minus()) {
        } else {
            this.ctxError(ctx, "Additive Expression is not valid");
        }
        return new AdditiveExpression(ctx, this, lhs, rhs, !!ctx.Minus() ? "-" : "+");
    }

    visitRelationalExpression(ctx) {
        const [, action] = ctx.children;
        const [lhs, , rhs] = super.visitRelationalExpression(ctx);
        if (lhs.type === "boolean" && rhs.type === "boolean" ||
            lhs.type === "number" && rhs.type === "number" ||
            lhs.type === "string" && rhs.type === "string") {
        } else {
            this.ctxError(ctx, "Relational Expression is not valid");
        }
        return new RelationalExpression(ctx, this, lhs, rhs, action.getText());
    }

    visitEqualityExpression(ctx) {
        const [lhs, , rhs] = super.visitEqualityExpression(ctx);
        if (lhs.type === "boolean" && rhs.type === "boolean") {
        } else if (lhs.type === "number" && rhs.type === "number") {
        } else if (lhs.type === "string" && rhs.type === "string") {
        } else {
            this.ctxError(ctx, "Equality Expression is not valid");
        }
        return new EqualityExpression(ctx, this, lhs, rhs, !!ctx.Equals() ? "==" : !!ctx.NotEquals() ? "!=" : undefined);
    }

    visitLogicalExpression(ctx) {
        const [lhs, , rhs] = super.visitLogicalExpression(ctx);
        if (lhs.type === "boolean" && rhs.type === "boolean") {
        } else {
            this.ctxError(ctx, "Logical Expression is not valid");
        }
        return new LogicalExpression(ctx, this, lhs, rhs, !!ctx.And() ? "&&" : !!ctx.Or() ? "||" : undefined);
    }

    visitIdentifierExpression(ctx) {
        const id = ctx.identifier().getText();
        const expression = this.resolve(id)?.expression;
        if (!expression) {
            this.ctxError(ctx, `Invalid identifier "${id}"`);
        }
        return new IdentifierExpression(ctx, this, id, expression);
    }

    visitLiteralExpression(ctx) {
        const children = super.visitLiteralExpression(ctx);
        const [retVal] = children;
        return retVal;
    }

    visitArrayLiteralExpression(ctx) {
        const [Arrayliteral] = super.visitArrayLiteralExpression(ctx);
        const [, literalItems] = Arrayliteral;
        const literals = literalItems?.filter(item => item !== ",") || [];
        literals.forEach(item => {
            if (item.type !== literals[0].type) {
                this.appendError(item, `All items must be type of "${literals[0].type}"`);
            }
        });
        return new ArrayExpression(ctx, this, literals?.filter(row => !!row));
    }

    visitLengthFunction(ctx) {
        const [, , expression] = super.visitLengthFunction(ctx);
        if (!LengthFunction.hasLength(expression)) {
            this.ctxError(ctx, "Expression does not have length");
        }
        return new LengthFunction(ctx, this, expression);
    }

    visitBooleanLiteralExpression(ctx) {
        return new BooleanExpression(ctx, this, ctx.BooleanLiteral().getText() === "true");
    }

    visitNumberLiteralExpression(ctx) {
        return new NumericExpression(ctx, this, Number(ctx.DecimalLiteral().getText()));
    }

    visitStringLiteralExpression(ctx) {
        return new StringExpression(ctx, this, removeQuotes(ctx.StringLiteral().getText()));
    }

    visitInitialiser(ctx) {
        const [, expression] = super.visitInitialiser(ctx);
        return expression;
    }

    visitVariableDeclaration(ctx) {
        const [id] = ctx.children;
        const [, rhs] = super.visitVariableDeclaration(ctx);
        const hlVar = new Declaration(ctx, this, id.getText(), rhs);
        this.appendDeclaration(ctx, hlVar.id, hlVar);
        return hlVar;
    }

    visitVariableStatement(ctx) {
        const [hlVar] = super.visitVariableStatement(ctx);
        return hlVar;
    }

    visitInlineAction(ctx) {
        const children = super.visitInlineAction(ctx);
        const [retVal, _] = children;
        this._actions.push(retVal);
        return retVal;
    }

    visitUnitTest(ctx) {
        const [_0, _1, _2, _3, _4, _5, msg] = ctx.children;
        const children = super.visitUnitTest(ctx);
        const [__0, __1, actual, __3, expected] = children;
        const test = new Test(ctx, this, actual, expected, msg?.getText());
        this._tests.push(test);
        return test;
    }
}
