import { jsxs, jsx } from "react/jsx-runtime";
import { A as Authenticated } from "./AuthenticatedLayout-CkiyEXrL.js";
import { Head, Link } from "@inertiajs/react";
import { b as getBeltStyle, g as getBeltBadgeStyle } from "./beltHelpers-6FZX55wB.js";
import "@headlessui/react";
import "react";
import "axios";
import "./ml-sports-BEC2gdiG.js";
function ParentDashboard({
  childrenData = [],
  billingSummary = { nextPaymentDue: "Check with Manager", amountDue: 0 }
}) {
  const children = childrenData.length > 0 ? childrenData : [
    { name: "Alex Smith", group: "Juniors Taekwondo", status: "Active", belt: "8. YELLOW", progress: 60, classes: 18 },
    { name: "Sarah Smith", group: "Elite Sparring", status: "Active", belt: "4. BLUE", progress: 45, classes: 24 }
  ];
  return /* @__PURE__ */ jsxs(
    Authenticated,
    {
      header: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Parent Portal" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-0.5", children: "Monitor your children's training and manage payments" })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Parent Dashboard" }),
        /* @__PURE__ */ jsx("div", { className: "py-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-5", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-indigo-100 shadow-sm p-5", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-gray-400 uppercase tracking-wide mb-1", children: "Children Enrolled" }),
              /* @__PURE__ */ jsx("p", { className: "text-3xl font-black text-indigo-600", children: children.length })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-emerald-100 shadow-sm p-5", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-gray-400 uppercase tracking-wide mb-1", children: "Next Payment Due" }),
              /* @__PURE__ */ jsx("p", { className: "text-xl font-black text-emerald-600", children: billingSummary.nextPaymentDue })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-amber-100 shadow-sm p-5", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-gray-400 uppercase tracking-wide mb-1", children: "Amount Due" }),
              /* @__PURE__ */ jsxs("p", { className: "text-3xl font-black text-amber-600", children: [
                "€",
                Number(billingSummary.amountDue).toFixed(2)
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-5", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-gray-900", children: "My Children" }),
              /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-5", children: children.map((child, idx) => {
                return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow", children: [
                  /* @__PURE__ */ jsxs("div", { className: "p-5", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-4", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                        /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-100", children: child.name.charAt(0) }),
                        /* @__PURE__ */ jsxs("div", { children: [
                          /* @__PURE__ */ jsx("p", { className: "font-bold text-gray-900 text-sm", children: child.name }),
                          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: child.group })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1 px-2 py-1 text-[10px] font-bold rounded-lg border ${child.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-rose-50 text-rose-700 border-rose-100"}`, children: [
                        /* @__PURE__ */ jsx("span", { className: `w-1.5 h-1.5 rounded-full ${child.status === "Active" ? "bg-emerald-500" : "bg-rose-500"}` }),
                        child.status
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
                      /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${getBeltBadgeStyle(child.belt)}`, children: [
                        /* @__PURE__ */ jsx("span", { className: "inline-block h-2 w-4 rounded-sm border shrink-0", style: getBeltStyle(child.belt) }),
                        child.belt
                      ] }),
                      /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-400", children: [
                        child.classes,
                        " classes attended"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs mb-1.5", children: [
                        /* @__PURE__ */ jsx("span", { className: "text-gray-500", children: "Belt Progress" }),
                        /* @__PURE__ */ jsxs("span", { className: "font-bold text-indigo-600", children: [
                          child.progress,
                          "%"
                        ] })
                      ] }),
                      /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-100 rounded-full h-2", children: /* @__PURE__ */ jsx("div", { className: "bg-indigo-500 h-2 rounded-full", style: { width: `${child.progress}%` } }) })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "px-5 py-3 bg-slate-50 border-t border-gray-100", children: /* @__PURE__ */ jsxs("button", { className: "text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1", children: [
                    "View Full Progress",
                    /* @__PURE__ */ jsx("svg", { className: "w-3 h-3", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })
                  ] }) })
                ] }, idx);
              }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
              /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", children: [
                /* @__PURE__ */ jsx("div", { className: "px-5 py-4 border-b border-gray-50", children: /* @__PURE__ */ jsx("h4", { className: "text-base font-bold text-gray-900", children: "Billing Summary" }) }),
                /* @__PURE__ */ jsxs("div", { className: "p-5 space-y-3", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-500", children: "Next Payment Due:" }),
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-gray-900 text-sm", children: billingSummary.nextPaymentDue })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-500", children: "Children:" }),
                    /* @__PURE__ */ jsx("span", { className: "font-semibold text-gray-700 text-sm", children: children.length })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center pt-2 border-t border-gray-100", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-gray-600", children: "Total Amount:" }),
                    /* @__PURE__ */ jsxs("span", { className: "text-xl font-black text-indigo-600", children: [
                      "€",
                      Number(billingSummary.amountDue).toFixed(2)
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs(
                    Link,
                    {
                      href: route("parent.billing"),
                      className: "flex items-center justify-center gap-2 mt-2 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-sm shadow-indigo-200",
                      children: [
                        "Pay Now",
                        /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })
                      ]
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", children: [
                /* @__PURE__ */ jsx("div", { className: "px-5 py-4 border-b border-gray-50", children: /* @__PURE__ */ jsx("h4", { className: "text-base font-bold text-gray-900", children: "Recent Notices" }) }),
                /* @__PURE__ */ jsx("div", { className: "divide-y divide-gray-50", children: [
                  { title: "Summer Camp Registration", msg: "Registration for the July summer camp is now open for all juniors.", dot: "bg-blue-400", time: "2d ago" },
                  { title: "Belt Grading Scheduled", msg: "The next belt grading ceremony is set for June 15th.", dot: "bg-amber-400", time: "4d ago" }
                ].map((notice, i) => /* @__PURE__ */ jsx("div", { className: "px-5 py-4 hover:bg-slate-50 transition-colors", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2.5", children: [
                  /* @__PURE__ */ jsx("div", { className: `w-2 h-2 rounded-full mt-1.5 shrink-0 ${notice.dot}` }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-gray-900", children: notice.title }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-0.5 leading-relaxed", children: notice.msg }),
                    /* @__PURE__ */ jsx("p", { className: "text-[10px] text-gray-400 mt-1.5", children: notice.time })
                  ] })
                ] }) }, i)) })
              ] })
            ] })
          ] })
        ] }) })
      ]
    }
  );
}
export {
  ParentDashboard as default
};
