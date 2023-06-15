const { app, BrowserWindow } = require('electron');
const updater = require('electron-updater');
const url = require('url');
let mainWindow;
const createWindow = () => {
    mainWindow = new BrowserWindow({
        height: 300,
        width: 300,
    });
    console.log('new Created');
    mainWindow.loadFile(
        url.format({
            pathname: path.join(__dirname, 'Routing.html'),
            protocol: 'file:',
            slashes: true,
        })
    );
};
app.whenReady(() => {
    createWindow();
});
