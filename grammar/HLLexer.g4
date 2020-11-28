lexer grammar HLLexer
  ;
// https://github.com/antlr/grammars-v4/blob/master/javascript/javascript/JavaScriptLexer.g4

SemiColon: ';';
OpenBracket: '[';
CloseBracket: ']';
OpenParen: '(';
CloseParen: ')';
OpenBrace: '{';
CloseBrace: '}';
Comma: ',';
Assign: '=';
Not: '!';
Multiply: '*';
Divide: '/';
Modulus: '%';
Plus: '+';
Minus: '-';

Export: 'export';
Import: 'import';
String: 'string';
Boolean: 'boolean';
Number: 'number';
As: 'as';
From: 'from';

Identifier: IdentifierStart IdentifierPart*;

StringLiteral
  : (
    '"' DoubleStringCharacter* '"'
    | '\'' SingleStringCharacter* '\''
  )
  ;

NullLiteral: 'null';

BooleanLiteral: 'true' | 'false';

DecimalLiteral
  : DecimalIntegerLiteral '.' DecimalDigit* ExponentPart?
  | '.' DecimalDigit+ ExponentPart?
  | DecimalIntegerLiteral ExponentPart?
  ;

HexIntegerLiteral: '0' [xX] HexDigit+;

OctalIntegerLiteral: {!this.strictMode}? '0' OctalDigit+;

fragment DecimalDigit: [0-9];

fragment HexDigit: [0-9a-fA-F];

fragment OctalDigit: [0-7];

fragment DecimalIntegerLiteral: '0' | [1-9] DecimalDigit*;

fragment ExponentPart: [eE] [+-]? DecimalDigit+;

fragment IdentifierPart
  : IdentifierStart
  | [0-9]
  | '\u200C'
  | '\u200D'
  ;

fragment IdentifierStart: [_] | [a-zA-Z];

fragment DoubleStringCharacter
  : ~ ["\\\r\n]
  | '\\' EscapeSequence
  | LineContinuation
  ;

fragment SingleStringCharacter
  : ~ ['\\\r\n]
  | '\\' EscapeSequence
  | LineContinuation
  ;

fragment EscapeSequence
  : CharacterEscapeSequence
  | '0'
  | HexEscapeSequence
  ;

fragment SingleEscapeCharacter: ['"\\bfnrtv];

fragment NonEscapeCharacter: ~ ['"\\bfnrtv0-9xu\r\n];

fragment EscapeCharacter
  : SingleEscapeCharacter
  | [0-9]
  | [xu]
  ;

fragment LineContinuation: '\\' [\r\n\u2028\u2029];

fragment CharacterEscapeSequence
  : SingleEscapeCharacter
  | NonEscapeCharacter
  ;

fragment HexEscapeSequence: 'x' HexDigit HexDigit;

WhiteSpace: [ \t\r\n]+ -> skip;

MultiLineComment: '/*' .*? '*/' -> channel ( HIDDEN );

SingleLineComment: '//' ~ [\r\n]* -> channel ( HIDDEN );
