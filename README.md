# hoshie-lang
_A new data centric programming language._

## Developing on Windows

1. Install [NodeJS v14.x.x](https://nodejs.org/en/download/)
2. Install WSL2 + Ubuntu-20.04
3. `git clone git@github.com:AlexSmith/hoshie-lang.git`
4. `cd hoshie-lang`
5. `npm install`
6. `npm run install-deps`
7. Open folder in vscode
8. Run build task:  `Ctrl + Shift + B`
9. Launch debug session:  `F5`

## Publishing a release

```
npm install
npm run clean
npm run build
npm run vsce-package
npm run vsce-install
```