import React from "react";
import DashboardHeader from "./DashboardHeader";
import DashboardSideBar from "./DashboardSideBar";

const SellerWorkspace = ({ active, children }) => {
  return (
    <div className="page-shell seller-shell">
      <DashboardHeader />

      <div className="workspace-body">
        <div className="workspace-grid">
          <div className="workspace-sidebar">
            <DashboardSideBar active={active} />
          </div>

          <main className="workspace-main">
            <div className="workspace-content">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default SellerWorkspace;
