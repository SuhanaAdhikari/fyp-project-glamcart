import React from "react";
import AdminWorkspace from "../components/Admin/Layout/AdminWorkspace";
import AdminDashboardMain from "../components/Admin/AdminDashboardMain";

const AdminDashboardPage = () => {
  return (
    <AdminWorkspace active={1}>
      <AdminDashboardMain />
    </AdminWorkspace>
  );
};

export default AdminDashboardPage;
