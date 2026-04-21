const axios = require("axios");

const buildBaseUrl = () =>
  String(process.env.KHALTI_BASE_URL || "https://dev.khalti.com/api/v2/epayment").replace(/\/+$/, "");

const shouldLogKhalti = () => String(process.env.KHALTI_DEBUG_LOGS || "true").toLowerCase() !== "false";

const normalizeEndpoint = (path) => String(path || "").replace(/^\/+/, "");

const logKhaltiAttempt = (url, endpoint, body, attempt = 1) => {
  if (!shouldLogKhalti()) {
    return;
  }

  console.log(`Khalti API attempt ${attempt}: ${url}`, {
    endpoint,
    data: body,
  });
};

const logKhaltiSuccess = (url, endpoint, payload, attempt = 1) => {
  if (!shouldLogKhalti()) {
    return;
  }

  console.log(`Khalti API success ${attempt}: ${url}`, {
    endpoint,
    data: payload,
  });
};

const logKhaltiFailure = (url, endpoint, status, payload, attempt = 1) => {
  if (!shouldLogKhalti()) {
    return;
  }

  console.error(`Khalti API failed ${attempt}: ${url}`, {
    endpoint,
    status,
    data: payload,
  });
};

const extractErrorMessage = (payload) => {
  if (!payload) {
    return "Khalti request failed";
  }

  if (typeof payload.detail === "string") {
    return payload.detail;
  }

  if (typeof payload.message === "string") {
    return payload.message;
  }

  if (Array.isArray(payload.detail)) {
    return payload.detail.join(", ");
  }

  return "Khalti request failed";
};

const callKhalti = async (path, body) => {
  if (!process.env.KHALTI_SECRET_KEY) {
    throw new Error("Khalti is not configured");
  }

  const endpoint = normalizeEndpoint(path);
  const url = `${buildBaseUrl()}/${endpoint}`;
  const attempt = 1;

  logKhaltiAttempt(url, endpoint, body, attempt);

  try {
    const response = await axios.post(url, body, {
      headers: {
        Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      timeout: 15000,
    });

    logKhaltiSuccess(url, endpoint, response.data, attempt);
    return response.data;
  } catch (error) {
    const payload = error.response?.data;
    logKhaltiFailure(url, endpoint, error.response?.status, payload, attempt);
    throw new Error(extractErrorMessage(payload));
  }
};

const initiateKhaltiPayment = async ({
  amount,
  purchaseOrderId,
  purchaseOrderName,
  returnUrl,
  websiteUrl,
  customerInfo,
}) =>
  callKhalti("/initiate/", {
    return_url: returnUrl,
    website_url: websiteUrl,
    amount,
    purchase_order_id: purchaseOrderId,
    purchase_order_name: purchaseOrderName,
    customer_info: customerInfo,
  });

const lookupKhaltiPayment = async (pidx) =>
  callKhalti("/lookup/", {
    pidx,
  });

module.exports = {
  initiateKhaltiPayment,
  lookupKhaltiPayment,
};
