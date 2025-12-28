const KHALTI_CONFIG = {
  BASE_URL: "https://dev.khalti.com/api/v2/epayment",
  SECRET_KEY: process.env.KHALTI_SECRET_KEY || "1867144249c744d3ba060c7de1348c98",
  WEBSITE_URL: process.env.WEBSITE_URL || "http://localhost:8000",
  TIMEOUT: 15000,
  MAX_RETRIES: 3,
};

module.exports = KHALTI_CONFIG;