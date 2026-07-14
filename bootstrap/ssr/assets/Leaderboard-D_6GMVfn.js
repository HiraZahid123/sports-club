import { jsxs, jsx } from "react/jsx-runtime";
import { A as Authenticated } from "./AuthenticatedLayout-CkiyEXrL.js";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import { b as getBeltStyle, g as getBeltBadgeStyle } from "./beltHelpers-6FZX55wB.js";
import "@headlessui/react";
import "axios";
import "./ml-sports-BEC2gdiG.js";
function Leaderboard({ leaderboard = [] }) {
  const [search, setSearch] = useState("");
  const filteredLeaderboard = leaderboard.filter(
    (ath) => ath.name.toLowerCase().includes(search.toLowerCase())
  );
  const topThree = filteredLeaderboard.slice(0, 3);
  const rest = filteredLeaderboard.slice(3);
  const podiumOrder = [];
  if (topThree[1]) podiumOrder.push({ ...topThree[1], rank: 2 });
  if (topThree[0]) podiumOrder.push({ ...topThree[0], rank: 1 });
  if (topThree[2]) podiumOrder.push({ ...topThree[2], rank: 3 });
  return /* @__PURE__ */ jsxs(
    Authenticated,
    {
      header: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Leaderboard" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-0.5", children: "Top athletes ranked by training and event points" })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Club Leaderboard" }),
        /* @__PURE__ */ jsx("div", { className: "py-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none", children: /* @__PURE__ */ jsx("span", { className: "text-gray-400 text-sm", children: "🔍" }) }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                placeholder: "Search athletes...",
                value: search,
                onChange: (e) => setSearch(e.target.value),
                className: "w-full rounded-2xl border border-gray-200 bg-white pl-10 pr-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all"
              }
            )
          ] }),
          podiumOrder.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-col sm:flex-row items-end justify-center gap-6 pt-4 pb-8 border-b border-gray-100", children: podiumOrder.map((ath) => {
            const isFirst = ath.rank === 1;
            const isSecond = ath.rank === 2;
            ath.rank === 3;
            return /* @__PURE__ */ jsxs(
              "div",
              {
                className: `flex flex-col items-center w-full sm:w-48 bg-white border border-gray-100/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 ${isFirst ? "sm:order-2 border-amber-200/80 -translate-y-4 ring-4 ring-amber-500/5" : isSecond ? "sm:order-1 border-slate-200/80" : "sm:order-3 border-amber-600/20"}`,
                children: [
                  /* @__PURE__ */ jsx("div", { className: `w-9 h-9 rounded-full flex items-center justify-center font-black text-sm mb-3 shadow-inner ${isFirst ? "bg-amber-400 text-white shadow-amber-300" : isSecond ? "bg-slate-300 text-slate-700 shadow-slate-200" : "bg-amber-600 text-white shadow-amber-500"}`, children: ath.rank }),
                  /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xl mb-3 shadow-sm", children: ath.name.charAt(0).toUpperCase() }),
                  /* @__PURE__ */ jsx("p", { className: "font-bold text-gray-900 text-sm text-center truncate w-full", children: ath.name }),
                  /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-md text-[9px] font-bold border ${getBeltBadgeStyle(ath.belt_rank)}`, children: [
                    /* @__PURE__ */ jsx("span", { className: "inline-block h-1.5 w-3 rounded-sm border shrink-0", style: getBeltStyle(ath.belt_rank) }),
                    ath.belt_rank
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "mt-4 bg-indigo-50/50 border border-indigo-100/30 rounded-xl px-3.5 py-1.5 text-center", children: /* @__PURE__ */ jsxs("span", { className: "text-xs font-black text-indigo-600", children: [
                    "⭐ ",
                    ath.points,
                    " pts"
                  ] }) })
                ]
              },
              ath.id
            );
          }) }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl border border-gray-150 shadow-sm overflow-hidden", children: [
            /* @__PURE__ */ jsx("div", { className: "px-6 py-5 border-b border-gray-50 bg-slate-50/30", children: /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-gray-800", children: "Athlete Rankings" }) }),
            filteredLeaderboard.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center py-16 text-gray-400 italic text-sm", children: "No athletes found matching your search." }) : /* @__PURE__ */ jsxs("div", { className: "divide-y divide-gray-50", children: [
              rest.map((ath, index) => {
                const rank = index + 4;
                return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-6 py-4 hover:bg-slate-50/60 transition-colors", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 min-w-0", children: [
                    /* @__PURE__ */ jsxs("span", { className: "w-6 text-xs font-black text-gray-400 text-center shrink-0", children: [
                      "#",
                      rank
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs shrink-0 shadow-sm", children: ath.name.charAt(0).toUpperCase() }),
                    /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                      /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-gray-900 truncate", children: ath.name }),
                      /* @__PURE__ */ jsx("span", { className: "inline-block text-[8px] font-bold text-gray-400 uppercase tracking-wide mt-0.5", children: ath.belt_rank })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 bg-amber-50/50 border border-amber-100 rounded-lg px-2.5 py-1 text-xs font-black text-amber-700 shadow-sm", children: [
                    "⭐ ",
                    ath.points,
                    " pts"
                  ] })
                ] }, ath.id);
              }),
              filteredLeaderboard.length <= 3 && rest.length === 0 && /* @__PURE__ */ jsx("div", { className: "text-center py-8 text-gray-400 italic text-xs", children: "All ranked athletes shown in the podium." })
            ] })
          ] })
        ] }) })
      ]
    }
  );
}
export {
  Leaderboard as default
};
