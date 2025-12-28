import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { server } from '../../server'
import { toast } from 'react-toastify'
import { FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi'

const KhaltiVerification = () => {
  const [searchParams] = useSearchParams()
  const [verificationStatus, setVerificationStatus] = useState('loading')
  const [orderDetails, setOrderDetails] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    verifyKhaltiPayment()
    // eslint-disable-next-line
  }, [])

  const verifyKhaltiPayment = async () => {
    try {
      // Get parameters from URL
      const pidx = searchParams.get('pidx')
      const orderIds = searchParams.get('orderIds')

      if (!pidx || !orderIds) {
        toast.error('Payment verification failed - Missing payment ID or order reference')
        setVerificationStatus('failed')
        return
      }

      // Store in localStorage for backup
      localStorage.setItem('khaltiPidx', pidx)
      localStorage.setItem('khaltiOrderIds', orderIds)

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }

      // Make API call to backend verification endpoint
      const { data } = await axios.post(
        `${server}/order/verify-khalti-payment`,
        { pidx, orderIds },
        config
      )

      if (data.success) {
        setVerificationStatus('success')
        setOrderDetails(data.orders)
        toast.success('Payment verified successfully!')

        // Clean up localStorage
        localStorage.removeItem('khaltiPidx')
        localStorage.removeItem('khaltiOrderIds')
        localStorage.setItem('cartItems', JSON.stringify([]))
        localStorage.setItem('latestOrder', JSON.stringify(data.orders))

        // Redirect to success page after a short delay
        setTimeout(() => {
          navigate('/order/success')
        }, 1500)
      } else {
        setVerificationStatus('failed')
        toast.error(data.message || 'Payment verification failed')
      }
    } catch (error) {
      console.error('Verification error:', error)
      setVerificationStatus('failed')
      
      // Check if it's a network error or server error
      if (error.code === 'ERR_NETWORK') {
        toast.error('Network error - please check your connection')
      } else {
        toast.error(error.response?.data?.message || 'Payment verification failed')
      }
    }
  }

  const handleRetryPayment = () => {
    // Clear failed payment data and redirect back to payment
    localStorage.removeItem('khaltiPidx')
    localStorage.removeItem('khaltiOrderIds')
    navigate('/payment')
  }

  const handleGoHome = () => {
    navigate('/')
  }

  // Rest of your component JSX remains the same
  return (
    <div className="min-h-screen flex items-center justify-center">
      {verificationStatus === 'loading' && (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Verifying payment...</span>
          </div>
          <p className="mt-3">Verifying your payment...</p>
        </div>
      )}
      
      {verificationStatus === 'success' && (
        <div className="text-center text-green-600">
          <h2 className="text-2xl font-bold">Payment Successful!</h2>
          <p>Your order has been confirmed.</p>
        </div>
      )}
      
      {verificationStatus === 'failed' && (
        <div className="text-center text-red-600">
          <h2 className="text-2xl font-bold">Payment Failed</h2>
          <p>Something went wrong with your payment.</p>
          <div className="mt-4 space-x-4">
            <button onClick={handleRetryPayment} className="btn btn-primary">
              Retry Payment
            </button>
            <button onClick={handleGoHome} className="btn btn-secondary">
              Go Home
            </button>
          </div>
        </div>
      )}
    </div>
  )

}
export default KhaltiVerification