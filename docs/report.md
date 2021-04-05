# Title Page

# Abstract

# Declaration

# Acknowledgements

# Table of Contents

# Introduction

The goal of this project is to create a new data centric programming language with the following features:

* A pure functional language
* All data will be immutable by default
* Syntax design to encourage / simplify the design of “Data Pipelines” or “Data Processes” (a chain of activities - project,  filter etc.) 
* Integrated Development Environment

# Analysis

The overall project can be broken down to several key functional areas:

* Syntax Design:  The design of the language - should be succinct, but easy to read / write.
* Compiler:  The compiler will convert the new language into a format that can be executed.
* Integrated Development Environment:  Having good IDE integration is a key factor to any languages usability.
* Runtime environment:  Where can the compiled program be executed? 

## Syntax Design

* Functional or OOP?
    * Pros:
    * Cons:
* Immutable or Mutable data?
    * Pros:
    * Cons:
* Declarative or Procedural?
    * Pros:
    * Cons:
* Scoping rules:
    * Files
    * Functions
* Visibility rules:
    * Forward declarations
* Operators
* Declarations
* Actions
* Builtin functions

## Compiler

There are some common tools to assist in compiler development, these are known as "compiler compilers":

* Antlr?
    * Pros:
    * Cons:
* Flex / Bison?
    * Pros:
    * Cons:
* Lex / Yacc?
    * Pros:
    * Cons:

## Integrated Development Environment

* Bespoke:  A specific IDE developed for the language in question.
    * Pros:
        * Can cater to the language very well
        * Can have deep integration with the language
    * Cons:
        * A lot of work
        * Developers don't like learning new IDEs
* Visual Studio:  Microsofts IDE, primarily focused on Windows development 
    * Pros:
    * Cons:
* XCode:  Apples IDE, primarily focused on OSX + IOS development
    * Pros:
    * Cons:
* Android Studio:  Googles IDE, primarily focused on Android and Chrome OS development
    * Pros:
    * Cons:
* IntelliJ:  IDE focusing on Java Development
    * Pros:
    * Cons:
* Eclipse:  Designed to be an extensible IDE written in Java
    * Pros:
    * Cons:
* Atom:  "A hackable text editor for the 21st Century"  
    * Pros:
    * Cons:
* VS Code:  Designed from the start to be an unopinionated modern and extensible editor / IDE written in TypeScript.  Borrowed heavily from Atoms ideology 
    * Pros:
    * Cons:

## Runtime Environment

* Native Machine Code:
* Java Virtual Machine:
* JavaScript Environment:
    * Browser
    * NodeJS
    * Deno

# Design

## Syntax

The key areas for the language are:

* Types:
    * Primitive:  boolean, number, string
    * Complex:  A named "set" of Primitives / Complex items
    * Arrays:  A "list" of Complex or Primitive items (limited to one type)
* Expressions:  A single entity that can be evaluated to a value:
    * Boolean:  true, false, equality, greater, less, and, or, not etc.
    * Numeric:  Plus, minus, multiplication, division, etc.
    * String:  Concatenation
* Functions:  An encapsulated set of expressions:
  * Gated inputs (parameters)
  * Internals should be private.
  * Single return value.
  * Should be pure.
* Declaration:  A named Type, Expression or Function
* Scoping:
    * Files:  Declarations inside a file will only be visible within that file, unless a declaration is specifically exported.
    * Functions:  
        * Declarations within the function are only visible within that function.
        * Declaration outside the function will not be visible within that function.
        * Parameters will be used to pass in expressions / declarations.
        * Return value will be used to expose a result from the function.
        * Functions are expected to be pure.
* Builtin Functions:  The language will have a set of data processing functions built into the language.  It will also have builtin support for unit testing.

## Compiler

* Lexer:  The set of known tokens, keywords and operators
* Grammar:  Defines how the tokens can be structured in a high level way

## Design Conclusion

Primary development language would be TypeScript and the targetted runtime environment would NodeJS / Browser (JavaScript). The key factors in this decision were:

