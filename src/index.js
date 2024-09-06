const { app, BrowserWindow,Menu,dialog,ipcMain } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}
let mainWindow;
const createWindow = () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        }
    });

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, '/front/index.html'));

    // Open the DevTools.
    let menu = Menu.buildFromTemplate([]);
    //Menu.setApplicationMenu(menu);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow();
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});


ipcMain.on("DATA_TO_MAIN",async (event,args)=>{
    if (args.type == "LOAD_JSON"){
        dialog.showOpenDialog({defaultPath:"./../saves/",filters:[{name:"JSON",extensions:['json']}], properties:['openFile']}).then(async res=>{
            if (!res.canceled){
                try{
                    let file = await fs.readFileSync(res.filePaths[0],'utf-8');
                    let obj = JSON.parse(file);
                    mainWindow.webContents.send("DATA_FROM_MAIN",{type:"LOAD_JSON",json:obj});
                }
                catch(e){
                    console.error(e);
                }
            }
        })
    }
    if (args.type == "SAVE_JSON"){
        dialog.showSaveDialog({defaultPath:"./../saves/",filters:[{name:"JSON",extensions:['json']}]}).then(async res=>{
            if (!res.canceled){
                try{
                    let saveFile = JSON.stringify({stats:args.stats,values:args.values});
                    fs.writeFileSync(res.filePath,saveFile);
                }
                catch(e){
                    console.error(e);
                }
            }
        })
    }
    if (args.type == "SAVE_TEMPLATE"){
        dialog.showSaveDialog({defaultPath:"./../templates/",filters:[{name:"JSON",extensions:['json']}]}).then(async res=>{
            if (!res.canceled){
                try{
                    let saveFile = JSON.stringify({stats:args.stats});
                    fs.writeFileSync(res.filePath,saveFile);
                }
                catch(e){
                    console.error(e);
                }
            }
        })
    }
    if (args.type == "LOAD_TEMPLATE"){
        dialog.showOpenDialog({defaultPath:"./../templates/",filters:[{name:"JSON",extensions:['json']}], properties:['openFile']}).then(async res=>{
            if (!res.canceled){
                try{
                    let file = await fs.readFileSync(res.filePaths[0],'utf-8');
                    let obj = JSON.parse(file);
                    mainWindow.webContents.send("DATA_FROM_MAIN",{type:"LOAD_TEMPLATE",json:obj});
                }
                catch(e){
                    console.error(e);
                }
            }
        })
    }
    if (args.type == "SAVE_TXT"){
        dialog.showSaveDialog({defaultPath:"./../",filters:[{name:"TEXT",extensions:['txt']}]}).then(async res=>{
            if (!res.canceled){
                try{
                    let saveFile = `Персонаж: N\n`;
                    let c = 0;
                    args.stats.forEach(stat=>{
                        saveFile+=`${stat.name}: ${args.values[c]}\n`;
                        c++;
                    })
                    fs.writeFileSync(res.filePath,saveFile);
                }
                catch(e){
                    console.error(e);
                }
            }
        })
    }
})

//window.API.send("DATA_TO_MAIN",{type:"PAGE_SWITCH",page:event.target.getAttribute('page')})