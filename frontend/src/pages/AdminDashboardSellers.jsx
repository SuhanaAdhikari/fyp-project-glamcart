import React from "react";
import AdminWorkspace from "../components/Admin/Layout/AdminWorkspace";
import AllSellers from "../components/Admin/AllSellers";

const AdminDashboardSellers = () => {
  return (
    <AdminWorkspace active={3}>
      <AllSellers />
    </AdminWorkspace>
  );
};

export default AdminDashboardSellers;
