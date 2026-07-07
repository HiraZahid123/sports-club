import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
function AthleteSubscriptions({
  subscriptions = [],
  className = ""
}) {
  const [expandedSubscription, setExpandedSubscription] = useState(null);
  const togglePayments = (id) => {
    setExpandedSubscription(expandedSubscription === id ? null : id);
  };
  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "unpaid":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "overdue":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    } catch (e) {
      return dateStr;
    }
  };
  return /* @__PURE__ */ jsxs("section", { className, children: [
    /* @__PURE__ */ jsx("header", { className: "mb-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 text-lg", children: "💳" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-gray-900", children: "My Subscriptions" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-0.5", children: "Manage your active training plans and download payment invoices." })
      ] })
    ] }) }),
    subscriptions.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-10 border border-dashed border-gray-200 rounded-2xl text-center bg-gray-50/50", children: [
      /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl mb-3", children: "🏷️" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-gray-600", children: "No active subscriptions" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 mt-1 max-w-sm", children: "You are not registered in any training groups. Join a group below to start training!" })
    ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-4", children: subscriptions.map((sub) => {
      const isExpanded = expandedSubscription === sub.id;
      const hasPayments = sub.payments && sub.payments.length > 0;
      return /* @__PURE__ */ jsxs(
        "div",
        {
          className: "border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "p-5 flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 flex-wrap", children: [
                  /* @__PURE__ */ jsx("h3", { className: "font-bold text-gray-900 text-base", children: sub.plan_name }),
                  /* @__PURE__ */ jsx("span", { className: `text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${getStatusBadgeClass(sub.status)}`, children: sub.status })
                ] }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500 font-medium", children: [
                  "Group: ",
                  /* @__PURE__ */ jsx("span", { className: "font-semibold text-gray-700", children: sub.training_group?.name ?? "General" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-1 md:text-right", children: [
                /* @__PURE__ */ jsxs("span", { className: "text-xl font-black text-indigo-600", children: [
                  "€",
                  sub.amount
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "text-xs font-semibold text-gray-400", children: [
                  "/",
                  sub.billing_cycle
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-x-4 gap-y-1 text-xs md:text-right", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-gray-400", children: "Starts:" }),
                  " ",
                  /* @__PURE__ */ jsx("span", { className: "font-semibold text-gray-700", children: formatDate(sub.starts_at) })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-gray-400", children: "Ends:" }),
                  " ",
                  /* @__PURE__ */ jsx("span", { className: "font-semibold text-gray-700", children: formatDate(sub.ends_at) })
                ] }),
                sub.status === "active" && /* @__PURE__ */ jsxs("div", { className: "col-span-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-gray-400", children: "Next Payment:" }),
                  " ",
                  /* @__PURE__ */ jsx("span", { className: "font-semibold text-indigo-600", children: formatDate(sub.next_payment_at) })
                ] })
              ] }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => togglePayments(sub.id),
                  className: "text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 mt-2 md:mt-0 transition-colors",
                  children: [
                    isExpanded ? "Hide Payments" : "View Payments",
                    /* @__PURE__ */ jsx(
                      "svg",
                      {
                        className: `w-3.5 h-3.5 transform transition-transform ${isExpanded ? "rotate-180" : ""}`,
                        fill: "none",
                        viewBox: "0 0 24 24",
                        stroke: "currentColor",
                        children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M19 9l-7 7-7-7" })
                      }
                    )
                  ]
                }
              )
            ] }),
            isExpanded && /* @__PURE__ */ jsxs("div", { className: "border-t border-gray-50 bg-gray-50/50 p-5", children: [
              /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold text-gray-500 uppercase tracking-wider mb-3", children: "Payment & Billing History" }),
              !hasPayments ? /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 italic", children: "No payments logged yet for this subscription." }) : /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-xl border border-gray-200/60 bg-white", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-gray-100 text-left text-xs", children: [
                /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 text-gray-500 font-bold uppercase tracking-wider", children: /* @__PURE__ */ jsxs("tr", { children: [
                  /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Date" }),
                  /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Method" }),
                  /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Amount" }),
                  /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Status" }),
                  /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-right", children: "Invoice" })
                ] }) }),
                /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-50", children: sub.payments?.map((payment) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50/50 transition-colors", children: [
                  /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-medium text-gray-700", children: formatDate(payment.payment_date) }),
                  /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-semibold text-gray-500 uppercase", children: payment.payment_method ?? "Admin Log" }),
                  /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 font-bold text-gray-800", children: [
                    "€",
                    payment.amount
                  ] }),
                  /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx("span", { className: `inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${payment.status.toLowerCase() === "completed" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"}`, children: payment.status }) }),
                  /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right", children: payment.status.toLowerCase() === "completed" ? /* @__PURE__ */ jsxs(
                    "a",
                    {
                      href: route("invoices.download", payment.id),
                      className: "inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors",
                      children: [
                        /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" }) }),
                        "PDF Invoice"
                      ]
                    }
                  ) : /* @__PURE__ */ jsx("span", { className: "text-gray-400 italic", children: "Unavailable" }) })
                ] }, payment.id)) })
              ] }) })
            ] })
          ]
        },
        sub.id
      );
    }) })
  ] });
}
export {
  AthleteSubscriptions as default
};
