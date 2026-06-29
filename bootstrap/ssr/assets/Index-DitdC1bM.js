import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as Authenticated } from "./AuthenticatedLayout-DcfkJEmD.js";
import { usePage, Head, router } from "@inertiajs/react";
import { useState } from "react";
import "@headlessui/react";
import "axios";
import "./ml-sports-BEC2gdiG.js";
function ParentBilling({ mySubscriptions, childrenSubscriptions }) {
  const { flash } = usePage().props;
  const isLocked = flash?.error === "access-locked";
  const allSubscriptions = [...mySubscriptions, ...childrenSubscriptions];
  const [loadingSubId, setLoadingSubId] = useState(null);
  const paymentsList = allSubscriptions.reduce((acc, sub) => {
    if (sub.payments) {
      const subPayments = sub.payments.map((p) => ({
        ...p,
        plan_name: sub.plan_name,
        member_name: sub.user?.name || "Member"
      }));
      return [...acc, ...subPayments];
    }
    return acc;
  }, []);
  const sortedPayments = paymentsList.sort((a, b) => {
    return new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime();
  });
  const handlePayNow = (subId) => {
    setLoadingSubId(subId);
    router.post(route("parent.billing.checkout", { subscription: subId }), {}, {
      onError: () => {
        setLoadingSubId(null);
      },
      onFinish: () => {
        setLoadingSubId(null);
      }
    });
  };
  return /* @__PURE__ */ jsxs(
    Authenticated,
    {
      header: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-900", children: "My Billing & Payments" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-0.5", children: "Manage family subscriptions and view payment history" })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "My Billing" }),
        /* @__PURE__ */ jsx("div", { className: "py-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6", children: [
          flash?.success && /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4 p-5 bg-emerald-50 border border-emerald-200 rounded-2xl shadow-sm transition-all duration-300", children: [
            /* @__PURE__ */ jsx("div", { className: "w-11 h-11 bg-emerald-100 rounded-xl flex items-center justify-center text-2xl shrink-0", children: "✅" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h4", { className: "font-bold text-emerald-900 text-sm", children: "Payment Successful" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-emerald-700 mt-1 leading-relaxed", children: flash.success })
            ] })
          ] }),
          flash?.error && !isLocked && /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4 p-5 bg-rose-50 border border-rose-200 rounded-2xl shadow-sm transition-all duration-300", children: [
            /* @__PURE__ */ jsx("div", { className: "w-11 h-11 bg-rose-100 rounded-xl flex items-center justify-center text-2xl shrink-0", children: "⚠️" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h4", { className: "font-bold text-rose-900 text-sm", children: "Payment Failed" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-rose-700 mt-1 leading-relaxed", children: flash.error })
            ] })
          ] }),
          isLocked && /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4 p-5 bg-red-50 border border-red-200 rounded-2xl", children: [
            /* @__PURE__ */ jsx("div", { className: "w-11 h-11 bg-red-100 rounded-xl flex items-center justify-center text-2xl shrink-0", children: "🔒" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h4", { className: "font-bold text-red-900 text-sm", children: "Account Access Restricted" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-red-700 mt-1 leading-relaxed", children: "Your dashboard access has been restricted due to outstanding payments. Please settle your dues below to restore full access." })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-5 gap-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "lg:col-span-3 space-y-5", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-gray-900", children: "Family Subscriptions" }),
              allSubscriptions.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm py-12 text-center", children: [
                /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl mx-auto mb-3", children: "💳" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-500", children: "No active subscriptions found." })
              ] }) : allSubscriptions.map((sub, idx) => /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow", children: [
                /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-4", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsxs("p", { className: "text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1", children: [
                        sub.user.name,
                        "'s Plan"
                      ] }),
                      /* @__PURE__ */ jsx("h4", { className: "text-lg font-bold text-gray-900", children: sub.plan_name })
                    ] }),
                    /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${sub.status === "active" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"}`, children: [
                      /* @__PURE__ */ jsx("span", { className: `w-1.5 h-1.5 rounded-full ${sub.status === "active" ? "bg-emerald-500" : "bg-red-500"}` }),
                      sub.status.charAt(0).toUpperCase() + sub.status.slice(1)
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-end justify-between", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 font-medium", children: "Next Payment Due" }),
                      /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-900 text-sm mt-0.5", children: sub.next_payment_at || "Check with manager" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                      /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 font-medium", children: "Amount" }),
                      /* @__PURE__ */ jsxs("p", { className: "text-3xl font-black text-indigo-600 leading-none mt-0.5", children: [
                        "€",
                        sub.amount
                      ] })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "px-6 py-4 bg-slate-50 border-t border-gray-100", children: /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handlePayNow(sub.id),
                    disabled: loadingSubId !== null,
                    className: `w-full py-3 text-white text-sm font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 ${loadingSubId === sub.id ? "bg-indigo-400 cursor-not-allowed shadow-none" : loadingSubId !== null ? "bg-indigo-300 cursor-not-allowed shadow-none" : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"}`,
                    children: loadingSubId === sub.id ? /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsxs("svg", { className: "animate-spin -ml-1 mr-3 h-5 w-5 text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [
                        /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
                        /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
                      ] }),
                      "Redirecting to Stripe..."
                    ] }) : "Pay Now via Portal"
                  }
                ) })
              ] }, idx))
            ] }),
            /* @__PURE__ */ jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", children: [
              /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 border-b border-gray-50", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-gray-900", children: "Payment History" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-0.5", children: "Your recent transactions" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "divide-y divide-gray-50", children: sortedPayments.length === 0 ? /* @__PURE__ */ jsx("div", { className: "py-8 text-center text-sm font-medium text-gray-500", children: "No payment history found." }) : sortedPayments.map((payment, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-gray-900", children: payment.plan_name }),
                  /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-400 mt-0.5", children: [
                    payment.member_name,
                    " • ",
                    new Date(payment.payment_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "font-black text-sm text-emerald-600", children: [
                  "+€",
                  parseFloat(payment.amount).toFixed(2)
                ] })
              ] }, i)) }),
              /* @__PURE__ */ jsx("div", { className: "px-6 py-3.5 bg-slate-50 border-t border-gray-100 text-center", children: /* @__PURE__ */ jsx("button", { className: "text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors", children: "View Full History" }) })
            ] }) })
          ] })
        ] }) })
      ]
    }
  );
}
export {
  ParentBilling as default
};
