import React, { useEffect, useRef, useState } from "react";

const CreditCardForm: React.FC = () => {
  const cardNumberRef = useRef<any>(null);
  const securityCodeRef = useRef<any>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchCaptureContext = async () => { console.log('d');
        try {
          const response = await fetch("https://staging.texasdebrazil.com/wp-admin/admin-ajax.php?action=get_cybersource_session");
          const data = await response.json();
          if (data.clientLibrary) {
            loadCyberSourceScript(data.clientLibrary, data.clientLibraryIntegrity, data.captureContext);
          }
        } catch (error) {
          console.error("Error fetching capture context:", error);
        }
      };
      
      const loadCyberSourceScript = (url: string, integrity: string, captureContext: string) => {
        console.log('loadCyberSourceScript',url,integrity);
        const script = document.createElement("script");
        script.src = url;
        script.async = true;
        script.integrity = integrity;
        script.crossOrigin = "anonymous";
        script.onload = () => initializeMicroform(captureContext); // Corrected line
        document.body.appendChild(script);
      };

      fetchCaptureContext();
      
  }, []);

  const initializeMicroform = (captureContext: string) => {

    console.log('window',window);

    console.log('captureContext',captureContext);

    const flex = new (window as any).Flex(captureContext);

    console.log('flex',flex);
    
    if (!flex) return;

    const customStyles = {

        'input': {
          'font-size': '16px',
          'color': '#3A3A3A'
        },
        '::placeholder': {
          'color': 'blue'
        },
        ':focus': {
          'color': 'blue'
        },
        ':hover': {
          'font-style': 'italic'
        },
        ':disabled': {
          'cursor': 'not-allowed',
        },
        'valid': {
          'color': 'green'
        },
        'invalid': {
          'color': 'red'
        }
      };


      const microform = flex.microform({ styles: customStyles });


      const number = microform.createField('number', { placeholder: 'Enter card number' });
      const securityCode = microform.createField('securityCode', { placeholder: '•••' });
            number.load('#card-number-container');
            securityCode.load('#security-code-container');


  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumberRef.current) return;

    cardNumberRef.current.createToken()
      .then((response: { token: string }) => {
        console.log("Token generado:", response.token);
        setToken(response.token);
        sendTokenToBackend(response.token);
      })
      .catch((error: Error) => {
        console.error("Error generando token:", error);
      });
  };

  const sendTokenToBackend = async (token: string) => {
    try {
        const formData = new FormData();
        formData.append("action", "process_payment");
        formData.append("token", token);
        
        const response = await fetch("https://staging.texasdebrazil.com/wp-admin/admin-ajax.php", {
          method: "POST",
          body: formData,
        });

      const data = await response.json();
      console.log("Respuesta del backend:", data);
    } catch (error) {
      console.error("Error al enviar el token:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
      {/* Cardholder Name */}
      <div className="mb-4">
        <label htmlFor="cardholderName" className="block text-gray-700 font-semibold mb-1">
          Name on Card
        </label>
        <input
          id="cardholderName"
          name="cardholderName"
          placeholder="John Doe"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
        />
      </div>

      {/* Card Number */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-1">Card Number</label>
        <div id="card-number-container" className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"></div>
      </div>

      {/* Security Code */}
      <div className="mb-4">
        <label htmlFor="security-code-container" className="block text-gray-700 font-semibold mb-1">
          Security Code
        </label>
        <div id="security-code-container" className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"></div>
      </div>

      {/* Expiry Date */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Expiry Month */}
        <div>
          <label htmlFor="expMonth" className="block text-gray-700 font-semibold mb-1">
            Expiry Month
          </label>
          <select id="expMonth" className="w-full p-2 border border-gray-300 rounded-md">
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={String(i + 1).padStart(2, "0")}>
                {String(i + 1).padStart(2, "0")}
              </option>
            ))}
          </select>
        </div>

        {/* Expiry Year */}
        <div>
          <label htmlFor="expYear" className="block text-gray-700 font-semibold mb-1">
            Expiry Year
          </label>
          <select id="expYear" className="w-full p-2 border border-gray-300 rounded-md">
            {Array.from({ length: 10 }, (_, i) => (
              <option key={i} value={2024 + i}>
                {2024 + i}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hidden Input */}
      <input type="hidden" id="flexresponse" name="flexresponse" />

      {/* Pay Button */}
      <button
        type="submit"
        id="pay-button"
        className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition"
      >
        Pay
      </button>
    </form>

      {token && <p>Token generado: {token}</p>}
    </div>
    
  );
};

export default CreditCardForm;
