lexer grammar HLLexer
  ;
// https://github.com/antlr/grammars-v4/blob/master/javascript/javascript/JavaScriptLexer.g4

//  Symbols
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
LessThan: '<';
GraterThan: '>';
LessThanEquals: '<=';
GreaterThanEquals: '>=';
Equals: '==';
NotEquals: '!=';
And: '&&';
Or: '||';
Arrow: '=>';
Dot: '.';

//  Keywords
Boolean: 'boolean';
Number: 'number';
String: 'string';
Export: 'export';
Import: 'import';
As: 'as';
From: 'from';
Return: 'return';

//  Functions
Length: 'length';
Generate: 'generate';
Random: 'random';
UTest: 'utest';
ReadJson: 'readJson';
WriteJson: 'writeJson';

//  Activities
Concat: 'concat';
Filter: 'filter';
FirstN: 'firstN';
Group: 'group';
Histogram: 'histogram';
Map: 'map';
Pipeline: 'pipeline';
Skip: 'skip';
Sort: 'sort';

//  Sensors
Count: 'count';
Deviation: 'deviation';
Distribution: 'distribution';
Extent: 'extent';
Max: 'max';
Mean: 'mean';
Median: 'median';
Min: 'min';
Quartile: 'quartile';
Reduce: 'reduce';
Variance: 'variance';

//  Literals
NullLiteral: 'null';
BooleanLiteral: 'true' | 'false';

DecimalLiteral
  : DecimalIntegerLiteral '.' DecimalDigit* ExponentPart?
  | '.' DecimalDigit+ ExponentPart?
  | DecimalIntegerLiteral ExponentPart?
  ;
fragment DecimalDigit: [0-9];
fragment DecimalIntegerLiteral: '0' | [1-9] DecimalDigit*;

HexIntegerLiteral: '0' [xX] HexDigit+;
fragment HexDigit: [0-9a-fA-F];

OctalIntegerLiteral: {!this.strictMode}? '0' OctalDigit+;
fragment OctalDigit: [0-7];
fragment ExponentPart: [eE] [+-]? DecimalDigit+;

StringLiteral
  : (
    '"' DoubleStringCharacter* '"'
    | '\'' SingleStringCharacter* '\''
  )
  ;

//  Identifier
IdentifierType: IdentifierTypeStart IdentifierPart*;
Identifier: IdentifierStart IdentifierPart*;
fragment IdentifierPart
  : [_]
  | [a-zA-Z]
  | [0-9]
  | '\u200C'
  | '\u200D'
  ;

fragment IdentifierTypeStart: [A-Z];

fragment IdentifierStart: [_] | [a-z];

//  Strings
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

//  Other
fragment LineContinuation: '\\' [\r\n\u2028\u2029];

fragment CharacterEscapeSequence
  : SingleEscapeCharacter
  | NonEscapeCharacter
  ;

fragment HexEscapeSequence: 'x' HexDigit HexDigit;

WhiteSpace: [ \t\r\n]+ -> skip;

MultiLineComment: '/*' .*? '*/' -> channel ( HIDDEN );

SingleLineComment: '//' ~ [\r\n]* -> channel ( HIDDEN );
