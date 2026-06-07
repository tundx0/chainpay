import React from "react";
import CodeBlock from "../../components/CodeBlock";

export default function WidgetSdkPage() {
  const cdnSnippet = `<!-- 1. Include the CDN script tag -->
<script src="https://dashboard.nodecheckout.com/widget.js"></script>

<!-- 2. Call the script anywhere in your code -->
<script>
  function payNow() {
    ChainPay.open({
      paymentId: "pay_10283",
      onSuccess: (payment) => {
        console.log("Payment completed successfully:", payment.txHash);
      },
      onClose: () => {
        console.log("Payment popup dismissed by customer");
      }
    });
  }
</script>`;

  const reactSnippet = `import { useChainPayWidget } from "@repo/widget-sdk/react";

function PayComponent() {
  const { open, close } = useChainPayWidget({
    onSuccess: (payment) => console.log("Paid:", payment.txHash),
    onClose: () => console.log("Closed"),
  });

  return (
    <button onClick={() => open("pay_10283")}>
      Pay with ChainPay
    </button>
  );
}`;

  const nativeSnippet = `import { ChainPayCheckout } from "@repo/widget-sdk/native";

function CheckoutScreen() {
  return (
    <ChainPayCheckout
      paymentId="pay_10283"
      checkoutUrl="https://dashboard.nodecheckout.com"
      onSuccess={(data) => console.log("App paid:", data)}
      onClose={() => console.log("App closed")}
    />
  );
}`;

  return (
    <div className="doc-content">
      <h1>Widget SDK</h1>
      <p>
        The ChainPay Widget SDK lets you embed the checkout screen directly on your website or mobile application as a sandboxed iframe overlay, keeping customers engaged without redirect loops.
      </p>

      <h2>1. Direct CDN Script Tag (Browser IIFE/UMD)</h2>
      <p>
        For standard HTML pages, import the minified global bundle from the CDN. The SDK will automatically detect its loading origin and coordinate overlays:
      </p>
      <CodeBlock snippets={{ "HTML Script": cdnSnippet }} />

      <h2>2. React Hook Wrapper</h2>
      <p>
        If your website is built with React/Next.js, install the workspace package and use the custom React hooks bridge:
      </p>
      <CodeBlock snippets={{ "React Integration": reactSnippet }} />

      <h2>3. React Native WebView (Mobile App)</h2>
      <p>
        Deploy checkouts inside iOS and Android mobile apps by mounting our mobile WebView wrapper:
      </p>
      <CodeBlock snippets={{ "React Native Integration": nativeSnippet }} />

      <div className="doc-alert">
        <span className="doc-alert-title">🔗 Standardized PostMessage Protocol</span>
        <p>
          All adapters are built on a framework-agnostic JSON protocol. The checkout frame dispatches broadcast messages to the parent context, making it simple to write custom wrappers for Vue, Angular, Svelte, or native Swift/Kotlin.
        </p>
      </div>
    </div>
  );
}
