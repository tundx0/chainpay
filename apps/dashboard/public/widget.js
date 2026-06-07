"use strict";var ChainPay=(()=>{var s=Object.defineProperty;var m=Object.getOwnPropertyDescriptor;var y=Object.getOwnPropertyNames;var f=Object.prototype.hasOwnProperty;var b=(e,t)=>{for(var n in t)s(e,n,{get:t[n],enumerable:!0})},g=(e,t,n,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of y(t))!f.call(e,i)&&i!==n&&s(e,i,{get:()=>t[i],enumerable:!(a=m(t,i))||a.enumerable});return e};var w=e=>g(s({},"__esModule",{value:!0}),e);var E={};b(E,{close:()=>d,open:()=>x});var h="http://localhost:3000";if(typeof document<"u"&&document.currentScript){let e=document.currentScript.src;if(e&&e.startsWith("http"))try{h=new URL(e).origin}catch{}}var l="chainpay-widget-styles";function v(){if(document.getElementById(l))return;let e=document.createElement("style");e.id=l,e.innerHTML=`
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
  `,document.head.appendChild(e)}var r=null;function x(e){if(typeof window>"u"||typeof document>"u")return;v(),d();let n=`${e.checkoutUrl??h}/pay/${e.paymentId}?embed=true`,a=document.createElement("div");a.id="chainpay-widget-backdrop";let i=document.createElement("div");i.id="chainpay-widget-container";let c=document.createElement("iframe");c.id="chainpay-widget-iframe",c.src=n,c.allow="clipboard-write",i.appendChild(c),document.body.appendChild(a),document.body.appendChild(i),setTimeout(()=>{a.classList.add("chainpay-visible"),i.classList.add("chainpay-visible")},10),r=p=>{let u=p.origin;if(!n.startsWith(u))return;let o=p.data;!o||typeof o!="object"||(o.type==="chainpay:success"?(e.onSuccess&&e.onSuccess(o.data),d()):o.type==="chainpay:close"&&(e.onClose&&e.onClose(),d()))},window.addEventListener("message",r),a.addEventListener("click",()=>{e.onClose&&e.onClose(),d()})}function d(){if(typeof window>"u"||typeof document>"u")return;let e=document.getElementById("chainpay-widget-backdrop"),t=document.getElementById("chainpay-widget-container");r&&(window.removeEventListener("message",r),r=null),e&&t&&(e.classList.remove("chainpay-visible"),t.classList.remove("chainpay-visible"),setTimeout(()=>{e.parentNode?.removeChild(e),t.parentNode?.removeChild(t)},300))}return w(E);})();
