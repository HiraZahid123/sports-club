import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as Authenticated, U as UserAvatar } from "./AuthenticatedLayout-p-OsO1Gw.js";
import { usePage, Head, Link, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { b as getBeltStyle, g as getBeltBadgeStyle } from "./beltHelpers-6FZX55wB.js";
import { g as getDateForDayOfWeek } from "./dateHelpers-pzAD51Td.js";
import axios from "axios";
import "@headlessui/react";
import "./ml-sports-BsguC5B3.js";
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
  if (!dateStr) return "";
  try {
    const dateOnly = dateStr.split("T")[0];
    const parts = dateOnly.split("-");
    if (parts.length === 3) {
      return `${parts[2].padStart(2, "0")}/${parts[1].padStart(2, "0")}/${parts[0]}`;
    }
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return dateStr;
  }
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
function PointAdjustPanel({ athlete }) {
  const { data, setData, post, processing, reset } = useForm({
    points: 0,
    comment: ""
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const submit = (e) => {
    e.preventDefault();
    const pts2 = Number(data.points);
    if (isNaN(pts2) || pts2 === 0) {
      setError("Points must be a non-zero number.");
      return;
    }
    setError("");
    post(route("coach.athletes.adjust-points", athlete.id), {
      preserveScroll: true,
      onSuccess: () => {
        setSaved(true);
        reset();
        setTimeout(() => setSaved(false), 2500);
      }
    });
  };
  const pts = Number(data.points);
  const isNegative = pts < 0;
  const isPositive = pts > 0;
  const adjustBy = (delta) => {
    setData("points", Math.max(-9999, Math.min(9999, pts + delta)));
    setError("");
  };
  const STEPS = [1, 5, 10];
  return /* @__PURE__ */ jsxs("div", { className: "border-t border-gray-100 pt-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm", children: "⚖️" }),
        " Point Adjustment"
      ] }),
      saved && /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg flex items-center gap-1", children: [
        /* @__PURE__ */ jsx("svg", { className: "w-3 h-3", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }),
        "Applied!"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4 p-2.5 bg-indigo-50 rounded-xl border border-indigo-100", children: [
      /* @__PURE__ */ jsx("span", { className: "text-sm", children: "⭐" }),
      /* @__PURE__ */ jsxs("span", { className: "text-xs font-semibold text-indigo-700", children: [
        "Current Points: ",
        /* @__PURE__ */ jsx("strong", { children: athlete.athlete_profile?.event_points ?? 0 })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: `w-full text-center py-3 rounded-2xl font-black text-3xl transition-all border-2 ${isNegative ? "bg-rose-50 border-rose-200 text-rose-600" : isPositive ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-gray-50 border-gray-200 text-gray-400"}`, children: [
          isNegative ? "−" : isPositive ? "+" : "",
          Math.abs(pts),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold ml-1 opacity-60", children: "pts" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "w-full", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-emerald-600 uppercase tracking-wide mb-1.5 text-center", children: "Add Points" }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-2", children: STEPS.map((step) => /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => adjustBy(+step),
              className: "py-3 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-black text-sm transition-all active:scale-95 shadow-sm border border-emerald-200",
              children: [
                "+",
                step
              ]
            },
            `+${step}`
          )) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "w-full", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-rose-500 uppercase tracking-wide mb-1.5 text-center", children: "Remove Points" }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-2", children: STEPS.map((step) => /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => adjustBy(-step),
              className: "py-3 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 font-black text-sm transition-all active:scale-95 shadow-sm border border-rose-200",
              children: [
                "−",
                step
              ]
            },
            `-${step}`
          )) })
        ] }),
        pts !== 0 && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              setData("points", 0);
              setError("");
            },
            className: "text-[10px] font-bold text-gray-400 hover:text-gray-600 underline transition-colors",
            children: "Reset to 0"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          value: data.comment,
          onChange: (e) => setData("comment", e.target.value),
          placeholder: "Reason / comment (optional)…",
          rows: 2,
          maxLength: 500,
          className: "w-full text-xs rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300/30 focus:border-indigo-400 resize-none transition-all"
        }
      ),
      error && /* @__PURE__ */ jsx("p", { className: "text-[10px] text-rose-600 font-semibold", children: error }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: processing || pts === 0,
          className: `w-full py-3 text-white text-sm font-black rounded-xl transition-all disabled:opacity-40 shadow-sm ${isNegative ? "bg-rose-500 hover:bg-rose-600" : "bg-emerald-600 hover:bg-emerald-700"}`,
          children: processing ? "Applying…" : isNegative ? `Deduct ${Math.abs(pts)} Points` : `Award ${pts || 0} Points`
        }
      )
    ] })
  ] });
}
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
    ] }),
    /* @__PURE__ */ jsx(PointAdjustPanel, { athlete })
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
          /* @__PURE__ */ jsx(
            UserAvatar,
            {
              name: athlete.name,
              photo: athlete.profile_photo,
              className: "w-10 h-10 rounded-xl text-sm"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-900 text-sm", children: athlete.name }),
              belt && /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold border ${getBeltBadgeStyle(belt)}`, children: [
                /* @__PURE__ */ jsx("span", { className: "inline-block h-1.5 w-3 rounded-sm border shrink-0", style: getBeltStyle(belt) }),
                belt
              ] }),
              showGroup && groupName && /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100", children: groupName }),
              /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-100", children: [
                "⭐ ",
                profile?.event_points ?? 0,
                " pts"
              ] })
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
function CoachProfileCard({
  user,
  coachProfile,
  groups
}) {
  const totalAthletes = groups.reduce((sum, g) => sum + (g.athletes?.length || 0), 0);
  return /* @__PURE__ */ jsxs("div", { className: "relative bg-gradient-to-br from-indigo-600 via-blue-700 to-indigo-800 rounded-2xl p-8 overflow-hidden text-white", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-36 h-36 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" }),
    /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 right-6 w-16 h-16 bg-white/5 rounded-full" }),
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-6", children: [
        /* @__PURE__ */ jsx(
          UserAvatar,
          {
            name: user.name,
            photo: user.profile_photo,
            className: "w-16 h-16 rounded-2xl border-2 border-white/30 backdrop-blur-sm shadow-inner text-2xl",
            fallbackClassName: "bg-white/20 text-white"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-base font-bold text-white truncate leading-snug", children: user.name }),
          user.club && /* @__PURE__ */ jsx("p", { className: "text-xs text-white/70 font-medium truncate mt-0.5", children: user.club.name }),
          /* @__PURE__ */ jsx("span", { className: "inline-flex items-center gap-1 mt-1.5 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-lg bg-white/20 text-white border border-white/25", children: "🎽 Coach" })
        ] })
      ] }),
      user.titles && Array.isArray(user.titles) && user.titles.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[10px] font-extrabold uppercase tracking-widest mb-2 text-white/50", children: "Position" }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: user.titles.map((title, i) => /* @__PURE__ */ jsx(
          "span",
          {
            className: "inline-flex items-center text-xs font-bold px-3 py-1 rounded-xl backdrop-blur-sm border bg-white/15 border-white/25 text-white",
            children: title
          },
          i
        )) })
      ] }),
      coachProfile?.specialization && /* @__PURE__ */ jsxs("p", { className: "text-xs text-white/70 mb-4 font-medium", children: [
        "📌 ",
        coachProfile.specialization
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 mt-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/15", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-white/60 uppercase tracking-wide", children: "Groups" }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-black text-white", children: groups.length })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/15", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-white/60 uppercase tracking-wide", children: "Athletes" }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-black text-white", children: totalAthletes })
        ] })
      ] })
    ] })
  ] });
}
function AttendancePanel({ groups }) {
  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const initGroup = params.get("group_id") ? Number(params.get("group_id")) : groups[0]?.id ?? null;
  const initDate = params.get("date") || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const [selectedGroupId, setSelectedGroupId] = useState(initGroup);
  const [attendanceDate, setAttendanceDate] = useState(initDate);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const load = (groupId, date) => {
    if (!groupId) return;
    setLoading(true);
    setRows([]);
    axios.get(route("coach.attendance.load"), { params: { group_id: groupId, date } }).then((res) => setRows(res.data.attendance)).catch(() => setMessage({ type: "error", text: "Failed to load attendance." })).finally(() => setLoading(false));
  };
  useEffect(() => {
    load(selectedGroupId, attendanceDate);
  }, [selectedGroupId, attendanceDate]);
  const toggleStatus = (id) => {
    setRows((prev) => prev.map((r) => r.athlete_id === id ? { ...r, status: r.status === "present" ? "absent" : "present" } : r));
  };
  const setPoints = (id, field, val) => {
    setRows((prev) => prev.map((r) => r.athlete_id === id ? { ...r, [field]: val } : r));
  };
  const save = () => {
    if (!selectedGroupId || rows.length === 0) return;
    setSaving(true);
    axios.post(route("coach.attendance.save"), {
      training_group_id: selectedGroupId,
      attendance_date: attendanceDate,
      attendance_data: rows
    }).then(() => setMessage({ type: "success", text: "Attendance saved successfully!" })).catch(() => setMessage({ type: "error", text: "Failed to save attendance." })).finally(() => setSaving(false));
  };
  const presentCount = rows.filter((r) => r.status === "present").length;
  return /* @__PURE__ */ jsx("div", { className: "space-y-5", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm p-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-5", children: [
      /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-xl", children: "📋" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-gray-900", children: "Mark Attendance" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-0.5", children: "Track your athletes' attendance for training sessions" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5", children: "Group" }),
        /* @__PURE__ */ jsx(
          "select",
          {
            value: selectedGroupId ?? "",
            onChange: (e) => setSelectedGroupId(Number(e.target.value)),
            className: "w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300/30 focus:border-indigo-400",
            children: groups.map((g) => /* @__PURE__ */ jsx("option", { value: g.id, children: g.name }, g.id))
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5", children: "Date" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "date",
            value: attendanceDate,
            onChange: (e) => setAttendanceDate(e.target.value),
            className: "w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300/30 focus:border-indigo-400"
          }
        )
      ] })
    ] }),
    message && /* @__PURE__ */ jsxs("div", { className: `mb-4 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100"}`, children: [
      message.type === "success" ? "✅" : "❌",
      " ",
      message.text
    ] }),
    rows.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
      /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-1.5 text-xs font-bold text-emerald-700", children: [
        "✅ ",
        presentCount,
        " Present"
      ] }),
      /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 bg-rose-50 border border-rose-100 rounded-xl px-3 py-1.5 text-xs font-bold text-rose-600", children: [
        "❌ ",
        rows.length - presentCount,
        " Absent"
      ] })
    ] }),
    loading ? /* @__PURE__ */ jsx("div", { className: "py-10 text-center text-gray-400 text-sm", children: "Loading athletes…" }) : rows.length === 0 ? /* @__PURE__ */ jsx("div", { className: "py-10 text-center", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 font-medium", children: "No athletes in this group." }) }) : /* @__PURE__ */ jsx("div", { className: "space-y-2", children: rows.map((row) => /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-4 rounded-xl px-4 py-3 border transition-all ${row.status === "present" ? "bg-emerald-50 border-emerald-100" : "bg-gray-50 border-gray-100"}`, children: [
      /* @__PURE__ */ jsx(
        UserAvatar,
        {
          name: row.name,
          photo: row.profile_photo,
          className: "w-8 h-8 rounded-full text-xs"
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-gray-900 truncate", children: row.name }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 shrink-0", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-gray-400 uppercase", children: "Pts" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              value: row.base_points,
              onChange: (e) => setPoints(row.athlete_id, "base_points", Number(e.target.value)),
              min: 0,
              className: "w-14 text-center text-xs font-bold rounded-lg border border-gray-200 bg-white px-1.5 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-300/30"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-gray-400 uppercase", children: "+Bonus" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              value: row.extra_points,
              onChange: (e) => setPoints(row.athlete_id, "extra_points", Number(e.target.value)),
              className: "w-14 text-center text-xs font-bold rounded-lg border border-gray-200 bg-white px-1.5 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-300/30"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => toggleStatus(row.athlete_id),
            className: `px-4 py-1.5 rounded-xl text-xs font-black transition-all ${row.status === "present" ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`,
            children: row.status === "present" ? "✓ Present" : "Absent"
          }
        )
      ] })
    ] }, row.athlete_id)) }),
    rows.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-5", children: /* @__PURE__ */ jsx(
      "button",
      {
        onClick: save,
        disabled: saving,
        className: "w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-black rounded-xl transition-all disabled:opacity-50 shadow-sm",
        children: saving ? "Saving…" : "Save Attendance"
      }
    ) })
  ] }) });
}
function CoachDashboard({
  groups,
  nextPayout,
  payoutHistory,
  totalEarned,
  coachProfile,
  leaderboard = []
}) {
  const { auth } = usePage().props;
  const user = auth.user;
  const isAttendanceTab = typeof window !== "undefined" && window.location.search.includes("tab=attendance");
  const [activeSection, setActiveSection] = useState(null);
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
      label: "Sessions This Week",
      value: totalSessions,
      sub: "scheduled",
      valueColor: "text-blue-600",
      border: "border-blue-100",
      ring: "ring-blue-400",
      icon: "📅",
      iconBg: "bg-blue-50",
      hint: "View schedule →",
      href: route("coach.schedule"),
      noAction: false
    },
    {
      id: null,
      label: "Total Earned",
      value: fmtCurrency(totalEarned),
      sub: "all time",
      valueColor: "text-amber-600",
      border: "border-amber-100",
      ring: "ring-amber-400",
      icon: "💰",
      iconBg: "bg-amber-50",
      hint: "All-time payouts",
      href: void 0,
      noAction: true
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
          isAttendanceTab && /* @__PURE__ */ jsx(AttendancePanel, { groups }),
          isAttendanceTab ? null : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
              /* @__PURE__ */ jsx(CoachProfileCard, { user, coachProfile, groups }),
              /* @__PURE__ */ jsx("div", { className: "md:col-span-2 grid grid-cols-2 gap-4", children: statCards.map((card) => {
                const isActive = card.id !== null && activeSection === card.id;
                let CardTag;
                let cardProps;
                if (card.noAction) {
                  CardTag = "div";
                  cardProps = {};
                } else if (card.id !== null) {
                  CardTag = "button";
                  cardProps = { onClick: () => setActiveSection(activeSection === card.id ? null : card.id) };
                } else {
                  CardTag = Link;
                  cardProps = { href: card.href };
                }
                return /* @__PURE__ */ jsxs(
                  CardTag,
                  {
                    ...cardProps,
                    className: `group bg-white rounded-2xl border shadow-sm p-5 text-left transition-all ${card.noAction ? `${card.border} cursor-default` : `cursor-pointer hover:shadow-md hover:-translate-y-0.5`} ${isActive ? `${card.border} ring-2 ${card.ring}/40 shadow-md -translate-y-0.5` : `${card.border}`}`,
                    children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-2", children: [
                        /* @__PURE__ */ jsx("div", { className: `w-9 h-9 ${card.iconBg} rounded-xl flex items-center justify-center text-lg transition-transform group-hover:scale-110`, children: card.icon }),
                        isActive && /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-indigo-500 animate-pulse" })
                      ] }),
                      /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1", children: card.label }),
                      /* @__PURE__ */ jsx("p", { className: `text-2xl font-black ${card.valueColor}`, children: card.value }),
                      /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 mt-0.5", children: card.sub }),
                      /* @__PURE__ */ jsx("p", { className: `text-[10px] font-semibold mt-1.5 transition-opacity ${isActive ? "opacity-100 text-indigo-500" : "opacity-0 group-hover:opacity-60 text-gray-400"}`, children: card.hint })
                    ]
                  },
                  card.label
                );
              }) })
            ] }),
            nextPayout && /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-xl", children: "💰" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-amber-900", children: "Next Payout" }),
                  /* @__PURE__ */ jsxs("p", { className: "text-xs text-amber-600 mt-0.5", children: [
                    fmt(nextPayout.payout_date),
                    days !== null && /* @__PURE__ */ jsx("span", { className: "ml-2 font-bold", children: days === 0 ? "— Today!" : days > 0 ? `— in ${days} day${days !== 1 ? "s" : ""}` : `— ${Math.abs(days)} day${Math.abs(days) !== 1 ? "s" : ""} ago` })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                /* @__PURE__ */ jsx("p", { className: "text-2xl font-black text-amber-700", children: fmtCurrency(nextPayout.amount) }),
                nextPayout.tip && Number(nextPayout.tip) > 0 && /* @__PURE__ */ jsxs("p", { className: "text-xs text-amber-500 font-semibold", children: [
                  "+",
                  fmtCurrency(nextPayout.tip),
                  " bonus"
                ] })
              ] })
            ] }),
            activeSection === "athletes" && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", children: [
              /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 border-b border-gray-50 flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-gray-900", children: "All Athletes" }),
                  /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500 mt-0.5", children: [
                    allAthletes.length,
                    " athletes across your groups"
                  ] })
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => setActiveSection(null),
                    className: "text-gray-400 hover:text-gray-600 transition-colors",
                    children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("div", { className: "divide-y divide-gray-50", children: allAthletes.length > 0 ? allAthletes.map(({ athlete, groupName }) => /* @__PURE__ */ jsx(
                AthleteRow,
                {
                  athlete,
                  expandedAthleteId,
                  setExpandedAthleteId,
                  showGroup: true,
                  groupName
                },
                athlete.id
              )) : /* @__PURE__ */ jsx("div", { className: "py-12 text-center text-gray-400 text-sm italic", children: "No athletes in your groups yet." }) })
            ] }),
            activeSection === "groups" && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", children: [
              /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 border-b border-gray-50 flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-gray-900", children: "My Groups" }),
                  /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500 mt-0.5", children: [
                    groups.length,
                    " group",
                    groups.length !== 1 ? "s" : "",
                    " assigned"
                  ] })
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => setActiveSection(null),
                    className: "text-gray-400 hover:text-gray-600 transition-colors",
                    children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
                  }
                )
              ] }),
              groups.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex border-b border-gray-100 overflow-x-auto", children: groups.map((g, idx) => /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => {
                    setSelectedGroupIdx(idx);
                    setExpandedAthleteId(null);
                  },
                  className: `flex-shrink-0 px-5 py-3 text-sm font-bold transition-colors ${selectedGroupIdx === idx ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500 hover:text-gray-700"}`,
                  children: [
                    g.name,
                    /* @__PURE__ */ jsx("span", { className: `ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${selectedGroupIdx === idx ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-500"}`, children: g.athletes.length })
                  ]
                },
                g.id
              )) }),
              selectedGroup && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsxs("div", { className: "px-6 py-3 bg-slate-50 border-b border-gray-100 flex flex-wrap gap-3", children: [
                  /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600", children: [
                    "🎯 ",
                    selectedGroup.skill_level
                  ] }),
                  selectedGroup.age_range && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600", children: [
                    "👥 Ages: ",
                    selectedGroup.age_range
                  ] }),
                  (selectedGroup.schedules?.length ?? 0) > 0 && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600", children: [
                    "📅 ",
                    selectedGroup.schedules.length,
                    " session",
                    selectedGroup.schedules.length !== 1 ? "s" : "",
                    "/wk"
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "divide-y divide-gray-50", children: selectedGroup.athletes.length > 0 ? selectedGroup.athletes.map((athlete) => /* @__PURE__ */ jsx(
                  AthleteRow,
                  {
                    athlete,
                    expandedAthleteId,
                    setExpandedAthleteId
                  },
                  athlete.id
                )) : /* @__PURE__ */ jsx("div", { className: "py-10 text-center text-gray-400 text-sm italic", children: "No athletes in this group yet." }) }),
                (selectedGroup.schedules?.length ?? 0) > 0 && /* @__PURE__ */ jsxs("div", { className: "border-t border-gray-100", children: [
                  /* @__PURE__ */ jsx("div", { className: "px-6 py-3 bg-slate-50", children: /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-gray-500 uppercase tracking-wide", children: "Weekly Schedule" }) }),
                  /* @__PURE__ */ jsx("div", { className: "divide-y divide-gray-50", children: selectedGroup.schedules.map((s, idx) => {
                    const dateNum = new Date(getDateForDayOfWeek(s.day_of_week)).getDate();
                    return /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-4 px-6 py-3 border-l-4 ${DAY_COLOR[s.day_of_week] || "border-gray-200"}`, children: [
                      /* @__PURE__ */ jsxs("div", { className: "text-center w-12 shrink-0", children: [
                        /* @__PURE__ */ jsx("p", { className: "text-[10px] font-extrabold uppercase tracking-wide text-gray-400", children: s.day_of_week.substring(0, 3) }),
                        /* @__PURE__ */ jsx("p", { className: "text-lg font-black text-gray-800 leading-none mt-0.5", children: dateNum })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                        /* @__PURE__ */ jsxs("p", { className: "text-sm font-semibold text-gray-800", children: [
                          fmtTime(s.start_time),
                          " – ",
                          fmtTime(s.end_time)
                        ] }),
                        s.facility?.name && /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 mt-0.5", children: s.facility.name }),
                        s.notes && /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 mt-0.5 italic", children: s.notes })
                      ] })
                    ] }, idx);
                  }) })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", children: [
                /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-yellow-50 to-amber-50 px-5 py-4 border-b border-amber-100 flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-amber-900", children: "Top Athletes (Points)" }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-amber-600 mt-0.5", children: "Club-wide ranking" })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center text-sm", children: "🏆" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "p-4 divide-y divide-gray-50", children: leaderboard.length > 0 ? leaderboard.slice(0, 5).map((ath, idx) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-2.5 first:pt-0 last:pb-0", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
                    /* @__PURE__ */ jsx("span", { className: `w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${idx === 0 ? "bg-amber-500 text-white" : idx === 1 ? "bg-slate-300 text-slate-800" : idx === 2 ? "bg-amber-600 text-white" : "bg-gray-100 text-gray-500"}`, children: idx + 1 }),
                    /* @__PURE__ */ jsx(
                      UserAvatar,
                      {
                        name: ath.name,
                        photo: ath.profile_photo,
                        className: "w-8 h-8 rounded-lg text-[11px]",
                        fallbackClassName: "bg-amber-50 text-amber-700"
                      }
                    ),
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
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", children: [
                /* @__PURE__ */ jsxs("div", { className: "px-5 py-4 border-b border-gray-50 flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-gray-900", children: "Recent Payouts" }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-0.5", children: "Last 5 paid payouts" })
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "text-xl", children: "📋" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "divide-y divide-gray-50", children: payoutHistory.length > 0 ? payoutHistory.map((p) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-5 py-3", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-gray-800", children: fmt(p.payout_date) }),
                    p.notes && /* @__PURE__ */ jsx("p", { className: "text-[10px] text-gray-400 mt-0.5", children: p.notes })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-sm font-black text-emerald-600", children: fmtCurrency(p.amount) }),
                    p.tip && Number(p.tip) > 0 && /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-amber-500 font-semibold", children: [
                      "+",
                      fmtCurrency(p.tip),
                      " bonus"
                    ] })
                  ] })
                ] }, p.id)) : /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 italic text-center py-8", children: "No payout history yet." }) })
              ] })
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
