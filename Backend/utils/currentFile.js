const fs = require('fs');
let currentFile = '';

const setCurrentFile = (value) => {
  currentFile = value;
}

const getCurrentFile = () => {
  return currentFile;
}

const sendData = (req, res) => {
  const pdfFilePath = getCurrentFile();
  const pdfFileData = fs.readFileSync(pdfFilePath);
  const base64Data = pdfFileData.toString('base64');
  const str = String(base64Data)
  const dataUri = `data:application/pdf; base64, ${str}`;
  res.json(dataUri);
}

module.exports = {
  setCurrentFile,
  getCurrentFile,
  sendData,
};