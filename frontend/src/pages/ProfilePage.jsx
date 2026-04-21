import React, { useState } from "react";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import ProfileSideBar from "../components/Profile/ProfileSidebar";
import ProfileContent from "../components/Profile/ProfileContent";
import { useSelector } from "react-redux";

const ProfilePage = () => {
  const { loading } = useSelector((state) => state.user);
  const [active, setActive] = useState(1);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Header />
          <div className="page-shell profile-shell">
            <div className="workspace-body">
              <div className="surface-card accent-panel mb-5 p-6 md:p-8">
                <span className="workspace-kicker">Account center</span>
                <h1 className="section-heading mt-4 text-[2.2rem] md:text-[3rem]">Profile, orders and security</h1>
                <p className="section-copy mt-3 max-w-3xl">
                  Everything tied to your account now sits inside one lighter, cleaner workspace.
                </p>
              </div>

              <div className="workspace-grid">
                <div className="workspace-sidebar">
                  <ProfileSideBar active={active} setActive={setActive} />
                </div>

                <div className="workspace-main">
                  <div className="workspace-content">
                    <ProfileContent active={active} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
