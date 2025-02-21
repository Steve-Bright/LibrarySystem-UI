import {app, BrowserWindow, ipcMain, dialog, session} from "electron"
import NRCData from "./assets/nrc.json" with {type: "json"}
import path from "path"
import { fileURLToPath } from 'url';
import ipcHandlers from "./ipcHandlers.js";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let win;
const createWindow = () => {
    win = new BrowserWindow({
      minWidth: 930,
      icon: __dirname + "/assets/rcs_app_logo.png",
      title: "RCS Library Management System",
      // width: 800,
      // height: 600,
      // titleBarStyle: 'hidden', // or 'hiddenInset' if you want a slimmer title bar
      // frame: false,             // This removes the default frame, making it non-resizable.
      // resizable: false  ,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: true,
        preload: path.join(__dirname, "preload.mjs")
      }
    })
    // win.webContents.enableDeviceEmulation()
    win.maximize()
    win.loadFile('./dashboard/index.html')
    // win.removeMenu();
    win.webContents.openDevTools();
}

app.whenReady().then(() => {createWindow() })
  
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})


  ipcMain.on("open-window", (event, arg) => {
    let fileName = arg.fileName;
    let windowFeatures = arg.windowFeatures
    let windowName = arg.name;
    const newWindow = new BrowserWindow({
      ...windowFeatures,
      webPreferences: {
        nodeIntegration: true, // If needed
        contextIsolation: true, // If using nodeIntegration
        preload: path.join(__dirname, "preload.mjs")
      },
    })
    newWindow.loadFile(fileName)
    // window.open(fileName, windowName, windowFeatures)
  })

  ipcMain.on("reload-parent-window", (event, htmlFile) => {
      const currentWindow = win;
      console.log("this should work " + path.join(__dirname, htmlFile))
      console.log("focused window " + currentWindow)
      currentWindow.loadFile(path.join(__dirname, htmlFile))
    })

ipcHandlers(win)

export default win;