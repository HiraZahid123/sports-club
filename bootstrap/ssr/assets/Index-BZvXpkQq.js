import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as Authenticated } from "./AuthenticatedLayout-CAEJzy7Q.js";
import { useForm, Head } from "@inertiajs/react";
import { useState } from "react";
import "@headlessui/react";
import "axios";
import "./ml-sports-BEC2gdiG.js";
const OPTION_META = {
  athlete: { icon: "👤", label: "Per Athlete", color: "bg-blue-50 text-blue-700 border-blue-100" },
  hourly: { icon: "⏱️", label: "Per Hour (Schedule)", color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  manual: { icon: "💰", label: "Fixed / Manual", color: "bg-indigo-50 text-indigo-700 border-indigo-100" }
};
function getCoachStats(coach) {
  const groups = coach.training_groups || [];
  const allAthletes = groups.flatMap((g) => g.athletes || []);
  const athleteCount = new Set(allAthletes.map((a) => a.id)).size;
  let totalWeeklyMinutes = 0;
  let totalClassesCount = 0;
  groups.forEach((g) => {
    (g.schedules || []).forEach((s) => {
      totalClassesCount++;
      const [sh, sm] = s.start_time.split(":").map(Number);
      const [eh, em] = s.end_time.split(":").map(Number);
      const mins = eh * 60 + em - (sh * 60 + sm);
      if (mins > 0) totalWeeklyMinutes += mins;
    });
  });
  return { athleteCount, totalClassesCount, weeklyHours: totalWeeklyMinutes / 60, groupCount: groups.length };
}
function calcEarning(coach) {
  const profile = coach.coach_profile;
  if (!profile?.payment_option || !profile?.payment_rate) return null;
  const { athleteCount, weeklyHours } = getCoachStats(coach);
  const rate = Number(profile.payment_rate);
  if (profile.payment_option === "athlete") return athleteCount * rate;
  if (profile.payment_option === "hourly") return weeklyHours * rate * 4;
  if (profile.payment_option === "manual") return rate;
  return null;
}
function CoachesIndex({ coaches }) {
  const [editing, setEditing] = useState(null);
  const [activeTab, setActiveTab] = useState("info");
  const { data, setData, put, processing, errors, reset, clearErrors } = useForm({
    name: "",
    email: "",
    phone: "",
    city: "",
    specialization: "",
    bio: "",
    payment_option: "manual",
    payment_rate: "0"
  });
  const openEdit = (coach) => {
    const p = coach.coach_profile;
    setData({
      name: coach.name,
      email: coach.email,
      phone: coach.phone ?? "",
      city: coach.city ?? "",
      specialization: p?.specialization ?? "",
      bio: p?.bio ?? "",
      payment_option: p?.payment_option ?? "manual",
      payment_rate: (p?.payment_rate ?? 0).toString()
    });
    clearErrors();
    setEditing(coach);
    setActiveTab("info");
  };
  const closeEdit = () => {
    setEditing(null);
    reset();
    clearErrors();
  };
  const submit = (e) => {
    e.preventDefault();
    put(route("manager.coaches.update", editing.id), { onSuccess: closeEdit });
  };
  const inputClass = "w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all";
  const labelClass = "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5";
  return /* @__PURE__ */ jsxs(
    Authenticated,
    {
      header: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Coach Management" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500 mt-0.5", children: [
          coaches.length,
          " coach",
          coaches.length !== 1 ? "es" : "",
          " — edit info and configure salary / revenue options"
        ] })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Coaches" }),
        /* @__PURE__ */ jsx("div", { className: "py-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-start gap-3", children: [
            /* @__PURE__ */ jsx("span", { className: "text-indigo-400 text-lg mt-0.5", children: "ℹ️" }),
            /* @__PURE__ */ jsxs("div", { className: "text-sm text-indigo-800", children: [
              /* @__PURE__ */ jsx("span", { className: "font-bold", children: "Three salary options available:" }),
              " ",
              /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Option 1" }),
              " — Per Athlete × EUR (counts athletes in coach's groups) ·",
              " ",
              /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Option 2" }),
              " — EUR Per Hour × monthly hours (weekly schedule × 4 weeks) ·",
              " ",
              /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Option 3" }),
              " — Manager writes the amount manually each payout. Changes take effect immediately."
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "overflow-x-auto", children: [
            /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
              /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-slate-50 border-b border-gray-100", children: [
                /* @__PURE__ */ jsx("th", { className: "px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide", children: "Coach" }),
                /* @__PURE__ */ jsx("th", { className: "px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide", children: "Specialization" }),
                /* @__PURE__ */ jsx("th", { className: "px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide", children: "Groups / Athletes" }),
                /* @__PURE__ */ jsx("th", { className: "px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide", children: "Weekly Hours" }),
                /* @__PURE__ */ jsx("th", { className: "px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide", children: "Salary Option" }),
                /* @__PURE__ */ jsx("th", { className: "px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide", children: "Est. Earning / Month" }),
                /* @__PURE__ */ jsx("th", { className: "px-6 py-3.5 text-right text-xs font-bold text-gray-500 uppercase tracking-wide", children: "Actions" })
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-50", children: coaches.map((coach) => {
                const p = coach.coach_profile;
                const opt = p?.payment_option ?? "manual";
                const meta = OPTION_META[opt] ?? OPTION_META.manual;
                const stats = getCoachStats(coach);
                const earning = calcEarning(coach);
                return /* @__PURE__ */ jsxs("tr", { className: "hover:bg-slate-50/60 transition-colors", children: [
                  /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center font-bold text-amber-700 text-sm border border-amber-100 shrink-0", children: coach.name.charAt(0).toUpperCase() }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-900 text-sm", children: coach.name }),
                      /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400", children: coach.email }),
                      coach.phone && /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400", children: coach.phone })
                    ] })
                  ] }) }),
                  /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-sm text-gray-600", children: p?.specialization || /* @__PURE__ */ jsx("span", { className: "text-gray-300 italic", children: "—" }) }),
                  /* @__PURE__ */ jsxs("td", { className: "px-6 py-4", children: [
                    /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-700 font-medium", children: [
                      stats.groupCount,
                      " group",
                      stats.groupCount !== 1 ? "s" : ""
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-400", children: [
                      stats.athleteCount,
                      " athlete",
                      stats.athleteCount !== 1 ? "s" : ""
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("td", { className: "px-6 py-4", children: [
                    /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-700 font-medium", children: [
                      stats.weeklyHours.toFixed(1),
                      " hrs"
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-400", children: [
                      stats.totalClassesCount,
                      " class",
                      stats.totalClassesCount !== 1 ? "es" : "",
                      "/wk"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("td", { className: "px-6 py-4", children: [
                    /* @__PURE__ */ jsxs("div", { className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${meta.color}`, children: [
                      /* @__PURE__ */ jsx("span", { children: meta.icon }),
                      /* @__PURE__ */ jsx("span", { children: meta.label })
                    ] }),
                    p?.payment_rate && p.payment_rate > 0 && opt !== "manual" && /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-400 mt-1", children: [
                      "€",
                      Number(p.payment_rate).toFixed(2),
                      opt === "athlete" ? " / athlete" : " / hr"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: earning !== null ? /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold text-emerald-600", children: [
                    "€",
                    earning.toFixed(2)
                  ] }) : /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-400 italic", children: "Set manually" }) }),
                  /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => openEdit(coach),
                      className: "px-4 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors",
                      children: "Edit"
                    }
                  ) })
                ] }, coach.id);
              }) })
            ] }),
            coaches.length === 0 && /* @__PURE__ */ jsxs("div", { className: "py-16 text-center", children: [
              /* @__PURE__ */ jsx("div", { className: "w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4", children: "🏋️" }),
              /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-900 mb-1", children: "No coaches yet" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Invite a coach from the Members page to get started." })
            ] })
          ] }) })
        ] }) }),
        editing && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white w-full sm:rounded-2xl shadow-2xl sm:max-w-2xl overflow-hidden max-h-screen sm:max-h-[90vh] flex flex-col", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-indigo-600 to-blue-700 px-6 py-5 flex items-center justify-between shrink-0", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-white", children: "Edit Coach" }),
              /* @__PURE__ */ jsx("p", { className: "text-indigo-200 text-sm mt-0.5", children: editing.name })
            ] }),
            /* @__PURE__ */ jsx("button", { onClick: closeEdit, className: "text-indigo-200 hover:text-white transition-colors", children: /* @__PURE__ */ jsx("svg", { className: "w-6 h-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex border-b border-gray-100 shrink-0", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setActiveTab("info"),
                className: `flex-1 py-3 text-sm font-bold transition-colors ${activeTab === "info" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500 hover:text-gray-700"}`,
                children: "Coach Information"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setActiveTab("salary"),
                className: `flex-1 py-3 text-sm font-bold transition-colors ${activeTab === "salary" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500 hover:text-gray-700"}`,
                children: "Salary & Revenue"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setActiveTab("payouts"),
                className: `flex-1 py-3 text-sm font-bold transition-colors ${activeTab === "payouts" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500 hover:text-gray-700"}`,
                children: "Payout History"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "flex flex-col flex-1 overflow-hidden", children: [
            /* @__PURE__ */ jsxs("div", { className: "overflow-y-auto flex-1 p-6 space-y-5", children: [
              activeTab === "info" && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: labelClass, children: "Full Name" }),
                    /* @__PURE__ */ jsx("input", { type: "text", value: data.name, onChange: (e) => setData("name", e.target.value), className: inputClass, placeholder: "Coach Name" }),
                    errors.name && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600", children: errors.name })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: labelClass, children: "Email Address" }),
                    /* @__PURE__ */ jsx("input", { type: "email", value: data.email, onChange: (e) => setData("email", e.target.value), className: inputClass, placeholder: "email@example.com" }),
                    errors.email && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600", children: errors.email })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: labelClass, children: "Phone" }),
                    /* @__PURE__ */ jsx("input", { type: "text", value: data.phone, onChange: (e) => setData("phone", e.target.value), className: inputClass, placeholder: "+1 555 000 0000" }),
                    errors.phone && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600", children: errors.phone })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: labelClass, children: "City" }),
                    /* @__PURE__ */ jsx("input", { type: "text", value: data.city, onChange: (e) => setData("city", e.target.value), className: inputClass, placeholder: "e.g. London" }),
                    errors.city && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600", children: errors.city })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: labelClass, children: "Specialization" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: data.specialization, onChange: (e) => setData("specialization", e.target.value), className: inputClass, placeholder: "e.g. Judo, Strength & Conditioning" }),
                  errors.specialization && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600", children: errors.specialization })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: labelClass, children: "Bio" }),
                  /* @__PURE__ */ jsx(
                    "textarea",
                    {
                      value: data.bio,
                      onChange: (e) => setData("bio", e.target.value),
                      rows: 3,
                      className: inputClass + " resize-none",
                      placeholder: "Short bio about the coach..."
                    }
                  ),
                  errors.bio && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600", children: errors.bio })
                ] })
              ] }),
              activeTab === "salary" && /* @__PURE__ */ jsxs(Fragment, { children: [
                (() => {
                  const stats = getCoachStats(editing);
                  return /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 border border-gray-100 rounded-2xl p-4 grid grid-cols-3 gap-4 text-center", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("p", { className: "text-2xl font-black text-gray-800", children: stats.athleteCount }),
                      /* @__PURE__ */ jsx("p", { className: "text-[11px] text-gray-500 font-medium mt-0.5", children: "Athletes" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("p", { className: "text-2xl font-black text-gray-800", children: stats.totalClassesCount }),
                      /* @__PURE__ */ jsx("p", { className: "text-[11px] text-gray-500 font-medium mt-0.5", children: "Classes / Week" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("p", { className: "text-2xl font-black text-gray-800", children: stats.weeklyHours.toFixed(1) }),
                      /* @__PURE__ */ jsx("p", { className: "text-[11px] text-gray-500 font-medium mt-0.5", children: "Hours / Week" })
                    ] })
                  ] });
                })(),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: labelClass, children: "Revenue / Salary Option" }),
                  /* @__PURE__ */ jsx("div", { className: "space-y-2", children: [
                    {
                      value: "athlete",
                      icon: "👤",
                      title: "Option 1 — Per Athlete × EUR",
                      desc: "Manager sets price per 1 athlete. System multiplies by number of athletes in coach's training groups."
                    },
                    {
                      value: "hourly",
                      icon: "⏱️",
                      title: "Option 2 — EUR Per Hour (Training Schedule)",
                      desc: "System counts weekly class hours × 4 weeks. Manager sets the hourly price. Result is monthly salary."
                    },
                    {
                      value: "manual",
                      icon: "💰",
                      title: "Option 3 — Manager Sets Amount",
                      desc: "Manager manually enters the payout amount each time. No automatic calculation."
                    }
                  ].map((opt) => /* @__PURE__ */ jsxs(
                    "label",
                    {
                      className: `flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${data.payment_option === opt.value ? "border-indigo-600 bg-indigo-50/30" : "border-gray-200 hover:bg-slate-50"}`,
                      children: [
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            type: "radio",
                            name: "payment_option",
                            value: opt.value,
                            checked: data.payment_option === opt.value,
                            onChange: () => setData("payment_option", opt.value),
                            className: "mt-1 text-indigo-600 focus:ring-indigo-500"
                          }
                        ),
                        /* @__PURE__ */ jsx("span", { className: "text-xl leading-none mt-0.5", children: opt.icon }),
                        /* @__PURE__ */ jsxs("div", { children: [
                          /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-gray-900", children: opt.title }),
                          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-0.5", children: opt.desc })
                        ] })
                      ]
                    },
                    opt.value
                  )) }),
                  errors.payment_option && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600", children: errors.payment_option })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("label", { className: labelClass, children: [
                    data.payment_option === "athlete" && "Price per Athlete (€)",
                    data.payment_option === "hourly" && "Price per Hour (€)",
                    data.payment_option === "manual" && "Default Amount (€) — optional, manager can override"
                  ] }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "number",
                      step: "0.01",
                      min: "0",
                      value: data.payment_rate,
                      onChange: (e) => setData("payment_rate", e.target.value),
                      placeholder: "0.00",
                      className: inputClass
                    }
                  ),
                  errors.payment_rate && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600", children: errors.payment_rate })
                ] }),
                data.payment_option !== "manual" && Number(data.payment_rate) > 0 && /* @__PURE__ */ jsxs("div", { className: `rounded-2xl p-4 border ${data.payment_option === "athlete" ? "bg-blue-50 border-blue-100" : "bg-emerald-50 border-emerald-100"}`, children: [
                  /* @__PURE__ */ jsx("p", { className: `text-xs font-bold uppercase tracking-wide mb-2 ${data.payment_option === "athlete" ? "text-blue-700" : "text-emerald-700"}`, children: "Estimated Earnings Preview" }),
                  data.payment_option === "athlete" && (() => {
                    const stats = getCoachStats(editing);
                    const total = stats.athleteCount * Number(data.payment_rate);
                    return /* @__PURE__ */ jsxs("div", { className: "text-sm text-blue-900 space-y-1", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                        /* @__PURE__ */ jsx("span", { children: "Athletes in groups:" }),
                        /* @__PURE__ */ jsx("span", { className: "font-bold", children: stats.athleteCount })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                        /* @__PURE__ */ jsx("span", { children: "× Rate per athlete:" }),
                        /* @__PURE__ */ jsxs("span", { className: "font-bold", children: [
                          "€",
                          Number(data.payment_rate).toFixed(2)
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "flex justify-between border-t border-blue-200 pt-1 font-black text-base", children: [
                        /* @__PURE__ */ jsx("span", { children: "Total:" }),
                        /* @__PURE__ */ jsxs("span", { className: "text-blue-700", children: [
                          "€",
                          total.toFixed(2)
                        ] })
                      ] })
                    ] });
                  })(),
                  data.payment_option === "hourly" && (() => {
                    const stats = getCoachStats(editing);
                    const totalPerMonth = stats.weeklyHours * Number(data.payment_rate) * 4;
                    return /* @__PURE__ */ jsxs("div", { className: "text-sm text-emerald-900 space-y-1", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                        /* @__PURE__ */ jsx("span", { children: "Weekly hours:" }),
                        /* @__PURE__ */ jsxs("span", { className: "font-bold", children: [
                          stats.weeklyHours.toFixed(2),
                          " hrs"
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                        /* @__PURE__ */ jsx("span", { children: "× Rate per hour:" }),
                        /* @__PURE__ */ jsxs("span", { className: "font-bold", children: [
                          "€",
                          Number(data.payment_rate).toFixed(2)
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                        /* @__PURE__ */ jsx("span", { children: "× 4 weeks / month:" }),
                        /* @__PURE__ */ jsx("span", { className: "font-bold", children: "4" })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "flex justify-between border-t border-emerald-200 pt-1 font-black text-base", children: [
                        /* @__PURE__ */ jsx("span", { children: "Monthly total:" }),
                        /* @__PURE__ */ jsxs("span", { className: "text-emerald-700", children: [
                          "€",
                          totalPerMonth.toFixed(2)
                        ] })
                      ] })
                    ] });
                  })()
                ] })
              ] }),
              activeTab === "payouts" && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-gray-100 pb-2", children: [
                  /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold text-gray-900", children: "Payout History" }),
                  /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-500 font-medium", children: [
                    (editing.coach_payouts || []).length,
                    " payout(s)"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "divide-y divide-gray-100 max-h-[350px] overflow-y-auto pr-1", children: [
                  (editing.coach_payouts || []).map((payout) => /* @__PURE__ */ jsxs("div", { className: "py-3 flex items-center justify-between text-sm", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxs("p", { className: "font-semibold text-gray-950", children: [
                          "€",
                          Number(payout.amount).toFixed(2)
                        ] }),
                        payout.payment_type && /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200", children: payout.payment_type })
                      ] }),
                      /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-400 mt-0.5", children: [
                        new Date(payout.payout_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
                        payout.tip && parseFloat(payout.tip.toString()) > 0 && /* @__PURE__ */ jsxs("span", { className: "text-amber-600 font-semibold ml-2", children: [
                          "(incl. €",
                          parseFloat(payout.tip.toString()).toFixed(2),
                          " tip)"
                        ] })
                      ] }),
                      payout.notes && /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500 italic mt-1 bg-slate-50 p-1.5 rounded-lg border border-slate-100", children: [
                        "Note: ",
                        payout.notes
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx("span", { className: "inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-100", children: "Paid" })
                  ] }, payout.id)),
                  (!editing.coach_payouts || editing.coach_payouts.length === 0) && /* @__PURE__ */ jsx("div", { className: "py-8 text-center text-gray-400 text-xs italic", children: "No payout recorded for this coach yet." })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "shrink-0 px-6 py-4 border-t border-gray-100 flex gap-3", children: activeTab === "payouts" ? /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: closeEdit,
                className: "w-full py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-all",
                children: "Close"
              }
            ) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: closeEdit,
                  className: "flex-1 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-all",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "submit",
                  disabled: processing,
                  className: "flex-1 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-sm",
                  children: processing ? "Saving…" : "Save Coach"
                }
              )
            ] }) })
          ] })
        ] }) })
      ]
    }
  );
}
export {
  CoachesIndex as default
};
