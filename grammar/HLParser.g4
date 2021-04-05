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
  | typeStatement
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

typeStatement: typeDeclaration eos;

typeDeclaration: IdentifierType typeInitialiser;

typeInitialiser: '=' singleTypeExpression;

singleTypeExpression
  : Boolean ('[' ']')?           # BooleanType
  | Number ('[' ']')?            # NumberType
  | String ('[' ']')?            # StringType
  | rowTypeDefinition ('[' ']')? # RowType
  | IdentifierType ('[' ']')?    # IdentifierType
  ;

variableStatement: variableDeclaration eos;

variableDeclaration: Identifier variableInitialiser;

variableInitialiser
  : '=' singleExpression (As singleTypeExpression)?
  ;

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

identifier: Identifier ('.'+ Identifier)*;

reservedWord: keyword | NullLiteral | BooleanLiteral;

activity: Filter | Map | Sort | FirstN;

sensor: Count | Mean;

keyword: Generate | Random | Length | activity | sensor;

emptyStatement: ';';

elementList: singleExpression (','+ singleExpression)*;

pipe: pipeItem '->' pipeItem ('->'+ pipeItem)*;

pipeItem
  : identifier        # PipeIdentifierExpression
  | keyword arguments # PipekeywordExpression
  ;

optionalElementList
  : ','* singleExpression? (','+ singleExpression)* ','* // Yes, everything is optional
  ;

arguments
  : '(' ')' // Avoid single undefined argument
  | '(' (optionalArgument (',' optionalArgument)*) ')'
  ;

optionalArgument: (singleExpression | identifier)?;

expressionSequence
  : singleExpression (',' singleExpression)*
  ;

singleExpression
  : singleExpression arguments                                  # FunctionCallExpression
  | '!' singleExpression                                        # NotExpression
  | singleExpression ('*' | '/' | '%') singleExpression         # MultiplicativeExpression
  | singleExpression ('+' | '-') singleExpression               # AdditiveExpression
  | singleExpression ('<' | '>' | '<=' | '>=') singleExpression # RelationalExpression
  | singleExpression ('==' | '!=') singleExpression             # EqualityExpression
  | singleExpression ('&&' | '||') singleExpression             # LogicalExpression
  | identifier                                                  # IdentifierExpression
  | literal                                                     # LiteralExpression
  | arrayLiteral                                                # ArrayLiteralExpression
  | arrowFunction                                               # ArrowFunctionExpression
  | pipe                                                        # PipeExpression
  | keyword arguments                                           # KeywordCallExpression
  ;

literal
  : BooleanLiteral # BooleanLiteralExpression
  | DecimalLiteral # NumberLiteralExpression
  | StringLiteral  # StringLiteralExpression
  | dataLiteral    # DataLiteralExpression
  ;

dataLiteral: ('{' '}' | '{' elementList '}');

arrayLiteral: ('[' ']' | '[' elementList ']');

rowTypeDefinition: '{' formalFieldTypeList? '}';

formalFieldTypeList
  : formalFieldType (',' formalFieldType)*
  ;

formalFieldType: singleTypeExpression identifier;

arrowFunction
  : arrowFunctionParameters '=>' arrowFunctionBody
  ;

arrowFunctionParameters: '(' formalParameterList? ')';

arrowFunctionBody
  : singleExpression
  | '{' functionBody '}'
  ;

formalParameterList
  : formalParameterArg (',' formalParameterArg)*
  ;

formalParameterArg
  : singleTypeExpression identifier ('=' singleExpression)? // ECMAScript 6: Initialization
  ;

functionBody: fileElement* Return singleExpression eos;

eos: ';' | EOF;
