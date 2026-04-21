import React from "react";
import AdminWorkspace from "../components/Admin/Layout/AdminWorkspace";
import BannerManager from "../components/Admin/BannerManager";

const AdminDashboardBanner = () => {
  return (
    <AdminWorkspace active={8}>
      <BannerManager />
    </AdminWorkspace>
  );
};

export default AdminDashboardBanner;
