import React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { CardNumberElement, CardCvcElement, CardExpiryElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { useSelector } from "react-redux"
import axios from "axios"
import { server } from "../../server"
import { toast } from "react-toastify"
import { FiCreditCard, FiTruck, FiSmartphone } from "react-icons/fi"

const Payment = () => {
  const [orderData, setOrderData] = useState([])
  const [open, setOpen] = useState(false)
  const [khaltiLoading, setKhaltiLoading] = useState(false)
  const { user } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const stripe = useStripe()
  const elements = useElements()

  useEffect(() => {
    const orderData = JSON.parse(localStorage.getItem("latestOrder"))
    setOrderData(orderData)
    window.scrollTo(0, 0)
  }, [])

  const order = {
    cart: orderData?.cart,
    shippingAddress: orderData?.shippingAddress,
    user: user && user,
    totalPrice: orderData?.totalPrice,
  }

  const paymentData = {
    amount: Math.round(orderData?.totalPrice * 100),
  }

  const paymentHandler = async (e) => {
    e.preventDefault()
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      }

      const { data } = await axios.post(`${server}/payment/process`, paymentData, config)

      const client_secret = data.client_secret

      if (!stripe || !elements) return
      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
        },
      })

      if (result.error) {
        toast.error(result.error.message)
      } else {
        if (result.paymentIntent.status === "succeeded") {
          order.paymentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
            type: "Credit Card",
          }

          await axios
            .post(`${server}/order/create-order`, order, config)
            .then((res) => {
              setOpen(false)
              navigate("/order/success")
              toast.success("Order successful!")
              localStorage.setItem("cartItems", JSON.stringify([]))
              localStorage.setItem("latestOrder", JSON.stringify([]))
              window.location.reload()
            })
            .catch((error) => {
              toast.error("Something went wrong with your order")
              console.error(error)
            })
        }
      }
    } catch (error) {
      toast.error(error.message || "Payment processing failed")
    }
  }

  const cashOnDeliveryHandler = async (e) => {
    e.preventDefault()

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    }

    order.paymentInfo = {
      type: "Cash On Delivery",
    }

    await axios
      .post(`${server}/order/create-order`, order, config)
      .then((res) => {
        setOpen(false)
        navigate("/order/success")
        toast.success("Order successful!")
        localStorage.setItem("cartItems", JSON.stringify([]))
        localStorage.setItem("latestOrder", JSON.stringify([]))
        window.location.reload()
      })
      .catch((error) => {
        toast.error("Something went wrong with your order")
        console.error(error)
      })
  }

  const khaltiPaymentHandler = async (e) => {
    e.preventDefault()
    setKhaltiLoading(true)

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      }

      // Prepare order data for Khalti
      const khaltiOrderData = {
        cart: orderData?.cart,
        shippingAddress: orderData?.shippingAddress,
        user: user,
        totalPrice: orderData?.totalPrice,
        customerInfo: {
          name: user?.name,
          email: user?.email,
          phone: user?.phoneNumber
        }
      }

      // Create order with Khalti
      const { data } = await axios.post(`${server}/order/create-order-khalti`, khaltiOrderData, config)

      if (data.success) {
        // Store order IDs for verification later
        const orderIds = data.orders.map(order => order._id).join(',')
        localStorage.setItem("khaltiOrderIds", orderIds)
        localStorage.setItem("khaltiPidx", data.khalti.pidx)

        // Redirect to Khalti payment page
        window.location.href = data.khalti.payment_url
      } else {
        toast.error("Failed to initiate Khalti payment")
      }
    } catch (error) {
      console.error("Khalti payment error:", error)
      toast.error(error.response?.data?.message || "Failed to initiate Khalti payment")
    } finally {
      setKhaltiLoading(false)
    }
  }

  return (
    <div className="w-full bg-[#f0f4fa] min-h-screen py-8">
      <div className="w-[95%] 1000px:w-[85%] m-auto">
        <div className="w-full block 800px:flex gap-8 mt-8">
          <div className="w-full 800px:w-[65%]">
            <PaymentInfo
              user={user}
              open={open}
              setOpen={setOpen}
              paymentHandler={paymentHandler}
              cashOnDeliveryHandler={cashOnDeliveryHandler}
              khaltiPaymentHandler={khaltiPaymentHandler}
              khaltiLoading={khaltiLoading}
            />
          </div>
          <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
            <CartData orderData={orderData} />
          </div>
        </div>
      </div>
    </div>
  )
}

