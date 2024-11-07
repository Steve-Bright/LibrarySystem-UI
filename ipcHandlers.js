// ipcHandlers.js
import { ipcMain, dialog, session, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from 'url';
import { mainWebsite } from "./utils/links.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let sharedData;

export default function setupIpcHandlers(win) {
  ipcMain.on("navigate-to-page", (event, page) => {
    const currentWindow = win || BrowserWindow.getFocusedWindow();
    currentWindow.loadFile(path.join(__dirname, page));
  });

  ipcMain.on("sendingData", (event, data) => {
    sharedData = data;
  });

  ipcMain.on("passingData", (event, args) => {
    event.returnValue = sharedData;
  });

  ipcMain.on("alertBox", (event, message) => {
    const currentWindow = win || BrowserWindow.getFocusedWindow();
    dialog.showMessageBoxSync(currentWindow, { message: message });
  });

  ipcMain.on("setCookies", (event, data) => {
    const cookie = { url: mainWebsite, name: "token", value: data, expirationDate: (Date.now() / 1000) + (7 * 24 * 60 * 60), httpOnly: true, secure: false};
    session.defaultSession.cookies
      .set(cookie)
      .then(() => {
        console.log("Cookie is successfully set");
      })
      .catch((error) => {
        console.error(error);
      });
  });

  ipcMain.on("checkCookies", (event, data) => {
    session.defaultSession.cookies
      .get({ url: mainWebsite, name: "token" })
      .then((cookies) => {
        if(cookies.length === 0){
            event.returnValue = { statusCode: 403}
        }else{
            console.log("This is the cookie " + JSON.stringify(cookies))
            event.returnValue = { statusCode: 200}
        }
      })
      .catch((error) => {
        console.error(error);
      });
  });

  ipcMain.on("clearCookies", (event, data) => {
    session.defaultSession.cookies
      .remove(mainWebsite, "token")
      .then((returnData) => {
        console.log("user has successfully logged out " + returnData)
      })
      .catch((error) => {
        console.error(error);
      });
  });
}
