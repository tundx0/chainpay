import {
  createChainClient,
  getRequiredConfirmations,
  PaymentService,
  PaymentVerificationService,
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

      const saved = await this.paymentService.applyWatcherUpdate(
        payment.id,
        update,
      );

      if (!saved) {
        console.log(`[watcher] ${payment.id} update skipped`);
        return;
      }

      console.log(
        `[watcher] ${payment.id} -> ${saved.status} ` +
          `(confirmations: ${saved.confirmations}/${getRequiredConfirmations(saved.network as Network)}, tx: ${saved.txHash})`,
      );
    } catch (error) {
      console.error(`[watcher] Failed to inspect ${payment.id}:`, error);
    }
  }
}
