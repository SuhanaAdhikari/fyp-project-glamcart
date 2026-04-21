"use client"

import React, { useEffect, useMemo, useState } from "react"
import { AiOutlineArrowRight, AiOutlineCamera, AiOutlineDelete } from "react-icons/ai"
import { MdTrackChanges } from "react-icons/md"
import { RxCross1 } from "react-icons/rx"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import { DataGrid } from "@material-ui/data-grid"
import { Country, State } from "country-state-city"

import { server } from "../../server"
import { deleteUserAddress, loadUser, updatUserAddress, updateUserInformation } from "../../redux/actions/user"
import { getAllOrdersOfUser } from "../../redux/actions/order"

const ProfileContent = ({ active }) => {
  const { user, error, successMessage } = useSelector((state) => state.user)

  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "")
  const [password, setPassword] = useState("")
  const [, setAvatar] = useState(null)

  const dispatch = useDispatch()

  useEffect(() => {
    setName(user?.name || "")
    setEmail(user?.email || "")
    setPhoneNumber(user?.phoneNumber || "")
  }, [user])

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch({ type: "clearErrors" })
    }
    if (successMessage) {
      toast.success(successMessage)
      dispatch({ type: "clearMessages" })
    }
  }, [error, successMessage, dispatch])

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(updateUserInformation(name, email, phoneNumber, password))
  }

  const handleImage = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result)

        axios
          .put(
            `${server}/user/update-avatar`,
            { avatar: reader.result },
            { withCredentials: true }
          )
          .then(() => {
            dispatch(loadUser())
            toast.success("Avatar updated successfully!")
          })
          .catch((error) => {
            toast.error(error?.response?.data?.message || "Failed to update avatar")
          })
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="w-full">
      {/* Profile */}
      {active === 1 && (
        <div className="w-full p-4 md:p-6">
          <div className="surface-card p-5 md:p-6">
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src={user?.avatar?.url || "/placeholder.svg"}
                  className="h-[140px] w-[140px] rounded-full border-[3px] border-[var(--color-border)] object-cover shadow-[0_20px_40px_rgba(23,33,43,0.14)]"
                  alt="User Avatar"
                />
                <div className="surface-card-sm absolute bottom-[6px] right-[6px] flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-full border border-[var(--color-border)] bg-white transition-colors">
                  <input type="file" id="image" className="hidden" onChange={handleImage} />
                  <label htmlFor="image" className="cursor-pointer">
                    <AiOutlineCamera className="text-[var(--color-accent-strong)]" />
                  </label>
                </div>
              </div>

              <h2 className="mt-4 text-xl font-semibold text-[var(--color-text)]">{user?.name || "User"}</h2>
              <p className="text-sm text-[var(--color-muted)]">{user?.email}</p>
            </div>

            <div className="mt-8">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">Full Name</label>
                    <input
                      type="text"
                      className="field-input"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">Email Address</label>
                    <input
                      type="text"
                      className="field-input"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">Phone Number</label>
                    <input
                      type="number"
                      className="field-input"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">Enter your password</label>
                    <input
                      type="password"
                      className="field-input"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary mt-6"
                >
                  Update Profile
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Orders */}
      {active === 2 && <AllOrders />}

      {/* Refund */}
      {active === 3 && <AllRefundOrders />}

      {/* Track order */}
      {active === 5 && <TrackOrder />}

      {/* Change Password */}
      {active === 6 && <ChangePassword />}

      {/* Address */}
      {active === 7 && <Address />}
    </div>
  )
}

/* --------------------------- Shared DataGrid Styles -------------------------- */
const gridSx = {
  border: 0,
  "& .MuiDataGrid-columnHeaders": {
    borderBottom: "1px solid rgba(0,0,0,0.08)",
    fontWeight: 800,
  },
  "& .MuiDataGrid-cell": { borderBottom: "1px solid rgba(0,0,0,0.06)" },
  "& .MuiDataGrid-row:hover": { backgroundColor: "rgba(0,0,0,0.02)" },
  "& .MuiDataGrid-footerContainer": { borderTop: "1px solid rgba(0,0,0,0.08)" },
  "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": { outline: "none" },
}

