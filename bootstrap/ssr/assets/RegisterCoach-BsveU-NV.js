import { jsxs, jsx } from "react/jsx-runtime";
import { I as InputError } from "./InputError-roYfmLKp.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { m as mlSportsLogo } from "./ml-sports-BEC2gdiG.js";
const paymentOptionLabels = {
  athlete: { label: "Per Athlete", icon: "👤", desc: "Calculated based on how many athletes are in your training groups." },
  hourly: { label: "Per Hour (Schedule)", icon: "⏱️", desc: "Calculated from weekly scheduled training hours × 4 weeks (monthly)." },
  manual: { label: "Fixed / Manual Amount", icon: "💰", desc: "Manager sets the payout amount manually each time." }
};
function RegisterCoach({ token, club, email, payment_option, payment_rate }) {
  const paymentInfo = paymentOptionLabels[payment_option] ?? paymentOptionLabels["manual"];
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    email,
    password: "",
    password_confirmation: ""
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("register.coach", token), {
      onFinish: () => reset("password", "password_confirmation")
    });
  };
  const inputClass = "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-2";
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex", children: [
    /* @__PURE__ */ jsx(Head, { title: "Activate Coach Account" }),
    /* @__PURE__ */ jsxs("div", { className: "hidden lg:flex lg:w-5/12 bg-gradient-to-br from-amber-500 via-amber-600 to-orange-700 flex-col justify-between p-12 relative overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute -top-24 -left-24 w-80 h-80 bg-white/5 rounded-full" }),
      /* @__PURE__ */ jsx("div", { className: "absolute -bottom-32 -right-16 w-96 h-96 bg-white/5 rounded-full" }),
      /* @__PURE__ */ jsx(Link, { href: "/", children: /* @__PURE__ */ jsx("img", { src: mlSportsLogo, alt: "ML Sports", className: "h-11 w-auto object-contain brightness-0 invert" }) }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-6", children: [
          /* @__PURE__ */ jsx("span", { className: "w-2 h-2 bg-white rounded-full animate-pulse" }),
          /* @__PURE__ */ jsx("span", { className: "text-white/80 text-xs font-semibold", children: "You've been invited" })
        ] }),
        /* @__PURE__ */ jsxs("h2", { className: "text-3xl font-black text-white leading-tight mb-5", children: [
          "Welcome to",
          /* @__PURE__ */ jsx("br", {}),
          club.name
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-amber-100 text-base leading-relaxed mb-8", children: [
          "Complete your account setup to access your coach dashboard. You'll be automatically connected to ",
          /* @__PURE__ */ jsx("strong", { children: club.name }),
          "."
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white/10 rounded-2xl p-5 border border-white/10", children: [
          /* @__PURE__ */ jsx("p", { className: "text-white font-bold text-sm mb-1", children: "Your club" }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-black text-white", children: club.name }),
          /* @__PURE__ */ jsx("p", { className: "text-amber-200 text-xs mt-2", children: "Your account will be linked to this club automatically." })
        ] }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-3 mt-6", children: [
          "Manage your assigned training groups",
          "Track athlete progress and goals",
          "View your schedule and payouts"
        ].map((f) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3 text-amber-100 text-sm", children: [
          /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 text-white shrink-0 mt-0.5", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) }),
          f
        ] }, f)) })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "relative text-amber-300 text-xs", children: "© 2026 ML SPORT Technologies OÜ." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:hidden flex items-center mb-8", children: /* @__PURE__ */ jsx(Link, { href: "/", children: /* @__PURE__ */ jsx("img", { src: mlSportsLogo, alt: "ML Sports", className: "h-10 w-auto object-contain" }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-8 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsx("svg", { className: "w-6 h-6 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" }) }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-amber-600 font-bold uppercase tracking-wide", children: "Coach Invitation" }),
            /* @__PURE__ */ jsx("p", { className: "text-base font-black text-gray-900", children: club.name })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-black text-gray-900 mb-1", children: "Activate Your Coach Account" }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500", children: [
            "You've been invited by the manager of ",
            /* @__PURE__ */ jsx("strong", { children: club.name }),
            ". Set your name and password to complete registration."
          ] })
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-5", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: labelClass, children: [
              "Full Name ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: data.name,
                onChange: (e) => setData("name", e.target.value),
                className: inputClass,
                placeholder: "Coach John Smith",
                autoFocus: true,
                required: true
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.name, className: "mt-2" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: labelClass, children: [
              "Email Address ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "email",
                value: data.email,
                onChange: (e) => setData("email", e.target.value),
                className: `${inputClass} ${email ? "bg-gray-100 text-gray-500" : ""}`,
                placeholder: "you@example.com",
                required: true
              }
            ),
            email && /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 mt-1", children: "You can change the email address if needed." }),
            /* @__PURE__ */ jsx(InputError, { message: errors.email, className: "mt-2" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: labelClass, children: [
                "Password ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "password",
                  value: data.password,
                  onChange: (e) => setData("password", e.target.value),
                  className: inputClass,
                  placeholder: "••••••••",
                  required: true
                }
              ),
              /* @__PURE__ */ jsx(InputError, { message: errors.password, className: "mt-2" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: labelClass, children: [
                "Confirm ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "password",
                  value: data.password_confirmation,
                  onChange: (e) => setData("password_confirmation", e.target.value),
                  className: inputClass,
                  placeholder: "••••••••",
                  required: true
                }
              ),
              /* @__PURE__ */ jsx(InputError, { message: errors.password_confirmation, className: "mt-2" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-amber-50 border border-amber-200 rounded-2xl p-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-amber-700 uppercase tracking-wide mb-2", children: "Your Salary Model" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsx("span", { className: "text-xl", children: paymentInfo.icon }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("p", { className: "text-sm font-bold text-gray-900", children: [
                  paymentInfo.label,
                  payment_option !== "manual" && payment_rate > 0 && /* @__PURE__ */ jsxs("span", { className: "ml-2 text-amber-600", children: [
                    "— €",
                    Number(payment_rate).toFixed(2),
                    payment_option === "athlete" ? " / athlete" : " / hr"
                  ] })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-0.5", children: paymentInfo.desc }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] text-amber-600 mt-1.5", children: "Configured by your club manager. Can be adjusted after you join." })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: processing,
              className: "w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-sm transition-all shadow-sm shadow-amber-200 disabled:opacity-60 disabled:cursor-not-allowed",
              children: processing ? "Activating account..." : "Activate Coach Account"
            }
          )
        ] })
      ] })
    ] })
  ] });
}
export {
  RegisterCoach as default
};
