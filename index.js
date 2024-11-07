import {app, BrowserWindow, ipcMain, dialog, session} from "electron"
import path from "path"
import { fileURLToPath } from 'url';
import ipcHandlers from "./ipcHandlers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let win;
const createWindow = () => {
    win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: true,
        preload: path.join(__dirname, "preload.mjs")
      }
    })
    win.loadFile('index.html')
    // win.removeMenu();
    win.webContents.openDevTools();
}

app.whenReady().then(() => {createWindow() })
  
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

ipcHandlers(win)