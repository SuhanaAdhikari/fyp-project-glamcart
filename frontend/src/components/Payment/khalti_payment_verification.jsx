import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../server";

const KhaltiVerification = () => {
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState("loading");
  const navigate = useNavigate();

  const verifyKhaltiPayment = useCallback(async () => {
    try {
      const pidx = searchParams.get("pidx");
      const orderIds = searchParams.get("orderIds");

      if (!pidx || !orderIds) {
        toast.error("Payment verification failed.");
        setVerificationStatus("failed");
        return;
      }

      localStorage.setItem("khaltiPidx", pidx);
      localStorage.setItem("khaltiOrderIds", orderIds);

      const response = await axios.post(
        `${server}/order/verify-khalti-payment`,
        { pidx, orderIds },
        { headers: { "Content-Type": "application/json" } }
      );

      if (!response?.data?.success) {
        toast.error(response?.data?.message || "Payment verification failed.");
        setVerificationStatus("failed");
        return;
      }

      setVerificationStatus("success");
      toast.success("Payment verified successfully.");

      localStorage.removeItem("khaltiPidx");
      localStorage.removeItem("khaltiOrderIds");
      localStorage.setItem("cartItems", JSON.stringify([]));
      localStorage.setItem("latestOrder", JSON.stringify(response.data.orders));

      setTimeout(() => {
        navigate("/order/success");
      }, 1200);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Payment verification failed.");
      setVerificationStatus("failed");
    }
  }, [navigate, searchParams]);

  useEffect(() => {
    verifyKhaltiPayment();
  }, [verifyKhaltiPayment]);

  return (
    <div className="page-shell flex items-center justify-center px-4 py-12">
      <div className="surface-card w-full max-w-md p-8 text-center">
        {verificationStatus === "loading" && (
          <>
            <h1 className="section-heading text-[2rem]">Verifying payment</h1>
            <p className="section-copy mt-4">Please wait while we confirm your Khalti transaction.</p>
          </>
        )}

        {verificationStatus === "success" && (
          <>
            <h1 className="section-heading text-[2rem]">Payment successful</h1>
            <p className="section-copy mt-4">Your order has been confirmed. Redirecting now.</p>
          </>
        )}

        {verificationStatus === "failed" && (
          <>
            <h1 className="section-heading text-[2rem]">Payment failed</h1>
            <p className="section-copy mt-4">We could not verify the payment. You can retry or return home.</p>
            <div className="mt-6 flex flex-col gap-3">
              <button type="button" onClick={() => navigate("/payment")} className="btn-primary !w-full">
                Retry payment
              </button>
              <button type="button" onClick={() => navigate("/")} className="btn-secondary !w-full">
                Go home
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default KhaltiVerification;
