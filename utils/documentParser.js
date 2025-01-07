// utils/documentParser.js
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

const parsePDF = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
};

const parseWord = async (filePath) => {
  const data = await mammoth.extractRawText({ path: filePath });
  return data.value;
};

const parseDocument = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".pdf") {
    return await parsePDF(filePath);
  } else if (ext === ".docx" || ext === ".doc") {
    return await parseWord(filePath);
  } else {
    throw new Error("Unsupported file type");
  }
};

module.exports = { parseDocument };
