import{ contextBridge, ipcRenderer } from "electron";

const navigationFunction = {
    toAnotherPage: (page) => ipcRenderer.send("navigate-to-page", page),
    openWindow: (options)=> ipcRenderer.send("open-window", options),
    loadWindow: (fileName) => ipcRenderer.send("reload-parent-window", fileName)
}

const alertBoxFunction = {
    alertMsg: (message) => ipcRenderer.send("alertBox", message),
    confirmMsg: (message) => ipcRenderer.send("openDialog", message),
    dialogResponse: (message) => ipcRenderer.on("dialogResponse", message),
    confirmMsg2: (message) => ipcRenderer.send("openDialog2", message),
    dialogResponse2: (message) => ipcRenderer.on("dialogResponse2", message),
    confirmMsg3: (message) => ipcRenderer.send("openDialog3", message),
    dialogResponse3: (message) => ipcRenderer.on("dialogResponse3", message)
}

const sharingDataFunction = {
    receiveData: ()=> ipcRenderer.sendSync("passingData"),
    sendData: (data)=> ipcRenderer.send("sendingData", data)
}

const fileSharingFunction = {
    shareFilePath: () => ipcRenderer.sendSync("sharingPath"),
    shareCurrentFile: () => ipcRenderer.sendSync("currentFilePath")
}

const cookieFunction = {
    setCookie: (cookieData)=> ipcRenderer.send("setCookies", cookieData),
    getCookie: () => {
        ipcRenderer.send("getCookies");
        return new Promise((resolve, reject) => {
            ipcRenderer.once("getCookiesResponse", (event, cookies) => {
              resolve(cookies); // Resolve the cookies
            });
          });
    },
    checkCookie: ()=> ipcRenderer.sendSync("checkCookies"),
    signOut: ()=> ipcRenderer.send("clearCookies")
}

const printFunction = {
    printPage: () => ipcRenderer.invoke("printPage")
}

contextBridge.exposeInMainWorld("navigationApi", navigationFunction)
contextBridge.exposeInMainWorld("showMessageApi", alertBoxFunction)
contextBridge.exposeInMainWorld("sharingDataApi", sharingDataFunction)
contextBridge.exposeInMainWorld("cookieApi", cookieFunction)
contextBridge.exposeInMainWorld("imagePaths", fileSharingFunction)
contextBridge.exposeInMainWorld("printApi", printFunction)