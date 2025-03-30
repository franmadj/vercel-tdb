import React from "react";
import GooglePayButton from "@google-pay/button-react";

const GooglePayComponent: React.FC<{ onPaymentSuccess: (token: string) => void }> = ({ onPaymentSuccess }) => {
  return (
    <GooglePayButton
      environment="TEST" // Change to "PRODUCTION" for live transactions
      paymentRequest={{
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [
          {
            type: "CARD",
            parameters: {
              allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
              allowedCardNetworks: ["VISA", "MASTERCARD", "AMEX", "DISCOVER"],
            },
            tokenizationSpecification: {
              type: "PAYMENT_GATEWAY",
              parameters: {
                gateway: "cybersource",
                gatewayMerchantId: "tdb_gc_corp", // Replace with your merchant ID
              },
            },
          },
        ],
        merchantInfo: {
          merchantId: "BCR2DN4TX7G3FMYF", // Get this from Google Pay Developer Console
          merchantName: "TDB",
        },
        transactionInfo: {
          totalPriceStatus: "FINAL",
          totalPrice: "10.00",
          currencyCode: "USD",
        },
      }}
      onLoadPaymentData={(paymentData) => {
        console.log("Google Pay PaymentData:", paymentData);
        const enc=window.btoa(paymentData.paymentMethodData.tokenizationData.token);
        onPaymentSuccess(enc);
      }}
    />
  );
};

export default GooglePayComponent;
