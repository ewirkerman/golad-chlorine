"use strict";

const alert = require("./modules/alert");
const electron = require("electron");
const ipcMain = require("electron").ipcMain;
const path = require("path");
const windows = require("./modules/windows");

let about_message = `Chlorine-Golad: Replay viewer for Golad\n` +
					`--\n` +
					`Electron ${process.versions.electron}\n` +
					`Node ${process.versions.node}\n` +
					`V8 ${process.versions.v8}`

// -------------------------------------------------------

electron.app.on("ready", () => {

	windows.new("renderer", {
		title: "Chlorine", show: true, width: 1200, height: 800, resizable: true, page: path.join(__dirname, "chlorine_renderer.html")
	});

	electron.Menu.setApplicationMenu(make_main_menu());
});

electron.app.on("window-all-closed", () => {
	electron.app.quit();
});

// -------------------------------------------------------

ipcMain.on("renderer_ready", () => {

	// Load a file via command line with -o filename.

	let filename = "";
	for (let i = 0; i < process.argv.length - 1; i++) {
		if (process.argv[i] === "-o") {
			filename = process.argv[i + 1];
		}
	}
	if (filename !== "") {
		windows.send("renderer", "open", filename);
	}

/*
	else if (process.argv.length === 2) {						// Or, if exactly 1 arg, assume it's a filename. Only good for standalone release.
		windows.send("renderer", "open", process.argv[1]);
	}
*/

});

ipcMain.on("relay", (event, msg) => {
	windows.send(msg.receiver, msg.channel, msg.content);		// Messages from one browser window to another...
});

// -------------------------------------------------------

function make_main_menu() {
	const template = [
		{
			label: "File",
			submenu: [
				{
					label: "About...",
					click: () => {
						alert(about_message);
					}
				},
				{
					role: "toggledevtools"
				},
				{
					type: "separator"
				},
				{
					label: "Open...",
					accelerator: "CommandOrControl+O",
					click: () => {
						let files = electron.dialog.showOpenDialog();
						if (files && files.length > 0) {
							windows.send("renderer", "open", files[0]);
						}
					}
				},
				{
					type: "separator"
				},
				{
					accelerator: "CommandOrControl+Q",
					role: "quit"
				},
			]
		},
		{
			label: "Navigation",
			submenu: [
				{
					label: "Forward",
					accelerator: "Right",
					click: () => {
						windows.send("renderer", "forward", 1);
					}
				},
				{
					label: "Back",
					accelerator: "Left",
					click: () => {
						windows.send("renderer", "forward", -1);
					}
				},
				{
					type: "separator"
				},
				{
					label: "Move to Start",
					accelerator: "Home",
					click: () => {
						windows.send("renderer", "forward", -99999);
					}
				},
				{
					label: "Move to End",
					accelerator: "End",
					click: () => {
						windows.send("renderer", "forward", 99999);
					}
				},
				{
					type: "separator"
				},
				{
					label: "Go To Next Event",
					accelerator: "Enter",
					click: () => {
						windows.send("renderer", "go_to_next_event", null);
					}
				},
			]
		},
		{
			label: "View",
			submenu: [
				{
					label: "Births",
					click: () => {
						windows.send("renderer", "toggle", "show_births");
					},
					type: "checkbox",
					checked: true,
				},
				{
					label: "Deaths",
					click: () => {
						windows.send("renderer", "toggle", "show_deaths");
					},
					type: "checkbox",
					checked: true,
				},
			]
		},
	];

	return electron.Menu.buildFromTemplate(template);
}
