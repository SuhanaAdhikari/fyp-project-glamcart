// pages/SellerActivationPage.jsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { server } from "../server";

const SellerActivationPage = () => {
  const { activation_token } = useParams();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (activation_token) {
      axios.get(`${server}/shop/activation/${activation_token}`)
        .then(() => setError(false))
        .catch(() => setError(true));
    }
  }, [activation_token]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-xl font-semibold">
        {error ? "Token expired or invalid!" : "Seller account activated successfully!"}
      </p>
    </div>
  );
};

export default SellerActivationPage;
