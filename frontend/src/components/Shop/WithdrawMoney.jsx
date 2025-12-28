import React from "react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllOrdersOfShop } from "../../redux/actions/order"
import axios from "axios"
import { server } from "../../server"
import { toast } from "react-toastify"
import { loadSeller } from "../../redux/actions/user"
import {
  FiDollarSign,
  FiPlus,
  FiTrash2,
  FiX,
  FiCreditCard,
  FiBriefcase,
  FiGlobe,
  FiUser,
  FiMapPin,
  FiChevronLeft,
} from "react-icons/fi"

const WithdrawMoney = () => {
  const [open, setOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState(50)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bankInfo, setBankInfo] = useState({
    bankName: "",
    bankCountry: "",
    bankSwiftCode: "",
    bankAccountNumber: "",
    bankHolderName: "",
    bankAddress: "",
  })

  const dispatch = useDispatch()
  const { seller } = useSelector((state) => state.seller)

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller?._id))
  }, [dispatch, seller])

  // ✅ SAME LOGIC
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const withdrawMethod = {
      bankName: bankInfo.bankName,
      bankCountry: bankInfo.bankCountry,
      bankSwiftCode: bankInfo.bankSwiftCode,
      bankAccountNumber: bankInfo.bankAccountNumber,
      bankHolderName: bankInfo.bankHolderName,
      bankAddress: bankInfo.bankAddress,
    }

    try {
      await axios.put(`${server}/shop/update-payment-methods`, { withdrawMethod }, { withCredentials: true })
      toast.success("Withdraw method added successfully!")
      dispatch(loadSeller())
      setBankInfo({
        bankName: "",
        bankCountry: "",
        bankSwiftCode: "",
        bankAccountNumber: "",
        bankHolderName: "",
        bankAddress: "",
      })
      setPaymentMethod(false)
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  // ✅ SAME LOGIC
  const deleteHandler = async () => {
    const userConfirmed = window.confirm("Are you sure you want to delete this withdrawal method?")
    if (!userConfirmed) return

    try {
      await axios.delete(`${server}/shop/delete-withdraw-method`, {
        withCredentials: true,
      })
      toast.success("Withdraw method deleted successfully!")
      dispatch(loadSeller())
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong")
    }
  }

  // ✅ SAME LOGIC
  const withdrawHandler = async () => {
    if (withdrawAmount < 50 || withdrawAmount > availableBalance) {
      toast.error(
        withdrawAmount < 50
          ? "Minimum withdrawal amount is Rs.50"
          : "You don't have enough balance to withdraw this amount",
      )
      return
    }

    try {
      setIsSubmitting(true)
      await axios.post(
        `${server}/withdraw/create-withdraw-request`,
        { amount: withdrawAmount },
        { withCredentials: true },
      )
      toast.success("Withdrawal request submitted successfully!")
      setOpen(false)
      dispatch(loadSeller())
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  const availableBalance = seller?.availableBalance?.toFixed(2) || "0.00"

  return (
    <div className="w-full min-h-[90vh] px-4 md:px-8 pt-6 mt-6">
      <div className="max-w-5xl mx-auto">
        {/* GlamCart header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="gc_dot" />
            <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Wallet</p>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 flex items-center gap-2">
                <FiDollarSign className="text-pink-500" /> Withdraw Money
              </h2>
              <p className="text-sm text-gray-600 mt-1">Manage your earnings and withdrawal requests.</p>
            </div>

            <button type="button" className="gc_backBtn" onClick={() => window.history.back()}>
              <FiChevronLeft />
              Back
            </button>
          </div>
        </div>

        {/* Balance card */}
        <div className="gc_card overflow-hidden">
          <div className="gc_cardTopLine" />

          <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: balance */}
            <div className="lg:col-span-2">
              <div className="flex items-start gap-4">
                <div className="gc_iconCircleBig">
                  <FiDollarSign size={26} />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-500">Available Balance</p>
                  <p className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-1">
                    Rs.{availableBalance}
                  </p>

                  <div className="mt-5 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() =>
                        Number.parseFloat(availableBalance) < 50
                          ? toast.error("Minimum withdrawal amount is Rs.50")
                          : setOpen(true)
                      }
                      disabled={Number.parseFloat(availableBalance) < 50}
                      className={`gc_primaryBtn w-full sm:w-auto ${
                        Number.parseFloat(availableBalance) < 50 ? "gc_disabledBtn" : ""
                      }`}
                    >
                      Withdraw Funds
                    </button>

                    <div className="gc_infoPills">
                      <span className="gc_pillInfo">Min: Rs.50</span>
                      <span className="gc_pillInfo">Fee: 2%</span>
                      <span className="gc_pillInfo">3–5 days</span>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5">
                    <p className="text-sm font-extrabold text-gray-900 mb-3">Withdrawal Information</p>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex justify-between">
                        <span className="text-gray-500">Minimum withdrawal</span>
                        <span className="font-bold">Rs.50.00</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-500">Processing time</span>
                        <span className="font-bold">3–5 business days</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-500">Service fee</span>
                        <span className="font-bold">2% of amount</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: method preview */}
            <div className="lg:col-span-1">
              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-extrabold text-gray-900 flex items-center gap-2">
                    <FiCreditCard className="text-pink-500" /> Withdrawal Method
                  </p>
                </div>

                {seller && seller?.withdrawMethod ? (
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-gray-200 bg-white p-4">
                      <p className="text-xs text-gray-500 font-semibold">Bank Account</p>
                      <p className="font-extrabold text-gray-900 mt-1">{seller?.withdrawMethod.bankName}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {seller?.withdrawMethod.bankAccountNumber
                          ? "*".repeat(seller?.withdrawMethod.bankAccountNumber.length - 4) +
                            seller?.withdrawMethod.bankAccountNumber.slice(-4)
                          : ""}
                      </p>

                      <button onClick={deleteHandler} className="gc_dangerGhost mt-4 w-full">
                        <FiTrash2 /> Delete method
                      </button>
                    </div>

                    <button onClick={() => setOpen(true)} className="gc_ghostBtn w-full">
                      <FiPlus /> Withdraw now
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="gc_iconCircle">
                      <FiCreditCard />
                    </div>
                    <h3 className="text-lg font-extrabold text-gray-900 mt-3">No Method Added</h3>
                    <p className="text-sm text-gray-600 mt-1 mb-5">
                      Add bank account details to withdraw funds.
                    </p>
                    <button
                      onClick={() => {
                        setOpen(true)
                        setPaymentMethod(true)
                      }}
                      className="gc_primaryBtn w-full"
                    >
                      <FiPlus /> Add Bank Account
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Withdrawal Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden`}>
            {/* Modal header */}
            <div className="gc_modalHeader">
              <div className="flex items-center gap-3">
                <span className="gc_dot" />
                <h3 className="text-lg md:text-xl font-extrabold text-gray-900">
                  {paymentMethod ? "Add Withdrawal Method" : "Withdraw Funds"}
                </h3>
              </div>

              <button
                onClick={() => {
                  setOpen(false)
                  setPaymentMethod(false)
                }}
                className="gc_iconBtn"
                aria-label="Close"
              >
                <FiX />
              </button>
            </div>

            {/* Modal content */}
            <div className="p-6">
              {paymentMethod ? (
                <div>
                  <p className="text-sm text-gray-600 mb-6">
                    Please provide your bank details for withdrawals. All fields are required.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="gc_field">
                        <label className="gc_labelSm">
                          Bank Name <span className="text-red-500">*</span>
                        </label>
                        <div className="gc_moneyWrap">
                          <FiBriefcase className="gc_moneyIcon" />
                          <input
                            type="text"
                            required
                            value={bankInfo.bankName}
                            onChange={(e) => setBankInfo({ ...bankInfo, bankName: e.target.value })}
                            placeholder="Enter your bank name"
                            className="gc_moneyInput"
                          />
                        </div>
                      </div>

                      <div className="gc_field">
                        <label className="gc_labelSm">
                          Bank Country <span className="text-red-500">*</span>
                        </label>
                        <div className="gc_moneyWrap">
                          <FiGlobe className="gc_moneyIcon" />
                          <input
                            type="text"
                            required
                            value={bankInfo.bankCountry}
                            onChange={(e) => setBankInfo({ ...bankInfo, bankCountry: e.target.value })}
                            placeholder="Enter your bank country"
                            className="gc_moneyInput"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="gc_field">
                        <label className="gc_labelSm">
                          Swift Code <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={bankInfo.bankSwiftCode}
                          onChange={(e) => setBankInfo({ ...bankInfo, bankSwiftCode: e.target.value })}
                          placeholder="Enter swift code"
                          className="gc_input"
                        />
                      </div>

                      <div className="gc_field">
                        <label className="gc_labelSm">
                          Account Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={bankInfo.bankAccountNumber}
                          onChange={(e) => setBankInfo({ ...bankInfo, bankAccountNumber: e.target.value })}
                          placeholder="Enter account number"
                          className="gc_input"
                        />
                      </div>
                    </div>

                    <div className="gc_field">
                      <label className="gc_labelSm">
                        Account Holder Name <span className="text-red-500">*</span>
                      </label>
                      <div className="gc_moneyWrap">
                        <FiUser className="gc_moneyIcon" />
                        <input
                          type="text"
                          required
                          value={bankInfo.bankHolderName}
                          onChange={(e) => setBankInfo({ ...bankInfo, bankHolderName: e.target.value })}
                          placeholder="Enter account holder name"
                          className="gc_moneyInput"
                        />
                      </div>
                    </div>

                    <div className="gc_field">
                      <label className="gc_labelSm">
                        Bank Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FiMapPin className="absolute top-3 left-3 text-gray-400" />
                        <textarea
                          required
                          value={bankInfo.bankAddress}
                          onChange={(e) => setBankInfo({ ...bankInfo, bankAddress: e.target.value })}
                          placeholder="Enter bank address"
                          className="gc_input pl-10 min-h-[90px]"
                        />
                      </div>
                    </div>

                    <div className="pt-3 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod(false)}
                        className="gc_ghostBtn w-full"
                      >
                        Cancel
                      </button>

                      <button type="submit" disabled={isSubmitting} className={`gc_primaryBtn w-full`}>
                        {isSubmitting ? "Saving..." : "Save Bank Details"}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <>
                  <div className="rounded-2xl border border-gray-200 bg-white p-5">
                    <p className="text-sm font-extrabold text-gray-900 mb-4">Withdrawal Amount</p>

                    {seller && seller?.withdrawMethod ? (
                      <>
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                          <div className="gc_moneyWrap w-full sm:w-[180px]">
                            <FiDollarSign className="gc_moneyIcon" />
                            <input
                              type="number"
                              min="50"
                              max={availableBalance}
                              value={withdrawAmount}
                              onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                              className="gc_moneyInput"
                            />
                          </div>

                          <button
                            onClick={withdrawHandler}
                            disabled={isSubmitting}
                            className={`gc_primaryBtn w-full sm:w-auto ${isSubmitting ? "gc_disabledBtn" : ""}`}
                            type="button"
                          >
                            {isSubmitting ? "Processing..." : "Withdraw"}
                          </button>
                        </div>

                        <p className="text-xs text-gray-600 mt-3">
                          Minimum withdrawal: Rs.50 | Available: Rs.{availableBalance}
                        </p>
                      </>
                    ) : (
                      <div className="text-center py-6">
                        <div className="gc_iconCircle mx-auto">
                          <FiCreditCard />
                        </div>
                        <h3 className="text-lg font-extrabold text-gray-900 mt-3">No Withdrawal Method</h3>
                        <p className="text-sm text-gray-600 mt-1 mb-4">
                          Add a bank account before you can withdraw funds.
                        </p>
                        <button
                          onClick={() => setPaymentMethod(true)}
                          className="gc_primaryBtn w-full"
                          type="button"
                        >
                          <FiPlus /> Add Bank Account
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* GlamCart styles */}
      <style jsx global>{`
        .gc_dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: linear-gradient(90deg, #ec4899, #a855f7);
          box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.12);
          display: inline-block;
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
          background: linear-gradient(90deg, #ec4899, #a855f7, #8b5cf6);
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
        .gc_iconCircleBig {
          width: 60px;
          height: 60px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(168, 85, 247, 0.12);
          border: 1px solid rgba(168, 85, 247, 0.22);
          color: #111827;
          flex: 0 0 auto;
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

        .gc_primaryBtn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 16px;
          border-radius: 16px;
          font-weight: 900;
          color: #fff;
          background: linear-gradient(90deg, #ec4899, #a855f7, #8b5cf6);
          box-shadow: 0 10px 22px rgba(168, 85, 247, 0.22);
          transition: 160ms ease;
          width: fit-content;
        }
        .gc_primaryBtn:hover {
          transform: translateY(-1px);
          box-shadow: 0 14px 30px rgba(168, 85, 247, 0.26);
        }
        .gc_disabledBtn {
          opacity: 0.65;
          cursor: not-allowed;
          box-shadow: none !important;
          transform: none !important;
        }

        .gc_ghostBtn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 16px;
          border-radius: 16px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          background: #fff;
          color: #111827;
          font-weight: 900;
          transition: 160ms ease;
        }
        .gc_ghostBtn:hover {
          background: rgba(17, 24, 39, 0.04);
        }

        .gc_dangerGhost {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 14px;
          border: 1px solid rgba(239, 68, 68, 0.25);
          background: rgba(239, 68, 68, 0.08);
          color: #b91c1c;
          font-weight: 900;
          transition: 160ms ease;
        }
        .gc_dangerGhost:hover {
          background: rgba(239, 68, 68, 0.14);
        }

        .gc_infoPills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
          justify-content: flex-start;
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

        .gc_modalHeader {
          padding: 14px 16px;
          background: linear-gradient(90deg, rgba(236, 72, 153, 0.08), rgba(168, 85, 247, 0.08));
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .gc_iconBtn {
          min-width: auto;
          padding: 10px;
          border-radius: 999px;
          background: rgba(17, 24, 39, 0.06);
          color: #111827;
          transition: 160ms ease;
        }
        .gc_iconBtn:hover {
          background: rgba(17, 24, 39, 0.12);
        }

        .gc_field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .gc_labelSm {
          font-size: 13px;
          font-weight: 900;
          color: #111827;
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
      `}</style>
    </div>
  )
}

export default WithdrawMoney
