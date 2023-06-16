const { app, BrowserWindow } = require('electron');
const updater = require('electron-updater');
const path = require('path');
const url = require('url');
const { autoUpdater, AppUpdater } = require('electron-updater');
const log = require('electron-log');

//Basic flags
const userDataPath = app.getPath('userData');
autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;
autoUpdater.autoRunAppAfterInstall = true;

log.transports.file.resolvePath = () =>
    path.join(userDataPath, '/logs/main.log');
console.log(userDataPath, '/logs/main.log');

log.transports.file.format = `${new Date().toLocaleString()} > {level} : {text}`;

// autoUpdater
let mainWindow;
const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 700,
        height: 700,
        fullscreenable: true,
        resizable: false,
        // frame: false,
        movable: true,
        minimizable: true,
        maximizable: false,
        // closable: false,
        // hide app window (for stealth  mode)
        // show: true,
        show: true,
        // disable app icon on windows task bar (for stealth mode)
        skipTaskbar: false,
        webPreferences: {
            allowDisplayingInsecureContent: true,
            webSecurity: false,
            nodeIntegration: true,
            enableRemoteModule: true,
            // preload: path.join(__dirname, 'preload.js'),
            // will break on electron v12
            contextIsolation: false,
            backgroundThrottling: true,
        },
    });
    logger(userDataPath, '/logs/main.log');

    autoUpdater.checkForUpdates();
    mainWindow.loadFile('view.html');
};
// @info:- Quit when all windows are closed.
app.on('window-all-closed', function () {
    // * On OS X it is common for applications and their menu bar to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
        // if (mainWindow && mainWindow.webContents) {
        //     mainWindow.webContents.executeJavaScript(`localStorage.clear()`);
        // }
    }
});

app.on('activate', function () {
    // * On OS X it's common to re-create a window in the app when the dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});

autoUpdater.on('update-available', (info) => {
    console.log(`Update available. Current version ${app.getVersion()}`);
    log.info(`Update available. Current version ${app.getVersion()}`);
    log.info('line:65 ' + JSON.stringify(info));
    autoUpdater.downloadUpdate();
});

autoUpdater.on('update-not-available', (info) => {
    console.log(`No update available. Current version ${app.getVersion()}`);
    log.info(`No update available. Current version ${app.getVersion()}`);
    log.info('line:71 ' + JSON.stringify(info));
});

/*Download Completion Message*/
autoUpdater.on('update-downloaded', (info) => {
    console.log(`Update downloaded. Current version ${app.getVersion()}`);
    log.info(`Update downloaded. Current version ${app.getVersion()}`);
    log.info('line:77 ' + JSON.stringify(info));
    autoUpdater.quitAndInstall();
});

autoUpdater.on('download-progress', (progressObj) => {
    let log_message = 'Download speed: ' + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message =
        log_message +
        ' (' +
        progressObj.transferred +
        '/' +
        progressObj.total +
        ')';
    log.info(log_message);
});

autoUpdater.on('error', (info) => {
    console.log(info);
    log.info(JSON.stringify(info));
});

function logger(s) {
    console.log('Logger', s);
    if (mainWindow && mainWindow.webContents) {
        mainWindow.webContents.executeJavaScript(`console.log("${s}")`);
    }
}

app.on('ready', () => {
    createWindow();
});
