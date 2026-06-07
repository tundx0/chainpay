import { useEffect, useCallback } from "react";
import { open as openWidget, close as closeWidget } from "./index";

export interface ReactWidgetConfig {
  onSuccess?: (payment: any) => void;
  onClose?: () => void;
  checkoutUrl?: string;
}

export function useChainPayWidget(config: ReactWidgetConfig = {}) {
  const open = useCallback(
    (paymentId: string) => {
      openWidget({
        paymentId,
        onSuccess: config.onSuccess,
        onClose: config.onClose,
        checkoutUrl: config.checkoutUrl,
      });
    },
    [config.onSuccess, config.onClose, config.checkoutUrl]
  );

  const close = useCallback(() => {
    closeWidget();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      closeWidget();
    };
  }, []);

  return { open, close };
}
