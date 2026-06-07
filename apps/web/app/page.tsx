"use client";

import React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Hero from "../components/hero/Hero";
import Playground from "../components/playground/Playground";
import FeatureGrid from "../components/features/FeatureGrid";
import { MarketTicker } from "@repo/ui/market-ticker";
import { PriceEstimator } from "@repo/ui/price-estimator";
import { useRates } from "@repo/wallet-core";

export default function LandingPage() {
  const { data: ratesData, isLoading, dataUpdatedAt } = useRates();
  const rates = ratesData ?? {
    ETH: 3000,
    BTC: 60000,
    USDC: 1,
    USDT: 1,
  };
  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : "";

  return (
    <div className="min-h-screen bg-bg text-text-primary flex flex-col font-inter">
      {/* Navbar Header */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-[1200px] mx-auto px-6 py-16 flex flex-col gap-24 w-full">
        {/* Animated Hero Section with FlowVisualizer */}
        <Hero />

        {/* Live Market Telemetry Ticker */}
        <section className="animate-fade-in-up delay-100 flex flex-col gap-3">
          <div className="flex justify-between items-center px-1">
            <span className="font-mono text-[9px] font-bold text-text-secondary tracking-widest uppercase">
              [ REAL_TIME_MARKET_TELEMETRY ]
            </span>
            {lastUpdated && (
              <span className="font-mono text-[9px] text-text-muted">
                TICKER_REFRESH: {lastUpdated}
              </span>
            )}
          </div>
          <MarketTicker rates={rates} loading={isLoading} showTitle={false} />
        </section>

        {/* Code Integration Playground */}
        <Playground />

        {/* Estimation Telemetry (Calculator) Section */}
        <section className="animate-fade-in-up delay-300 grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          {/* Shared Calculator Component */}
          <div className="lg:col-span-3 w-full">
            <PriceEstimator rates={rates} />
          </div>

          <div className="lg:col-span-2 flex flex-col gap-5 text-left">
            <div className="font-mono text-[10px] text-accent font-bold tracking-widest uppercase">
              [ SETTLEMENT_CONVERSION ]
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-text-primary leading-tight">
              Instantly settle rates <br />
              during invoice creation
            </h2>
            <p className="text-text-secondary text-[14px] leading-relaxed">
              When standard invoices are settled, the processor computes exchange rates with CoinGecko simple price services and persists the exact historical USD valuation in Postgres immediately on payment validation. 
            </p>
            <div className="h-[1px] bg-border my-2" />
            <div className="flex gap-6">
              <div>
                <span className="block text-xl font-bold font-mono text-accent">0%</span>
                <span className="text-xs text-text-muted">Platform cut</span>
              </div>
              <div>
                <span className="block text-xl font-bold font-mono text-text-primary">15s</span>
                <span className="text-xs text-text-muted">Telemetry cache sync</span>
              </div>
              <div>
                <span className="block text-xl font-bold font-mono text-text-primary">EVM</span>
                <span className="text-xs text-text-muted">Multichain native</span>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Matrix Grid */}
        <FeatureGrid />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
