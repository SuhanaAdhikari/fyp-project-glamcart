import React from "react";
import AdminWorkspace from "../components/Admin/Layout/AdminWorkspace";
import VendorApprovals from "../components/Admin/VendorApprovals";

const AdminVendorApprovals = () => {
  return (
    <AdminWorkspace active={9}>
      <VendorApprovals />
    </AdminWorkspace>
  );
};

export default AdminVendorApprovals;
