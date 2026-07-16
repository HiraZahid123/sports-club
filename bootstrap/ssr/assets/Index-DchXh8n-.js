import { jsxs, jsx } from "react/jsx-runtime";
import { A as Authenticated } from "./AuthenticatedLayout-DGwI6Ex0.js";
import { useForm, Head, router } from "@inertiajs/react";
import { useState } from "react";
import "@headlessui/react";
import "axios";
import "./ml-sports-BEC2gdiG.js";
const EMPTY_PLAN = { name: "", training_group_id: "", monthly_price: "", yearly_price: "", description: "" };
const EMPTY_SUB = { user_id: "", subscription_plan_id: "", billing_cycle: "monthly", starts_at: (/* @__PURE__ */ new Date()).toISOString().split("T")[0] };
const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  try {
    const dateOnly = dateStr.split("T")[0];
    const parts = dateOnly.split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date2 = new Date(year, month, day);
      return date2.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    }
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
function BillingIndex({ subscriptions, plans, groups, members, totalRevenue }) {
  const [tab, setTab] = useState("plans");
  const [editPlan, setEditPlan] = useState(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);
  const planForm = useForm({ ...EMPTY_PLAN });
  const subForm = useForm({ ...EMPTY_SUB });
  const payForm = useForm({
    amount: "",
    payment_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    notes: ""
  });
  const openCreatePlan = () => {
    planForm.reset();
    planForm.setData(EMPTY_PLAN);
    setEditPlan(null);
    setShowPlanModal(true);
  };
  const openEditPlan = (plan) => {
    planForm.setData({
      name: plan.name,
      training_group_id: plan.training_group_id ? String(plan.training_group_id) : "",
      monthly_price: plan.monthly_price,
      yearly_price: plan.yearly_price,
      description: plan.description ?? ""
    });
    setEditPlan(plan);
    setShowPlanModal(true);
  };
  const submitPlan = (e) => {
    e.preventDefault();
    if (editPlan) {
      planForm.put(route("manager.plans.update", editPlan.id), {
        onSuccess: () => {
          setShowPlanModal(false);
          planForm.reset();
        }
      });
    } else {
      planForm.post(route("manager.plans.store"), {
        onSuccess: () => {
          setShowPlanModal(false);
          planForm.reset();
        }
      });
    }
  };
  const deletePlan = (plan) => {
    if (!confirm(`Delete plan "${plan.name}"? Active subscriptions using it won't be affected.`)) return;
    router.delete(route("manager.plans.destroy", plan.id));
  };
  const submitSub = (e) => {
    e.preventDefault();
    subForm.post(route("manager.billing.subscriptions.store"), {
      onSuccess: () => {
        setShowSubModal(false);
        subForm.reset();
        subForm.setData(EMPTY_SUB);
      }
    });
  };
  const deleteSub = (sub) => {
    if (!confirm(`Remove subscription for ${sub.user.name}?`)) return;
    router.delete(route("manager.billing.subscriptions.destroy", sub.id));
  };
  const submitPayment = (e) => {
    e.preventDefault();
    if (!selectedSub) return;
    payForm.post(route("manager.billing.pay", selectedSub.id), {
      onSuccess: () => {
        setSelectedSub(null);
        payForm.reset();
      }
    });
  };
  const activeCount = subscriptions.filter((s) => s.status === "active").length;
  const overdueCount = subscriptions.filter((s) => s.status !== "active").length;
  const selectedPlan = plans.find((p) => String(p.id) === subForm.data.subscription_plan_id);
  const computedPrice = selectedPlan ? subForm.data.billing_cycle === "yearly" ? selectedPlan.yearly_price : selectedPlan.monthly_price : null;
  return /* @__PURE__ */ jsxs(
    Authenticated,
    {
      header: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Billing & Revenue" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-0.5", children: "Manage subscription plans and track member payments" })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Billing" }),
        /* @__PURE__ */ jsx("div", { className: "py-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "col-span-2 sm:col-span-1 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-5 text-white shadow-lg shadow-indigo-200", children: [
              /* @__PURE__ */ jsx("p", { className: "text-indigo-200 text-xs font-bold uppercase tracking-wide mb-1", children: "Total Revenue" }),
              /* @__PURE__ */ jsxs("p", { className: "text-3xl font-black", children: [
                "€",
                Number(totalRevenue).toLocaleString()
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-emerald-100 p-5 shadow-sm", children: [
              /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-xs font-bold uppercase tracking-wide mb-1", children: "Active" }),
              /* @__PURE__ */ jsx("p", { className: "text-3xl font-black text-emerald-600", children: activeCount })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-amber-100 p-5 shadow-sm", children: [
              /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-xs font-bold uppercase tracking-wide mb-1", children: "Overdue" }),
              /* @__PURE__ */ jsx("p", { className: "text-3xl font-black text-amber-600", children: overdueCount })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-indigo-100 p-5 shadow-sm", children: [
              /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-xs font-bold uppercase tracking-wide mb-1", children: "Plans" }),
              /* @__PURE__ */ jsx("p", { className: "text-3xl font-black text-indigo-600", children: plans.length })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex gap-1 bg-gray-100 rounded-xl p-1 w-fit", children: ["plans", "subscriptions"].map((t) => /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setTab(t),
              className: `px-5 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`,
              children: t === "plans" ? "Subscription Plans" : "Member Subscriptions"
            },
            t
          )) }),
          tab === "plans" && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-gray-900", children: "Subscription Plans" }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: openCreatePlan,
                  className: "flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-sm shadow-indigo-200 transition-all",
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "text-lg leading-none", children: "+" }),
                    " New Plan"
                  ]
                }
              )
            ] }),
            plans.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center", children: [
              /* @__PURE__ */ jsx("div", { className: "w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4", children: "📋" }),
              /* @__PURE__ */ jsx("p", { className: "font-bold text-gray-900 text-lg", children: "No plans yet" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-1 mb-5", children: "Create subscription plans for your club or specific groups." }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: openCreatePlan,
                  className: "px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all",
                  children: "Create First Plan"
                }
              )
            ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: plans.map((plan) => /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "font-bold text-gray-900 text-base", children: plan.name }),
                  /* @__PURE__ */ jsx("span", { className: `inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md text-xs font-semibold ${plan.training_group ? "bg-violet-50 text-violet-700" : "bg-indigo-50 text-indigo-700"}`, children: plan.training_group ? plan.training_group.name : "Club-wide" })
                ] }),
                /* @__PURE__ */ jsx("span", { className: `w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${plan.is_active ? "bg-emerald-500" : "bg-gray-300"}`, title: plan.is_active ? "Active" : "Inactive" })
              ] }),
              plan.description && /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 leading-relaxed", children: plan.description }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2 pt-1", children: [
                /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 rounded-xl p-3 text-center", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 font-semibold mb-0.5", children: "Monthly" }),
                  /* @__PURE__ */ jsxs("p", { className: "text-xl font-black text-gray-900", children: [
                    "€",
                    Number(plan.monthly_price).toFixed(0)
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "bg-indigo-50 rounded-xl p-3 text-center relative overflow-hidden", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-indigo-500 font-semibold mb-0.5", children: "Yearly" }),
                  /* @__PURE__ */ jsxs("p", { className: "text-xl font-black text-indigo-700", children: [
                    "€",
                    Number(plan.yearly_price).toFixed(0)
                  ] }),
                  Number(plan.yearly_price) < Number(plan.monthly_price) * 12 && Number(plan.monthly_price) > 0 && /* @__PURE__ */ jsxs("span", { className: "absolute top-1 right-1 text-[9px] font-bold bg-emerald-500 text-white px-1 py-0.5 rounded", children: [
                    "SAVE ",
                    Math.round(100 - Number(plan.yearly_price) / (Number(plan.monthly_price) * 12) * 100),
                    "%"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-2 pt-1", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => openEditPlan(plan),
                    className: "flex-1 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors",
                    children: "Edit"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => deletePlan(plan),
                    className: "flex-1 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors",
                    children: "Delete"
                  }
                )
              ] })
            ] }, plan.id)) })
          ] }),
          tab === "subscriptions" && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-gray-900", children: "Member Subscriptions" }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => setShowSubModal(true),
                  disabled: plans.length === 0,
                  className: "flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-sm font-bold rounded-xl shadow-sm shadow-indigo-200 transition-all",
                  title: plans.length === 0 ? "Create a plan first" : "",
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "text-lg leading-none", children: "+" }),
                    " Assign Subscription"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "overflow-x-auto", children: [
              /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
                /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-slate-50 border-b border-gray-100", children: [
                  /* @__PURE__ */ jsx("th", { className: "px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide", children: "Member" }),
                  /* @__PURE__ */ jsx("th", { className: "px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide", children: "Plan" }),
                  /* @__PURE__ */ jsx("th", { className: "px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide", children: "Cycle" }),
                  /* @__PURE__ */ jsx("th", { className: "px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide", children: "Amount" }),
                  /* @__PURE__ */ jsx("th", { className: "px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide", children: "Status" }),
                  /* @__PURE__ */ jsx("th", { className: "px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide", children: "Next Due" }),
                  /* @__PURE__ */ jsx("th", { className: "px-6 py-3.5 text-right text-xs font-bold text-gray-500 uppercase tracking-wide", children: "Actions" })
                ] }) }),
                /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-50", children: subscriptions.map((sub) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-slate-50/60 transition-colors", children: [
                  /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs", children: sub.user.name.charAt(0).toUpperCase() }),
                    /* @__PURE__ */ jsx("span", { className: "font-semibold text-gray-900 text-sm", children: sub.user.name })
                  ] }) }),
                  /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-900 font-medium", children: sub.plan_name }),
                    sub.training_group && /* @__PURE__ */ jsx("p", { className: "text-xs text-violet-600 mt-0.5", children: sub.training_group.name }),
                    sub.payments && sub.payments.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-2 space-y-1", children: [
                      /* @__PURE__ */ jsx("p", { className: "text-[9px] font-bold text-gray-400 uppercase tracking-wider", children: "Invoices:" }),
                      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: sub.payments.map((p) => /* @__PURE__ */ jsxs(
                        "a",
                        {
                          href: route("invoices.download", p.id),
                          className: "inline-flex items-center gap-1 text-[9px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 px-2 py-0.5 rounded transition-all",
                          title: `Payment date: ${p.payment_date}`,
                          children: [
                            /* @__PURE__ */ jsx("svg", { className: "w-2.5 h-2.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" }) }),
                            "#",
                            p.id,
                            " (€",
                            Number(p.amount).toFixed(0),
                            ")"
                          ]
                        },
                        p.id
                      )) })
                    ] })
                  ] }) }),
                  /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: `px-2 py-1 rounded-lg text-xs font-semibold ${sub.billing_cycle === "yearly" ? "bg-indigo-50 text-indigo-700" : "bg-gray-100 text-gray-600"}`, children: sub.billing_cycle === "yearly" ? "Yearly" : "Monthly" }) }),
                  /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("span", { className: "font-bold text-indigo-600", children: [
                    "€",
                    Number(sub.amount).toFixed(2)
                  ] }) }),
                  /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${sub.status === "active" ? "bg-emerald-50 text-emerald-700" : sub.status === "overdue" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`, children: [
                    /* @__PURE__ */ jsx("span", { className: `w-1.5 h-1.5 rounded-full ${sub.status === "active" ? "bg-emerald-500" : sub.status === "overdue" ? "bg-red-500" : "bg-amber-500"}` }),
                    sub.status.charAt(0).toUpperCase() + sub.status.slice(1)
                  ] }) }),
                  /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-sm text-gray-500", children: formatDate(sub.next_payment_at) }),
                  /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2", children: [
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: () => {
                          setSelectedSub(sub);
                          payForm.setData("amount", sub.amount);
                        },
                        className: "px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors",
                        children: "Log Payment"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: () => deleteSub(sub),
                        className: "px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors",
                        children: "Remove"
                      }
                    )
                  ] }) })
                ] }, sub.id)) })
              ] }),
              subscriptions.length === 0 && /* @__PURE__ */ jsxs("div", { className: "py-14 text-center", children: [
                /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3", children: "💳" }),
                /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-900", children: "No subscriptions yet" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Assign subscriptions to members using the button above." })
              ] })
            ] }) })
          ] })
        ] }) }),
        showPlanModal && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-indigo-600 to-blue-700 px-6 py-5", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-white", children: editPlan ? "Edit Plan" : "New Subscription Plan" }),
            /* @__PURE__ */ jsx("p", { className: "text-indigo-200 text-sm mt-0.5", children: "Set pricing for monthly and yearly billing" })
          ] }),
          /* @__PURE__ */ jsxs("form", { onSubmit: submitPlan, className: "p-6 space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5", children: "Plan Name" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: planForm.data.name,
                  onChange: (e) => planForm.setData("name", e.target.value),
                  placeholder: "e.g. Basic Membership",
                  className: "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                }
              ),
              planForm.errors.name && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-600 mt-1", children: planForm.errors.name })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5", children: "Scope" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: planForm.data.training_group_id,
                  onChange: (e) => planForm.setData("training_group_id", e.target.value),
                  className: "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: "Club-wide (all members)" }),
                    groups.map((g) => /* @__PURE__ */ jsx("option", { value: g.id, children: g.name }, g.id))
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5", children: "Monthly Price (€)" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    step: "0.01",
                    min: "0",
                    value: planForm.data.monthly_price,
                    onChange: (e) => planForm.setData("monthly_price", e.target.value),
                    placeholder: "0.00",
                    className: "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  }
                ),
                planForm.errors.monthly_price && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-600 mt-1", children: planForm.errors.monthly_price })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5", children: "Yearly Price (€)" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    step: "0.01",
                    min: "0",
                    value: planForm.data.yearly_price,
                    onChange: (e) => planForm.setData("yearly_price", e.target.value),
                    placeholder: "0.00",
                    className: "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  }
                ),
                planForm.errors.yearly_price && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-600 mt-1", children: planForm.errors.yearly_price })
              ] })
            ] }),
            planForm.data.monthly_price && planForm.data.yearly_price && Number(planForm.data.yearly_price) < Number(planForm.data.monthly_price) * 12 && Number(planForm.data.monthly_price) > 0 && /* @__PURE__ */ jsxs("div", { className: "bg-emerald-50 rounded-xl px-4 py-2.5 text-xs text-emerald-700 font-semibold", children: [
              "Yearly saves ",
              Math.round(100 - Number(planForm.data.yearly_price) / (Number(planForm.data.monthly_price) * 12) * 100),
              "% vs monthly"
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5", children: "Description (optional)" }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  value: planForm.data.description,
                  onChange: (e) => planForm.setData("description", e.target.value),
                  rows: 2,
                  placeholder: "What's included in this plan...",
                  className: "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-2", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowPlanModal(false),
                  className: "flex-1 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-all",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "submit",
                  disabled: planForm.processing,
                  className: "flex-1 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-sm",
                  children: planForm.processing ? "Saving..." : editPlan ? "Save Changes" : "Create Plan"
                }
              )
            ] })
          ] })
        ] }) }),
        showSubModal && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-indigo-600 to-blue-700 px-6 py-5", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-white", children: "Assign Subscription" }),
            /* @__PURE__ */ jsx("p", { className: "text-indigo-200 text-sm mt-0.5", children: "Enroll a member in a subscription plan" })
          ] }),
          /* @__PURE__ */ jsxs("form", { onSubmit: submitSub, className: "p-6 space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5", children: "Member" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: subForm.data.user_id,
                  onChange: (e) => subForm.setData("user_id", e.target.value),
                  className: "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: "Select member..." }),
                    members.map((m) => /* @__PURE__ */ jsx("option", { value: m.id, children: m.name }, m.id))
                  ]
                }
              ),
              subForm.errors.user_id && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-600 mt-1", children: subForm.errors.user_id })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5", children: "Plan" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: subForm.data.subscription_plan_id,
                  onChange: (e) => subForm.setData("subscription_plan_id", e.target.value),
                  className: "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: "Select plan..." }),
                    plans.filter((p) => p.is_active).map((p) => /* @__PURE__ */ jsxs("option", { value: p.id, children: [
                      p.name,
                      p.training_group ? ` — ${p.training_group.name}` : " — Club-wide"
                    ] }, p.id))
                  ]
                }
              ),
              subForm.errors.subscription_plan_id && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-600 mt-1", children: subForm.errors.subscription_plan_id })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5", children: "Billing Cycle" }),
              /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2", children: ["monthly", "yearly"].map((cycle) => /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => subForm.setData("billing_cycle", cycle),
                  className: `py-3 rounded-xl border-2 text-sm font-semibold transition-all ${subForm.data.billing_cycle === cycle ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`,
                  children: [
                    /* @__PURE__ */ jsx("div", { className: "capitalize", children: cycle }),
                    selectedPlan && /* @__PURE__ */ jsxs("div", { className: `text-xs mt-0.5 font-bold ${subForm.data.billing_cycle === cycle ? "text-indigo-600" : "text-gray-400"}`, children: [
                      "€",
                      Number(cycle === "yearly" ? selectedPlan.yearly_price : selectedPlan.monthly_price).toFixed(2)
                    ] })
                  ]
                },
                cycle
              )) })
            ] }),
            computedPrice !== null && /* @__PURE__ */ jsxs("div", { className: "bg-indigo-50 rounded-xl px-4 py-3 flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm text-indigo-700 font-semibold", children: subForm.data.billing_cycle === "yearly" ? "Annual total" : "Monthly charge" }),
              /* @__PURE__ */ jsxs("span", { className: "text-xl font-black text-indigo-700", children: [
                "€",
                Number(computedPrice).toFixed(2)
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5", children: "Start Date" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "date",
                  value: subForm.data.starts_at,
                  onChange: (e) => subForm.setData("starts_at", e.target.value),
                  className: "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-2", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setShowSubModal(false);
                    subForm.reset();
                  },
                  className: "flex-1 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-all",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "submit",
                  disabled: subForm.processing,
                  className: "flex-1 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-sm",
                  children: subForm.processing ? "Assigning..." : "Assign Subscription"
                }
              )
            ] })
          ] })
        ] }) }),
        selectedSub && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-5", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-white", children: "Log Payment" }),
            /* @__PURE__ */ jsxs("p", { className: "text-emerald-100 text-sm mt-0.5", children: [
              "Recording payment for ",
              selectedSub.user.name
            ] })
          ] }),
          /* @__PURE__ */ jsxs("form", { onSubmit: submitPayment, className: "p-6 space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5", children: "Amount (€)" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  step: "0.01",
                  value: payForm.data.amount,
                  onChange: (e) => payForm.setData("amount", e.target.value),
                  className: "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5", children: "Payment Date" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "date",
                  value: payForm.data.payment_date,
                  onChange: (e) => payForm.setData("payment_date", e.target.value),
                  className: "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5", children: "Notes (optional)" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: payForm.data.notes,
                  onChange: (e) => payForm.setData("notes", e.target.value),
                  placeholder: "e.g. Cash payment",
                  className: "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-2", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setSelectedSub(null),
                  className: "flex-1 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-all",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "submit",
                  disabled: payForm.processing,
                  className: "flex-1 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-all disabled:opacity-50 shadow-sm",
                  children: payForm.processing ? "Saving..." : "Save Payment"
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
  BillingIndex as default
};
