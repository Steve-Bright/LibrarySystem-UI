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

console.log("current file name " + __filename + " and dir name " + __dirname)

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
  
  ipcMain.on("currentFilePath", (event, data) => {
    event.returnValue = __dirname;
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

  ipcMain.on("openDialog2", (event, message) =>{
    const currentWindow = win || BrowserWindow.getFocusedWindow();
    dialog.showMessageBox(currentWindow, 
      {message: message,
        buttons: ["yes", "no"]
      })
  .then((result) => {
    try{
      // console.log("this is the result: " + JSON.stringify(result))
      event.sender.send("dialogResponse2", result.response);
    }catch(error){
      // console.log("error in openDialog ipcMain: " + error)
    }
  })})

  ipcMain.on("openDialog3", (event, message) =>{
    const currentWindow = win || BrowserWindow.getFocusedWindow();
    dialog.showMessageBox(currentWindow, 
      {message: message,
        buttons: ["yes", "no"]
      })
  .then((result) => {
    try{
      // console.log("this is the result: " + JSON.stringify(result))
      event.sender.send("dialogResponse3", result.response);
    }catch(error){
      // console.log("error in openDialog ipcMain: " + error)
    }
  })})

  // ipcMain.on("openDialog", (event, dialogOptions) => {
  //   try {
  //     const currentWindow = win || BrowserWindow.getFocusedWindow();
  
  //     // Use dialogOptions to dynamically set the dialog properties
  //     dialog
  //       .showMessageBox(currentWindow, {
  //         type: dialogOptions.type || "info", // Default type is 'info'
  //         title: dialogOptions.title || "Confirm", // Default title
  //         message: dialogOptions.message || "Are you sure?", // Default message
  //         buttons: dialogOptions.buttons || ["Yes", "No"], // Default buttons
  //         defaultId: dialogOptions.defaultId || 0, // Default selected button
  //         cancelId: dialogOptions.cancelId || 1, // Default cancel button
  //         detail: dialogOptions.detail || "", // Additional details if any
  //       })
  //       .then((result) => {
  //         event.sender.send(dialogOptions.responseChannel || "dialogResponse", result.response); // Dynamic response channel
  //       });
  //   } catch (error) {
  //     console.error("Error in openDialog ipcMain:", error);
  //     event.sender.send(dialogOptions.responseChannel || "dialogResponse", { error: error.message });
  //   }
  // });
  

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

  ipcMain.handle("printPage", async (event, data) => {
      let currentWindow = win || BrowserWindow.getFocusedWindow();
      let options = {
        silent: false,
        printBackground: true,
    }
    
      currentWindow.webContents.print(options, (success, errorType) => {
        if (!success) console.error(errorType);
      });
      
  })
}
