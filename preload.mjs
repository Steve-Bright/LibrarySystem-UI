import{ contextBridge, ipcRenderer } from "electron";

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("windowapi", {
    sendMessage: (channel, page) => ipcRenderer.send('navigate-to-page', "signIn.html")
})
