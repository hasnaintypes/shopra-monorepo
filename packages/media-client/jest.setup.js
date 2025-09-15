/* eslint-disable no-undef */
/* global console */
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../../../.env.test') });

// Suppress all console.log output during tests
console.log = () => {};
