const { app, BrowserWindow, ipcMain } = require('electron')

let win, player = null;

let isMinimized = false;

function createWindow () {
    //create main window
    win = new BrowserWindow({
        width: 500,
        height: 180,
        webPreferences: {
            nodeIntegration: true
        },
        alwaysOnTop: false,
        frame: false
    })

    win.loadFile('./src/ressources/index.html')

    //create player window
    player = new BrowserWindow({
        width: 480,
        height: 270,
        webPreferences: {
            nodeIntegration: true
        },
        alwaysOnTop: true,
        frame: false,
        show: false
    })

    player.loadFile('./src/ressources/player.html')
}

app.whenReady().then(createWindow)

ipcMain.on('play', (event, arg) => {
    win.hide();
    player.webContents.send("url", arg);
    player.show();
})

ipcMain.on('quit', (event, arg) => {
    console.log("qui")
    app.quit()
})

ipcMain.on("closePlayer", (event, arg) => {
    win.webContents.send("status", false);
    isMinimized = false;
    player.hide();
    win.show();
})

ipcMain.on("minimize", (event, arg) => {
    isMinimized = true;
    win.webContents.send("status", true);
    player.hide();
    win.show();
})

ipcMain.on("reopen", () => {
    if(isMinimized){
        win.hide();
        player.show();
    }
})