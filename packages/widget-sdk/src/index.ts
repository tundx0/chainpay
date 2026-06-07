export interface WidgetConfig {
  paymentId: string;
  onSuccess?: (payment: any) => void;
  onClose?: () => void;
  checkoutUrl?: string;
}

let DEFAULT_CHECKOUT_URL = "http://localhost:3000";

if (typeof document !== "undefined" && document.currentScript) {
  const src = (document.currentScript as HTMLScriptElement).src;
  if (src && src.startsWith("http")) {
    try {
      DEFAULT_CHECKOUT_URL = new URL(src).origin;
    } catch (e) {
      // fallback
    }
  }
}

const WIDGET_STYLE_ID = "chainpay-widget-styles";

function injectStyles() {
  if (document.getElementById(WIDGET_STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = WIDGET_STYLE_ID;
  style.innerHTML = `
    #chainpay-widget-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(8, 8, 10, 0.75);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 999999;
      opacity: 0;
      transition: opacity 0.25s ease-out;
      pointer-events: auto;
    }

    #chainpay-widget-backdrop.chainpay-visible {
      opacity: 1;
    }

    #chainpay-widget-container {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -45%) scale(0.96);
      width: 100%;
      max-width: 440px;
      height: 90vh;
      max-height: 680px;
      z-index: 1000000;
      opacity: 0;
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease-out;
      pointer-events: none;
    }

    #chainpay-widget-container.chainpay-visible {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
      pointer-events: auto;
    }

    #chainpay-widget-iframe {
      width: 100%;
      height: 100%;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 24px;
      box-shadow: 0 24px 48px -12px rgba(0, 0, 0, 0.5);
      background: #09090b;
      overflow: hidden;
    }

    @media (max-width: 480px) {
      #chainpay-widget-container {
        top: auto;
        bottom: 0;
        left: 0;
        transform: translateY(100%);
        max-width: 100%;
        width: 100%;
        height: 100%;
        max-height: 90vh;
        border-radius: 24px 24px 0 0;
      }
      
      #chainpay-widget-container.chainpay-visible {
        transform: translateY(0);
      }
      
      #chainpay-widget-iframe {
        border-radius: 24px 24px 0 0;
        border-bottom: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

let activeMessageListener: ((event: MessageEvent) => void) | null = null;

export function open(config: WidgetConfig): void {
  // Ensure styles are injected
  if (typeof window === "undefined" || typeof document === "undefined") return;
  injectStyles();

  // Close any existing widget instance first
  close();

  const checkoutUrl = config.checkoutUrl ?? DEFAULT_CHECKOUT_URL;
  const embedUrl = `${checkoutUrl}/pay/${config.paymentId}?embed=true`;

  // Create elements
  const backdrop = document.createElement("div");
  backdrop.id = "chainpay-widget-backdrop";

  const container = document.createElement("div");
  container.id = "chainpay-widget-container";

  const iframe = document.createElement("iframe");
  iframe.id = "chainpay-widget-iframe";
  iframe.src = embedUrl;
  iframe.allow = "clipboard-write";

  container.appendChild(iframe);
  document.body.appendChild(backdrop);
  document.body.appendChild(container);

  // Trigger animations
  setTimeout(() => {
    backdrop.classList.add("chainpay-visible");
    container.classList.add("chainpay-visible");
  }, 10);

  // Setup postMessage event listener
  activeMessageListener = (event: MessageEvent) => {
    // Basic origin check (could be tightened in production, but let's allow flexibility for dev)
    const origin = event.origin;
    if (!embedUrl.startsWith(origin)) return;

    const msg = event.data;
    if (!msg || typeof msg !== "object") return;

    if (msg.type === "chainpay:success") {
      if (config.onSuccess) config.onSuccess(msg.data);
      close();
    } else if (msg.type === "chainpay:close") {
      if (config.onClose) config.onClose();
      close();
    }
  };

  window.addEventListener("message", activeMessageListener);

  // Close on clicking backdrop
  backdrop.addEventListener("click", () => {
    if (config.onClose) config.onClose();
    close();
  });
}

export function close(): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const backdrop = document.getElementById("chainpay-widget-backdrop");
  const container = document.getElementById("chainpay-widget-container");

  if (activeMessageListener) {
    window.removeEventListener("message", activeMessageListener);
    activeMessageListener = null;
  }

  if (backdrop && container) {
    backdrop.classList.remove("chainpay-visible");
    container.classList.remove("chainpay-visible");

    // Remove elements after animations transition completes
    setTimeout(() => {
      backdrop.parentNode?.removeChild(backdrop);
      container.parentNode?.removeChild(container);
    }, 300);
  }
}
