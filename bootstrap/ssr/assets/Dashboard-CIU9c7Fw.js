import { jsx, jsxs } from "react/jsx-runtime";
import { A as Authenticated } from "./AuthenticatedLayout-DGwI6Ex0.js";
import { Head, Link } from "@inertiajs/react";
import "@headlessui/react";
import "react";
import "axios";
import "./ml-sports-BEC2gdiG.js";
function ManagerDashboard({ stats, recentActivity = [], leaderboard = [] }) {
  const statCards = [
    {
      name: "Total Athletes",
      value: stats.totalMembers,
      href: route("manager.members.index"),
      icon: /* @__PURE__ */ jsx("svg", { className: "w-6 h-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" }) }),
      change: "+12%",
      changeType: "increase",
      iconBg: "bg-blue-50 text-blue-600",
      accent: "border-blue-500",
      valueCls: "text-blue-600"
    },
    {
      name: "Active Groups",
      value: stats.activeGroups,
      href: route("manager.groups.index"),
      icon: /* @__PURE__ */ jsx("svg", { className: "w-6 h-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" }) }),
      change: "+2",
      changeType: "increase",
      iconBg: "bg-indigo-50 text-indigo-600",
      accent: "border-indigo-500",
      valueCls: "text-indigo-600"
    },
    {
      name: "Monthly Net Revenue",
      value: `€${Number(stats.monthlyNetRevenue ?? 0).toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subText: `Gross: €${Number(stats.monthlyRevenue ?? 0).toLocaleString()} | Payouts: €${Number(stats.monthlyPayouts ?? 0).toLocaleString()}`,
      href: route("manager.reports.index"),
      icon: /* @__PURE__ */ jsx("svg", { className: "w-6 h-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }),
      change: "+18%",
      changeType: "increase",
      iconBg: "bg-emerald-50 text-emerald-600",
      accent: "border-emerald-500",
      valueCls: "text-emerald-600"
    },
    {
      name: "Unpaid Dues",
      value: stats.overdueCount,
      href: route("manager.billing.index"),
      icon: /* @__PURE__ */ jsx("svg", { className: "w-6 h-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }) }),
      change: "-5",
      changeType: "decrease",
      iconBg: "bg-amber-50 text-amber-600",
      accent: "border-amber-500",
      valueCls: "text-amber-600"
    }
  ];
  const quickActions = [
    { label: "Add New Athlete", href: route("manager.members.index"), icon: "👤", color: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200" },
    { label: "Manage Training Groups", href: route("manager.groups.index"), icon: "🏆", color: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200" },
    { label: "View Financial Reports", href: route("manager.reports.index"), icon: "📊", color: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200" },
    { label: "Billing & Payments", href: route("manager.billing.index"), icon: "💳", color: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200" }
  ];
  return /* @__PURE__ */ jsxs(
    Authenticated,
    {
      header: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Club Manager Dashboard" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-0.5", children: "Welcome back — here's what's happening today." })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Manager Dashboard" }),
        /* @__PURE__ */ jsx("div", { className: "py-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8", children: [
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5", children: statCards.map((card) => /* @__PURE__ */ jsx(
            Link,
            {
              href: card.href,
              className: `group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden border-b-4 ${card.accent} block cursor-pointer`,
              children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-4", children: [
                  /* @__PURE__ */ jsx("div", { className: `w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110 ${card.iconBg}`, children: card.icon }),
                  /* @__PURE__ */ jsx("span", { className: `text-xs font-bold px-2 py-1 rounded-full ${card.changeType === "increase" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`, children: card.change })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 transition-colors group-hover:text-gray-700", children: card.name }),
                /* @__PURE__ */ jsx("p", { className: `text-3xl font-black ${card.valueCls}`, children: card.value }),
                card.subText && /* @__PURE__ */ jsx("p", { className: "text-[11px] text-gray-400 mt-1.5 font-bold transition-colors group-hover:text-gray-500", children: card.subText })
              ] })
            },
            card.name
          )) }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm", children: [
              /* @__PURE__ */ jsxs("div", { className: "p-6 border-b border-gray-50", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-gray-900", children: "Recent Club Activity" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-0.5", children: "Latest registrations and events" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "divide-y divide-gray-50", children: recentActivity.length > 0 ? recentActivity.map((item, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors", children: [
                /* @__PURE__ */ jsx("div", { className: `w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${item.color}`, children: item.initial }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-gray-900 truncate", children: item.name }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 truncate", children: item.action })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-400 shrink-0", children: item.time })
              ] }, i)) : /* @__PURE__ */ jsx("div", { className: "text-center py-12 text-gray-400 italic text-sm", children: "No recent club activity logged yet." }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
              /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm p-6", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-gray-900 mb-5", children: "Quick Actions" }),
                /* @__PURE__ */ jsx("div", { className: "space-y-3", children: quickActions.map((action) => /* @__PURE__ */ jsxs(
                  Link,
                  {
                    href: action.href,
                    className: `flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all ${action.color}`,
                    children: [
                      /* @__PURE__ */ jsx("span", { children: action.icon }),
                      action.label
                    ]
                  },
                  action.label
                )) })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100 p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 text-lg shrink-0", children: "🏅" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold text-amber-900 mb-1", children: "Upcoming Event" }),
                  /* @__PURE__ */ jsxs("p", { className: "text-xs text-amber-700 leading-relaxed", children: [
                    "Regional Championship — Registration closes in ",
                    /* @__PURE__ */ jsx("span", { className: "font-bold", children: "3 days" }),
                    ". Ensure all athletes are enrolled."
                  ] }),
                  /* @__PURE__ */ jsx("button", { className: "mt-3 text-xs font-bold text-amber-700 hover:text-amber-900 transition-colors", children: "View Details →" })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col", children: [
                /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-yellow-50 to-amber-50 px-6 py-4 border-b border-amber-100 flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-amber-900", children: "Top Athletes (Points)" }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-amber-600 mt-0.5", children: "Top point earners in the club" })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center text-lg", children: "🏆" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "p-5 divide-y divide-gray-50", children: leaderboard.length > 0 ? leaderboard.slice(0, 5).map((ath, idx) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-2.5 first:pt-0 last:pb-0", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsx("span", { className: `w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${idx === 0 ? "bg-amber-500 text-white" : idx === 1 ? "bg-slate-300 text-slate-800" : idx === 2 ? "bg-amber-600 text-white" : "bg-gray-100 text-gray-500"}`, children: idx + 1 }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-gray-800", children: ath.name }),
                      /* @__PURE__ */ jsx("span", { className: "inline-block text-[8px] font-bold text-gray-400 uppercase", children: ath.belt_rank })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 bg-amber-50 border border-amber-100 rounded-lg px-2 py-0.5 text-[10px] font-extrabold text-amber-700", children: [
                    "⭐ ",
                    ath.points,
                    " pts"
                  ] })
                ] }, ath.id)) : /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 italic text-center py-4", children: "No athlete points recorded yet." }) })
              ] })
            ] })
          ] })
        ] }) })
      ]
    }
  );
}
export {
  ManagerDashboard as default
};
