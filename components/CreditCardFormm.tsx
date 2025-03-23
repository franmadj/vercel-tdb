declare global {
  interface Window {
    microform: any
  }
}

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface CreditCardFormProps {
  billingDetails: {
    firstName: string
    lastName: string
    email: string
    address: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  orderAmount: string
  orderId: string
  onPaymentSuccess:CallableFunction
}

const CreditCardForm: React.FC<CreditCardFormProps> = ({
  billingDetails,
  orderAmount,
  orderId,
  onPaymentSuccess
}) => {
  const [token, setToken] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchCaptureContext = async () => {
      console.log("d")
      try {
        const response = await fetch(
          "https://staging.texasdebrazil.com/wp-admin/admin-ajax.php?action=get_cybersource_session"
        )
        const data = await response.json()
        if (data.clientLibrary) {
          loadCyberSourceScript(
            data.clientLibrary,
            data.clientLibraryIntegrity,
            data.captureContext
          )
        }
      } catch (error) {
        console.error("Error fetching capture context:", error)
      }
    }


  }, [])



  const handleSubmit = async (e: React.FormEvent) => {
    console.log("handleSubmit")
    e.preventDefault()
    if (!window.microform) {
      console.error("Microform is not initialized.")
      return
    }

    const options = {
      expirationMonth: '01',
      expirationYear: '2031'
  };

    window.microform.createToken(options, (err: any, token: string) => {
      if (err) {
        console.error(err)
        alert(err.message)
        return
      }
      console.log("Token successfully created!", token)

    })
  }



  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className='w-full mx-auto bg-white p-6 rounded-lg shadow-lg'
      >
        {/* Cardholder Name */}
        <div className='mb-4'>
          <label
            htmlFor='cardholderName'
            className='block text-gray-700 font-semibold mb-1'
          >
            Name on Card
          </label>
          <input
            id='cardholderName'
            name='cardholderName'
            placeholder='John Doe'
            className='w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300'
          />
        </div>

        {/* Card Number */}
        <div className='mb-4'>
          <label className='block text-gray-700 font-semibold mb-1'>
            Card Number
          </label>
          <div
            id='card-number-container'
            className='w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 h-12'
          ></div>
        </div>

        {/* Security Code */}
        <div className='mb-4'>
          <label
            htmlFor='security-code-container'
            className='block text-gray-700 font-semibold mb-1'
          >
            Security Code
          </label>
          <div
            id='security-code-container'
            className='w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 h-12'
          ></div>
        </div>

        {/* Expiry Date */}
        <div className='grid grid-cols-2 gap-4 mb-4'>
          {/* Expiry Month */}
          <div>
            <label
              htmlFor='expMonth'
              className='block text-gray-700 font-semibold mb-1'
            >
              Expiry Month
            </label>
            <select
              id='expMonth'
              className='w-full p-2 border border-gray-300 rounded-md'
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={String(i + 1).padStart(2, "0")}>
                  {String(i + 1).padStart(2, "0")}
                </option>
              ))}
            </select>
          </div>

          {/* Expiry Year */}
          <div>
            <label
              htmlFor='expYear'
              className='block text-gray-700 font-semibold mb-1'
            >
              Expiry Year
            </label>
            <select
              id='expYear'
              className='w-full p-2 border border-gray-300 rounded-md'
            >
              {Array.from({ length: 10 }, (_, i) => (
                <option key={i} value={2024 + i}>
                  {2024 + i}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Hidden Input */}
        <input type='hidden' id='flexresponse' name='flexresponse' />

        {/* Pay Button */}
        <button
          type='submit'
          id='pay-button'
          className='w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition'
        >
          Pay
        </button>
      </form>

      {token && <p>Token generado: {token}</p>}
    </div>
  )
}

export default CreditCardForm
