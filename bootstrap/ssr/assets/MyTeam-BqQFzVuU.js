import { jsxs, jsx } from "react/jsx-runtime";
import { A as Authenticated, U as UserAvatar } from "./AuthenticatedLayout-DCg19vub.js";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";
import { b as getBeltStyle, g as getBeltBadgeStyle } from "./beltHelpers-6FZX55wB.js";
import "@headlessui/react";
import "axios";
import "./ml-sports-BsguC5B3.js";
const METRICS = [
  { key: "speed", label: "Speed", color: "from-blue-400 to-blue-600", track: "bg-blue-100", fill: "bg-blue-500", icon: "⚡" },
  { key: "strength", label: "Strength", color: "from-orange-400 to-orange-600", track: "bg-orange-100", fill: "bg-orange-500", icon: "💪" },
  { key: "flexibility", label: "Flexibility", color: "from-emerald-400 to-emerald-600", track: "bg-emerald-100", fill: "bg-emerald-500", icon: "🤸" },
  { key: "kyorugi", label: "Kyorugi", color: "from-rose-400 to-rose-600", track: "bg-rose-100", fill: "bg-rose-500", icon: "🥊" },
  { key: "poomsae", label: "Poomsae", color: "from-purple-400 to-purple-600", track: "bg-purple-100", fill: "bg-purple-500", icon: "🎽" }
];
function getAge(dob) {
  if (!dob) return "—";
  return Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1e3)).toString();
}
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
function AthleteDetailsPanel({ athlete }) {
  const profile = athlete.athlete_profile;
  const { data: metricsData, setData: setMetric, post: postMetrics, processing: savingMetrics } = useForm({
    speed: profile?.speed ?? 0,
    strength: profile?.strength ?? 0,
    flexibility: profile?.flexibility ?? 0,
    kyorugi: profile?.kyorugi ?? 0,
    poomsae: profile?.poomsae ?? 0
  });
  const tipForm = useForm({
    coach_tip: profile?.coach_tip ?? ""
  });
  const [metricsSaved, setMetricsSaved] = useState(false);
  const [tipSaved, setTipSaved] = useState(false);
  const submitMetrics = (e) => {
    e.preventDefault();
    postMetrics(route("coach.athletes.skills", athlete.id), {
      preserveScroll: true,
      onSuccess: () => {
        setMetricsSaved(true);
        setTimeout(() => setMetricsSaved(false), 2e3);
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
        metricsSaved && /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg flex items-center gap-1", children: [
          /* @__PURE__ */ jsx("svg", { className: "w-3 h-3", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }),
          "Saved!"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: submitMetrics, className: "space-y-4", children: [
        METRICS.map((m) => /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1.5", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-xs font-semibold text-gray-600 flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx("span", { children: m.icon }),
              " ",
              m.label
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-xs font-black text-gray-800 w-8 text-right", children: metricsData[m.key] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: `flex-1 ${m.track} rounded-full h-2 overflow-hidden`, children: /* @__PURE__ */ jsx(
              "div",
              {
                className: `${m.fill} h-2 rounded-full transition-all duration-200`,
                style: { width: `${metricsData[m.key]}%` }
              }
            ) }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "range",
                min: 0,
                max: 100,
                value: metricsData[m.key],
                onChange: (e) => setMetric(m.key, Number(e.target.value)),
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
            disabled: savingMetrics,
            className: "w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all disabled:opacity-50 shadow-sm",
            children: savingMetrics ? "Saving…" : "Save Metrics"
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
function AthleteCard({
  athlete,
  expandedAthleteId,
  setExpandedAthleteId
}) {
  const profile = athlete.athlete_profile;
  const rank = profile?.belt_rank ?? null;
  const age = getAge(profile?.date_of_birth ?? null);
  const isExpanded = expandedAthleteId === athlete.id;
  return /* @__PURE__ */ jsxs("div", { className: `px-6 py-4 transition-colors rounded-2xl border mb-3 bg-white shadow-sm ${isExpanded ? "border-indigo-200 ring-1 ring-indigo-50/55 bg-indigo-50/5" : "border-gray-100 hover:bg-slate-50"}`, children: [
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
              rank && /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold border ${getBeltBadgeStyle(rank)}`, children: [
                /* @__PURE__ */ jsx("span", { className: "inline-block h-1.5 w-3 rounded-sm border shrink-0", style: getBeltStyle(rank) }),
                rank
              ] }),
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
          /* @__PURE__ */ jsx(
            "svg",
            {
              className: `w-4 h-4 text-gray-400 shrink-0 mt-1 transition-transform ${isExpanded ? "rotate-180" : ""}`,
              fill: "none",
              viewBox: "0 0 24 24",
              stroke: "currentColor",
              children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" })
            }
          )
        ] })
      }
    ),
    isExpanded && /* @__PURE__ */ jsx(AthleteDetailsPanel, { athlete })
  ] });
}
function MyTeam({ groups }) {
  const [selectedGroupId, setSelectedGroupId] = useState(groups[0]?.id ?? null);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedAthleteId, setExpandedAthleteId] = useState(null);
  const activeGroup = groups.find((g) => g.id === selectedGroupId) || null;
  const displayedAthletes = activeGroup ? activeGroup.athletes.filter(
    (athlete) => athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) || athlete.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];
  return /* @__PURE__ */ jsxs(
    Authenticated,
    {
      header: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-900", children: "My Team Directory" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-0.5", children: "Manage athlete metrics, awards and feedback by groups" })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "My Team" }),
        /* @__PURE__ */ jsx("div", { className: "py-8", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: groups.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4", children: "🥋" }),
          /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-900 mb-1", children: "No groups assigned" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 max-w-sm mx-auto", children: "You are not currently assigned as a Coach to any training groups. Contact your Club Manager to be assigned." })
        ] }) : /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-6 items-start", children: [
          /* @__PURE__ */ jsxs("div", { className: "lg:col-span-1 space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm p-4", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1", children: "Training Groups" }),
              /* @__PURE__ */ jsx("div", { className: "block lg:hidden mb-1", children: /* @__PURE__ */ jsx(
                "select",
                {
                  value: selectedGroupId ?? "",
                  onChange: (e) => setSelectedGroupId(Number(e.target.value)),
                  className: "w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300/30",
                  children: groups.map((g) => /* @__PURE__ */ jsxs("option", { value: g.id, children: [
                    g.name,
                    " (",
                    g.athletes.length,
                    ")"
                  ] }, g.id))
                }
              ) }),
              /* @__PURE__ */ jsx("div", { className: "hidden lg:flex flex-col gap-1", children: groups.map((g) => {
                const isActive = g.id === selectedGroupId;
                return /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: () => {
                      setSelectedGroupId(g.id);
                      setExpandedAthleteId(null);
                    },
                    className: `w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${isActive ? "bg-indigo-600 text-white shadow-sm" : "text-gray-600 hover:bg-slate-50 hover:text-gray-900"}`,
                    children: [
                      /* @__PURE__ */ jsx("span", { className: "truncate pr-2", children: g.name }),
                      /* @__PURE__ */ jsx("span", { className: `px-2 py-0.5 text-[10px] rounded-lg font-extrabold ${isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`, children: g.athletes.length })
                    ]
                  },
                  g.id
                );
              }) })
            ] }),
            activeGroup && /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100 p-4 hidden lg:block", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] font-extrabold text-indigo-800 uppercase tracking-widest mb-2", children: "Group Details" }),
              /* @__PURE__ */ jsx("h4", { className: "font-bold text-gray-900 text-sm leading-tight", children: activeGroup.name }),
              /* @__PURE__ */ jsxs("div", { className: "mt-3 space-y-2 text-xs text-gray-600", children: [
                /* @__PURE__ */ jsxs("p", { className: "flex justify-between", children: [
                  /* @__PURE__ */ jsx("span", { children: "Skill Level:" }),
                  /* @__PURE__ */ jsx("strong", { className: "text-gray-950 font-bold", children: activeGroup.skill_level })
                ] }),
                activeGroup.age_range && /* @__PURE__ */ jsxs("p", { className: "flex justify-between", children: [
                  /* @__PURE__ */ jsx("span", { children: "Age Range:" }),
                  /* @__PURE__ */ jsx("strong", { className: "text-gray-950 font-bold", children: activeGroup.age_range })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "lg:col-span-3 space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col md:flex-row items-center justify-between gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "relative w-full md:max-w-xs shrink-0", children: [
                /* @__PURE__ */ jsx("span", { className: "absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400", children: "🔍" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: searchTerm,
                    onChange: (e) => setSearchTerm(e.target.value),
                    placeholder: "Search athlete by name or email...",
                    className: "w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-400 font-semibold", children: [
                "Showing ",
                displayedAthletes.length,
                " of ",
                activeGroup?.athletes.length || 0,
                " athletes"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "space-y-1", children: displayedAthletes.length === 0 ? /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center", children: /* @__PURE__ */ jsx("p", { className: "text-gray-400 italic text-sm", children: searchTerm ? "No athletes match your search query." : "This group has no athletes." }) }) : displayedAthletes.map((athlete) => /* @__PURE__ */ jsx(
              AthleteCard,
              {
                athlete,
                expandedAthleteId,
                setExpandedAthleteId
              },
              athlete.id
            )) })
          ] })
        ] }) }) })
      ]
    }
  );
}
export {
  MyTeam as default
};
