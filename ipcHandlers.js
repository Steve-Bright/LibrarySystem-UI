// ipcHandlers.js
import { ipcMain, dialog, session, BrowserWindow } from "electron";
import path from "path";
import os from "os"
import JsBarCode from "jsbarcode"
import { fileURLToPath } from 'url';
import { mainWebsite } from "./utils/links.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let sharedData;

// const kayinGyiDirectory = os.homedir() + "/KayinGyi/";
// const kayinGyiBooks = kayinGyiDirectory + "books/";
// const kayinGyiMembers = kayinGyiDirectory + "members/"

export default function setupIpcHandlers(win) {
  ipcMain.on("navigate-to-page", (event, page) => {
    const currentWindow = win || BrowserWindow.getFocusedWindow();
    currentWindow.loadFile(path.join(__dirname, page));
  });

  ipcMain.on("sendingData", (event, data) => {
    sharedData = data;
  });

  ipcMain.on("sharingPath", (event, data) => {
    event.returnValue = os.homedir();
  })

  ipcMain.on("passingData", (event, args) => {
    event.returnValue = sharedData;
  });

  ipcMain.on("alertBox", (event, message) => {
    const currentWindow = win || BrowserWindow.getFocusedWindow();
    dialog.showMessageBoxSync(currentWindow, { message: message });
  });

  ipcMain.on("openDialog", (event, message) =>{
    const currentWindow = win || BrowserWindow.getFocusedWindow();
    dialog.showMessageBox(currentWindow, 
      {message: message,
        buttons: ["yes", "no"]
      })
  .then((result) => {
    try{
      // console.log("this is the result: " + JSON.stringify(result))
      event.sender.send("dialogResponse", result.response);
    }catch(error){
      // console.log("error in openDialog ipcMain: " + error)
    }
  })})

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

  ipcMain.on("getCookies", (event, data) => {
    session.defaultSession.cookies.get({url: mainWebsite, name: "token"})
      .then((cookies) => {
        event.reply("getCookiesResponse", cookies);
      })
    
  })

  ipcMain.on("checkCookies", (event, data) => {
    session.defaultSession.cookies
      .get({ url: mainWebsite, name: "token" })
      .then((cookies) => {
        if(cookies.length === 0){
            event.returnValue = { statusCode: 403}
        }else{
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

  ipcMain.on("printPage", (event, data) => {
      let currentWindow = win || BrowserWindow.getFocusedWindow();
      let options = {
        silent: false,
        printBackground: true,
        color: false,
        margin: {
            marginType: 'printableArea'
        },
        landscape: false,
        pagesPerSheet: 1,
        collate: false,
        copies: 1,
        header: 'Header of the Page',
        footer: 'Footer of the Page'
    }
    
      currentWindow.webContents.print(options, (success, errorType) => {
        if (!success) console.error(errorType);
        console.log("print initiated")
      });
      
  })
}
