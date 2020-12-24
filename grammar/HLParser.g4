parser grammar HLParser
  ;
// https://github.com/antlr/grammars-v4/blob/master/javascript/javascript/JavaScriptParser.g4

options {
  tokenVocab = HLLexer;
}

program: fileElements? EOF;

fileElements: fileElement+;

fileElement: fileStatement;

fileStatement
  : block
  | variableStatement
  | actionStatement
  | importStatement
  | exportStatement
  | emptyStatement
  ;

// | classDeclaration | expressionStatement | ifStatement | iterationStatement | continueStatement | breakStatement | returnStatement | yieldStatement | withStatement | labelledStatement | switchStatement | throwStatement | tryStatement | debuggerStatement | functionDeclaration;

block: '{' statementList? '}';

blockStatement
  : block
  | variableStatement
  | actionStatement
  | emptyStatement
  ;

statementList: blockStatement+;

actionStatement
  : singleExpression eos # InlineAction
  | UTest '(' singleExpression (
    ',' singleExpression (',' StringLiteral)?
  )? ')' eos # UnitTest
  ;

variableStatement: variableDeclaration eos;

variableDeclaration: Identifier initialiser;

initialiser: '=' singleExpression;

importStatement: 'import' importFromBlock;

importFromBlock: moduleItems importFrom eos;

moduleItems: '{' (aliasName ',')* (aliasName ','?)? '}';

importNamespace
  : ('*' | identifierName) (As identifierName)?
  ;

importFrom: From StringLiteral;

aliasName
  : identifierName (As identifierName)? # ImportDeclaration
  ;

exportStatement
  : Export (exportFromBlock | variableDeclaration) eos # ExportDeclaration
  ;

exportFromBlock
  : importNamespace importFrom eos
  | moduleItems importFrom? eos
  ;

identifierName: identifier | reservedWord;

identifier: Identifier;

reservedWord: keyword | NullLiteral | BooleanLiteral;

keyword: String;

emptyStatement: ';';

elementList: singleExpression (','+ singleExpression)*;

optionalElementList
  : ','* singleExpression? (','+ singleExpression)* ','* // Yes, everything is optional
  ;

arguments: '(' (argument? (',' argument?)*) ')';

argument: singleExpression | identifier;

expressionSequence
  : singleExpression (',' singleExpression)*
  ;

singleExpression
  : singleExpression arguments                                  # FunctionExpression
  | '!' singleExpression                                        # NotExpression
  | singleExpression ('*' | '/' | '%') singleExpression         # MultiplicativeExpression
  | singleExpression ('+' | '-') singleExpression               # AdditiveExpression
  | singleExpression ('<' | '>' | '<=' | '>=') singleExpression # RelationalExpression
  | singleExpression ('==' | '!=') singleExpression             # EqualityExpression
  | singleExpression ('&&' | '||') singleExpression             # LogicalExpression
  | identifier                                                  # IdentifierExpression
  | literal                                                     # LiteralExpression
  | arrayLiteral                                                # ArrayLiteralExpression
  | Length '(' singleExpression ')'                             # LengthFunction
  | arrowFunctionParameters '=>' arrowFunctionBody              # ArrowFunction
  ;

literal
  : BooleanLiteral # BooleanLiteralExpression
  | DecimalLiteral # NumberLiteralExpression
  | StringLiteral  # StringLiteralExpression
  ;

arrayLiteral: ('[' ']' | '[' elementList ']');

arrowFunctionParameters: '(' formalParameterList? ')';

arrowFunctionBody
  : singleExpression
  | '{' functionBody '}'
  ;

formalParameterList
  : formalParameterArg (',' formalParameterArg)*
  ;

formalParameterArg
  : paramaterType identifier ('=' singleExpression)? // ECMAScript 6: Initialization
  ;

paramaterType
  : Boolean ('[' ']')?
  | Number ('[' ']')?
  | String ('[' ']')?
  ;

functionBody: fileElement* Return singleExpression eos;

eos: ';' | EOF;

