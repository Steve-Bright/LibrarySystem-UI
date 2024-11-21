import{ contextBridge, ipcRenderer } from "electron";

const navigationFunction = {
    toAnotherPage: (page) => ipcRenderer.send("navigate-to-page", page),
}

const alertBoxFunction = {
    alertMsg: (message) => ipcRenderer.send("alertBox", message)
}

const sharingDataFunction = {
    receiveData: ()=> ipcRenderer.sendSync("passingData"),
    sendData: (data)=> ipcRenderer.send("sendingData", data)
}

const fileSharingFunction = {
    shareFilePath: () => ipcRenderer.sendSync("sharingPath")
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

contextBridge.exposeInMainWorld("navigationApi", navigationFunction)
contextBridge.exposeInMainWorld("showMessageApi", alertBoxFunction)
contextBridge.exposeInMainWorld("sharingDataApi", sharingDataFunction)
contextBridge.exposeInMainWorld("cookieApi", cookieFunction)
contextBridge.exposeInMainWorld("imagePaths", fileSharingFunction)