/* -------------------------------- All Orders -------------------------------- */
const AllOrders = () => {
  const { user } = useSelector((state) => state.user)
  const { orders } = useSelector((state) => state.order)
  const dispatch = useDispatch()

  useEffect(() => {
    if (user?._id) dispatch(getAllOrdersOfUser(user._id))
  }, [dispatch, user?._id])

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 190, flex: 1 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 160,
      flex: 0.8,
      renderCell: (params) => {
        const v = params.value
        const ok = v === "Delivered"
        return (
          <span className={ok ? "status-chip status-chip--success" : "status-chip status-chip--danger"}>
            {v}
          </span>
        )
      },
    },
    { field: "itemsQty", headerName: "Items", type: "number", minWidth: 120, flex: 0.5 },
    { field: "total", headerName: "Total", minWidth: 140, flex: 0.6 },
    {
      field: "action",
      headerName: "",
      minWidth: 90,
      flex: 0.35,
      sortable: false,
      renderCell: (params) => (
        <Link to={`/user/order/${params.id}`}>
          <button className="btn-secondary !h-10 !min-h-0 !w-10 !rounded-[14px] !p-0">
            <AiOutlineArrowRight size={18} className="text-[var(--color-text)]" />
          </button>
        </Link>
      ),
    },
  ]

  const rows = useMemo(() => {
    return (orders || []).map((item) => ({
      id: item._id,
      itemsQty: item?.cart?.length || 0,
      total: `Rs. ${item?.totalPrice}`,
      status: item?.status,
    }))
  }, [orders])

  return (
    <div className="w-full p-4 md:p-6">
      <div className="surface-card overflow-hidden">
        <div className="px-5 py-4 md:px-6">
          <h3 className="text-lg font-semibold text-[var(--color-text)]">My Orders</h3>
          <p className="mt-1 text-sm text-[var(--color-muted)]">All your recent orders.</p>
        </div>

        <div className="px-2 md:px-4 pb-4">
          <div className="surface-card-sm overflow-hidden bg-white">
            <DataGrid rows={rows} columns={columns} pageSize={10} disableSelectionOnClick autoHeight sx={gridSx} />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------ Refund Orders -------------------------------- */
const AllRefundOrders = () => {
  const { user } = useSelector((state) => state.user)
  const { orders } = useSelector((state) => state.order)
  const dispatch = useDispatch()

  useEffect(() => {
    if (user?._id) dispatch(getAllOrdersOfUser(user._id))
  }, [dispatch, user?._id])

  const eligibleOrders = useMemo(() => {
    return (orders || []).filter((item) => item.status === "Processing refund")
  }, [orders])

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 190, flex: 1 },
    { field: "status", headerName: "Status", minWidth: 170, flex: 0.8 },
    { field: "itemsQty", headerName: "Items", type: "number", minWidth: 120, flex: 0.5 },
    { field: "total", headerName: "Total", minWidth: 140, flex: 0.6 },
    {
      field: "action",
      headerName: "",
      minWidth: 90,
      flex: 0.35,
      sortable: false,
      renderCell: (params) => (
        <Link to={`/user/order/${params.id}`}>
          <button className="btn-secondary !h-10 !min-h-0 !w-10 !rounded-[14px] !p-0">
            <AiOutlineArrowRight size={18} className="text-[var(--color-text)]" />
          </button>
        </Link>
      ),
    },
  ]

  const rows = useMemo(() => {
    return eligibleOrders.map((item) => ({
      id: item._id,
      itemsQty: item?.cart?.length || 0,
      total: `Rs. ${item?.totalPrice}`,
      status: item?.status,
    }))
  }, [eligibleOrders])

  return (
    <div className="w-full p-4 md:p-6">
      <div className="surface-card overflow-hidden">
        <div className="px-5 py-4 md:px-6">
          <h3 className="text-lg font-semibold text-[var(--color-text)]">Refund Requests</h3>
          <p className="mt-1 text-sm text-[var(--color-muted)]">Orders currently in refund processing.</p>
        </div>

        <div className="px-2 md:px-4 pb-4">
          <div className="surface-card-sm overflow-hidden bg-white">
            <DataGrid rows={rows} columns={columns} pageSize={10} disableSelectionOnClick autoHeight sx={gridSx} />
          </div>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------- Track Order -------------------------------- */
const TrackOrder = () => {
  const { user } = useSelector((state) => state.user)
  const { orders } = useSelector((state) => state.order)
  const dispatch = useDispatch()

  useEffect(() => {
    if (user?._id) dispatch(getAllOrdersOfUser(user._id))
  }, [dispatch, user?._id])

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 190, flex: 1 },
    { field: "status", headerName: "Status", minWidth: 170, flex: 0.8 },
    { field: "itemsQty", headerName: "Items", type: "number", minWidth: 120, flex: 0.5 },
    { field: "total", headerName: "Total", minWidth: 140, flex: 0.6 },
    {
      field: "action",
      headerName: "",
      minWidth: 90,
      flex: 0.35,
      sortable: false,
      renderCell: (params) => (
        <Link to={`/user/track/order/${params.id}`}>
          <button className="btn-secondary !h-10 !min-h-0 !w-10 !rounded-[14px] !p-0">
            <MdTrackChanges size={18} className="text-[var(--color-text)]" />
          </button>
        </Link>
      ),
    },
  ]

  const rows = useMemo(() => {
    return (orders || []).map((item) => ({
      id: item._id,
      itemsQty: item?.cart?.length || 0,
      total: `Rs. ${item?.totalPrice}`,
      status: item?.status,
    }))
  }, [orders])

  return (
    <div className="w-full p-4 md:p-6">
      <div className="surface-card overflow-hidden">
        <div className="px-5 py-4 md:px-6">
          <h3 className="text-lg font-semibold text-[var(--color-text)]">Track Orders</h3>
          <p className="mt-1 text-sm text-[var(--color-muted)]">Track current orders.</p>
        </div>

        <div className="px-2 md:px-4 pb-4">
          <div className="surface-card-sm overflow-hidden bg-white">
            <DataGrid rows={rows} columns={columns} pageSize={10} disableSelectionOnClick autoHeight sx={gridSx} />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------ Change Password ------------------------------ */
const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const passwordChangeHandler = async (e) => {
    e.preventDefault()

    axios
      .put(
        `${server}/user/update-user-password`,
        { oldPassword, newPassword, confirmPassword },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success(res.data.success || "Password updated")
        setOldPassword("")
        setNewPassword("")
        setConfirmPassword("")
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || "Password update failed")
      })
  }

  return (
    <div className="w-full p-4 md:p-6">
      <div className="surface-card p-5 md:p-6">
        <h1 className="pb-2 text-center text-[22px] font-semibold text-[var(--color-text)] md:text-[26px]">Change Password</h1>

        <form onSubmit={passwordChangeHandler} className="mt-6 max-w-xl mx-auto space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">Old password</label>
            <input
              type="password"
              className="field-input"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">New password</label>
            <input
              type="password"
              className="field-input"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">Confirm password</label>
            <input
              type="password"
              className="field-input"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary !w-full">
            Update Password
          </button>
        </form>
      </div>
    </div>
  )
}

