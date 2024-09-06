const {ipcRenderer, contextBridge} = require('electron')
const ValidSendC = ["DATA_TO_MAIN"]
const ValidReceiveC = ["DATA_FROM_MAIN"]
/**
 * The preload script runs before. It has access to web APIs
 * as well as Electron's renderer process modules and some
 * polyfilled Node.js functions.
 * 
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */
contextBridge.exposeInMainWorld("API",{
    send:(chl,data) =>{
        if (ValidSendC.includes(chl)){
            ipcRenderer.send(chl,data)
        }
    },
    receive:(chl, func)=>{
        if (ValidReceiveC.includes(chl)){
            ipcRenderer.on(chl,(event, ...args) => func(...args))
        }
    }
})
window.addEventListener('DOMContentLoaded', () => {
    
})
