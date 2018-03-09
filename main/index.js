const { app, ipcMain } = require('electron')

const store = require('./store')
const signers = require('./signers')
const windows = require('./windows')

let quit = false

require('./rpc')

console.log(process.versions.chrome)
console.log(process.versions.electron)

ipcMain.on('addPermission', (e, host, permission) => store.addPermission(host, permission))
ipcMain.on('removePermission', (e, host, permission) => store.removePermission(host, permission))

app.on('ready', () => {
  windows.tray()
  process.env.TRAY_ONLY ? app.dock.hide() : windows.create()
})

app.on('activate', () => {
  quit = false
  windows.activate()
})

app.on('will-quit', e => {
  if (!quit) e.preventDefault()
  app.dock.hide()
  setTimeout(() => {
    quit = true
    app.quit()
  }, 3000)
})

app.on('quit', signers.close)

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() })
