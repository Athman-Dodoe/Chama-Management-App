const path = require('path');
const dotenv = require('dotenv');

// Load variables from .env into process.env as early as possible.
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const REQUIRED_ENV_VARS = ['PORT', 'DATABASE_URL'];

const missingEnvVars = REQUIRED_ENV_VARS.filter((name) => !process.env[name]);

if (missingEnvVars.length > 0) {
  const error = new Error(
    `Missing required environment variable(s): ${missingEnvVars.join(', ')}.` + 
    'Copy .env.example to .env and fill in the required values.'
  );
  console.error(`[config] ${error.message}`);
  process.exit(1);
}

const parsedPort = Number.parseInt(process.env.PORT, 10);

if (Number.isNaN(parsedPort)) {
  console.error(`[config] PORT must be a valid number. Received: "${process.env.PORT}"`);
  process.exit(1);
}
const env = Object.freeze({
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parsedPort,
  DATABASE_URL: process.env.DATABASE_URL,

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  MPESA_ENVIRONMENT: process.env.MPESA_ENVIRONMENT || 'sandbox',
  MPESA_CONSUMER_KEY: process.env.MPESA_CONSUMER_KEY || '',
  MPESA_CONSUMER_SECRET: process.env.MPESA_CONSUMER_SECRET || '',
  MPESA_PASSKEY: process.env.MPESA_PASSKEY || '',
  MPESA_SHORTCODE: process.env.MPESA_SHORTCODE || '174379',
  MPESA_C2B_SHORTCODE: process.env.MPESA_C2B_SHORTCODE || '600991',
  MPESA_B2C_SHORTCODE: process.env.MPESA_B2C_SHORTCODE || '600991',
  MPESA_INITIATOR_NAME: process.env.MPESA_INITIATOR_NAME || 'testapi',
  MPESA_INITIATOR_PASSWORD: process.env.MPESA_INITIATOR_PASSWORD || '',
  MPESA_CALLBACK_BASE_URL: process.env.MPESA_CALLBACK_BASE_URL || '',

});

module.exports = env;
