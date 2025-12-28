import React, { useMemo } from "react"
import { AiOutlineLogin, AiOutlineMessage } from "react-icons/ai"
import { RiLockPasswordLine } from "react-icons/ri"
import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from "react-icons/hi"
import { MdOutlineAdminPanelSettings, MdOutlineTrackChanges } from "react-icons/md"
import { TbAddressBook } from "react-icons/tb"
import { RxPerson } from "react-icons/rx"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { server } from "../../server"
import { toast } from "react-toastify"
import { useSelector } from "react-redux"
import { FiChevronRight } from "react-icons/fi"

const ProfileSidebar = ({ setActive, active }) => {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.user)

  const menu = useMemo(() => {
    const base = [
      { id: 1, label: "Profile", icon: RxPerson, onClick: () => setActive(1) },
      { id: 2, label: "Orders", icon: HiOutlineShoppingBag, onClick: () => setActive(2) },
      { id: 3, label: "Refunds", icon: HiOutlineReceiptRefund, onClick: () => setActive(3) },
      { id: 4, label: "Inbox", icon: AiOutlineMessage, onClick: () => navigate("/inbox") },
      { id: 5, label: "Track Order", icon: MdOutlineTrackChanges, onClick: () => setActive(5) },
      { id: 6, label: "Change Password", icon: RiLockPasswordLine, onClick: () => setActive(6) },
      { id: 7, label: "Address", icon: TbAddressBook, onClick: () => setActive(7) },
    ]
    return base
  }, [navigate, setActive])

  const isAdmin = user?.role === "Admin" || user?.role === "admin"

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${server}/user/logout`, { withCredentials: true })
      toast.success(res.data.message)
      window.location.reload(true)
      navigate("/login")
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed")
    }
  }

  return (
    <aside className="w-full">
      {/* Card shell */}
      <div className="rounded-2xl overflow-hidden border border-white/60 shadow-[0_18px_60px_rgba(20,21,43,0.10)] bg-gradient-to-b from-[#fff7fb] via-white to-[#f6f7ff]">
        {/* Header */}
        <div className="relative p-5">
          <div className="absolute inset-0 bg-gradient-to-r from-[#ff5aa5]/25 via-[#7b61ff]/15 to-transparent" />
          <div className="relative flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white shadow-sm bg-white">
              <img
                src={user?.avatar?.url || "/placeholder.svg"}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="text-sm text-[#6b6f86] font-semibold">My Account</div>
              <div className="text-[#14152b] font-extrabold truncate">{user?.name || "User"}</div>
              <div className="text-xs text-[#6b6f86] truncate">{user?.email || ""}</div>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="p-4 pt-2">
          <div className="text-xs font-bold text-[#6b6f86] px-2 mb-2 tracking-wider">
            NAVIGATION
          </div>

          <div className="flex flex-col gap-2">
            {menu.map((item) => {
              const Icon = item.icon
              const isActive = active === item.id

              return (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  className={[
                    "group w-full flex items-center justify-between rounded-2xl px-3 py-3 transition-all",
                    "border",
                    isActive
                      ? "bg-gradient-to-r from-[#ff5aa5] to-[#7b61ff] text-white border-transparent shadow-[0_12px_30px_rgba(123,97,255,0.25)]"
                      : "bg-white/70 hover:bg-white border-[#edf0ff] text-[#14152b]",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-3">
                    {/* left indicator */}
                    <div
                      className={[
                        "w-1.5 h-8 rounded-full transition-all",
                        isActive ? "bg-white/90" : "bg-[#e8e9ff] group-hover:bg-[#cfd2ff]",
                      ].join(" ")}
                    />
                    <div
                      className={[
                        "w-10 h-10 rounded-2xl flex items-center justify-center transition-all",
                        isActive ? "bg-white/15" : "bg-[#f6f7ff] group-hover:bg-[#eef0ff]",
                      ].join(" ")}
                    >
                      <Icon size={20} className={isActive ? "text-white" : "text-[#4b4ff0]"} />
                    </div>

                    <div className="flex flex-col items-start leading-tight">
                      <span className={["font-bold text-sm", isActive ? "text-white" : "text-[#14152b]"].join(" ")}>
                        {item.label}
                      </span>
                      <span className={["text-[11px]", isActive ? "text-white/80" : "text-[#6b6f86]"].join(" ")}>
                        Manage {item.label.toLowerCase()}
                      </span>
                    </div>
                  </div>

                  <FiChevronRight className={isActive ? "text-white" : "text-[#9aa0c3]"} />
                </button>
              )
            })}

            {/* Admin shortcut */}
            {isAdmin && (
              <Link to="/admin/dashboard" className="block">
                <div
                  className={[
                    "group w-full flex items-center justify-between rounded-2xl px-3 py-3 transition-all",
                    "border bg-white/70 hover:bg-white border-[#edf0ff] text-[#14152b]",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-8 rounded-full bg-[#e8e9ff] group-hover:bg-[#cfd2ff]" />
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[#fff7fb] border border-[#f2d7e6]">
                      <MdOutlineAdminPanelSettings size={20} className="text-[#b21b5a]" />
                    </div>
                    <div className="flex flex-col items-start leading-tight">
                      <span className="font-bold text-sm text-[#14152b]">Admin Dashboard</span>
                      <span className="text-[11px] text-[#6b6f86]">Manage platform</span>
                    </div>
                  </div>
                  <FiChevronRight className="text-[#9aa0c3]" />
                </div>
              </Link>
            )}

            {/* Logout */}
            <button
              onClick={logoutHandler}
              className="w-full mt-2 rounded-2xl px-4 py-3 border border-[#ffe0e8] bg-gradient-to-r from-[#fff] to-[#fff7fb] hover:from-[#fff7fb] hover:to-[#f6f7ff] transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[#fff1f4]">
                  <AiOutlineLogin size={20} className="text-[#d23a56]" />
                </div>
                <div className="text-left">
                  <div className="font-extrabold text-sm text-[#14152b]">Log out</div>
                  <div className="text-[11px] text-[#6b6f86]">Sign out of your account</div>
                </div>
              </div>
              <FiChevronRight className="text-[#d23a56]" />
            </button>
          </div>

          {/* Mobile hint */}
          <div className="mt-4 text-center text-[11px] text-[#8a90b3]">
            Tip: Use the menu to manage orders, refunds & profile settings.
          </div>
        </div>
      </div>
    </aside>
  )
}

export default ProfileSidebar
