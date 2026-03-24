const { readUserExcel } = require('../../../shared/helpers/excel-reader.helper');
const { generateRandomPassword } = require('./password-generator.service');
const { hashPassword } = require('../../../shared/helpers/hash.helper');
const { sendAccountEmail } = require('./user-mail.service');

async function importUsersFromExcel() {
  const excelData = readUserExcel();

  const results = [];

  for (const user of excelData) {
    try {
      const plainPassword = generateRandomPassword(16);
      const hashedPassword = await hashPassword(plainPassword);

      await sendAccountEmail(user.email, user.username, plainPassword);

      results.push({
        username: user.username,
        email: user.email,
        plainPassword,
        hashedPassword,
        role: 'user',
        status: 'success'
      });
    } catch (error) {
      results.push({
        username: user.username,
        email: user.email,
        role: 'user',
        status: 'failed',
        error: error.message
      });
    }
  }

  const successCount = results.filter((item) => item.status === 'success').length;
  const failedCount = results.filter((item) => item.status === 'failed').length;

  return {
    total: results.length,
    successCount,
    failedCount,
    results
  };
}

module.exports = {
  importUsersFromExcel
};