const PaymentInfo = ({ 
  user, 
  open, 
  setOpen, 
  paymentHandler, 
  cashOnDeliveryHandler, 
  khaltiPaymentHandler, 
  khaltiLoading 
}) => {
  const [select, setSelect] = useState(1)

  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-[#dce5f3]">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-[#f0f4fa] p-2 rounded-full">
          <FiCreditCard className="text-[#3d569a] text-xl" />
        </div>
        <h2 className="text-xl font-bold text-[#1a2240]">Payment Method</h2>
      </div>

      {/* Payment Options */}
      <div className="space-y-6">
        {/* Credit Card Option */}
        <div className="border-b border-[#dce5f3] pb-6">
          <div className="flex items-center gap-3 cursor-pointer mb-4" onClick={() => setSelect(1)}>
            <div className="w-6 h-6 rounded-full border-2 border-[#3d569a] flex items-center justify-center">
              {select === 1 && <div className="w-3 h-3 bg-[#3d569a] rounded-full" />}
            </div>
            <div className="flex items-center gap-2">
              <FiCreditCard className="text-[#334580]" />
              <span className="font-medium text-[#1a2240]">Pay with Credit/Debit Card</span>
            </div>
          </div>

          {select === 1 && (
            <div className="pl-9">
              <form className="w-full space-y-4" onSubmit={paymentHandler}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#334580] font-medium mb-2">Name On Card</label>
                    <input
                      required
                      placeholder={user && user.name}
                      className="w-full px-4 py-3 rounded-lg border border-[#dce5f3] focus:outline-none focus:ring-2 focus:ring-[#3d569a]"
                      value={user && user.name}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-[#334580] font-medium mb-2">Expiration Date</label>
                    <CardExpiryElement
                      className="w-full px-4 py-3 rounded-lg border border-[#dce5f3] focus:outline-none focus:ring-2 focus:ring-[#3d569a]"
                      options={{
                        style: {
                          base: {
                            fontSize: "16px",
                            lineHeight: "42px",
                            color: "#1a2240",
                          },
                          empty: {
                            color: "#334580",
                            backgroundColor: "transparent",
                            "::placeholder": {
                              color: "#6a8cca",
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#334580] font-medium mb-2">Card Number</label>
                    <CardNumberElement
                      className="w-full px-4 py-3 rounded-lg border border-[#dce5f3] focus:outline-none focus:ring-2 focus:ring-[#3d569a]"
                      options={{
                        style: {
                          base: {
                            fontSize: "16px",
                            lineHeight: "42px",
                            color: "#1a2240",
                          },
                          empty: {
                            color: "#334580",
                            backgroundColor: "transparent",
                            "::placeholder": {
                              color: "#6a8cca",
                            },
                          },
                        },
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-[#334580] font-medium mb-2">CVV</label>
                    <CardCvcElement
                      className="w-full px-4 py-3 rounded-lg border border-[#dce5f3] focus:outline-none focus:ring-2 focus:ring-[#3d569a]"
                      options={{
                        style: {
                          base: {
                            fontSize: "16px",
                            lineHeight: "42px",
                            color: "#1a2240",
                          },
                          empty: {
                            color: "#334580",
                            backgroundColor: "transparent",
                            "::placeholder": {
                              color: "#6a8cca",
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#3d569a] hover:bg-[#2d3a69] text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FiCreditCard />
                  Pay Now
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Khalti Payment Option */}
        <div className="border-b border-[#dce5f3] pb-6">
          <div className="flex items-center gap-3 cursor-pointer mb-4" onClick={() => setSelect(2)}>
            <div className="w-6 h-6 rounded-full border-2 border-[#3d569a] flex items-center justify-center">
              {select === 2 && <div className="w-3 h-3 bg-[#3d569a] rounded-full" />}
            </div>
            <div className="flex items-center gap-2">
              <FiSmartphone className="text-[#334580]" />
              <span className="font-medium text-[#1a2240]">Pay with Khalti</span>
              <div className="bg-gradient-to-r from-[#5D2C91] to-[#7B61FF] text-white text-xs px-2 py-1 rounded-full">
                Digital Wallet
              </div>
            </div>
          </div>

          {select === 2 && (
            <div className="pl-9">
              <div className="bg-gradient-to-r from-[#5D2C91]/10 to-[#7B61FF]/10 p-4 rounded-lg mb-4 border border-[#7B61FF]/20">
                <div className="flex items-center gap-3 mb-3">
                  <img 
                    src="https://khalti.s3.ap-south-1.amazonaws.com/website/khalti-logo-white.png" 
                    alt="Khalti" 
                    className="h-8 bg-[#5D2C91] px-3 py-1 rounded"
                  />
                  <div>
                    <h4 className="font-semibold text-[#1a2240]">Pay with Khalti Digital Wallet</h4>
                    <p className="text-sm text-[#334580]">Fast, secure, and convenient payment</p>
                  </div>
                </div>
                <div className="text-sm text-[#334580] space-y-1">
                  <p>• Pay using Khalti balance, bank account, or cards</p>
                  <p>• No extra charges for digital wallet payments</p>
                  <p>• Instant payment confirmation</p>
                </div>
              </div>

              <form onSubmit={khaltiPaymentHandler}>
                <button
                  type="submit"
                  disabled={khaltiLoading}
                  className="w-full bg-gradient-to-r from-[#5D2C91] to-[#7B61FF] hover:from-[#4A1D7A] hover:to-[#6B4EE6] text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {khaltiLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FiSmartphone />
                      Pay with Khalti
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Cash on Delivery Option */}
        <div>
          <div className="flex items-center gap-3 cursor-pointer mb-4" onClick={() => setSelect(3)}>
            <div className="w-6 h-6 rounded-full border-2 border-[#3d569a] flex items-center justify-center">
              {select === 3 && <div className="w-3 h-3 bg-[#3d569a] rounded-full" />}
            </div>
            <div className="flex items-center gap-2">
              <FiTruck className="text-[#334580]" />
              <span className="font-medium text-[#1a2240]">Cash on Delivery</span>
            </div>
          </div>

          {select === 3 && (
            <div className="pl-9">
              <div className="bg-[#f0f4fa] p-4 rounded-lg mb-4">
                <p className="text-[#334580] text-sm">
                  Pay with cash upon delivery. Please have the exact amount ready when your order arrives.
                </p>
              </div>

              <form onSubmit={cashOnDeliveryHandler}>
                <button
                  type="submit"
                  className="w-full bg-[#3d569a] hover:bg-[#2d3a69] text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Confirm Order
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const CartData = ({ orderData }) => {
  const shipping = orderData?.shipping?.toFixed(2)

  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-[#dce5f3]">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-[#f0f4fa] p-2 rounded-full">
          <FiCreditCard className="text-[#3d569a] text-xl" />
        </div>
        <h2 className="text-xl font-bold text-[#1a2240]">Order Summary</h2>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-[#334580]">Subtotal:</span>
          <span className="font-semibold text-[#1a2240]">Rs.{orderData?.subTotalPrice?.toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-[#334580]">Shipping:</span>
          <span className="font-semibold text-[#1a2240]">Rs.{shipping}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-[#334580]">Discount:</span>
          <span className="font-semibold text-[#1a2240]">
            {orderData?.discountPrice ? `Rs.${orderData.discountPrice}` : "-"}
          </span>
        </div>

        <div className="border-t border-[#dce5f3] pt-4 mt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-[#1a2240]">Total:</span>
            <span className="text-xl font-bold text-[#1a2240]">Rs.{orderData?.totalPrice}</span>
          </div>
        </div>

        <div className="bg-[#f0f4fa] p-4 rounded-lg mt-2">
          <div className="flex items-center gap-2 mb-2">
            <FiTruck className="text-[#3d569a]" />
            <span className="font-medium text-[#1a2240]">Delivery Address</span>
          </div>
          <p className="text-sm text-[#334580]">
            {orderData?.shippingAddress?.address1}, {orderData?.shippingAddress?.address2},
            {orderData?.shippingAddress?.city}, Nepal - {orderData?.shippingAddress?.zipCode}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Payment