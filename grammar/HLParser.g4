parser grammar HLParser
  ;
// https://github.com/antlr/grammars-v4/blob/master/javascript/javascript/JavaScriptParser.g4

options {
  tokenVocab = HLLexer;
}

program: sourceElements? EOF;

sourceElements: sourceElement+;

sourceElement: statement;

statement
  : block
  | variableStatement
  | importStatement
  | exportStatement
  | emptyStatement
  ;

// | classDeclaration | expressionStatement | ifStatement | iterationStatement | continueStatement | breakStatement | returnStatement | yieldStatement | withStatement | labelledStatement | switchStatement | throwStatement | tryStatement | debuggerStatement | functionDeclaration;

block: '{' statementList? '}';

statementList: statement+;

variableStatement: variableDeclaration eos;

variableDeclaration: Identifier initialiser;

initialiser: '=' singleExpression;

importStatement: 'import' importFromBlock;

importFromBlock
  : moduleItems importFrom eos
  | StringLiteral eos
  ;

moduleItems: '{' (aliasName ',')* (aliasName ','?)? '}';

importDefault: aliasName ',';

importNamespace
  : ('*' | identifierName) (As identifierName)?
  ;

importFrom: From StringLiteral;

aliasName: identifierName ( As identifierName)?;

exportStatement
  : Export (exportFromBlock | variableStatement) eos # ExportDeclaration
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

arrayLiteral: ('[' elementList ']');

elementList
  : ','* singleExpression? (','+ singleExpression)* ','* // Yes, everything is optional
  ;

expressionSequence
  : singleExpression (',' singleExpression)*
  ;

singleExpression
  : '!' singleExpression                                # NotExpression
  | singleExpression ('*' | '/' | '%') singleExpression # MultiplicativeExpression
  | singleExpression ('+' | '-') singleExpression       # AdditiveExpression
  | identifier                                          # IdentifierExpression
  | literal                                             # LiteralExpression
  | arrayLiteral                                        # ArrayLiteralExpression
  ;

literal
  : (NullLiteral | BooleanLiteral | StringLiteral)
  | numericLiteral
  ;

numericLiteral
  : DecimalLiteral
  | HexIntegerLiteral
  | OctalIntegerLiteral
  ;

eos: ';' | EOF;

