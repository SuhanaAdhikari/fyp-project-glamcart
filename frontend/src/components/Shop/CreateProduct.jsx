"use client"

import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { createProduct } from "../../redux/actions/product"
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
  FiChevronLeft,
} from "react-icons/fi"

const CreateProduct = () => {
  const { seller } = useSelector((state) => state.seller)
  const { success, error } = useSelector((state) => state.products)

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

  const canSubmit = useMemo(() => {
    return (
      seller?._id &&
      name.trim() &&
      description.trim() &&
      category.trim() &&
      discountPrice !== "" &&
      stock !== "" &&
      images.length > 0 &&
      !isSubmitting
    )
  }, [seller?._id, name, description, category, discountPrice, stock, images.length, isSubmitting])

  useEffect(() => {
    if (error) {
      toast.error(error)
      setIsSubmitting(false)
    }
    if (success) {
      toast.success("Product created successfully!")
      setIsSubmitting(false)
      navigate("/dashboard")
    }
  }, [error, success, navigate])

  // ✅ DO NOT CHANGE FUNCTION
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    const picked = files.slice(0, 5)

    picked.forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImages((prev) => [...prev, reader.result])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  // ✅ DO NOT CHANGE FUNCTION
  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  // ✅ DO NOT CHANGE FUNCTION
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!seller?._id) return toast.error("Seller not found. Please login again.")
    if (!images.length) return toast.error("Please upload at least 1 product image.")

    setIsSubmitting(true)

    dispatch(
      createProduct({
        name,
        description,
        category,
        tags,
        originalPrice,
        discountPrice,
        stock,
        shopId: seller._id,
        images,
      }),
    )
  }

  return (
    <div className="w-full px-4 md:px-8 pt-6 mt-6">
      <div className="max-w-6xl mx-auto">
        {/* GlamCart header */}
        <div className="mb-6">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="gc_backBtn"
            >
              <FiChevronLeft />
              Back
            </button>

            <div className="hidden md:flex items-center gap-2">
              <span className="gc_chip">Dashboard</span>
              <span className="text-gray-300">›</span>
              <span className="gc_chip">Products</span>
              <span className="text-gray-300">›</span>
              <span className="gc_chipActive">Create</span>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2">
            <div className="inline-flex items-center gap-2">
              <span className="gc_dot" />
              <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Products</p>
            </div>

            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">Create New Product</h2>
              <button type="button" onClick={() => navigate(-1)} className="hidden md:inline-flex gc_ghostBtn">
                <FiX />
                Cancel
              </button>
            </div>

            <p className="text-sm text-gray-600">
              GlamCart style form — add details, upload images, set pricing & stock.
            </p>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT (2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Product Info card */}
            <div className="gc_card">
              <div className="gc_cardTopLine" />
              <div className="gc_cardHeader">
                <div className="flex items-center gap-3">
                  <div className="gc_iconCircle">
                    <FiPackage />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-gray-900">Product Information</h3>
                    <p className="text-sm text-gray-600">Fill the details for your GlamCart listing.</p>
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter product name..."
                    className="gc_input"
                    required
                  />
                  <p className="gc_help">Short + clear names convert better.</p>
                </div>

                <div className="gc_field">
                  <label className="gc_label">
                    <FiLayers /> Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows="9"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe features, material, fit, etc..."
                    className="gc_input gc_textarea"
                    required
                  />
                  <p className="gc_help">Tip: include size/fit notes and material.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="gc_field">
                    <label className="gc_label">
                      <FiTag /> Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="gc_input"
                      required
                    >
                      <option value="">Choose a category</option>
                      {shoeCategoriesData?.map((i) => (
                        <option key={i.title} value={i.title}>
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
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="e.g. sneakers, men, new"
                      className="gc_input"
                    />
                    <p className="gc_help">Use commas to separate tags.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing card */}
            <div className="gc_card">
              <div className="gc_cardTopLine" />
              <div className="gc_cardHeader">
                <div className="flex items-center gap-3">
                  <div className="gc_iconCircle">
                    <FiDollarSign />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-gray-900">Pricing & Inventory</h3>
                    <p className="text-sm text-gray-600">Set prices and keep stock accurate.</p>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="gc_field">
                    <label className="gc_labelSm">Original Price</label>
                    <div className="gc_moneyWrap">
                      <FiDollarSign className="gc_moneyIcon" />
                      <input
                        type="number"
                        value={originalPrice}
                        onChange={(e) => setOriginalPrice(e.target.value)}
                        placeholder="0.00"
                        min="0"
                        className="gc_moneyInput"
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
                        value={discountPrice}
                        onChange={(e) => setDiscountPrice(e.target.value)}
                        placeholder="0.00"
                        min="0"
                        className="gc_moneyInput"
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
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        placeholder="0"
                        min="0"
                        className="gc_moneyInput"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4">
                  <span className="gc_pillInfo">TIP</span>
                  <p className="text-sm text-gray-600">
                    Discount price is what customers see. Keep stock updated to avoid cancellations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT (Upload) */}
          <div className="lg:col-span-1">
            <div className="gc_card lg:sticky lg:top-6">
              <div className="gc_cardTopLine" />
              <div className="gc_cardHeader">
                <div className="flex items-center gap-3">
                  <div className="gc_iconCircle">
                    <FiImage />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-gray-900">Upload Images</h3>
                    <p className="text-sm text-gray-600">Clear photos sell faster.</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <input
                  id="upload"
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                />

                <label htmlFor="upload" className="gc_dropzone">
                  <div className="gc_dropIcon">
                    <FiUploadCloud size={26} />
                  </div>
                  <div className="text-center">
                    <p className="font-extrabold text-gray-900">Click to upload</p>
                    <p className="text-xs text-gray-600 mt-1">PNG / JPG • up to 5 images recommended</p>
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
                          <img src={image} alt={`Product ${index + 1}`} className="gc_thumb" />
                          <span className="gc_badge">{index === 0 ? "Cover" : `#${index + 1}`}</span>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="gc_removeBtn"
                            title="Remove"
                          >
                            <FiX size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4">
                  <p className="text-sm font-extrabold text-gray-900 mb-2">Checklist</p>
                  <ul className="text-sm text-gray-600 space-y-1.5">
                    <li>• Name + description</li>
                    <li>• Category selected</li>
                    <li>• At least 1 image</li>
                    <li>• Discount price + stock required</li>
                  </ul>
                </div>

                <div className="mt-6">
                  <button type="submit" disabled={!canSubmit} className={`gc_submit ${!canSubmit ? "gc_disabled" : ""}`}>
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="gc_spinner" />
                        Creating Product...
                      </span>
                    ) : (
                      "Create Product"
                    )}
                  </button>

                  <button type="button" onClick={() => navigate(-1)} className="gc_cancelMobile md:hidden">
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            <p className="hidden lg:block text-xs text-gray-500 mt-3">
              Tip: add side + top + sole view photos for better trust.
            </p>
          </div>
        </form>

        {/* GlamCart global styles (same vibe as your AllProducts) */}
        <style jsx global>{`
          .gc_dot {
            width: 10px;
            height: 10px;
            border-radius: 999px;
            background: linear-gradient(90deg, #ec4899, #a855f7);
            box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.12);
            display: inline-block;
          }

          .gc_chip {
            font-size: 12px;
            font-weight: 700;
            color: #6b7280;
            padding: 6px 10px;
            border-radius: 999px;
            border: 1px solid rgba(0, 0, 0, 0.08);
            background: #fff;
          }
          .gc_chipActive {
            font-size: 12px;
            font-weight: 800;
            color: #fff;
            padding: 6px 10px;
            border-radius: 999px;
            background: linear-gradient(90deg, #ec4899, #a855f7, #8b5cf6);
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
            overflow: hidden;
          }
          .gc_cardTopLine {
            height: 5px;
            width: 100%;
            background: linear-gradient(90deg, #ec4899, #a855f7, #8b5cf6);
          }
          .gc_cardHeader {
            padding: 16px 18px;
            background: linear-gradient(
              90deg,
              rgba(236, 72, 153, 0.08),
              rgba(168, 85, 247, 0.08)
            );
            border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          }

          .gc_iconCircle {
            width: 42px;
            height: 42px;
            border-radius: 999px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: rgba(236, 72, 153, 0.12);
            border: 1px solid rgba(236, 72, 153, 0.22);
            color: #111827;
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
            border-color: rgba(168, 85, 247, 0.65);
            box-shadow: 0 0 0 4px rgba(168, 85, 247, 0.15);
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
            border-color: rgba(236, 72, 153, 0.65);
            box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.14);
          }

          .gc_pillInfo {
            font-size: 11px;
            font-weight: 900;
            padding: 6px 10px;
            border-radius: 999px;
            background: linear-gradient(90deg, rgba(236, 72, 153, 0.14), rgba(168, 85, 247, 0.14));
            border: 1px solid rgba(0, 0, 0, 0.08);
            color: #111827;
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
            border-color: rgba(168, 85, 247, 0.6);
            background: rgba(168, 85, 247, 0.06);
          }
          .gc_dropIcon {
            width: 52px;
            height: 52px;
            border-radius: 999px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: rgba(168, 85, 247, 0.12);
            border: 1px solid rgba(168, 85, 247, 0.22);
            color: #111827;
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
            background: linear-gradient(90deg, #ec4899, #a855f7, #8b5cf6);
            box-shadow: 0 10px 22px rgba(168, 85, 247, 0.22);
            transition: 160ms ease;
          }
          .gc_submit:hover {
            transform: translateY(-1px);
            box-shadow: 0 14px 30px rgba(168, 85, 247, 0.26);
          }
          .gc_disabled {
            opacity: 0.6;
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

export default CreateProduct
