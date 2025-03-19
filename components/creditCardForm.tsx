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
        '.flex-microform': {
            'height': '20px;',
            'background': '#ffffff;',
            '-webkit-transition': 'background 200ms;',
            'transition': 'background 200ms;',
          },
          

          '#securityCode-container.flex-microform': {
            'background': 'purple;'
          },
          
          '.flex-microform-focused' :{
            'background': 'lightyellow;'
          },
          
          '.flex-microform-valid': {
            'background': 'green;'
          },
          
          '.flex-microform-valid.flex-microform-focused': {
            'background': 'lightgreen;'
          },
          
          '.flex-microform-autocomplete' :{
            'background': '#faffbd;'
          },
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
      <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="cardholderName">Name</label>
        <input id="cardholderName" className="form-control" name="cardholderName" placeholder="Name on the card"/>
        <label id="card-number-container">Card Number</label>
        <div id="card-number-container" className="form-control"></div>
        <label htmlFor="security-code-container">Security Code</label>
        <div id="security-code-container" className="form-control"></div>
    </div>

    <div className="form-row">
        <div className="form-group col-md-6">
            <label htmlFor="expMonth">Expiry month</label>
            <select id="expMonth" className="form-control">
                <option>01</option>
                <option>02</option>
                <option>03</option>
                <option>04</option>
                <option>05</option>
                <option>06</option>
                <option>07</option>
                <option>08</option>
                <option>09</option>
                <option>10</option>
                <option>11</option>
                <option>12</option>
            </select>
        </div>
        <div className="form-group col-md-6">
            <label htmlFor="expYear">Expiry year</label>
            <select id="expYear" className="form-control">
                <option>2021</option>
                <option>2022</option>
                <option>2023</option>
            </select>
        </div>
    </div>
    <button type="button" id="pay-button" className="btn btn-primary">Pay</button>
    <input type="hidden" id="flexresponse" name="flexresponse"></input>
      </form>

      {token && <p>Token generado: {token}</p>}
    </div>
    
  );
};

export default CreditCardForm;
