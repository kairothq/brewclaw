"use client"

import { useState } from "react"
import {
  CreditCard,
  Check,
  Receipt,
  Download,
  ArrowUpRight,
  Calendar,
  IndianRupee,
} from "lucide-react"
import { Button } from "@/components/ui/button"

// Mock data
const mockSubscription = {
  plan: "Pro",
  status: "active",
  amount: 499,
  nextBilling: "March 15, 2026",
  startDate: "February 15, 2026",
  paymentMethod: "**** 4242",
}

const mockInvoices = [
  {
    id: "INV-2026-002",
    date: "Feb 15, 2026",
    amount: 499,
    status: "paid",
    plan: "Pro",
  },
  {
    id: "INV-2026-001",
    date: "Jan 15, 2026",
    amount: 499,
    status: "paid",
    plan: "Pro",
  },
]

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 199,
    description: "For casual personal use",
    features: ["Full Agent abilities", "1.5 GB RAM", "10 GB Storage", "Email support"],
    current: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 499,
    description: "For power users",
    features: [
      "Everything in Starter",
      "3 GB RAM",
      "20 GB Storage",
      "Priority support",
      "More AI credits",
    ],
    current: true,
    popular: true,
  },
  {
    id: "business",
    name: "Business",
    price: 1499,
    description: "For teams and heavy usage",
    features: [
      "Everything in Pro",
      "4 GB RAM",
      "60 GB Storage",
      "Dedicated support",
      "Advanced analytics",
    ],
    current: false,
  },
]

export default function BillingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Billing</h1>
        <p className="text-muted-foreground">Manage your subscription and payment methods</p>
      </div>

      {/* Current Plan Card */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Current Plan</h2>
              <p className="text-sm text-muted-foreground">
                Your subscription renews on {mockSubscription.nextBilling}
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-sm font-medium">
            {mockSubscription.status}
          </span>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 p-6 rounded-lg bg-secondary/30">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Plan</p>
            <p className="text-xl font-semibold text-foreground">{mockSubscription.plan}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Monthly Cost</p>
            <p className="text-xl font-semibold text-foreground">
              <span className="text-lg">₹</span>{mockSubscription.amount}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
            <p className="text-xl font-semibold text-foreground">{mockSubscription.paymentMethod}</p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline">Update Payment Method</Button>
          <Button variant="outline" className="text-red-500 border-red-500/20 hover:bg-red-500/10">
            Cancel Subscription
          </Button>
        </div>
      </div>

      {/* Change Plan */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-foreground mb-2">Change Plan</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Upgrade or downgrade your subscription
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => !plan.current && setSelectedPlan(plan.id)}
              className={`relative rounded-xl border p-5 transition-all duration-200 ${
                plan.current
                  ? "border-emerald-500 bg-emerald-500/5 cursor-default"
                  : selectedPlan === plan.id
                  ? "border-foreground bg-secondary cursor-pointer"
                  : "border-border hover:border-foreground/50 cursor-pointer"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Most Popular
                </span>
              )}
              {plan.current && (
                <span className="absolute -top-2.5 right-4 bg-foreground text-background text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Current
                </span>
              )}

              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-foreground">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-foreground">₹{plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>

                <ul className="space-y-2 pt-3 border-t border-border">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {!plan.current && (
                  <Button
                    variant={selectedPlan === plan.id ? "default" : "outline"}
                    className="w-full mt-2"
                    size="sm"
                  >
                    {plan.price > mockSubscription.amount ? "Upgrade" : "Downgrade"}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <Receipt className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Billing History</h2>
              <p className="text-sm text-muted-foreground">Download your past invoices</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-sm font-medium text-muted-foreground py-3 pr-4">
                  Invoice
                </th>
                <th className="text-left text-sm font-medium text-muted-foreground py-3 pr-4">
                  Date
                </th>
                <th className="text-left text-sm font-medium text-muted-foreground py-3 pr-4">
                  Plan
                </th>
                <th className="text-left text-sm font-medium text-muted-foreground py-3 pr-4">
                  Amount
                </th>
                <th className="text-left text-sm font-medium text-muted-foreground py-3 pr-4">
                  Status
                </th>
                <th className="text-right text-sm font-medium text-muted-foreground py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {mockInvoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-border last:border-0">
                  <td className="py-4 pr-4">
                    <span className="text-sm font-medium text-foreground">{invoice.id}</span>
                  </td>
                  <td className="py-4 pr-4">
                    <span className="text-sm text-muted-foreground">{invoice.date}</span>
                  </td>
                  <td className="py-4 pr-4">
                    <span className="text-sm text-foreground">{invoice.plan}</span>
                  </td>
                  <td className="py-4 pr-4">
                    <span className="text-sm text-foreground">₹{invoice.amount}</span>
                  </td>
                  <td className="py-4 pr-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500">
                      {invoice.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <Download className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {mockInvoices.length > 5 && (
          <div className="mt-4 text-center">
            <Button variant="ghost" size="sm">
              View all invoices
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
