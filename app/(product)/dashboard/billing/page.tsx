'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Receipt, ArrowRight, Check, Zap } from 'lucide-react';

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: '₹199',
    period: '/month',
    features: ['1.5GB RAM', 'BYOK (Your API Key)', 'Email Support'],
    ram: '1.5GB',
    storage: '10GB'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '₹499',
    period: '/month',
    features: ['3GB RAM', 'BYOK (Your API Key)', 'Priority Support'],
    popular: true,
    ram: '3GB',
    storage: '20GB'
  },
  {
    id: 'business',
    name: 'Business',
    price: '₹1,499',
    period: '/month',
    features: ['4GB RAM', 'BYOK (Your API Key)', 'Priority Support'],
    ram: '4GB',
    storage: '60GB'
  }
];

export default function BillingPage() {
  const [currentPlan, setCurrentPlan] = useState('starter');
  const [subscription, setSubscription] = useState<{
    status: string;
    nextBilling: string;
    startDate: string;
  } | null>(null);

  useEffect(() => {
    // Mock subscription data - in production, fetch from API
    setSubscription({
      status: 'active',
      nextBilling: 'March 26, 2026',
      startDate: 'February 26, 2026'
    });
  }, []);

  const currentPlanDetails = PLANS.find(p => p.id === currentPlan);

  return (
    <div className="min-h-screen">
      {/* Subtle background accent */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/3 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Page Header */}
        <h1 className="text-2xl font-bold text-white mb-6">Billing</h1>

        {/* Current Subscription */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-zinc-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Current Subscription</h2>
              <p className="text-sm text-zinc-500">Your active plan and billing details</p>
            </div>
          </div>

          {subscription && (
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Plan Info */}
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-zinc-400">Current Plan</p>
                    <p className="text-xl font-bold text-white">{currentPlanDetails?.name}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    subscription.status === 'active'
                      ? 'bg-green-500/10 text-green-400'
                      : 'bg-yellow-500/10 text-yellow-400'
                  }`}>
                    {subscription.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Amount</span>
                    <span className="text-white font-medium">{currentPlanDetails?.price}/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">RAM</span>
                    <span className="text-white">{currentPlanDetails?.ram}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Storage</span>
                    <span className="text-white">{currentPlanDetails?.storage}</span>
                  </div>
                </div>
              </div>

              {/* Billing Info */}
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <p className="text-sm text-zinc-400 mb-4">Billing Details</p>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Started</span>
                    <span className="text-white">{subscription.startDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Next billing</span>
                    <span className="text-white">{subscription.nextBilling}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Payment method</span>
                    <span className="text-white">Razorpay</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Upgrade Plans */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
              <Zap className="w-5 h-5 text-zinc-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Upgrade Plan</h2>
              <p className="text-sm text-zinc-500">Get more resources and features</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {PLANS.map((plan) => {
              const isCurrent = plan.id === currentPlan;
              return (
                <div
                  key={plan.id}
                  className={`relative rounded-xl border p-4 transition-all duration-200 ${
                    isCurrent
                      ? 'border-orange-500 bg-orange-500/5'
                      : 'border-zinc-700 hover:border-zinc-600'
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-2 right-4 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                      Most Popular
                    </span>
                  )}
                  <div className="mb-4">
                    <h3 className="font-semibold text-white">{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-bold text-white">{plan.price}</span>
                      <span className="text-sm text-zinc-400">{plan.period}</span>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-zinc-400">
                        <Check className="w-4 h-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {isCurrent ? (
                    <button
                      disabled
                      className="w-full py-2 rounded-lg bg-zinc-800 text-zinc-500 text-sm font-medium cursor-not-allowed"
                    >
                      Current Plan
                    </button>
                  ) : (
                    <button className="w-full py-2 rounded-lg bg-orange-500 hover:bg-orange-400 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2">
                      Upgrade <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Billing History */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
              <Receipt className="w-5 h-5 text-zinc-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Billing History</h2>
              <p className="text-sm text-zinc-500">Your past invoices and receipts</p>
            </div>
          </div>

          <div className="text-center py-8">
            <Receipt className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-400">No billing history yet</p>
            <p className="text-sm text-zinc-500 mt-1">
              Your invoices will appear here after your first payment
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
