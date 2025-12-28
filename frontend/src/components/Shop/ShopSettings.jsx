import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { server } from "../../server"
import axios from "axios"
import { loadSeller } from "../../redux/actions/user"
import { toast } from "react-toastify"
import { FiUser, FiMapPin, FiPhone, FiMail, FiFileText, FiSave, FiCamera, FiInfo, FiHash } from "react-icons/fi"

const ShopSettings = () => {
  const { seller } = useSelector((state) => state.seller)
  const dispatch = useDispatch()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // Form states (keep same logic)
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

  return (
    <div className="w-full min-h-screen px-4 md:px-8 pt-6 mt-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2">
            <span className="gc_dot" />
            <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Settings</p>
          </div>

          <div className="mt-2 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Shop Settings</h1>
              <p className="text-sm text-gray-600 mt-1">Update your shop profile, contact info and description.</p>
            </div>

            <button
              type="submit"
              form="shop-settings-form"
              disabled={isSubmitting}
              className={`hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl font-extrabold text-white
                          bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-600 shadow-lg hover:shadow-xl transition
                          ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              <FiSave />
              Save
            </button>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="h-[5px] w-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-600" />

          {/* Hero */}
          <div className="relative px-6 md:px-8 py-6 bg-white">
            <div className="gc_softGlow" />
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative">
              <div>
                <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">Profile & Branding</h2>
                <p className="text-sm text-gray-600 mt-1">Your logo and details are visible to customers.</p>
              </div>

              <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gray-50 border border-gray-200 text-xs font-extrabold text-gray-900">
                <FiInfo className="text-gray-700" />
                Public profile
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 md:p-8">
            {/* Avatar row */}
            <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
              <div className="relative w-max">
                <div className={`gc_avatarRing ${isUploading ? "opacity-80" : ""}`}>
                  <div className="gc_avatarInner">
                    <img
                      src={avatar || seller?.avatar?.url || "/placeholder.svg"}
                      alt={seller?.name || "Shop"}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {isUploading && (
                    <div className="absolute inset-0 grid place-items-center bg-black/25 rounded-full">
                      <div className="w-9 h-9 border-4 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                <div className="absolute -bottom-1 -right-1">
                  <input type="file" id="avatar-upload" className="hidden" onChange={handleImage} accept="image/*" />
                  <label htmlFor="avatar-upload" className="gc_fab" title="Change logo">
                    <FiCamera size={18} />
                  </label>
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-lg md:text-xl font-extrabold text-gray-900">{seller?.name || "Your Shop"}</h3>
                <p className="text-sm text-gray-600 mt-1">JPG/PNG/WebP • Max 5MB • Square logo recommended.</p>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="gc_stat">
                    <p className="gc_statLabel">EMAIL</p>
                    <p className="gc_statValue truncate">{email || "-"}</p>
                  </div>
                  <div className="gc_stat">
                    <p className="gc_statLabel">PHONE</p>
                    <p className="gc_statValue truncate">{phoneNumber || "-"}</p>
                  </div>
                  <div className="gc_stat">
                    <p className="gc_statLabel">ZIP</p>
                    <p className="gc_statValue truncate">{zipCode || "-"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <form id="shop-settings-form" onSubmit={updateHandler} className="space-y-7">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="gc_field">
                  <label className="gc_label">
                    <FiUser className="gc_icon" /> Shop Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter shop name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="gc_input"
                    required
                  />
                </div>

                <div className="gc_field">
                  <label className="gc_label">
                    <FiMail className="gc_icon" /> Email Address
                  </label>
                  <input type="email" value={email} className="gc_input gc_readonly" readOnly />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div className="gc_field">
                  <label className="gc_label">
                    <FiPhone className="gc_icon" /> Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="gc_input"
                    required
                  />
                </div>

                <div className="gc_field">
                  <label className="gc_label">
                    <FiHash className="gc_icon" /> Zip Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter zip code"
                    value={zipCode}
                    onChange={(e) => setZipcode(e.target.value)}
                    className="gc_input"
                    required
                  />
                </div>

                <div className="gc_field md:col-span-2">
                  <label className="gc_label">
                    <FiMapPin className="gc_icon" /> Shop Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter shop address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="gc_input"
                    required
                  />
                </div>

                <div className="gc_field md:col-span-2">
                  <label className="gc_label">
                    <FiFileText className="gc_icon" /> Shop Description
                  </label>
                  <textarea
                    placeholder="Tell customers what you sell and what makes your shop special..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="gc_textarea"
                  />
                  <p className="text-xs text-gray-500 mt-1">This appears on your shop page.</p>
                </div>
              </div>

              {/* Info box */}
              <div className="gc_infoBox">
                <FiInfo className="gc_infoIcon" />
                <div>
                  <p className="font-extrabold text-gray-900">Tip</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Keep your logo and contact details accurate to build customer trust.
                  </p>
                </div>
              </div>

              {/* Mobile Save */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`sm:hidden w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl font-extrabold text-white
                            bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-600 shadow-lg hover:shadow-xl transition
                            ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-1 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Updating...
                  </>
                ) : (
                  <>
                    <FiSave />
                    Save Changes
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* GlamCart5 theme styles */}
        <style jsx global>{`
          .gc_dot {
            width: 10px;
            height: 10px;
            border-radius: 999px;
            background: linear-gradient(90deg, #ec4899, #a855f7);
            box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.12);
            display: inline-block;
          }

          .gc_softGlow {
            position: absolute;
            inset: -60px;
            background: radial-gradient(circle at 20% 30%, rgba(236, 72, 153, 0.14), transparent 45%),
              radial-gradient(circle at 70% 20%, rgba(168, 85, 247, 0.14), transparent 45%),
              radial-gradient(circle at 60% 80%, rgba(124, 58, 237, 0.12), transparent 45%);
            pointer-events: none;
          }

          .gc_avatarRing {
            width: 118px;
            height: 118px;
            border-radius: 999px;
            padding: 4px;
            background: linear-gradient(135deg, #ec4899, #a855f7, #7c3aed);
            box-shadow: 0 20px 40px rgba(17, 24, 39, 0.16);
            position: relative;
          }
          @media (min-width: 768px) {
            .gc_avatarRing {
              width: 132px;
              height: 132px;
            }
          }
          .gc_avatarInner {
            width: 100%;
            height: 100%;
            border-radius: 999px;
            overflow: hidden;
            border: 4px solid #ffffff;
            background: #f8fafc;
          }

          .gc_fab {
            width: 42px;
            height: 42px;
            border-radius: 999px;
            display: grid;
            place-items: center;
            cursor: pointer;
            color: white;
            background: linear-gradient(135deg, #ec4899, #a855f7, #7c3aed);
            border: 1px solid rgba(255, 255, 255, 0.35);
            box-shadow: 0 18px 30px rgba(17, 24, 39, 0.18);
            transition: transform 160ms ease, box-shadow 160ms ease;
          }
          .gc_fab:hover {
            transform: translateY(-1px);
            box-shadow: 0 22px 40px rgba(17, 24, 39, 0.22);
          }

          .gc_stat {
            border: 1px solid rgba(0, 0, 0, 0.08);
            background: linear-gradient(
              90deg,
              rgba(236, 72, 153, 0.06),
              rgba(168, 85, 247, 0.06),
              rgba(124, 58, 237, 0.05)
            );
            border-radius: 18px;
            padding: 10px 12px;
            box-shadow: 0 14px 26px rgba(17, 24, 39, 0.08);
          }
          .gc_statLabel {
            font-size: 11px;
            font-weight: 900;
            color: rgba(17, 24, 39, 0.55);
            letter-spacing: 0.08em;
          }
          .gc_statValue {
            margin-top: 4px;
            font-weight: 900;
            color: #111827;
            font-size: 13px;
          }

          .gc_field {
            display: flex;
            flex-direction: column;
          }
          .gc_label {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            font-weight: 900;
            color: rgba(17, 24, 39, 0.75);
            margin-bottom: 8px;
          }
          .gc_icon {
            color: rgba(17, 24, 39, 0.55);
          }

          .gc_input {
            width: 100%;
            padding: 12px 14px;
            border-radius: 16px;
            border: 1px solid rgba(0, 0, 0, 0.12);
            background: #fff;
            outline: none;
            transition: 160ms ease;
            font-weight: 800;
            color: #111827;
            box-shadow: 0 10px 18px rgba(17, 24, 39, 0.05);
          }
          .gc_input:focus {
            border-color: rgba(168, 85, 247, 0.55);
            box-shadow: 0 0 0 4px rgba(168, 85, 247, 0.18), 0 14px 24px rgba(17, 24, 39, 0.06);
          }
          .gc_readonly {
            background: rgba(248, 250, 252, 0.9);
            color: rgba(17, 24, 39, 0.55);
          }

          .gc_textarea {
            width: 100%;
            min-height: 120px;
            padding: 12px 14px;
            border-radius: 16px;
            border: 1px solid rgba(0, 0, 0, 0.12);
            background: #fff;
            outline: none;
            transition: 160ms ease;
            font-weight: 800;
            color: #111827;
            resize: vertical;
            box-shadow: 0 10px 18px rgba(17, 24, 39, 0.05);
          }
          .gc_textarea:focus {
            border-color: rgba(236, 72, 153, 0.55);
            box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.16), 0 14px 24px rgba(17, 24, 39, 0.06);
          }

          .gc_infoBox {
            display: flex;
            gap: 12px;
            align-items: flex-start;
            border-radius: 20px;
            padding: 14px 14px;
            border: 1px solid rgba(0, 0, 0, 0.08);
            background: linear-gradient(
              90deg,
              rgba(236, 72, 153, 0.08),
              rgba(168, 85, 247, 0.08),
              rgba(124, 58, 237, 0.07)
            );
          }
          .gc_infoIcon {
            color: #7c3aed;
            margin-top: 2px;
          }
        `}</style>
      </div>
    </div>
  )
}

export default ShopSettings
