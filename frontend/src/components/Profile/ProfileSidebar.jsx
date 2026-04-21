import React, { useMemo } from "react";
import { AiOutlineLogin, AiOutlineMessage } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from "react-icons/hi";
import { MdOutlineAdminPanelSettings, MdOutlineTrackChanges } from "react-icons/md";
import { TbAddressBook } from "react-icons/tb";
import { RxPerson } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const ProfileSidebar = ({ setActive, active }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const menu = useMemo(
    () => [
      { id: 1, label: "Profile", meta: "Personal details", icon: RxPerson, onClick: () => setActive(1) },
      { id: 2, label: "Orders", meta: "Purchase history", icon: HiOutlineShoppingBag, onClick: () => setActive(2) },
      { id: 3, label: "Refunds", meta: "Return requests", icon: HiOutlineReceiptRefund, onClick: () => setActive(3) },
      { id: 4, label: "Inbox", meta: "Customer messages", icon: AiOutlineMessage, onClick: () => navigate("/inbox") },
      { id: 5, label: "Track Order", meta: "Delivery progress", icon: MdOutlineTrackChanges, onClick: () => setActive(5) },
      { id: 6, label: "Password", meta: "Security settings", icon: RiLockPasswordLine, onClick: () => setActive(6) },
      { id: 7, label: "Addresses", meta: "Saved delivery spots", icon: TbAddressBook, onClick: () => setActive(7) },
    ],
    [navigate, setActive]
  );

  const isAdmin = user?.role === "Admin" || user?.role === "admin";

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${server}/user/logout`, { withCredentials: true });
      toast.success(res.data.message);
      window.location.reload();
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  };

  return (
    <aside className="workspace-nav-card">
      <div className="workspace-nav-head">
        <span className="workspace-nav-kicker">Account center</span>
        <h2 className="workspace-nav-title">Your account</h2>
        <p className="workspace-nav-copy">Orders, security and addresses stay organized in one simple panel.</p>

        <div className="surface-card-sm mt-4 flex items-center gap-3 bg-white/90 p-3">
          <img
            src={user?.avatar?.url || "/placeholder.svg"}
            alt={user?.name || "User"}
            className="h-12 w-12 rounded-2xl border border-[var(--color-border)] object-cover"
          />

          <div className="min-w-0">
            <p className="truncate text-sm font-[700] text-[var(--color-text)]">{user?.name || "User"}</p>
            <p className="truncate text-xs text-[var(--color-muted)]">{user?.email || ""}</p>
          </div>
        </div>
      </div>

      <div className="workspace-nav-list">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={item.onClick}
              className={`workspace-nav-button ${isActive ? "is-active" : ""}`}
            >
              <span className="workspace-nav-icon">
                <Icon size={19} />
              </span>

              <span className="workspace-nav-text">
                <span className="workspace-nav-label">{item.label}</span>
                <span className="workspace-nav-meta">{item.meta}</span>
              </span>

              <span className="workspace-nav-trailing" />
            </button>
          );
        })}

        {isAdmin && (
          <Link to="/admin/dashboard" className="workspace-nav-item">
            <span className="workspace-nav-icon">
              <MdOutlineAdminPanelSettings size={19} />
            </span>

            <span className="workspace-nav-text">
              <span className="workspace-nav-label">Admin Dashboard</span>
              <span className="workspace-nav-meta">Open platform controls</span>
            </span>

            <span className="workspace-nav-trailing" />
          </Link>
        )}

        <button type="button" onClick={logoutHandler} className="workspace-nav-button">
          <span className="workspace-nav-icon">
            <AiOutlineLogin size={19} />
          </span>

          <span className="workspace-nav-text">
            <span className="workspace-nav-label">Log out</span>
            <span className="workspace-nav-meta">Sign out of this device</span>
          </span>

          <span className="workspace-nav-trailing" />
        </button>
      </div>

      <div className="workspace-nav-foot">
        <p className="workspace-nav-foot-title">A clean profile saves time</p>
        <p className="workspace-nav-foot-copy">
          Keep contact details and saved addresses current so checkout and support stay frictionless.
        </p>
      </div>
    </aside>
  );
};

export default ProfileSidebar;
