import {app, BrowserWindow, ipcMain, dialog, session} from "electron"
import NRCData from "./assets/nrc.json" with {type: "json"}
import path from "path"
import { fileURLToPath } from 'url';
import ipcHandlers from "./ipcHandlers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let win;
const createWindow = () => {
    win = new BrowserWindow({
      minWidth: 930,
      icon: __dirname + "/rcs_app_logo.ico",
      title: "RCS Library Management System",
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
      currentWindow.loadFile(path.join(__dirname, htmlFile))
    })

ipcHandlers(win)

export default win;