import { jsxs, jsx } from "react/jsx-runtime";
import { A as Authenticated } from "./AuthenticatedLayout-CAEJzy7Q.js";
import { useForm, Head } from "@inertiajs/react";
import { useState, useEffect } from "react";
import "@headlessui/react";
import "axios";
import "./ml-sports-BEC2gdiG.js";
const paymentTypeBadges = {
  "Per Athlete": "bg-blue-50 text-blue-700 border-blue-100",
  "Hourly Rate": "bg-emerald-50 text-emerald-700 border-emerald-100",
  "Fixed Amount": "bg-indigo-50 text-indigo-700 border-indigo-100",
  "Monthly Salary": "bg-indigo-50 text-indigo-700 border-indigo-100",
  "Per Session": "bg-purple-50 text-purple-700 border-purple-100",
  "Commission": "bg-amber-50 text-amber-700 border-amber-100",
  "Bonus": "bg-rose-50 text-rose-700 border-rose-100"
};
function ReportsIndex({ revenueData, coaches, recentPayouts }) {
  const [selectedCoach, setSelectedCoach] = useState(null);
  const { data, setData, post, processing, reset } = useForm({
    user_id: "",
    amount: "",
    payout_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    payment_type: "Fixed Amount",
    notes: ""
  });
  const [calcOption, setCalcOption] = useState("manual");
  const [pricePerAthlete, setPricePerAthlete] = useState("10");
  const [pricePerHour, setPricePerHour] = useState("");
  const [numberOfWeeks, setNumberOfWeeks] = useState("4");
  const [selectedCoachSettings, setSelectedCoachSettings] = useState(null);
  const settingsForm = useForm({
    payment_option: "manual",
    payment_rate: "0"
  });
  const selectCoachSettings = (coach) => {
    setSelectedCoachSettings(coach);
    const profile = coach.coach_profile || coach.coachProfile;
    settingsForm.setData({
      payment_option: profile?.payment_option || "manual",
      payment_rate: (profile?.payment_rate || 0).toString()
    });
    settingsForm.clearErrors();
  };
  const submitSettings = (e) => {
    e.preventDefault();
    settingsForm.post(route("manager.coaches.payment-settings", selectedCoachSettings.id), {
      onSuccess: () => {
        setSelectedCoachSettings(null);
        settingsForm.reset();
      }
    });
  };
  const selectCoachForPayment = (coach) => {
    setSelectedCoach(coach);
    const profile = coach.coach_profile || coach.coachProfile;
    const defaultOpt = profile?.payment_option || "manual";
    const defaultRate = profile?.payment_rate || "0";
    setCalcOption(defaultOpt);
    if (defaultOpt === "athlete") {
      setPricePerAthlete(defaultRate.toString() || "10");
    } else if (defaultOpt === "hourly") {
      setPricePerHour(defaultRate.toString() || "25");
    } else {
      setPricePerAthlete("10");
      setPricePerHour((profile?.hourly_rate || "25").toString());
    }
    setData({
      user_id: coach.id,
      amount: "",
      payout_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      payment_type: defaultOpt === "athlete" ? "Per Athlete" : defaultOpt === "hourly" ? "Hourly Rate" : "Fixed Amount",
      notes: ""
    });
    setNumberOfWeeks("4");
  };
  const groups = selectedCoach?.training_groups || [];
  const allAthletes = groups.flatMap((g) => g.athletes || []);
  const uniqueAthleteIds = new Set(allAthletes.map((a) => a.id));
  const athleteCount = uniqueAthleteIds.size;
  let totalWeeklyMinutes = 0;
  let totalClassesCount = 0;
  groups.forEach((g) => {
    const schedules = g.schedules || [];
    schedules.forEach((s) => {
      totalClassesCount++;
      const [sh, sm] = s.start_time.split(":").map(Number);
      const [eh, em] = s.end_time.split(":").map(Number);
      const durationMinutes = eh * 60 + em - (sh * 60 + sm);
      if (durationMinutes > 0) {
        totalWeeklyMinutes += durationMinutes;
      }
    });
  });
  const totalWeeklyHours = totalWeeklyMinutes / 60;
  useEffect(() => {
    if (!selectedCoach) return;
    if (calcOption === "athlete") {
      const amt = athleteCount * (parseFloat(pricePerAthlete) || 0);
      setData((d) => ({ ...d, payment_type: "Per Athlete", amount: amt > 0 ? amt.toFixed(2) : "" }));
    } else if (calcOption === "hourly") {
      const amt = totalWeeklyHours * (parseFloat(pricePerHour) || 0) * (parseFloat(numberOfWeeks) || 0);
      setData((d) => ({ ...d, payment_type: "Hourly Rate", amount: amt > 0 ? amt.toFixed(2) : "" }));
    } else {
      setData((d) => ({ ...d, payment_type: "Fixed Amount" }));
    }
  }, [calcOption, pricePerAthlete, pricePerHour, numberOfWeeks, selectedCoach, athleteCount, totalWeeklyHours]);
  const submit = (e) => {
    e.preventDefault();
    post(route("manager.payouts.store"), {
      onSuccess: () => {
        setSelectedCoach(null);
        reset();
      }
    });
  };
  const maxRevenue = revenueData.length > 0 ? Math.max(...revenueData.map((d) => parseFloat(d.total))) : 1;
  const totalRevenue = revenueData.reduce((sum, d) => sum + parseFloat(d.total), 0);
  return /* @__PURE__ */ jsxs(
    Authenticated,
    {
      header: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Financial Reports & Analytics" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-0.5", children: "Track revenue trends and manage coach compensation" })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Reports" }),
        /* @__PURE__ */ jsx("div", { className: "py-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", children: [
            /* @__PURE__ */ jsxs("div", { className: "px-6 py-5 border-b border-gray-50 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-gray-900", children: "Revenue Trends" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-0.5", children: "Last 6 months performance" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 font-medium", children: "6-Month Total" }),
                /* @__PURE__ */ jsxs("p", { className: "text-xl font-black text-indigo-600", children: [
                  "€",
                  totalRevenue.toLocaleString()
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "p-6", children: revenueData.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center h-40 text-gray-400", children: [
              /* @__PURE__ */ jsx("span", { className: "text-3xl mb-2", children: "📊" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm", children: "No revenue data available yet." })
            ] }) : /* @__PURE__ */ jsx("div", { className: "flex items-end gap-3 h-52", children: revenueData.map((d, idx) => {
              const pct = maxRevenue > 0 ? parseFloat(d.total) / maxRevenue * 100 : 0;
              return /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col items-center group", children: [
                /* @__PURE__ */ jsxs("div", { className: "relative w-full flex flex-col items-center", children: [
                  /* @__PURE__ */ jsxs("span", { className: "mb-1 text-xs font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity", children: [
                    "€",
                    Number(d.total).toLocaleString()
                  ] }),
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "w-full bg-indigo-100 group-hover:bg-indigo-600 rounded-t-xl transition-all duration-300 cursor-pointer",
                      style: { height: `${Math.max(pct * 1.8, 6)}px` }
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx("span", { className: "mt-3 text-[10px] font-bold text-gray-400 uppercase tracking-wide", children: d.month })
              ] }, idx);
            }) }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", children: [
              /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 border-b border-gray-50", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-gray-900", children: "Coach Compensation" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-0.5", children: "Manage coach payouts" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "divide-y divide-gray-50", children: [
                coaches.map((coach) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center font-bold text-indigo-700 text-sm border border-indigo-100", children: coach.name.charAt(0).toUpperCase() }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-900 text-sm", children: coach.name }),
                      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-gray-400", children: [
                        /* @__PURE__ */ jsxs("span", { children: [
                          coach.training_groups.length,
                          " group",
                          coach.training_groups.length !== 1 ? "s" : "",
                          " assigned"
                        ] }),
                        /* @__PURE__ */ jsx("span", { children: "•" }),
                        /* @__PURE__ */ jsx("span", { className: "font-medium text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded", children: (() => {
                          const p = coach.coach_profile || coach.coachProfile;
                          if (!p) return "Manual";
                          if (p.payment_option === "athlete") return `Per Athlete (€${Number(p.payment_rate || 0).toFixed(2)})`;
                          if (p.payment_option === "hourly") return `Hourly (€${Number(p.payment_rate || 0).toFixed(2)}/hr)`;
                          return p.payment_rate > 0 ? `Fixed Amount (€${Number(p.payment_rate).toFixed(2)})` : "Manual";
                        })() })
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => selectCoachSettings(coach),
                        className: "px-3 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-200 transition-all flex items-center gap-1",
                        children: [
                          /* @__PURE__ */ jsx("span", { children: "⚙️" }),
                          /* @__PURE__ */ jsx("span", { children: "Settings" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => selectCoachForPayment(coach),
                        className: "px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-sm",
                        children: "Pay Coach"
                      }
                    )
                  ] })
                ] }, coach.id)),
                coaches.length === 0 && /* @__PURE__ */ jsx("div", { className: "py-10 text-center text-gray-400", children: /* @__PURE__ */ jsx("p", { className: "text-sm", children: "No coaches found." }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", children: [
              /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 border-b border-gray-50", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-gray-900", children: "Recent Payouts" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-0.5", children: "Coach payment history" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "divide-y divide-gray-50", children: [
                recentPayouts.map((payout) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-full bg-rose-50 flex items-center justify-center font-bold text-rose-600 text-sm", children: payout.user.name.charAt(0).toUpperCase() }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-900 text-sm", children: payout.user.name }),
                        payout.payment_type && /* @__PURE__ */ jsx("span", { className: `inline-block px-1.5 py-0.5 rounded-md text-[9px] font-bold border ${paymentTypeBadges[payout.payment_type] || "bg-gray-50 text-gray-700 border-gray-100"}`, children: payout.payment_type })
                      ] }),
                      /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400", children: payout.payout_date })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: "font-bold text-rose-600", children: [
                    "−€",
                    payout.amount
                  ] })
                ] }, payout.id)),
                recentPayouts.length === 0 && /* @__PURE__ */ jsx("div", { className: "py-10 text-center text-gray-400", children: /* @__PURE__ */ jsx("p", { className: "text-sm", children: "No payout history found." }) })
              ] })
            ] })
          ] })
        ] }) }),
        selectedCoach && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-indigo-600 to-blue-700 px-6 py-5", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-white", children: "Pay Coach" }),
            /* @__PURE__ */ jsxs("p", { className: "text-indigo-200 text-sm mt-0.5", children: [
              "Recording payout for ",
              selectedCoach.name
            ] })
          ] }),
          /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "p-6 space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2", children: "Compensation Method" }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => setCalcOption("athlete"),
                    className: `px-2 py-3 rounded-xl border text-[11px] font-bold transition-all text-center flex flex-col items-center justify-center gap-1.5 leading-tight ${calcOption === "athlete" ? "bg-indigo-600 border-indigo-600 text-white shadow-sm" : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"}`,
                    children: [
                      /* @__PURE__ */ jsx("span", { className: "text-base", children: "👤" }),
                      /* @__PURE__ */ jsx("span", { children: "Per Athlete" })
                    ]
                  },
                  "athlete"
                ),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => setCalcOption("hourly"),
                    className: `px-2 py-3 rounded-xl border text-[11px] font-bold transition-all text-center flex flex-col items-center justify-center gap-1.5 leading-tight ${calcOption === "hourly" ? "bg-indigo-600 border-indigo-600 text-white shadow-sm" : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"}`,
                    children: [
                      /* @__PURE__ */ jsx("span", { className: "text-base", children: "⏱️" }),
                      /* @__PURE__ */ jsx("span", { children: "Per Hour" })
                    ]
                  },
                  "hourly"
                ),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => setCalcOption("manual"),
                    className: `px-2 py-3 rounded-xl border text-[11px] font-bold transition-all text-center flex flex-col items-center justify-center gap-1.5 leading-tight ${calcOption === "manual" ? "bg-indigo-600 border-indigo-600 text-white shadow-sm" : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"}`,
                    children: [
                      /* @__PURE__ */ jsx("span", { className: "text-base", children: "💰" }),
                      /* @__PURE__ */ jsx("span", { children: "Fixed Amount" })
                    ]
                  },
                  "manual"
                )
              ] })
            ] }),
            calcOption === "athlete" && /* @__PURE__ */ jsxs("div", { className: "bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 space-y-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs text-indigo-900", children: [
                /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Athletes in Training Groups:" }),
                /* @__PURE__ */ jsxs("span", { className: "font-black bg-indigo-100 px-2 py-0.5 rounded-lg", children: [
                  athleteCount,
                  " Athletes"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-indigo-700 uppercase tracking-wide mb-1", children: "Price per Athlete (€)" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    value: pricePerAthlete,
                    onChange: (e) => setPricePerAthlete(e.target.value),
                    placeholder: "10.00",
                    className: "w-full rounded-xl border border-indigo-200 bg-white px-3 py-2 text-xs text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-xs font-bold text-indigo-800 pt-1 flex justify-between border-t border-indigo-100/50", children: [
                /* @__PURE__ */ jsx("span", { children: "Calculation formula:" }),
                /* @__PURE__ */ jsxs("span", { children: [
                  athleteCount,
                  " athletes × €",
                  Number(pricePerAthlete || 0).toFixed(2),
                  " = €",
                  data.amount || "0.00"
                ] })
              ] })
            ] }),
            calcOption === "hourly" && /* @__PURE__ */ jsxs("div", { className: "bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 space-y-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "text-xs text-emerald-900 space-y-1", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Weekly Scheduled Classes:" }),
                  /* @__PURE__ */ jsxs("span", { className: "font-black bg-emerald-100 px-2 py-0.5 rounded-lg", children: [
                    totalClassesCount,
                    " Classes"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Total Weekly Hours:" }),
                  /* @__PURE__ */ jsxs("span", { className: "font-black bg-emerald-100 px-2 py-0.5 rounded-lg", children: [
                    totalWeeklyHours.toFixed(2),
                    " Hrs"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-emerald-700 uppercase tracking-wide mb-1", children: "Price per Hour (€)" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "number",
                      value: pricePerHour,
                      onChange: (e) => setPricePerHour(e.target.value),
                      placeholder: "25.00",
                      className: "w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-xs text-gray-900 focus:border-emerald-500 focus:outline-none"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-emerald-700 uppercase tracking-wide mb-1", children: "Number of Weeks" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "number",
                      value: numberOfWeeks,
                      onChange: (e) => setNumberOfWeeks(e.target.value),
                      placeholder: "4",
                      className: "w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-xs text-gray-900 focus:border-emerald-500 focus:outline-none"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-xs font-bold text-emerald-800 pt-1 flex flex-col gap-1 border-t border-emerald-100/50", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ jsx("span", { children: "Calculation formula:" }),
                  /* @__PURE__ */ jsxs("span", { children: [
                    totalWeeklyHours.toFixed(2),
                    " hrs × €",
                    Number(pricePerHour || 0).toFixed(2),
                    "/hr × ",
                    numberOfWeeks,
                    " wks"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "text-right text-sm font-black text-emerald-900", children: [
                  "Total: €",
                  data.amount || "0.00"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5", children: "Payout Amount (€)" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  value: data.amount,
                  onChange: (e) => setData("amount", e.target.value),
                  readOnly: calcOption !== "manual",
                  placeholder: "0.00",
                  className: `w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 transition-all ${calcOption !== "manual" ? "bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed focus:ring-0" : "bg-gray-50 focus:border-indigo-500 focus:bg-white focus:ring-indigo-500/20"}`
                }
              ),
              calcOption !== "manual" && /* @__PURE__ */ jsx("p", { className: "text-[10px] text-gray-400 mt-1 font-medium", children: "Calculated automatically based on option selected above." })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5", children: "Payout Date" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "date",
                  value: data.payout_date,
                  onChange: (e) => setData("payout_date", e.target.value),
                  className: "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-2", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setSelectedCoach(null),
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
                  children: processing ? "Recording..." : "Record Payout"
                }
              )
            ] })
          ] })
        ] }) }),
        selectedCoachSettings && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-slate-700 to-slate-900 px-6 py-5", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-white", children: "Coach Payout Settings" }),
            /* @__PURE__ */ jsxs("p", { className: "text-slate-300 text-sm mt-0.5", children: [
              "Configure default payment option for ",
              selectedCoachSettings.name
            ] })
          ] }),
          /* @__PURE__ */ jsxs("form", { onSubmit: submitSettings, className: "p-6 space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2", children: "Default Payment Option" }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxs("label", { className: `flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${settingsForm.data.payment_option === "athlete" ? "border-indigo-600 bg-indigo-50/20 text-indigo-900" : "border-gray-200 hover:bg-slate-50 text-gray-700"}`, children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "radio",
                      name: "payment_option",
                      value: "athlete",
                      checked: settingsForm.data.payment_option === "athlete",
                      onChange: (e) => settingsForm.setData("payment_option", e.target.value),
                      className: "mt-1 text-indigo-600 focus:ring-indigo-500"
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "text-xs font-bold", children: "Option 1: Per Athlete" }),
                    /* @__PURE__ */ jsx("p", { className: "text-[11px] text-gray-500 mt-0.5", children: "Pay per athlete in the coach's training groups." })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: `flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${settingsForm.data.payment_option === "hourly" ? "border-indigo-600 bg-indigo-50/20 text-indigo-900" : "border-gray-200 hover:bg-slate-50 text-gray-700"}`, children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "radio",
                      name: "payment_option",
                      value: "hourly",
                      checked: settingsForm.data.payment_option === "hourly",
                      onChange: (e) => settingsForm.setData("payment_option", e.target.value),
                      className: "mt-1 text-indigo-600 focus:ring-indigo-500"
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "text-xs font-bold", children: "Option 2: Hourly Rate" }),
                    /* @__PURE__ */ jsx("p", { className: "text-[11px] text-gray-500 mt-0.5", children: "Pay per scheduled training hour dynamically." })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: `flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${settingsForm.data.payment_option === "manual" ? "border-indigo-600 bg-indigo-50/20 text-indigo-900" : "border-gray-200 hover:bg-slate-50 text-gray-700"}`, children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "radio",
                      name: "payment_option",
                      value: "manual",
                      checked: settingsForm.data.payment_option === "manual",
                      onChange: (e) => settingsForm.setData("payment_option", e.target.value),
                      className: "mt-1 text-indigo-600 focus:ring-indigo-500"
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "text-xs font-bold", children: "Option 3: Fixed / Manual Amount" }),
                    /* @__PURE__ */ jsx("p", { className: "text-[11px] text-gray-500 mt-0.5", children: "Manager manually inputs the amount on payout." })
                  ] })
                ] })
              ] }),
              settingsForm.errors.payment_option && /* @__PURE__ */ jsx("p", { className: "text-xs text-rose-500 mt-1", children: settingsForm.errors.payment_option })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5", children: [
                settingsForm.data.payment_option === "athlete" && "Price per Athlete (€)",
                settingsForm.data.payment_option === "hourly" && "Price per Hour (€)",
                settingsForm.data.payment_option === "manual" && "Default Amount (€) (Optional)"
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  step: "0.01",
                  value: settingsForm.data.payment_rate,
                  onChange: (e) => settingsForm.setData("payment_rate", e.target.value),
                  placeholder: "0.00",
                  className: "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                }
              ),
              settingsForm.errors.payment_rate && /* @__PURE__ */ jsx("p", { className: "text-xs text-rose-500 mt-1", children: settingsForm.errors.payment_rate })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-2", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setSelectedCoachSettings(null),
                  className: "flex-1 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-all",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "submit",
                  disabled: settingsForm.processing,
                  className: "flex-1 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-sm",
                  children: settingsForm.processing ? "Saving..." : "Save Settings"
                }
              )
            ] })
          ] })
        ] }) })
      ]
    }
  );
}
export {
  ReportsIndex as default
};
