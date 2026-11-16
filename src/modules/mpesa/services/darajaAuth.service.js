const axios = require('axios');
const env = require('../../../config/env');

let cachedToken = null;
let tokenExpiresAt = null;

async function getAccessToken() {
    const baseUrl = env.MPESA_ENVIRONMENT === 'production' 
    ? 'https://api.safaricom.co.ke' 
    : 'https://sandbox.safaricom.co.ke';

    if (cachedToken && Date.now() < tokenExpiresAt) {
        return cachedToken;
    }

    const credentials = `${env.MPESA_CONSUMER_KEY}:${env.MPESA_CONSUMER_SECRET}`;
    const authHeader = Buffer.from(credentials).toString('base64');

    try {
        const response = await axios.get(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
            headers: {
                'Authorization': `Basic ${authHeader}`
            },
            timeout: 15000,
        });

        const { access_token: accessToken, expires_in: expiresIn } = response.data;
        
        const ttlSeconds = Number.parseInt(expiresIn, 10);

        const safeTtl = Number.isNaN(ttlSeconds) ? 3599 : ttlSeconds;

        cachedToken = accessToken;
        tokenExpiresAt = Date.now() + (safeTtl - 300) * 1000;

        if (env.NODE_ENV === 'development'){
            console.log(`[DarajaAuthService] Fresh token generated, valid for ${safeTtl} seconds`);
        }

        return accessToken;

    } catch (error) {
        if (error.response) {
            console.error(`[DarajaAuth] Safaricom responded with ${error.response.status}:`, error.response.data);
        } else {
            console.error(`[DarajaAuth] Network error: ${error.code || error.message}`);

        }
        throw new Error(`Failed to retrieve Daraja access token: ${error.message}`,  { cause: error });
    }
}

module.exports = { getAccessToken };

