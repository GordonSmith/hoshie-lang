# Title Page

# Abstract

# Declaration

# Acknowledgements

# Table of Contents

# Introduction

# Analysis

# Design

## IDE Integration

# Implementation

## IDE Integration
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
