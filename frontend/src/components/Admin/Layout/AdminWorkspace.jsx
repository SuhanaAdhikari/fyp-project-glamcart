import React from "react";
import AdminHeader from "../../Layout/AdminHeader";
import AdminSideBar from "./AdminSideBar";

const AdminWorkspace = ({ active, children }) => {
  return (
    <div className="page-shell admin-shell">
      <AdminHeader />

      <div className="workspace-body">
        <div className="workspace-grid">
          <div className="workspace-sidebar">
            <AdminSideBar active={active} />
          </div>

          <main className="workspace-main">
            <div className="workspace-content">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminWorkspace;
