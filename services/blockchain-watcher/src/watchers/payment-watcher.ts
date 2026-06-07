import {
  createChainClient,
  getRequiredConfirmations,
  PaymentService,
  PaymentVerificationService,
  inngest,
  type ChainClient,
  type ChainClientFactory,
} from "@repo/payment-core";
import type { Network, PaymentRequest } from "@repo/payment-core";

export class PaymentWatcher {
  private readonly clients = new Map<Network, ChainClient>();
  private running = false;

  constructor(
    private readonly paymentService: PaymentService,
    private readonly verificationService: PaymentVerificationService,
    private readonly createClient: ChainClientFactory = createChainClient,
  ) {}

  async runOnce(): Promise<void> {
    const payments = await this.paymentService.listWatchablePayments();

    if (payments.length === 0) {
      console.log("[watcher] No payments awaiting on-chain settlement");
      return;
    }

    console.log(`[watcher] Inspecting ${payments.length} payment(s)`);

    for (const payment of payments) {
      await this.inspectPayment(payment);
    }
  }

  start(intervalMs: number): void {
    if (this.running) {
      return;
    }

    this.running = true;
    void this.runOnce();

    setInterval(() => {
      void this.runOnce();
    }, intervalMs);
  }

  private getClient(network: Network): ChainClient {
    const existing = this.clients.get(network);
    if (existing) {
      return existing;
    }

    const client = this.createClient(network);
    this.clients.set(network, client);
    return client;
  }

  private async inspectPayment(payment: PaymentRequest): Promise<void> {
    try {
      const client = this.getClient(payment.network as Network);
      const update = await this.verificationService.inspectPayment(
        client,
        payment,
      );

      if (!update) {
        console.log(
          `[watcher] ${payment.id} no matching transfer yet (${payment.status})`,
        );
        return;
      }

      // Emit transaction received event to Inngest if still pending
      if (payment.status === "pending") {
        console.log(`[watcher] ${payment.id} transfer detected. Emitting payment.received...`);
        await inngest.send({
          name: "payment.received",
          data: {
            paymentId: payment.id,
            txHash: update.txHash,
            payerAddress: update.payerAddress,
          },
        });
      }

      // Sync confirmations count in database for telemetry.
      // Keep status as 'confirming' until Inngest updates it to 'completed'
      const targetConfirmations = getRequiredConfirmations(payment.network as Network);
      const updatePayload = {
        ...update,
        status: (update.status === "completed" ? "confirming" : update.status) as any,
      };

      const saved = await this.paymentService.applyWatcherUpdate(
        payment.id,
        updatePayload,
      );

      if (!saved) {
        console.log(`[watcher] ${payment.id} db sync skipped`);
      } else {
        console.log(
          `[watcher] ${payment.id} updated in DB -> status: ${saved.status}, confirmations: ${saved.confirmations}/${targetConfirmations}`
        );
      }

      // Emit confirmations complete event to Inngest
      if (update.confirmations >= targetConfirmations) {
        console.log(`[watcher] ${payment.id} confirmations met (${update.confirmations}/${targetConfirmations}). Emitting payment.confirmed...`);
        await inngest.send({
          name: "payment.confirmed",
          data: {
            paymentId: payment.id,
            blockNumber: update.blockNumber,
          },
        });
      }
    } catch (error) {
      console.error(`[watcher] Failed to inspect ${payment.id}:`, error);
    }
  }
}
