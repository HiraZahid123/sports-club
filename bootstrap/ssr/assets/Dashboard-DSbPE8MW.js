import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as Authenticated } from "./AuthenticatedLayout-uU_SUfcq.js";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";
import { b as getBeltStyle, g as getBeltBadgeStyle } from "./beltHelpers-6FZX55wB.js";
import "@headlessui/react";
import "axios";
import "./ml-sports-BEC2gdiG.js";
const skillColors = {
  Beginner: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Intermediate: "bg-blue-50 text-blue-700 border-blue-100",
  Advanced: "bg-indigo-50 text-indigo-700 border-indigo-100",
  Elite: "bg-amber-50 text-amber-700 border-amber-100"
};
const DAY_SHORT = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun"
};
const DAY_COLOR = {
  Monday: "bg-indigo-50 text-indigo-700 border-indigo-100",
  Tuesday: "bg-purple-50 text-purple-700 border border-purple-100",
  Wednesday: "bg-blue-50 text-blue-700 border border-blue-100",
  Thursday: "bg-cyan-50 text-cyan-700 border border-cyan-100",
  Friday: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  Saturday: "bg-amber-50 text-amber-700 border border-amber-100",
  Sunday: "bg-rose-50 text-rose-700 border border-rose-100"
};
const fmtTime = (t) => {
  if (!t) return "";
  const parts = t.split(":");
  return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}`;
};
function getAge(dob) {
  if (!dob) return "—";
  return Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1e3)).toString();
}
function fmt(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
function fmtCurrency(amount) {
  return "€" + Number(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function daysUntil(dateStr) {
  return Math.ceil((new Date(dateStr).setHours(0, 0, 0, 0) - (/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0)) / 864e5);
}
const METRICS = [
  { key: "speed", label: "Speed", color: "from-blue-400 to-blue-600", track: "bg-blue-100", fill: "bg-blue-500", icon: "⚡" },
  { key: "strength", label: "Strength", color: "from-orange-400 to-orange-600", track: "bg-orange-100", fill: "bg-orange-500", icon: "💪" },
  { key: "flexibility", label: "Flexibility", color: "from-emerald-400 to-emerald-600", track: "bg-emerald-100", fill: "bg-emerald-500", icon: "🤸" },
  { key: "kyorugi", label: "Kyorugi", color: "from-rose-400 to-rose-600", track: "bg-rose-100", fill: "bg-rose-500", icon: "🥊" },
  { key: "poomsae", label: "Poomsae", color: "from-purple-400 to-purple-600", track: "bg-purple-100", fill: "bg-purple-500", icon: "🎽" }
];
function AthleteSkillsPanel({ athlete }) {
  const profile = athlete.athlete_profile;
  const { data, setData, post, processing } = useForm({
    speed: profile?.speed ?? 0,
    strength: profile?.strength ?? 0,
    flexibility: profile?.flexibility ?? 0,
    kyorugi: profile?.kyorugi ?? 0,
    poomsae: profile?.poomsae ?? 0
  });
  const tipForm = useForm({ coach_tip: profile?.coach_tip ?? "" });
  const [saved, setSaved] = useState(false);
  const [tipSaved, setTipSaved] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    post(route("coach.athletes.skills", athlete.id), {
      preserveScroll: true,
      onSuccess: () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2e3);
      }
    });
  };
  const submitTip = (e) => {
    e.preventDefault();
    tipForm.post(route("coach.athletes.tip", athlete.id), {
      preserveScroll: true,
      onSuccess: () => {
        setTipSaved(true);
        setTimeout(() => setTipSaved(false), 2e3);
      }
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "mt-4 border-t border-gray-100 pt-4 space-y-5", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm", children: "📊" }),
          " Athlete Metrics"
        ] }),
        saved && /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg flex items-center gap-1", children: [
          /* @__PURE__ */ jsx("svg", { className: "w-3 h-3", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }),
          "Saved!"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-4", children: [
        METRICS.map((m) => /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1.5", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-xs font-semibold text-gray-600 flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx("span", { children: m.icon }),
              " ",
              m.label
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-xs font-black text-gray-800 w-8 text-right", children: data[m.key] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: `flex-1 ${m.track} rounded-full h-2 overflow-hidden`, children: /* @__PURE__ */ jsx(
              "div",
              {
                className: `${m.fill} h-2 rounded-full transition-all duration-200`,
                style: { width: `${data[m.key]}%` }
              }
            ) }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "range",
                min: 0,
                max: 100,
                value: data[m.key],
                onChange: (e) => setData(m.key, Number(e.target.value)),
                className: "absolute inset-0 w-full opacity-0 cursor-pointer h-2"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-[9px] text-gray-300 mt-0.5 font-medium", children: [
            /* @__PURE__ */ jsx("span", { children: "0" }),
            /* @__PURE__ */ jsx("span", { children: "50" }),
            /* @__PURE__ */ jsx("span", { children: "100" })
          ] })
        ] }, m.key)),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: processing,
            className: "w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all disabled:opacity-50 shadow-sm",
            children: processing ? "Saving…" : "Save Metrics"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "border-t border-gray-100 pt-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-xs font-bold text-amber-700 uppercase tracking-wide flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm", children: "🎯" }),
          " Coach's Tip"
        ] }),
        tipSaved && /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg flex items-center gap-1", children: [
          /* @__PURE__ */ jsx("svg", { className: "w-3 h-3", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }),
          "Saved!"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: submitTip, className: "space-y-2", children: [
        /* @__PURE__ */ jsx(
          "textarea",
          {
            value: tipForm.data.coach_tip,
            onChange: (e) => tipForm.setData("coach_tip", e.target.value),
            maxLength: 500,
            rows: 3,
            placeholder: "Write a personalised tip for this athlete…",
            className: "w-full text-xs rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-amber-900 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 resize-none"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-gray-400", children: [
            tipForm.data.coach_tip.length,
            "/500"
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: tipForm.processing,
              className: "px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-all disabled:opacity-50 shadow-sm",
              children: tipForm.processing ? "Saving…" : "Save Tip"
            }
          )
        ] })
      ] })
    ] })
  ] });
}
function AthleteRow({
  athlete,
  expandedAthleteId,
  setExpandedAthleteId,
  showGroup,
  groupName
}) {
  const profile = athlete.athlete_profile;
  const belt = profile?.belt_rank ?? null;
  const age = getAge(profile?.date_of_birth ?? null);
  const isExpanded = expandedAthleteId === athlete.id;
  return /* @__PURE__ */ jsxs("div", { className: `px-6 py-4 transition-colors ${isExpanded ? "bg-indigo-50/40" : "hover:bg-slate-50"}`, children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        className: "w-full text-left",
        onClick: () => setExpandedAthleteId(isExpanded ? null : athlete.id),
        children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0", children: athlete.name.charAt(0).toUpperCase() }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-900 text-sm", children: athlete.name }),
              belt && /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold border ${getBeltBadgeStyle(belt)}`, children: [
                /* @__PURE__ */ jsx("span", { className: "inline-block h-1.5 w-3 rounded-sm border shrink-0", style: getBeltStyle(belt) }),
                belt
              ] }),
              showGroup && groupName && /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100", children: groupName })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 mt-0.5 truncate", children: athlete.email }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mt-1.5 flex-wrap", children: [
              age !== "—" && /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-500", children: [
                "Age ",
                /* @__PURE__ */ jsx("strong", { children: age })
              ] }),
              profile?.weight_class && /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-500", children: [
                "Weight ",
                /* @__PURE__ */ jsx("strong", { children: profile.weight_class })
              ] }),
              profile?.speed != null && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-600", children: [
                "⚡ ",
                profile.speed
              ] }),
              profile?.strength != null && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-50 text-orange-600", children: [
                "💪 ",
                profile.strength
              ] }),
              profile?.flexibility != null && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600", children: [
                "🤸 ",
                profile.flexibility
              ] }),
              profile?.kyorugi != null && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-600", children: [
                "🥊 ",
                profile.kyorugi
              ] }),
              profile?.poomsae != null && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-600", children: [
                "🎽 ",
                profile.poomsae
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("svg", { className: `w-4 h-4 text-gray-400 shrink-0 mt-1 transition-transform ${isExpanded ? "rotate-180" : ""}`, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) })
        ] })
      }
    ),
    isExpanded && /* @__PURE__ */ jsx(AthleteSkillsPanel, { athlete })
  ] });
}
function SectionNav({ active, setActive }) {
  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "athletes", label: "Athletes", icon: "🥋" },
    { id: "groups", label: "Groups", icon: "🏆" },
    { id: "earnings", label: "Earnings", icon: "💰" }
  ];
  return /* @__PURE__ */ jsx("div", { className: "flex gap-1 bg-slate-100 rounded-2xl p-1", children: tabs.map((t) => /* @__PURE__ */ jsxs(
    "button",
    {
      onClick: () => setActive(t.id),
      className: `flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${active === t.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`,
      children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm", children: t.icon }),
        /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: t.label })
      ]
    },
    t.id
  )) });
}
function CoachDashboard({
  groups,
  nextPayout,
  payoutHistory,
  totalEarned,
  coachProfile
}) {
  const [activeSection, setActiveSection] = useState("overview");
  const [selectedGroupIdx, setSelectedGroupIdx] = useState(0);
  const [expandedAthleteId, setExpandedAthleteId] = useState(null);
  const totalAthletes = groups.reduce((sum, g) => sum + (g.athletes?.length || 0), 0);
  const selectedGroup = groups[selectedGroupIdx] ?? null;
  const days = nextPayout ? daysUntil(nextPayout.payout_date) : null;
  const allAthletes = Object.values(
    groups.flatMap((g) => g.athletes.map((a) => ({ athlete: a, groupName: g.name }))).reduce((acc, item) => {
      if (!acc[item.athlete.id]) acc[item.athlete.id] = item;
      return acc;
    }, {})
  );
  const totalSessions = groups.reduce((sum, g) => sum + (g.schedules?.length || 0), 0);
  const statCards = [
    {
      id: "athletes",
      label: "Total Athletes",
      value: totalAthletes,
      sub: "across all groups",
      valueColor: "text-emerald-600",
      border: "border-emerald-100",
      ring: "ring-emerald-400",
      icon: "🥋",
      iconBg: "bg-emerald-50",
      hint: "View athlete list →"
    },
    {
      id: "groups",
      label: "Groups Assigned",
      value: groups.length,
      sub: "active groups",
      valueColor: "text-indigo-600",
      border: "border-indigo-100",
      ring: "ring-indigo-400",
      icon: "🏆",
      iconBg: "bg-indigo-50",
      hint: "View your groups →"
    },
    {
      id: null,
      // navigate to schedule
      label: "Sessions This Week",
      value: totalSessions,
      sub: "scheduled",
      valueColor: "text-blue-600",
      border: "border-blue-100",
      ring: "ring-blue-400",
      icon: "📅",
      iconBg: "bg-blue-50",
      hint: "View schedule →"
    },
    {
      id: "earnings",
      label: "Total Earned",
      value: fmtCurrency(totalEarned),
      sub: "all time",
      valueColor: "text-amber-600",
      border: "border-amber-100",
      ring: "ring-amber-400",
      icon: "💰",
      iconBg: "bg-amber-50",
      hint: "View earnings →"
    }
  ];
  return /* @__PURE__ */ jsxs(
    Authenticated,
    {
      header: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Coach Dashboard" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-0.5", children: "Manage your training groups and athlete metrics" })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Coach Dashboard" }),
        /* @__PURE__ */ jsx("div", { className: "py-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6", children: [
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-5", children: statCards.map((card) => {
            const isActive = card.id !== null && activeSection === card.id;
            const CardTag = card.id === null ? Link : "button";
            const cardProps = card.id === null ? { href: route("coach.schedule") } : { onClick: () => setActiveSection(card.id) };
            return /* @__PURE__ */ jsxs(
              CardTag,
              {
                ...cardProps,
                className: `group bg-white rounded-2xl border shadow-sm p-6 text-left cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 ${isActive ? `${card.border} ring-2 ${card.ring}/40 shadow-md -translate-y-0.5` : `${card.border} hover:${card.ring}/20`}`,
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-3", children: [
                    /* @__PURE__ */ jsx("div", { className: `w-9 h-9 ${card.iconBg} rounded-xl flex items-center justify-center text-lg transition-transform group-hover:scale-110`, children: card.icon }),
                    isActive && /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-indigo-500 animate-pulse" })
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-gray-400 uppercase tracking-wide mb-1", children: card.label }),
                  /* @__PURE__ */ jsx("p", { className: `text-3xl font-black ${card.valueColor}`, children: card.value }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 mt-1", children: card.sub }),
                  /* @__PURE__ */ jsx("p", { className: `text-[10px] font-semibold mt-2 transition-opacity ${isActive ? "opacity-100 text-indigo-500" : "opacity-0 group-hover:opacity-60 text-gray-400"}`, children: card.hint })
                ]
              },
              card.label
            );
          }) }),
          /* @__PURE__ */ jsx(SectionNav, { active: activeSection, setActive: setActiveSection }),
          activeSection === "overview" && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-5", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", children: [
              /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-emerald-100 flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-emerald-900", children: "Next Salary / Payout" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-emerald-600 mt-0.5", children: "Your upcoming scheduled payment" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center text-lg", children: "💰" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "p-6", children: nextPayout ? /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-end justify-between", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-gray-400 uppercase tracking-wide mb-1", children: "Amount" }),
                    /* @__PURE__ */ jsx("p", { className: "text-4xl font-black text-emerald-600", children: fmtCurrency(nextPayout.amount) })
                  ] }),
                  days !== null && /* @__PURE__ */ jsxs("div", { className: `text-right px-3 py-2 rounded-xl ${days <= 3 ? "bg-emerald-100" : days <= 7 ? "bg-amber-50" : "bg-gray-50"}`, children: [
                    /* @__PURE__ */ jsx("p", { className: `text-2xl font-black ${days <= 3 ? "text-emerald-600" : days <= 7 ? "text-amber-600" : "text-gray-600"}`, children: days <= 0 ? "Today" : `${days}d` }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 font-medium", children: days <= 0 ? "due" : "away" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
                  /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 rounded-xl p-3", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1", children: "Payout Date" }),
                    /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-gray-800", children: fmt(nextPayout.payout_date) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 rounded-xl p-3", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1", children: "Type" }),
                    /* @__PURE__ */ jsx("span", { className: "inline-flex items-center text-xs font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100", children: nextPayout.payment_type ?? "Monthly Salary" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 rounded-xl p-3", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1", children: "Status" }),
                    /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-lg", children: [
                      /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" }),
                      "Pending"
                    ] })
                  ] })
                ] }),
                nextPayout.notes && /* @__PURE__ */ jsxs("div", { className: "bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2.5", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-indigo-400 uppercase tracking-wide mb-1", children: "Note from Manager" }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-indigo-800", children: nextPayout.notes })
                ] })
              ] }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-8 text-center", children: [
                /* @__PURE__ */ jsx("div", { className: "w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-2xl mb-4", children: "📭" }),
                /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-700 mb-1", children: "No pending payout" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400", children: "Your manager hasn't scheduled a payout yet." })
              ] }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col", children: [
              /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-indigo-100 flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-indigo-900", children: "My Profile & Compensation" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-indigo-600 mt-0.5", children: "Your specialization and pay settings" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center text-lg", children: "👤" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-4 flex-1", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-gray-400 uppercase tracking-wide mb-1", children: "Specialization" }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-gray-800", children: coachProfile?.specialization || "Not specified" })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-gray-400 uppercase tracking-wide mb-1", children: "Compensation Plan" }),
                  coachProfile?.payment_option ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx("span", { className: "inline-flex items-center text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-lg", children: coachProfile.payment_option === "athlete" ? "Per Athlete" : coachProfile.payment_option === "hourly" ? "Hourly Rate" : "Fixed Amount" }),
                    /* @__PURE__ */ jsxs("span", { className: "text-sm font-black text-gray-900", children: [
                      "€",
                      Number(coachProfile.payment_rate || 0).toFixed(2),
                      coachProfile.payment_option === "hourly" ? "/hr" : coachProfile.payment_option === "athlete" ? "/athlete" : ""
                    ] })
                  ] }) : /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 italic", children: "No payment details set by manager yet." })
                ] }),
                coachProfile?.bio && /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 border border-gray-100 rounded-xl px-3 py-2", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1", children: "My Biography" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-600 line-clamp-3 leading-relaxed", children: coachProfile.bio })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm p-5", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-gray-900 mb-4", children: "Quick Access" }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2.5", children: [
                [
                  { section: "athletes", icon: "🥋", label: "View All Athletes", sub: `${totalAthletes} athletes across ${groups.length} groups`, color: "bg-emerald-50 hover:bg-emerald-100 border-emerald-100" },
                  { section: "groups", icon: "🏆", label: "Training Groups", sub: `${groups.length} active groups`, color: "bg-indigo-50 hover:bg-indigo-100 border-indigo-100" },
                  { section: "earnings", icon: "💰", label: "My Earnings", sub: `Total: ${fmtCurrency(totalEarned)}`, color: "bg-amber-50 hover:bg-amber-100 border-amber-100" }
                ].map((item) => /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: () => setActiveSection(item.section),
                    className: `w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left ${item.color}`,
                    children: [
                      /* @__PURE__ */ jsx("span", { className: "text-xl", children: item.icon }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-gray-900", children: item.label }),
                        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: item.sub })
                      ] }),
                      /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-gray-400 ml-auto", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })
                    ]
                  },
                  item.section
                )),
                /* @__PURE__ */ jsxs(
                  Link,
                  {
                    href: route("coach.schedule"),
                    className: "w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left bg-blue-50 hover:bg-blue-100 border-blue-100",
                    children: [
                      /* @__PURE__ */ jsx("span", { className: "text-xl", children: "📅" }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-gray-900", children: "Weekly Schedule" }),
                        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "View your training sessions" })
                      ] }),
                      /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-gray-400 ml-auto", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })
                    ]
                  }
                )
              ] })
            ] }) })
          ] }),
          activeSection === "athletes" && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", children: [
            /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 border-b border-gray-50 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-gray-900", children: "All Athletes" }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500 mt-0.5", children: [
                  totalAthletes,
                  " athletes across ",
                  groups.length,
                  " groups · click to edit metrics"
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center text-lg", children: "🥋" })
            ] }),
            allAthletes.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "py-16 text-center", children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl mx-auto mb-3", children: "👤" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-500", children: "No athletes assigned to your groups yet" })
            ] }) : /* @__PURE__ */ jsx("div", { className: "divide-y divide-gray-50 max-h-[600px] overflow-y-auto", children: allAthletes.map(({ athlete, groupName }) => /* @__PURE__ */ jsx(
              AthleteRow,
              {
                athlete,
                expandedAthleteId,
                setExpandedAthleteId,
                showGroup: true,
                groupName
              },
              athlete.id
            )) })
          ] }),
          activeSection === "groups" && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-5 gap-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", children: [
              /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 border-b border-gray-50 flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-gray-900", children: "My Training Groups" }),
                  /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500 mt-0.5", children: [
                    groups.length,
                    " groups assigned to you"
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center text-lg", children: "🏆" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "divide-y divide-gray-50", children: [
                groups.map((group, idx) => {
                  const skillStyle = skillColors[group.skill_level] || "bg-gray-50 text-gray-700 border-gray-100";
                  const isSelected = idx === selectedGroupIdx;
                  return /* @__PURE__ */ jsxs(
                    "button",
                    {
                      onClick: () => {
                        setSelectedGroupIdx(idx);
                        setExpandedAthleteId(null);
                      },
                      className: `w-full text-left flex items-center justify-between px-6 py-4 transition-colors ${isSelected ? "bg-indigo-50" : "hover:bg-slate-50"}`,
                      children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                          /* @__PURE__ */ jsx("div", { className: `w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm border ${isSelected ? "bg-indigo-100 text-indigo-700 border-indigo-200" : "bg-emerald-50 text-emerald-600 border-emerald-100"}`, children: group.name.charAt(0) }),
                          /* @__PURE__ */ jsxs("div", { children: [
                            /* @__PURE__ */ jsx("p", { className: `font-semibold text-sm ${isSelected ? "text-indigo-900" : "text-gray-900"}`, children: group.name }),
                            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mt-0.5", children: [
                              /* @__PURE__ */ jsx("span", { className: `inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold border ${skillStyle}`, children: group.skill_level }),
                              group.age_range && /* @__PURE__ */ jsx("span", { className: "text-[10px] text-gray-400", children: group.age_range })
                            ] })
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "text-right shrink-0", children: [
                          /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-gray-400 uppercase tracking-wide", children: "Athletes" }),
                          /* @__PURE__ */ jsx("p", { className: `text-lg font-black ${isSelected ? "text-indigo-700" : "text-gray-900"}`, children: group.athletes?.length || 0 })
                        ] })
                      ]
                    },
                    idx
                  );
                }),
                groups.length === 0 && /* @__PURE__ */ jsxs("div", { className: "py-12 text-center", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl mx-auto mb-3", children: "📋" }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-500", children: "No groups assigned yet" })
                ] })
              ] }),
              groups.length > 0 && /* @__PURE__ */ jsx("div", { className: "px-6 py-4 bg-slate-50 border-t border-gray-100", children: /* @__PURE__ */ jsx(Link, { href: route("coach.schedule"), className: "w-full inline-block text-center py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-all shadow-sm", children: "View Full Schedule" }) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", children: selectedGroup ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 border-b border-gray-50 flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("h3", { className: "text-base font-bold text-gray-900", children: [
                    "Athletes — ",
                    selectedGroup.name
                  ] }),
                  /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500 mt-0.5", children: [
                    selectedGroup.athletes.length,
                    " athletes · click to edit metrics"
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center text-lg", children: "🥋" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 border-b border-gray-50 bg-slate-50/50", children: [
                /* @__PURE__ */ jsxs("p", { className: "text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsx("span", { children: "📅" }),
                  " Weekly Schedule"
                ] }),
                !selectedGroup.schedules || selectedGroup.schedules.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 italic", children: "No schedule set for this group." }) : /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: selectedGroup.schedules.map((s, i) => /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg ${DAY_COLOR[s.day_of_week] ?? "bg-gray-100 text-gray-600"}`, children: [
                  /* @__PURE__ */ jsx("span", { children: DAY_SHORT[s.day_of_week] }),
                  /* @__PURE__ */ jsxs("span", { className: "opacity-80", children: [
                    fmtTime(s.start_time),
                    "–",
                    fmtTime(s.end_time)
                  ] }),
                  (s.facility?.name || s.location) && /* @__PURE__ */ jsxs("span", { className: "opacity-65", children: [
                    "· ",
                    s.facility?.name ?? s.location
                  ] })
                ] }, i)) })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "divide-y divide-gray-50 max-h-[600px] overflow-y-auto", children: selectedGroup.athletes.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "py-12 text-center", children: [
                /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl mx-auto mb-3", children: "👤" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-500", children: "No athletes in this group" })
              ] }) : selectedGroup.athletes.map((athlete) => /* @__PURE__ */ jsx(
                AthleteRow,
                {
                  athlete,
                  expandedAthleteId,
                  setExpandedAthleteId
                },
                athlete.id
              )) })
            ] }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center h-full py-20 text-center", children: [
              /* @__PURE__ */ jsx("div", { className: "w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4", children: "🥋" }),
              /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-900 mb-1", children: "No groups assigned" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400", children: "Contact your manager to be assigned to a group." })
            ] }) })
          ] }),
          activeSection === "earnings" && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-5", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden", children: [
              /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-amber-100 flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-amber-900", children: "Total Earnings" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-amber-600 mt-0.5", children: "All-time payouts received" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center text-lg", children: "💰" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-4", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-gray-400 uppercase tracking-wide mb-1", children: "Total Earned (All Time)" }),
                  /* @__PURE__ */ jsx("p", { className: "text-5xl font-black text-amber-600", children: fmtCurrency(totalEarned) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                  /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 rounded-xl p-3", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1", children: "Paid Payouts" }),
                    /* @__PURE__ */ jsx("p", { className: "text-xl font-black text-gray-800", children: payoutHistory.length })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "bg-emerald-50 rounded-xl p-3", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-emerald-600 uppercase tracking-wide mb-1", children: "Pending" }),
                    /* @__PURE__ */ jsx("p", { className: "text-xl font-black text-emerald-700", children: nextPayout ? fmtCurrency(nextPayout.amount) : "—" })
                  ] })
                ] }),
                nextPayout && /* @__PURE__ */ jsxs("div", { className: "bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-indigo-500 uppercase tracking-wide mb-1", children: "Next Payout" }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-indigo-900", children: fmtCurrency(nextPayout.amount) }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-indigo-600 font-semibold", children: fmt(nextPayout.payout_date) })
                  ] }),
                  nextPayout.notes && /* @__PURE__ */ jsx("p", { className: "text-xs text-indigo-700 mt-1", children: nextPayout.notes })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", children: [
              /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-indigo-100 flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-indigo-900", children: "Payout History" }),
                  /* @__PURE__ */ jsxs("p", { className: "text-xs text-indigo-600 mt-0.5", children: [
                    "Your last ",
                    payoutHistory.length,
                    " payments"
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center text-lg", children: "📋" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "divide-y divide-gray-50", children: payoutHistory.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-10 text-center px-6", children: [
                /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl mb-3", children: "🗂️" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-500", children: "No payment history yet" })
              ] }) : payoutHistory.map((payout) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-emerald-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }) }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsxs("p", { className: "text-sm font-semibold text-gray-900", children: [
                      fmtCurrency(payout.amount),
                      payout.tip && Number(payout.tip) > 0 && /* @__PURE__ */ jsxs("span", { className: "text-xs text-amber-600 font-medium ml-1", children: [
                        "(incl. ",
                        fmtCurrency(payout.tip),
                        " tip)"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400", children: fmt(payout.payout_date) })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg", children: [
                    /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500" }),
                    "Paid"
                  ] }),
                  payout.payment_type && /* @__PURE__ */ jsx("span", { className: `inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${payout.payment_type === "Monthly Salary" ? "bg-indigo-50 border-indigo-100 text-indigo-700" : payout.payment_type === "Hourly Rate" ? "bg-emerald-50 border-emerald-100 text-emerald-700" : payout.payment_type === "Per Session" ? "bg-purple-50 border-purple-100 text-purple-700" : payout.payment_type === "Commission" ? "bg-amber-50 border-amber-100 text-amber-700" : "bg-rose-50 border-rose-100 text-rose-700"}`, children: payout.payment_type })
                ] })
              ] }, payout.id)) })
            ] })
          ] })
        ] }) })
      ]
    }
  );
}
export {
  CoachDashboard as default
};
