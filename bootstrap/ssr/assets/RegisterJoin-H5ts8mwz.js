import { jsxs, jsx } from "react/jsx-runtime";
import { I as InputError } from "./InputError-roYfmLKp.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { useState } from "react";
import { m as mlSportsLogo } from "./ml-sports-BEC2gdiG.js";
function RegisterJoin({ club: initialClub, prefill_code }) {
  const [resolvedClub, setResolvedClub] = useState(initialClub);
  const [codeError, setCodeError] = useState("");
  const { data, setData, post, processing, errors, reset } = useForm({
    join_code: prefill_code || "",
    role: "Athlete",
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    child_email: ""
  });
  const inputClass = "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-2";
  const validateCode = async () => {
    setCodeError("");
    setResolvedClub(null);
    if (!data.join_code.trim()) return;
    try {
      const res = await fetch(`/api/clubs/validate-code?code=${encodeURIComponent(data.join_code.trim().toUpperCase())}`);
      if (res.ok) {
        const json = await res.json();
        setResolvedClub(json.club);
      } else {
        setCodeError("No active club found with that code. Double-check and try again.");
      }
    } catch {
      setCodeError("Could not verify the code. Please try again.");
    }
  };
  const submit = (e) => {
    e.preventDefault();
    post(route("register.join"), {
      onFinish: () => reset("password", "password_confirmation")
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex", children: [
    /* @__PURE__ */ jsx(Head, { title: "Join a Club" }),
    /* @__PURE__ */ jsxs("div", { className: "hidden lg:flex lg:w-5/12 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 flex-col justify-between p-12 relative overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute -top-24 -left-24 w-80 h-80 bg-white/5 rounded-full" }),
      /* @__PURE__ */ jsx("div", { className: "absolute -bottom-32 -right-16 w-96 h-96 bg-white/5 rounded-full" }),
      /* @__PURE__ */ jsx(Link, { href: "/", children: /* @__PURE__ */ jsx("img", { src: mlSportsLogo, alt: "ML Sports", className: "h-11 w-auto object-contain brightness-0 invert" }) }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-6", children: [
          /* @__PURE__ */ jsx("span", { className: "w-2 h-2 bg-yellow-400 rounded-full animate-pulse" }),
          /* @__PURE__ */ jsx("span", { className: "text-white/80 text-xs font-semibold", children: "Join your club today" })
        ] }),
        /* @__PURE__ */ jsxs("h2", { className: "text-3xl font-black text-white leading-tight mb-5", children: [
          "Athletes &",
          /* @__PURE__ */ jsx("br", {}),
          "Parents Welcome"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-emerald-100 text-base leading-relaxed mb-8", children: "Enter your club joining code to create your account and get instant access to your training portal." }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: [
          "Join with your club's unique code",
          "Athlete portal: track progress & goals",
          "Parent portal: manage multiple children",
          "View schedules and billing in one place"
        ].map((f) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3 text-emerald-100 text-sm", children: [
          /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 text-yellow-400 shrink-0 mt-0.5", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) }),
          f
        ] }, f)) })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "relative text-emerald-400 text-xs", children: "© 2026 ML SPORT Technologies OÜ." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white overflow-y-auto", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:hidden flex items-center mb-8", children: /* @__PURE__ */ jsx(Link, { href: "/", children: /* @__PURE__ */ jsx("img", { src: mlSportsLogo, alt: "ML Sports", className: "h-10 w-auto object-contain" }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-2", children: /* @__PURE__ */ jsxs(Link, { href: route("register"), className: "inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-6", children: [
          /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) }),
          "Back to options"
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
          /* @__PURE__ */ jsx("span", { className: "inline-block px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full border border-emerald-100 mb-3", children: "Athletes & Parents" }),
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-black text-gray-900 mb-1", children: "Join a Club" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Enter your club code and create your account." })
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-5", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 rounded-2xl border border-gray-100 p-5 space-y-3", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-widest text-gray-400", children: "Step 1 — Enter Your Club Code" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: labelClass, children: [
                "Club Joining Code ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: data.join_code,
                    onChange: (e) => {
                      setData("join_code", e.target.value.toUpperCase());
                      setResolvedClub(null);
                      setCodeError("");
                    },
                    className: `${inputClass} uppercase tracking-widest font-mono`,
                    placeholder: "e.g. ABC12345",
                    maxLength: 8,
                    required: true
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: validateCode,
                    className: "shrink-0 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-all",
                    children: "Verify"
                  }
                )
              ] }),
              codeError && /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-red-600", children: codeError }),
              /* @__PURE__ */ jsx(InputError, { message: errors.join_code, className: "mt-2" })
            ] }),
            resolvedClub && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3", children: [
              /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 text-emerald-500 shrink-0", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", clipRule: "evenodd" }) }),
              /* @__PURE__ */ jsxs("p", { className: "text-sm font-semibold text-emerald-800", children: [
                "Club found: ",
                /* @__PURE__ */ jsx("span", { className: "font-black", children: resolvedClub.name })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 rounded-2xl border border-gray-100 p-5 space-y-3", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-widest text-gray-400", children: "Step 2 — Your Role" }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3", children: ["Athlete", "Parent"].map((r) => /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setData("role", r),
                className: `py-3 px-4 rounded-xl border-2 text-sm font-bold transition-all ${data.role === r ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"}`,
                children: r === "Athlete" ? "🏃 Athlete" : "👨‍👧 Parent"
              },
              r
            )) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 rounded-2xl border border-gray-100 p-5 space-y-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-widest text-gray-400", children: "Step 3 — Your Account" }),
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
                  placeholder: "John Smith",
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
                  className: inputClass,
                  placeholder: "you@example.com",
                  required: true
                }
              ),
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
            data.role === "Parent" && /* @__PURE__ */ jsxs("div", { className: "bg-yellow-50 border border-yellow-100 rounded-xl p-4", children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-yellow-800 mb-2", children: "Link Existing Athlete (optional)" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "email",
                  value: data.child_email,
                  onChange: (e) => setData("child_email", e.target.value),
                  className: inputClass,
                  placeholder: "child@example.com"
                }
              ),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-yellow-700 mt-2", children: "Enter your child's registered email to link them to your parent account. You can also add children later from your dashboard." }),
              /* @__PURE__ */ jsx(InputError, { message: errors.child_email, className: "mt-2" })
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: processing,
              className: "w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm transition-all shadow-sm shadow-emerald-200 disabled:opacity-60 disabled:cursor-not-allowed",
              children: processing ? "Creating account..." : `Create ${data.role} Account`
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "mt-6 text-center text-sm text-gray-500", children: [
          "Already have an account?",
          " ",
          /* @__PURE__ */ jsx(Link, { href: route("login"), className: "font-semibold text-indigo-600 hover:text-indigo-700", children: "Sign in" })
        ] })
      ] })
    ] })
  ] });
}
export {
  RegisterJoin as default
};
