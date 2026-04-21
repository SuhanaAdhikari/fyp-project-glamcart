"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { createevent } from "../../redux/actions/event"
import { shoeCategoriesData } from "../../static/data"
import { toast } from "react-toastify"
import {
  FiUploadCloud,
  FiDollarSign,
  FiTag,
  FiPackage,
  FiLayers,
  FiEdit3,
  FiImage,
  FiX,
  FiCalendar,
  FiChevronLeft,
} from "react-icons/fi"

const CreateEvent = () => {
  const { seller } = useSelector((state) => state.seller)
  const { success, error } = useSelector((state) => state.events)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [images, setImages] = useState([])
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState("")
  const [originalPrice, setOriginalPrice] = useState("")
  const [discountPrice, setDiscountPrice] = useState("")
  const [stock, setStock] = useState("")
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  // ✅ SAME FUNCTION
  const handleStartDateChange = (e) => {
    const startDate = new Date(e.target.value)
    const minEndDate = new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000)
    setStartDate(startDate)
    setEndDate(null)

    const endDateInput = document.getElementById("end-date")
    if (endDateInput) {
      endDateInput.min = minEndDate.toISOString().slice(0, 10)
    }
  }

  // ✅ SAME FUNCTION
  const handleEndDateChange = (e) => {
    setEndDate(new Date(e.target.value))
  }

  const today = new Date().toISOString().slice(0, 10)
  const minEndDate = startDate
    ? new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
    : ""

  useEffect(() => {
    if (error) {
      toast.error(error)
      setIsSubmitting(false)
    }
    if (success) {
      toast.success("✅ Event added successfully!")
      navigate("/dashboard-events")
    }
  }, [dispatch, error, success, navigate])

  // ✅ SAME FUNCTION
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    setImages([])
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImages((old) => [...old, reader.result])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  // ✅ SAME FUNCTION
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index))
  }

  // ✅ SAME FUNCTION / SAME DISPATCH
  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const newForm = new FormData()

    images.forEach((image) => {
      newForm.append("images", image)
    })

    const data = {
      name,
      description,
      category,
      tags,
      originalPrice,
      discountPrice,
      stock,
      images,
      shopId: seller._id,
      start_Date: startDate?.toISOString(),
      Finish_Date: endDate?.toISOString(),
    }

    dispatch(createevent(data))
  }

  return (
    <div className="w-full px-4 md:px-8 pt-6 mt-6">
      <div className="max-w-6xl mx-auto">
        {/* GlamCart header */}
        <div className="mb-6">
          <div className="flex items-center justify-between gap-3">
            <button type="button" onClick={() => navigate(-1)} className="gc_backBtn">
              <FiChevronLeft />
              Back
            </button>

            <button type="button" onClick={() => navigate(-1)} className="hidden md:inline-flex gc_ghostBtn">
              <FiX />
              Cancel
            </button>
          </div>

          <div className="mt-5">
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="gc_dot" />
              <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Events</p>
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 flex items-center gap-2">
              <FiCalendar className="text-[var(--color-accent-strong)]" />
              Create New Event
            </h2>
            <p className="text-sm text-gray-600 mt-1">Create GlamCart promotions with dates, stock and pricing.</p>
          </div>
        </div>

        {/* Layout */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event details */}
            <div className="gc_card overflow-hidden">
              <div className="gc_cardTopLine" />
              <div className="gc_cardHeader">
                <div className="flex items-center gap-3">
                  <div className="gc_iconCircle">
                    <FiCalendar />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-gray-900">Event Information</h3>
                    <p className="text-sm text-gray-600">Fill the details for your GlamCart event listing.</p>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-6">
                <div className="gc_field">
                  <label className="gc_label">
                    <FiEdit3 /> Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={name}
                    className="gc_input"
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your event product name..."
                    required
                  />
                  <p className="gc_help">Keep it short & searchable.</p>
                </div>

                <div className="gc_field">
                  <label className="gc_label">
                    <FiLayers /> Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    cols="30"
                    rows="9"
                    name="description"
                    value={description}
                    className="gc_input gc_textarea"
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter your event product description..."
                    required
                  />
                  <p className="gc_help">Mention offer details, who it's for, and key features.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="gc_field">
                    <label className="gc_label">
                      <FiTag /> Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="gc_input"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    >
                      <option value="">Choose a category</option>
                      {shoeCategoriesData?.map((i) => (
                        <option value={i.title} key={i.title}>
                          {i.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="gc_field">
                    <label className="gc_label">
                      <FiTag /> Tags
                    </label>
                    <input
                      type="text"
                      name="tags"
                      value={tags}
                      className="gc_input"
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="Enter event product tags..."
                    />
                    <p className="gc_help">Use commas (e.g. winter, sale, shoes)</p>
                  </div>
                </div>

                {/* Dates */}
                <div className="rounded-xl border border-gray-200 bg-white p-5">
                  <p className="text-sm font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                    <FiCalendar className="text-[var(--color-accent-strong)]" /> Event Dates
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="gc_field">
                      <label className="gc_labelSm">
                        Start Date <span className="text-red-500">*</span>
                      </label>
                      <div className="gc_moneyWrap">
                        <FiCalendar className="gc_moneyIcon" />
                        <input
                          type="date"
                          name="startDate"
                          id="start-date"
                          value={startDate ? startDate.toISOString().slice(0, 10) : ""}
                          className="gc_moneyInput"
                          onChange={handleStartDateChange}
                          min={today}
                          required
                        />
                      </div>
                      <p className="gc_help">Start from today or later.</p>
                    </div>

                    <div className="gc_field">
                      <label className="gc_labelSm">
                        End Date <span className="text-red-500">*</span>
                      </label>
                      <div className="gc_moneyWrap">
                        <FiCalendar className="gc_moneyIcon" />
                        <input
                          type="date"
                          name="endDate"
                          id="end-date"
                          value={endDate ? endDate.toISOString().slice(0, 10) : ""}
                          className="gc_moneyInput"
                          onChange={handleEndDateChange}
                          min={minEndDate}
                          required
                        />
                      </div>
                      <p className="gc_help">Must be at least 3 days after start.</p>
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="rounded-xl border border-gray-200 bg-white p-5">
                  <p className="text-sm font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                    <FiDollarSign className="text-[var(--color-accent-strong)]" /> Pricing & Inventory
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="gc_field">
                      <label className="gc_labelSm">Original Price</label>
                      <div className="gc_moneyWrap">
                        <FiDollarSign className="gc_moneyIcon" />
                        <input
                          type="number"
                          name="originalPrice"
                          value={originalPrice}
                          className="gc_moneyInput"
                          onChange={(e) => setOriginalPrice(e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div className="gc_field">
                      <label className="gc_labelSm">
                        Discounted Price <span className="text-red-500">*</span>
                      </label>
                      <div className="gc_moneyWrap">
                        <FiDollarSign className="gc_moneyIcon" />
                        <input
                          type="number"
                          name="discountPrice"
                          value={discountPrice}
                          className="gc_moneyInput"
                          onChange={(e) => setDiscountPrice(e.target.value)}
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </div>

                    <div className="gc_field md:col-span-2">
                      <label className="gc_labelSm">
                        Stock Quantity <span className="text-red-500">*</span>
                      </label>
                      <div className="gc_moneyWrap">
                        <FiPackage className="gc_moneyIcon" />
                        <input
                          type="number"
                          name="stock"
                          value={stock}
                          className="gc_moneyInput"
                          onChange={(e) => setStock(e.target.value)}
                          placeholder="0"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4">
                    <span className="gc_pillInfo">TIP</span>
                    <p className="text-sm text-gray-600">
                      Discount price is what customers see. Keep stock updated during the event.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Images */}
          <div className="lg:col-span-1">
            <div className="gc_card overflow-hidden lg:sticky lg:top-6">
              <div className="gc_cardTopLine" />
              <div className="gc_cardHeader">
                <div className="flex items-center gap-3">
                  <div className="gc_iconCircle">
                    <FiImage />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-gray-900">Upload Images</h3>
                    <p className="text-sm text-gray-600">Use clean photos for better clicks.</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <input type="file" id="upload" className="hidden" multiple onChange={handleImageChange} />

                <label htmlFor="upload" className="gc_dropzone">
                  <div className="gc_dropIcon">
                    <FiUploadCloud size={26} />
                  </div>
                  <div className="text-center">
                    <p className="font-extrabold text-gray-900">Click to upload</p>
                    <p className="text-xs text-gray-600 mt-1">PNG / JPG • Max 5 recommended</p>
                    <p className="text-[11px] text-gray-500 mt-2">First image will be cover</p>
                  </div>
                </label>

                {images.length > 0 && (
                  <div className="mt-5">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-extrabold text-gray-900">Preview ({images.length})</p>
                      <button type="button" onClick={() => setImages([])} className="gc_smallBtn">
                        Clear
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img src={image || "/placeholder.svg"} alt={`Event ${index + 1}`} className="gc_thumb" />
                          <span className="gc_badge">{index === 0 ? "Cover" : `#${index + 1}`}</span>
                          <button type="button" onClick={() => removeImage(index)} className="gc_removeBtn" title="Remove">
                            <FiX size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`gc_submit ${isSubmitting ? "gc_disabled" : ""}`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="gc_spinner" />
                        Creating Event...
                      </span>
                    ) : (
                      "Create Event"
                    )}
                  </button>

                  <button type="button" onClick={() => navigate(-1)} className="gc_cancelMobile md:hidden">
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            <p className="hidden lg:block text-xs text-gray-500 mt-3">
              Tip: add offer banner as first image for better attention.
            </p>
          </div>
        </form>

        {/* GlamCart styles */}
        <style jsx global>{`
          .gc_dot {
            width: 10px;
            height: 10px;
            border-radius: 999px;
            background: linear-gradient(90deg, var(--color-accent), var(--color-accent-strong));
            box-shadow: 0 0 0 3px rgba(166, 120, 97, 0.12);
            display: inline-block;
          }

          .gc_backBtn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 14px;
            border-radius: 14px;
            border: 1px solid rgba(0, 0, 0, 0.08);
            background: #fff;
            color: #111827;
            font-weight: 800;
            box-shadow: 0 1px 6px rgba(17, 24, 39, 0.06);
            transition: 160ms ease;
          }
          .gc_backBtn:hover {
            box-shadow: 0 8px 18px rgba(17, 24, 39, 0.08);
          }

          .gc_ghostBtn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 14px;
            border-radius: 14px;
            border: 1px solid rgba(0, 0, 0, 0.08);
            background: #fff;
            color: #111827;
            font-weight: 800;
            transition: 160ms ease;
          }
          .gc_ghostBtn:hover {
            background: rgba(17, 24, 39, 0.04);
          }

          .gc_card {
            border-radius: 18px;
            border: 1px solid rgba(0, 0, 0, 0.08);
            background: #fff;
            box-shadow: 0 10px 30px rgba(17, 24, 39, 0.06);
          }
          .gc_cardTopLine {
            height: 5px;
            width: 100%;
            background: linear-gradient(90deg, var(--color-accent), var(--color-accent-strong));
          }
          .gc_cardHeader {
            padding: 16px 18px;
            background: linear-gradient(90deg, rgba(234, 215, 200, 0.9), rgba(255, 255, 255, 0.9));
            border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          }

          .gc_iconCircle {
            width: 42px;
            height: 42px;
            border-radius: 999px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: var(--color-surface-soft);
            border: 1px solid var(--color-border);
            color: var(--color-accent-strong);
          }

          .gc_field {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .gc_label {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            font-weight: 900;
            color: #111827;
          }
          .gc_labelSm {
            font-size: 13px;
            font-weight: 900;
            color: #111827;
          }
          .gc_help {
            font-size: 12px;
            color: #6b7280;
          }

          .gc_input {
            width: 100%;
            padding: 12px 14px;
            border-radius: 14px;
            border: 2px solid rgba(0, 0, 0, 0.08);
            background: #fff;
            outline: none;
            transition: 160ms ease;
          }
          .gc_input:focus {
            border-color: rgba(166, 120, 97, 0.65);
            box-shadow: 0 0 0 4px rgba(166, 120, 97, 0.15);
          }
          .gc_textarea {
            resize: vertical;
          }

          .gc_moneyWrap {
            position: relative;
          }
          .gc_moneyIcon {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: #9ca3af;
          }
          .gc_moneyInput {
            width: 100%;
            padding: 12px 14px 12px 40px;
            border-radius: 14px;
            border: 2px solid rgba(0, 0, 0, 0.08);
            outline: none;
            transition: 160ms ease;
          }
          .gc_moneyInput:focus {
            border-color: rgba(166, 120, 97, 0.65);
            box-shadow: 0 0 0 4px rgba(166, 120, 97, 0.14);
          }

          .gc_pillInfo {
            font-size: 11px;
            font-weight: 900;
            padding: 6px 10px;
            border-radius: 999px;
            background: var(--color-accent-soft);
            border: 1px solid rgba(166, 120, 97, 0.22);
            color: var(--color-accent-strong);
            line-height: 1;
          }

          .gc_dropzone {
            border-radius: 18px;
            border: 2px dashed rgba(0, 0, 0, 0.12);
            background: rgba(17, 24, 39, 0.02);
            padding: 22px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: 160ms ease;
          }
          .gc_dropzone:hover {
            border-color: rgba(166, 120, 97, 0.6);
            background: rgba(166, 120, 97, 0.06);
          }
          .gc_dropIcon {
            width: 52px;
            height: 52px;
            border-radius: 999px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: var(--color-surface-soft);
            border: 1px solid var(--color-border);
            color: var(--color-accent-strong);
          }

          .gc_smallBtn {
            font-size: 12px;
            font-weight: 900;
            padding: 6px 10px;
            border-radius: 12px;
            border: 1px solid rgba(0, 0, 0, 0.08);
            background: #fff;
            color: #111827;
            transition: 160ms ease;
          }
          .gc_smallBtn:hover {
            background: rgba(17, 24, 39, 0.04);
          }

          .gc_thumb {
            width: 100%;
            height: 86px;
            object-fit: cover;
            border-radius: 14px;
            border: 1px solid rgba(0, 0, 0, 0.08);
            box-shadow: 0 6px 14px rgba(17, 24, 39, 0.06);
          }
          .gc_badge {
            position: absolute;
            left: 6px;
            top: 6px;
            font-size: 10px;
            font-weight: 900;
            padding: 4px 7px;
            border-radius: 10px;
            background: rgba(0, 0, 0, 0.6);
            color: #fff;
          }
          .gc_removeBtn {
            position: absolute;
            right: 6px;
            top: 6px;
            width: 28px;
            height: 28px;
            border-radius: 999px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: rgba(255, 255, 255, 0.92);
            border: 1px solid rgba(0, 0, 0, 0.08);
            color: #ef4444;
            opacity: 0;
            transform: translateY(-2px);
            transition: 160ms ease;
          }
          .group:hover .gc_removeBtn {
            opacity: 1;
            transform: translateY(0px);
          }

          .gc_submit {
            width: 100%;
            padding: 14px 16px;
            border-radius: 16px;
            font-weight: 900;
            color: #fff;
            background: linear-gradient(90deg, var(--color-accent), var(--color-accent-strong));
            box-shadow: 0 10px 22px rgba(136, 94, 74, 0.18);
            transition: 160ms ease;
          }
          .gc_submit:hover {
            transform: translateY(-1px);
            box-shadow: 0 14px 30px rgba(136, 94, 74, 0.22);
          }
          .gc_disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }
          .gc_disabled:hover {
            transform: none;
          }

          .gc_cancelMobile {
            width: 100%;
            margin-top: 10px;
            padding: 12px 14px;
            border-radius: 16px;
            border: 1px solid rgba(0, 0, 0, 0.08);
            background: #fff;
            font-weight: 900;
            color: #111827;
          }

          .gc_spinner {
            width: 16px;
            height: 16px;
            border-radius: 999px;
            border: 2px solid rgba(255, 255, 255, 0.4);
            border-top-color: #fff;
            animation: gcspin 0.8s linear infinite;
            display: inline-block;
          }
          @keyframes gcspin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    </div>
  )
}

export default CreateEvent
