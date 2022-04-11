# hoshie-lang
_A new data centric programming language._

## Developing on Windows

Run from inside windows environment. Wsl will be invoked as necessary to prepare and run files.

1. Install [NodeJS v14.x.x](https://nodejs.org/en/download/)
2. Install WSL2 + Ubuntu-20.04
3. `git clone git@github.com:AlexSmith/hoshie-lang.git`
4. `cd hoshie-lang`
5. `npm install`
6. `npm run install-deps`
7. Open folder in vscode
8. Run build task:  `Ctrl + Shift + B`
9. Select "Extension" as the target launch configuration
10. Launch debug session:  `F5`

## Packaging and installing a release

```
npm install
npm run clean
npm run build
npm run vsce-package
npm run vsce-install
```

## Usage

Source code (Left) will launch the VSCode Extension (Right) after setup steps 8, 9 and 10.

From inside the extension insatnce (Right), F5 will compile and run the .ho files.
This should be complete with syntax highlighting with output in the Debug Console.
![image](https://user-images.githubusercontent.com/32247584/161601091-2827e051-e787-4227-a165-2dc155ba52e3.png)
