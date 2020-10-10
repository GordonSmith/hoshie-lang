# Hoshie Lang

_A new data centric programming language._

The goal of this project is to create a new data centric programming language with the following features:
* A pure functional language
* All data will be immutable by default
* Syntax design to encourage / simplify the design of “Data Pipelines” or “Data Processes” (a chain of activities - project,  filter etc.) 
* IDE support
* Pluggable code generators targeting:
    * TypeScript / JavaScript 
    * Python 	(stretch goal)
    * Wasm (stretch goal)
* Runtime environments:
    * Small Data:  JS in Web Browser
    * Medium Data:  JS in NodeJS or Deno
    * Large Data:  Serverless “Azure Functions” on Azure or “Lambda Functions” on AWS (stretch goal)

## Technologies:

* Antlr for compiler work
* VS Code Extensions for IDE Support
* TypeScript / JavaScript / Python / Wasm
* NodeJS / Deno
* Ramda
* Azure Functions
* AWS Lambda Functions

## Comments
I plan on keeping the syntax of the language relatively small but including a comprehensive standard library of “activities” modelled on established functional libraries (like Ramda).

Being a pure functional language means it will be relatively easy to scale and run on parallel systems. 

Further if each functional activity is modelled on a pattern like Azure Serverless Functions, the code generator will be able to create “pipelines” in the cloud, which will allow for adhoc parallelism based on data sizes (stretch goal).
