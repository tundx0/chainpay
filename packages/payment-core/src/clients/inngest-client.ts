import { Inngest } from "inngest";

export type PaymentCreatedEvent = {
  data: {
    paymentId: string;
  };
};

export type PaymentReceivedEvent = {
  data: {
    paymentId: string;
    txHash: string;
    payerAddress: string;
  };
};

export type PaymentConfirmedEvent = {
  data: {
    paymentId: string;
    blockNumber: string;
  };
};

export interface ChainPayEvents {
  "payment.created": PaymentCreatedEvent;
  "payment.received": PaymentReceivedEvent;
  "payment.confirmed": PaymentConfirmedEvent;
}

export const inngest = new Inngest({
  id: "chainpay",
  schemas: {} as ChainPayEvents,
});
