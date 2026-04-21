import React from "react";
import AdminWorkspace from "../components/Admin/Layout/AdminWorkspace";
import AllUsers from "../components/Admin/AllUsers";

const AdminDashboardUsers = () => {
  return (
    <AdminWorkspace active={4}>
      <AllUsers />
    </AdminWorkspace>
  );
};

export default AdminDashboardUsers;
