import { jsxs, jsx } from "react/jsx-runtime";
import { A as Authenticated } from "./AuthenticatedLayout-DcfkJEmD.js";
import { Head, Link } from "@inertiajs/react";
import { a as getBeltCardGradient, b as getBeltStyle, c as getNextBelt } from "./beltHelpers-6FZX55wB.js";
import "@headlessui/react";
import "react";
import "axios";
import "./ml-sports-BEC2gdiG.js";
const METRICS = [
  { key: "speed", label: "Speed", icon: "⚡", track: "bg-blue-100", fill: "bg-blue-500", text: "text-blue-700", badge: "bg-blue-50 text-blue-600" },
  { key: "strength", label: "Strength", icon: "💪", track: "bg-orange-100", fill: "bg-orange-500", text: "text-orange-700", badge: "bg-orange-50 text-orange-600" },
  { key: "flexibility", label: "Flexibility", icon: "🤸", track: "bg-emerald-100", fill: "bg-emerald-500", text: "text-emerald-700", badge: "bg-emerald-50 text-emerald-600" },
  { key: "kyorugi", label: "Kyorugi", icon: "🥊", track: "bg-rose-100", fill: "bg-rose-500", text: "text-rose-700", badge: "bg-rose-50 text-rose-600" },
  { key: "poomsae", label: "Poomsae", icon: "🎽", track: "bg-purple-100", fill: "bg-purple-500", text: "text-purple-700", badge: "bg-purple-50 text-purple-600" }
];
function MetricsCard({ athleteProfile }) {
  const hasAny = METRICS.some((m) => (athleteProfile?.[m.key] ?? null) !== null);
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm p-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-5", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-gray-900", children: "My Metrics" }),
      /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-400 font-medium", children: "Set by coach" })
    ] }),
    hasAny ? /* @__PURE__ */ jsx("div", { className: "space-y-5", children: METRICS.map((m) => {
      const val = athleteProfile?.[m.key] ?? 0;
      return /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
          /* @__PURE__ */ jsxs("span", { className: `text-xs font-bold flex items-center gap-1.5 ${m.text}`, children: [
            /* @__PURE__ */ jsx("span", { children: m.icon }),
            " ",
            m.label
          ] }),
          /* @__PURE__ */ jsxs("span", { className: `text-xs font-black px-2 py-0.5 rounded-lg ${m.badge}`, children: [
            val,
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-medium opacity-70", children: "/100" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: `w-full ${m.track} rounded-full h-2.5 overflow-hidden`, children: /* @__PURE__ */ jsx(
          "div",
          {
            className: `${m.fill} h-2.5 rounded-full transition-all duration-700`,
            style: { width: `${val}%` }
          }
        ) })
      ] }, m.key);
    }) }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-6 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl mb-3", children: "📊" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-500", children: "No metrics set yet" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 mt-1", children: "Your coach will update your metrics soon." })
    ] })
  ] });
}
function AthleteDashboard({ athleteProfile }) {
  const belt = athleteProfile?.belt_rank || "10. WHITE";
  const cardStyle = getBeltCardGradient(belt);
  const progressStats = [
    { label: "Classes", val: "24", icon: "📚", color: "bg-blue-50 border-blue-100 text-blue-600" },
    { label: "Sparring", val: "15", icon: "🥊", color: "bg-rose-50 border-rose-100 text-rose-600" },
    { label: "Events", val: "2", icon: "🏅", color: "bg-amber-50 border-amber-100 text-amber-600" },
    { label: "Points", val: "450", icon: "⭐", color: "bg-indigo-50 border-indigo-100 text-indigo-600" }
  ];
  return /* @__PURE__ */ jsxs(
    Authenticated,
    {
      header: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-900", children: "My Dashboard" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-0.5", children: "Track your progress and upcoming training schedule" })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Athlete Dashboard" }),
        /* @__PURE__ */ jsx("div", { className: "py-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
            /* @__PURE__ */ jsxs("div", { className: `relative bg-gradient-to-br ${cardStyle.bg} rounded-2xl p-8 overflow-hidden`, children: [
              /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" }),
              /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx("div", { className: `w-16 h-16 ${cardStyle.text.includes("text-white") ? "bg-white/20 border-white/30" : "bg-black/10 border-black/15"} backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl mb-4 border shadow-inner`, children: "🥋" }),
                /* @__PURE__ */ jsx("p", { className: `text-[11px] font-extrabold uppercase tracking-widest mb-2 ${cardStyle.text.includes("text-white") ? "text-white/70" : "text-gray-500"}`, children: "Current Rank" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-1", children: [
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: "inline-block h-5 w-9 rounded-md border-2 shadow-md shrink-0",
                      style: getBeltStyle(belt)
                    }
                  ),
                  /* @__PURE__ */ jsx("h3", { className: `text-xl font-black leading-tight ${cardStyle.text.includes("text-white") ? "text-white drop-shadow-sm" : "text-gray-900"}`, children: belt })
                ] }),
                /* @__PURE__ */ jsxs("p", { className: `text-xs mb-5 ${cardStyle.text.includes("text-white") ? "text-white/60" : "text-gray-500"}`, children: [
                  "Next: ",
                  /* @__PURE__ */ jsx("span", { className: `font-bold ${cardStyle.text.includes("text-white") ? "text-white/90" : "text-gray-700"}`, children: getNextBelt(belt) })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs mb-1.5", children: [
                    /* @__PURE__ */ jsx("span", { className: `font-semibold ${cardStyle.text.includes("text-white") ? "text-white/70" : "text-gray-500"}`, children: "Progress to Grading" }),
                    /* @__PURE__ */ jsx("span", { className: `font-black ${cardStyle.text.includes("text-white") ? "text-white" : "text-indigo-600"}`, children: "45%" })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: `w-full rounded-full h-2.5 ${cardStyle.text.includes("text-white") ? "bg-white/20" : "bg-gray-200"}`, children: /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: `h-2.5 rounded-full ${cardStyle.text.includes("text-white") ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "bg-indigo-600"}`,
                      style: { width: "45%" }
                    }
                  ) })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-5", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-gray-900", children: "My Progress" }),
                /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-400 font-medium", children: "This month" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4", children: progressStats.map((stat, i) => /* @__PURE__ */ jsxs("div", { className: `border rounded-xl p-4 text-center ${stat.color.split(" ").slice(0, 2).join(" ")}`, children: [
                /* @__PURE__ */ jsx("div", { className: "text-2xl mb-2", children: stat.icon }),
                /* @__PURE__ */ jsx("p", { className: `text-2xl font-black ${stat.color.split(" ").slice(2).join(" ")}`, children: stat.val }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 font-semibold mt-1 uppercase tracking-wide", children: stat.label })
              ] }, i)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", children: [
              /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 border-b border-gray-50 flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-gray-900", children: "Upcoming Schedule" }),
                /* @__PURE__ */ jsx(Link, { href: route("athlete.schedule"), className: "text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors", children: "View All" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "divide-y divide-gray-50", children: [
                { day: "16", month: "May", title: "Elite Sparring Session", coach: "Master Kim", time: "18:00", color: "border-indigo-400 bg-indigo-50" },
                { day: "18", month: "May", title: "Belt Grading Prep", coach: "Coach Lee", time: "16:00", color: "border-emerald-400 bg-emerald-50" },
                { day: "22", month: "May", title: "Pattern Practice", coach: "Master Kim", time: "17:30", color: "border-blue-400 bg-blue-50" }
              ].map((event, i) => /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors border-l-4 ${event.color}`, children: [
                /* @__PURE__ */ jsxs("div", { className: "text-center w-10 shrink-0", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-lg font-black text-gray-900 leading-none", children: event.day }),
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-gray-400 uppercase", children: event.month })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-900 text-sm", children: event.title }),
                  /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500", children: [
                    event.coach,
                    " • ",
                    event.time
                  ] })
                ] }),
                /* @__PURE__ */ jsx(Link, { href: route("athlete.schedule"), className: "text-xs font-semibold text-indigo-600 hover:text-indigo-700 shrink-0 transition-colors", children: "Details" })
              ] }, i)) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
              /* @__PURE__ */ jsx(MetricsCard, { athleteProfile }),
              /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100 p-5", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2 mb-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-lg", children: "🎯" }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-amber-900", children: "Coach's Tip" })
                ] }),
                athleteProfile?.coach_tip ? /* @__PURE__ */ jsx("p", { className: "text-xs text-amber-700 leading-relaxed", children: athleteProfile.coach_tip }) : /* @__PURE__ */ jsx("p", { className: "text-xs text-amber-500 italic leading-relaxed", children: "No tip yet — your coach will add one soon." })
              ] })
            ] })
          ] })
        ] }) })
      ]
    }
  );
}
export {
  AthleteDashboard as default
};
