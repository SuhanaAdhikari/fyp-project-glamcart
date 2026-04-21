import React from "react";
import AdminWorkspace from "../components/Admin/Layout/AdminWorkspace";
import AllEvents from '../components/Admin/AllEvents';

const AdminDashboardEvents = () => {
  return (
    <AdminWorkspace active={6}>
      <AllEvents />
    </AdminWorkspace>
  );
};

export default AdminDashboardEvents;
