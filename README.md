# Chlorine-Golad
Replay viewer for Golad, in JavaScript (Electron).

# Installation

If you have npm and [Electron](https://electron.atom.io/) installed globally, you can do:

```
npm install
electron .
```

If you only have npm, and don't want to install Electron globally, I'm told the following works instead:

```
npm install
npm install electron --save-dev --save-exact
./node_modules/.bin/electron .
```

# Usage

Open a file from the menu, or via command line with `electron . -o filename.json`. Drag-and-dropping a file onto the window may also work. Once a file is opened, navigate with left and right arrow keys.
