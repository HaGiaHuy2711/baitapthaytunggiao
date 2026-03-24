const xlsx = require('xlsx');
const path = require('path');

function readUserExcel() {
  const filePath = path.join(process.cwd(), 'storage', 'imports', 'user.xlsx');

  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  const data = xlsx.utils.sheet_to_json(worksheet);

  return data;
}

module.exports = {
  readUserExcel
};