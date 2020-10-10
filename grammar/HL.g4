grammar HL;

//  ---  Parser  ---
program
    : sourceElements? EOF
    ;

sourceElements
    : sourceElement+
    ;

sourceElement
    : statement
    ;

statement
    : block
    // | variableStatement
    | importStatement
    // | exportStatement
    | emptyStatement
    // | classDeclaration
    // | expressionStatement
    // | ifStatement
    // | iterationStatement
    // | continueStatement
    // | breakStatement
    // | returnStatement
    // | yieldStatement
    // | withStatement
    // | labelledStatement
    // | switchStatement
    // | throwStatement
    // | tryStatement
    // | debuggerStatement
    // | functionDeclaration
    ;

block
    : '{' statementList? '}'
    ;

statementList
    : statement+
    ;

importStatement
    : Import importFromBlock
    ;
    
importFromBlock
    : importDefault? (importNamespace | moduleItems) importFrom eos
    | StringLiteral eos
    ;

moduleItems
    : '{' (aliasName ',')* (aliasName ','?)? '}'
    ;

importDefault
    : aliasName ','
    ;

importNamespace
    : ('*' | identifierName) (As identifierName)?
    ;

importFrom
    : From StringLiteral
    ;

aliasName
    : identifierName (As identifierName)?
    ;

identifierName
    : identifier
    | reservedWord
    ;

identifier
    : Identifier
    ;

reservedWord
    : keyword
    | NullLiteral
    | BooleanLiteral
    ;

keyword
    :String
    ;

emptyStatement
    : SemiColon
    ;

eos
    : SemiColon
    | EOF
    ;

//  --- Lexer  ---
SemiColon:                      ';';

Import:                         'import';
String:                         'string';
As:                             'as';
From:                           'from';

Identifier:                     IdentifierStart IdentifierPart*;

StringLiteral:                 ('"' DoubleStringCharacter* '"'
             |                  '\'' SingleStringCharacter* '\'')
             ;

NullLiteral:                    'null';

BooleanLiteral:                 'true'
              |                 'false';

fragment IdentifierPart
    : IdentifierStart
    | [0-9]
    | '\u200C'
    | '\u200D'
    ;

fragment IdentifierStart
    : [_]
    | [a-zA-Z]
    ;

fragment DoubleStringCharacter
    : ~["\\\r\n]
    | '\\' EscapeSequence
    | LineContinuation
    ;

fragment SingleStringCharacter
    : ~['\\\r\n]
    | '\\' EscapeSequence
    | LineContinuation
    ;

fragment EscapeSequence
    : CharacterEscapeSequence
    | '0' // no digit ahead! TODO
    | HexEscapeSequence
    ;

fragment SingleEscapeCharacter
    : ['"\\bfnrtv]
    ;

fragment NonEscapeCharacter
    : ~['"\\bfnrtv0-9xu\r\n]
    ;

fragment EscapeCharacter
    : SingleEscapeCharacter
    | [0-9]
    | [xu]
    ;

fragment LineContinuation
    : '\\' [\r\n\u2028\u2029]
    ;

fragment CharacterEscapeSequence
    : SingleEscapeCharacter
    | NonEscapeCharacter
    ;

fragment HexEscapeSequence
    : 'x' HexDigit HexDigit
    ;

fragment HexDigit
    : [_0-9a-fA-F]
    ;

WhiteSpace : [ \n\t]+ -> skip;
