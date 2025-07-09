const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const HID = require('node-hid');
const fs = require('fs');

let mainWindow;

function createWindow() {
 mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // Enable Node.js integration
      contextIsolation: false, // Disable context isolation for compatibility
    },
  });

  // Load the Angular app (assuming it's built and served)
  mainWindow.loadURL(
    process.env.NODE_ENV === "development"
      ? "http://localhost:3336" // Angular dev server
      : `file://${__dirname}/dist/electron-scanner-app/browser/index.html`
    // Built Angular app
  );

  // Open DevTools in development mode
  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC to handle scanning
ipcMain.on("start-scanning", (event) => {
  const devices = HID.devices();
  const scanner = new HID.HID(devices[0].path); // Replace with your scanner's path

  scanner.on("data", (data) => {
    // Check for a specific signal indicating scanning completion
    if (data[0] === 1) {
      // Example condition
      console.log("Scanning completed");
      handleScannedData(event);
    }
  });
});

function handleScannedData(event) {
  const scannedFilePath = "path/to/scanned_image.png"; // Path to the scanned image
  const pdfPath = createPDF(scannedFilePath);
  const fileName = path.basename(pdfPath);
  const fileSize = fs.statSync(pdfPath).size;

  // Send file data back to Angular
  event.reply("scanning-complete", { fileName, fileSize, pdfPath });
}

function createPDF(imagePath) {
  const doc = new PDFDocument();
  const pdfPath = "output.pdf";

  doc.pipe(fs.createWriteStream(pdfPath));
  doc.image(imagePath, 0, 0, { width: 600 });
  doc.end();

  console.log(`PDF created at: ${pdfPath}`);
  return pdfPath;
}

