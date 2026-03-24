const express = require('express');
const { readUserExcel } = require('./shared/helpers/excel-reader.helper');
const { generateRandomPassword } = require('./modules/users/services/password-generator.service');
const { hashPassword } = require('./shared/helpers/hash.helper');
const { sendAccountEmail } = require('./modules/users/services/user-mail.service');
const { importUsersFromExcel } = require('./modules/users/services/user-import.service');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'import-user-excel-mailtrap is running'
  });
});

app.get('/test-read-excel', (req, res) => {
  try {
    const data = readUserExcel();

    res.json({
      total: data.length,
      data
    });
  } catch (error) {
    res.status(500).json({
      message: 'Read excel failed',
      error: error.message
    });
  }
});

app.get('/test-generate-users', (req, res) => {
  try {
    const data = readUserExcel();

    const users = data.map((user) => ({
      username: user.username,
      email: user.email,
      password: generateRandomPassword(16),
      role: 'user'
    }));

    res.json({
      total: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      message: 'Generate users failed',
      error: error.message
    });
  }
});

app.get('/test-hash-users', async (req, res) => {
  try {
    const data = readUserExcel();

    const users = await Promise.all(
      data.map(async (user) => {
        const plainPassword = generateRandomPassword(16);
        const hashedPassword = await hashPassword(plainPassword);

        return {
          username: user.username,
          email: user.email,
          plainPassword,
          hashedPassword,
          role: 'user'
        };
      })
    );

    res.json({
      total: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      message: 'Hash users failed',
      error: error.message
    });
  }
});

app.get('/test-send-mail', async (req, res) => {
  try {
    const data = readUserExcel();

    if (!data.length) {
      return res.status(400).json({
        message: 'No user data found in excel file'
      });
    }

    const firstUser = data[0];
    const plainPassword = generateRandomPassword(16);

    const mailResult = await sendAccountEmail(
      firstUser.email,
      firstUser.username,
      plainPassword
    );

    res.json({
      message: 'Send mail successfully',
      user: {
        username: firstUser.username,
        email: firstUser.email,
        plainPassword,
        role: 'user'
      },
      mailResult
    });
  } catch (error) {
    res.status(500).json({
      message: 'Send mail failed',
      error: error.message
    });
  }
});

app.get('/import-users', async (req, res) => {
  try {
    const result = await importUsersFromExcel();

    res.json({
      message: 'Import users completed',
      ...result
    });
  } catch (error) {
    res.status(500).json({
      message: 'Import users failed',
      error: error.message
    });
  }
});

module.exports = app;