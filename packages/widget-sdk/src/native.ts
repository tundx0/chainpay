import React from "react";
// Import WebView from react-native-webview peerDependency
import { WebView } from "react-native-webview";

export interface ChainPayMobileProps {
  paymentId: string;
  onSuccess?: (data: any) => void;
  onClose?: () => void;
  checkoutUrl?: string; // defaults to http://localhost:3000
}

export function ChainPayCheckout({
  paymentId,
  onSuccess,
  onClose,
  checkoutUrl = "http://localhost:3000",
}: ChainPayMobileProps) {
  const handleMessage = (event: any) => {
    try {
      const payloadString = event.nativeEvent.data;
      if (!payloadString) return;

      const message = JSON.parse(payloadString);
      if (message.type === "chainpay:success" && onSuccess) {
        onSuccess(message.data);
      } else if (message.type === "chainpay:close" && onClose) {
        onClose();
      }
    } catch (e) {
      // Ignore non-JSON postMessage payloads
    }
  };

  return React.createElement(WebView, {
    source: { uri: `${checkoutUrl}/pay/${paymentId}?embed=true` },
    onMessage: handleMessage,
    style: { flex: 1 },
  });
}
