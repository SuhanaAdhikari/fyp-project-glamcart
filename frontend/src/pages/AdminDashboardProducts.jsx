import React from "react";
import AdminWorkspace from "../components/Admin/Layout/AdminWorkspace";
import AllProducts from "../components/Admin/AllProducts";

const AdminDashboardProducts = () => {
  return (
    <AdminWorkspace active={5}>
      <AllProducts />
    </AdminWorkspace>
  );
};

export default AdminDashboardProducts;
