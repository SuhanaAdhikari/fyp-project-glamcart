import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { toast } from "react-toastify"
import { FiCamera, FiFileText, FiHash, FiInfo, FiMail, FiMapPin, FiPhone, FiSave, FiUser } from "react-icons/fi"

import { loadSeller } from "../../redux/actions/user"
import { server } from "../../server"

const ShopSettings = () => {
  const { seller } = useSelector((state) => state.seller)
  const dispatch = useDispatch()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [avatar, setAvatar] = useState(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [address, setAddress] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [zipCode, setZipcode] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() => {
    if (seller) {
      setName(seller.name || "")
      setDescription(seller.description || "")
      setAddress(seller.address || "")
      setPhoneNumber(seller.phoneNumber || "")
      setZipcode(seller.zipCode || "")
      setEmail(seller.email || "")
    }
  }, [seller])

  const handleImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG, or WebP)")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB")
      return
    }

    const reader = new FileReader()
    setIsUploading(true)

    reader.onload = async () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result)

        try {
          await axios.put(`${server}/shop/update-shop-avatar`, { avatar: reader.result }, { withCredentials: true })
          dispatch(loadSeller())
          toast.success("Shop logo updated successfully!")
        } catch (error) {
          toast.error(error.response?.data?.message || "Error updating shop logo")
        } finally {
          setIsUploading(false)
        }
      }
    }

    reader.readAsDataURL(file)
  }

  const updateHandler = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await axios.put(
        `${server}/shop/update-seller-info`,
        { name, address, zipCode, phoneNumber, description },
        { withCredentials: true },
      )
      toast.success("Shop information updated successfully!")
      dispatch(loadSeller())
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating shop information")
    } finally {
      setIsSubmitting(false)
    }
  }

  const profileStats = [
    { label: "Email", value: email || "-" },
    { label: "Phone", value: phoneNumber || "-" },
    { label: "Zip Code", value: zipCode || "-" },
  ]

  return (
    <div className="w-full p-4 md:p-6">
      <div className="space-y-6">
        <div className="surface-card accent-panel p-5 md:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="eyebrow">Seller Settings</span>
              <h1 className="mt-4 text-3xl font-extrabold text-[var(--color-text)] md:text-4xl">Refine your shop profile</h1>
              <p className="mt-3 text-sm leading-6 text-[var(--color-muted)] md:text-base">
                Keep your storefront details consistent so buyers immediately understand who you are and how to reach
                you.
              </p>
            </div>

            <button
              type="submit"
              form="shop-settings-form"
              disabled={isSubmitting}
              className={`btn-primary hidden sm:inline-flex ${isSubmitting ? "cursor-not-allowed opacity-70" : ""}`}
            >
              <FiSave />
              {isSubmitting ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(300px,360px)_minmax(0,1fr)]">
          <aside className="space-y-6">
            <div className="surface-card p-5 md:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-strong)]">
                    Brand Identity
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-[var(--color-text)]">{seller?.name || "Your Shop"}</h2>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                    These details shape the way customers see your store across product pages, orders, and search
                    results.
                  </p>
                </div>

                <span className="muted-chip">
                  <FiInfo size={14} />
                  Public profile
                </span>
              </div>

              <div className="mt-6 flex flex-col items-center rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-5 py-6 text-center">
                <div
                  className={`relative h-[132px] w-[132px] rounded-full p-[4px] shadow-[var(--shadow-soft)] ${isUploading ? "opacity-80" : ""}`}
                  style={{ background: "linear-gradient(135deg, var(--color-accent), var(--color-accent-strong))" }}
                >
                  <div className="h-full w-full overflow-hidden rounded-full border-[4px] border-white bg-white">
                    <img
                      src={avatar || seller?.avatar?.url || "/placeholder.svg"}
                      alt={seller?.name || "Shop"}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {isUploading && (
                    <div className="absolute inset-0 grid place-items-center rounded-full bg-black/25">
                      <div className="h-9 w-9 animate-spin rounded-full border-4 border-white border-t-transparent" />
                    </div>
                  )}
                </div>

                <div className="mt-5">
                  <input type="file" id="avatar-upload" className="hidden" onChange={handleImage} accept="image/*" />
                  <label htmlFor="avatar-upload" className="btn-secondary cursor-pointer">
                    <FiCamera />
                    {isUploading ? "Uploading..." : "Change logo"}
                  </label>
                </div>

                <p className="mt-4 text-sm leading-6 text-[var(--color-muted)]">
                  JPG, PNG, or WebP. Keep the file under 5MB for a sharper and faster storefront.
                </p>
              </div>

              <div className="mt-6 grid gap-3">
                {profileStats.map((item) => (
                  <div key={item.label} className="surface-card-sm accent-panel px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{item.label}</p>
                    <p className="mt-1 truncate text-sm font-semibold text-[var(--color-text)]">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-card-sm accent-panel p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-[14px] bg-white text-[var(--color-accent-strong)]">
                  <FiInfo />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text)]">Keep it clean and trustworthy</p>
                  <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">
                    Customers are more likely to buy when your logo, contact number, and description feel complete and
                    current.
                  </p>
                </div>
              </div>
            </div>
          </aside>

          <div className="surface-card p-5 md:p-6">
            <div className="border-b border-[var(--color-border)] pb-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-strong)]">
                Profile Details
              </p>
              <h2 className="mt-2 text-2xl font-bold text-[var(--color-text)]">Storefront information</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                Update the details customers use to recognize your store and contact you without friction.
              </p>
            </div>

            <form id="shop-settings-form" onSubmit={updateHandler} className="mt-6 space-y-6">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-text)]">
                    <FiUser className="text-[var(--color-accent-strong)]" /> Shop Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter shop name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="field-input"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-text)]">
                    <FiMail className="text-[var(--color-accent-strong)]" /> Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    className="field-input cursor-not-allowed bg-[var(--color-surface-soft)] text-[var(--color-muted)]"
                    readOnly
                  />
                  <p className="mt-2 text-xs text-[var(--color-muted)]">Email is tied to your seller account.</p>
                </div>

                <div>
                  <label className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-text)]">
                    <FiPhone className="text-[var(--color-accent-strong)]" /> Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="field-input"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-text)]">
                    <FiHash className="text-[var(--color-accent-strong)]" /> Zip Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter zip code"
                    value={zipCode}
                    onChange={(e) => setZipcode(e.target.value)}
                    className="field-input"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-text)]">
                    <FiMapPin className="text-[var(--color-accent-strong)]" /> Shop Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter shop address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="field-input"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-text)]">
                    <FiFileText className="text-[var(--color-accent-strong)]" /> Shop Description
                  </label>
                  <textarea
                    placeholder="Tell customers what you sell and what makes your shop special..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="field-textarea"
                  />
                  <p className="mt-2 text-xs text-[var(--color-muted)]">This text appears on your public shop page.</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-[var(--color-border)] pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm leading-6 text-[var(--color-muted)]">
                  Saving refreshes the information buyers see when they open your storefront.
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`btn-primary w-full sm:w-auto ${isSubmitting ? "cursor-not-allowed opacity-70" : ""}`}
                >
                  <FiSave />
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShopSettings
