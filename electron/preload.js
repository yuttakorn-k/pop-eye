const { contextBridge, ipcRenderer } = require("electron");

// expose API เฉพาะที่ frontend ใช้ได้
contextBridge.exposeInMainWorld("electronAPI", {
  printOrder: (orderData) => ipcRenderer.send("print-order", orderData),
  onPrintComplete: (callback) => ipcRenderer.on("print-complete", callback),
  getAppVersion: () => ipcRenderer.invoke("get-app-version")
});