/* --------------------------------- Address --------------------------------- */
const Address = () => {
  const [open, setOpen] = useState(false)
  const [country, setCountry] = useState("")
  const [city, setCity] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [address1, setAddress1] = useState("")
  const [address2, setAddress2] = useState("")
  const [addressType, setAddressType] = useState("")
  const { user } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const addressTypeData = [{ name: "Default" }, { name: "Home" }, { name: "Office" }]

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!addressType || !country || !city) {
      toast.error("Please fill all the fields!")
      return
    }

    dispatch(updatUserAddress(country, city, address1, address2, zipCode, addressType))
    setOpen(false)
    setCountry("")
    setCity("")
    setAddress1("")
    setAddress2("")
    setZipCode("")
    setAddressType("")
  }

  const handleDelete = (item) => {
    dispatch(deleteUserAddress(item._id))
  }

  return (
    <div className="w-full p-4 md:p-6">
      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="surface-card w-full max-w-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
              <h2 className="text-lg font-semibold text-[var(--color-text)]">Add New Address</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="surface-card-sm flex h-10 w-10 items-center justify-center rounded-[14px] bg-white transition"
              >
                <RxCross1 size={18} className="text-[var(--color-text)]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">Country</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="field-select"
                >
                  <option value="">Choose your country</option>
                  {Country.getAllCountries().map((item) => (
                    <option key={item.isoCode} value={item.isoCode}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">City/State</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="field-select"
                >
                  <option value="">Choose your city</option>
                  {State.getStatesOfCountry(country).map((item) => (
                    <option key={item.isoCode} value={item.isoCode}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">Address 1</label>
                <input
                  className="field-input"
                  required
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">Address 2</label>
                <input
                  className="field-input"
                  required
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">Zip Code</label>
                <input
                  type="number"
                  className="field-input"
                  required
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">Address Type</label>
                <select
                  value={addressType}
                  onChange={(e) => setAddressType(e.target.value)}
                  className="field-select"
                >
                  <option value="">Choose your address type</option>
                  {addressTypeData.map((item) => (
                    <option key={item.name} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn-primary !w-full">
                Add Address
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-[22px] font-semibold text-[var(--color-text)] md:text-[26px]">My Addresses</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">Manage saved delivery addresses.</p>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={() => setOpen(true)}
        >
          Add New
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {user?.addresses?.map((item, index) => (
          <div
            key={index}
            className="surface-card-sm flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="muted-chip">
                {item.addressType}
              </span>
              <div className="text-sm font-medium text-[var(--color-text)]">
                {item.address1} {item.address2}
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-4">
              <div className="text-sm text-[var(--color-muted)]">{user?.phoneNumber}</div>
              <button
                type="button"
                onClick={() => handleDelete(item)}
                className="btn-danger !h-10 !min-h-0 !w-10 !rounded-[14px] !p-0"
                title="Delete address"
              >
                <AiOutlineDelete size={20} />
              </button>
            </div>
          </div>
        ))}

        {user?.addresses?.length === 0 && (
          <div className="surface-card py-14 text-center">
            <h5 className="text-lg font-semibold text-[var(--color-text)]">No saved addresses</h5>
            <p className="mt-2 text-sm text-[var(--color-muted)]">Add an address for faster checkout next time.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfileContent
