import {app, BrowserWindow, ipcMain} from "electron"
import path from "path"
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createWindow = () => {
    const win = new BrowserWindow({
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
    // win.webContents.openDevTools();
  }

  app.whenReady().then(() => {createWindow() })
  console.log(__dirname)
  
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('navigate-to-page', (event, page) => {
  let win = BrowserWindow.getFocusedWindow()
  win.loadFile(path.join(__dirname, "auth/signIn.html"))
  // mainWindow.webContents.loadURL(`file://${__dirname}/auth/${page}`);
});

const goToAnotherPage = () => {
  
}