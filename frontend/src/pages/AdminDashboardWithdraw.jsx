import React from "react";
import AdminWorkspace from "../components/Admin/Layout/AdminWorkspace";
import AllWithdraw from "../components/Admin/AllWithdraw";

const AdminDashboardWithdraw = () => {
  return (
    <AdminWorkspace active={7}>
      <AllWithdraw />
    </AdminWorkspace>
  );
};

export default AdminDashboardWithdraw;