* Antlr supports generating JavaScript (and experimental TypeScript) parsing and visitor code.
* VS Code extension authoring is written in TypeScript.
* NodeJS and Browser environments are cross-platform and widley available.

# Implementation

## Development Environment
_The following is a description of the development environment used, given the nature of the project setting up an optimised environment served as valuable research as well as expediting actual development._

The following development tools were used:

* [NodeJS](https://nodejs.org/en/):  Cross-platform JavaScript runtime environment for executing JavaScript outside of a web browser.  Has a large ecosystem of third party libraries and a popular package manager to define versioned dependencies.
* [TypeScript](https://www.typescriptlang.org/):  An extension to the JavaScript language, TypeScript adds static typing and transpiling capabilities making large scale development of JavaScript more robust.
* [Antlr](https://www.antlr.org/):  A compiler compiler which takes Lexer and grammar definition files and generates parsers, abstract syntax trees with associated walkers and visitors.
* [Mocha](https://mochajs.org/):  JavaScript test framework.
* [Chai](https://www.chaijs.com/):  A JAvaScript assertion library, commonly used in conjunction with Mocha.
* [rimraf](https://github.com/isaacs/rimraf):  Emulated the "rm -rf" command line in JavaScript.  Used for running "clean" commands.
* [npm-run-all](https://github.com/mysticatea/npm-run-all):  Allows sequential and parallel execution of "npm run" commands.  Used for "build-all" type commands.
* [watch](https://github.com/mikeal/watch):  Monitors a folder for changes, used to detect when files change so they can be automatically recompiled.
* [pandoc](https://pandoc.org/):  A universal document converted, used to convert markdown to Microsoft Word formats (and back again), allow initial report writing to be done in markdown.
* [Visual Studio Code](https://code.visualstudio.com/):  Development environment, including the following extensions:
    * [ANTLR4 grammar syntax support](https://marketplace.visualstudio.com/items?itemName=mike-lischke.vscode-antlr4):  IDE support for Antlr lexer and grammar files.
    * [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint):  IDE support for TypeScript linting tools.

## Syntax

## Compiler
_Antlr is a modern compiler compiler, initially designed to generate Java based compilers has been extended to support many languages, including JavaScript and experimental TypeScript._

## Integrated Development Environment
_A critical part of any programming language is good support for associated development tools, VS Code is currently one of the most popular cross platform, general purpose programming IDEs available.  https://code.visualstudio.com/_

### Contribution Points
_VS Code has many ways it can be extended to support new features and languages.  These capabilities are defined using "Contribution Points" within the extensions `./package.json` file, in a specific section called `contributes`.  https://code.visualstudio.com/api/references/contribution-points_

* `languages`:  Every extension will need to declare some global information about itself, this includes:
    * `id`:  A unique ID associated with the extension (hoshie)
    * `extensions`:  File extension IDs that VS Code can use to assosiate a file with the extension (.ho)
    * `configuration`:  Some general rules for the language to help the editor handle common operations (.\language-configuration.json) and includes - [link](https://code.visualstudio.com/api/language-extensions/language-configuration-guide):
        * Comment toggling
        * Brackets definition
        * Autoclosing
        * Autosurrounding
        * Folding
        * Word pattern
        * Indentation Rules
* `grammars`:  VS Code uses [TextMate grammar definitions](https://macromates.com/manual/en/language_grammars) for its default syntax colouring.  This contribution point associates hoshie lang with a Text Mate language file `./syntaxes/hoshie.tmLanguage.json`.
* `commands`

# Evaluation

# Conclusions

# Appendix

# References

* Grammar naming conventions and layout based on:
    * https://github.com/antlr/grammars-v4/blob/master/javascript/ecmascript/JavaScript/ECMAScript.g4
    * https://github.com/antlr/grammars-v4/blob/master/javascript/javascript/JavaScriptParser.g4
    * https://github.com/antlr/grammars-v4/blob/master/javascript/javascript/JavaScriptLexer.g4

* VSCode Syntax Language file bases on
    * https://github.com/microsoft/vscode/blob/master/extensions/javascript/syntaxes/JavaScript.tmLanguage.json
