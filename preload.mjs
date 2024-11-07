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

const cookieFunction = {
    setCookie: (cookieData)=> ipcRenderer.send("setCookies", cookieData),
    checkCookie: ()=> ipcRenderer.sendSync("checkCookies"),
    signOut: ()=> ipcRenderer.send("clearCookies")
}

contextBridge.exposeInMainWorld("navigationApi", navigationFunction)
contextBridge.exposeInMainWorld("showMessageApi", alertBoxFunction)
contextBridge.exposeInMainWorld("sharingDataApi", sharingDataFunction)
contextBridge.exposeInMainWorld("cookieApi", cookieFunction)