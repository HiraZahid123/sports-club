import { jsxs, jsx } from "react/jsx-runtime";
import { useForm } from "@inertiajs/react";
import { I as InputLabel } from "./InputLabel-DDs2XNYP.js";
import { P as PrimaryButton } from "./PrimaryButton-DDF1xnxF.js";
import { I as InputError } from "./InputError-roYfmLKp.js";
function JoinGroupForm({
  availablePlans = [],
  className = ""
}) {
  const { data, setData, post, processing, errors } = useForm({
    subscription_plan_id: "",
    billing_cycle: "monthly"
  });
  const submit = (e) => {
    e.preventDefault();
    if (!data.subscription_plan_id) return;
    post(route("athlete.profile.join-group"));
  };
  const selectedPlan = availablePlans.find(
    (plan) => plan.id === Number(data.subscription_plan_id)
  );
  if (availablePlans.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsxs("section", { className, children: [
    /* @__PURE__ */ jsx("header", { className: "mb-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 text-lg", children: "➕" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-gray-900", children: "Join Another Training Group" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-0.5", children: "Subscribe to additional groups and checkout safely with Stripe." })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "max-w-xl", children: [
        /* @__PURE__ */ jsx(InputLabel, { htmlFor: "subscription_plan_id", value: "Select Training Plan" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            id: "subscription_plan_id",
            value: data.subscription_plan_id,
            onChange: (e) => setData("subscription_plan_id", e.target.value),
            className: "mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-2.5",
            required: true,
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "-- Choose a Training Plan / Group --" }),
              availablePlans.map((plan) => /* @__PURE__ */ jsxs("option", { value: plan.id, children: [
                plan.name,
                " ",
                plan.training_group ? `(${plan.training_group.name})` : ""
              ] }, plan.id))
            ]
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.subscription_plan_id, className: "mt-2" })
      ] }),
      selectedPlan && /* @__PURE__ */ jsxs("div", { className: "bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5 max-w-xl space-y-4 transition-all duration-300", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs font-extrabold uppercase tracking-wider text-indigo-500", children: "Plan Description" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-700 mt-1", children: selectedPlan.description || "No description provided for this plan." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs font-extrabold uppercase tracking-wider text-indigo-500", children: "Billing Cycle" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 mt-1", children: [
            /* @__PURE__ */ jsxs("label", { className: `flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${data.billing_cycle === "monthly" ? "border-indigo-600 bg-white shadow-sm" : "border-gray-200 hover:border-gray-300 bg-white/50"}`, children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "radio",
                  name: "billing_cycle",
                  value: "monthly",
                  checked: data.billing_cycle === "monthly",
                  onChange: () => setData("billing_cycle", "monthly"),
                  className: "sr-only"
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "text-xs font-extrabold text-gray-500", children: "Monthly" }),
              /* @__PURE__ */ jsxs("span", { className: "text-lg font-black text-gray-900 mt-1", children: [
                "€",
                selectedPlan.monthly_price
              ] }),
              /* @__PURE__ */ jsx("span", { className: "text-[10px] text-gray-400 font-medium", children: "Billed every month" })
            ] }),
            /* @__PURE__ */ jsxs("label", { className: `flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${data.billing_cycle === "yearly" ? "border-indigo-600 bg-white shadow-sm" : "border-gray-200 hover:border-gray-300 bg-white/50"}`, children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "radio",
                  name: "billing_cycle",
                  value: "yearly",
                  checked: data.billing_cycle === "yearly",
                  onChange: () => setData("billing_cycle", "yearly"),
                  className: "sr-only"
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "text-xs font-extrabold text-gray-500", children: "Yearly" }),
              /* @__PURE__ */ jsxs("span", { className: "text-lg font-black text-gray-900 mt-1", children: [
                "€",
                selectedPlan.yearly_price
              ] }),
              /* @__PURE__ */ jsx("span", { className: "text-[10px] text-emerald-600 font-bold mt-0.5", children: "Best Value" })
            ] })
          ] }),
          /* @__PURE__ */ jsx(InputError, { message: errors.billing_cycle, className: "mt-2" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-4", children: /* @__PURE__ */ jsx(PrimaryButton, { disabled: processing || !data.subscription_plan_id, children: processing ? "Redirecting to Stripe..." : "Subscribe & Pay" }) })
    ] })
  ] });
}
export {
  JoinGroupForm as default
};
