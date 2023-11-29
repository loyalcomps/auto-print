const FileSystem = require('fs');
const path = require('path');
const { print } = require('pdf-to-printer');

const watchFolder = './watch'; // Folder to watch for new PDF files
const doneFolder = './done'; // Folder to move printed files

// Ensure watch and done folders exist
FileSystem.mkdirSync(watchFolder, { recursive: true });
FileSystem.mkdirSync(doneFolder, { recursive: true });

// Function to print and move file
async function printAndMoveFile(file) {
  try {
    const filePath = path.join(watchFolder, file);
    await print(filePath);
    console.log(`Printed ${file}`);

    const targetPath = path.join(doneFolder, file);
    FileSystem.renameSync(filePath, targetPath);
    console.log(`Moved ${file} to 'done' folder`);
  } catch (error) {
    console.error(`Error handling ${file}:`, error);
  }
}

// Watch for new files in the folder
FileSystem.watch(watchFolder, (eventType, filename) => {
  if (eventType === 'rename' && filename.endsWith('.pdf')) {
    console.log(`New file detected: ${filename}`);
    printAndMoveFile(filename);
  }
});

console.log(`Watching for files in '${watchFolder}'...`);
