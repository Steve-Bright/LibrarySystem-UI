import {app, BrowserWindow, ipcMain, dialog} from "electron"
import path from "path"
import { fileURLToPath } from 'url';

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

ipcMain.on('navigate-to-page', (event, page) => {
  win = BrowserWindow.getFocusedWindow()
  win.loadFile(path.join(__dirname, page))
});

let sharedData; 

ipcMain.on("sendingData", (event, data) => {
  sharedData = data;
})


ipcMain.on("passingData", (event, args) => {
  event.returnValue = sharedData
})


ipcMain.on("alertBox", (event, message) => {
  win = BrowserWindow.getFocusedWindow();
  dialog.showMessageBoxSync(win, {message: message})
})