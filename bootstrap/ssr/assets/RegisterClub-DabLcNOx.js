import { jsxs, jsx } from "react/jsx-runtime";
import { I as InputError } from "./InputError-roYfmLKp.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { m as mlSportsLogo } from "./ml-sports-BEC2gdiG.js";
function RegisterClub() {
  const { data, setData, post, processing, errors, reset } = useForm({
    club_name: "",
    club_email: "",
    club_phone: "",
    club_address: "",
    name: "",
    email: "",
    password: "",
    password_confirmation: ""
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("register.club"), {
      onFinish: () => reset("password", "password_confirmation")
    });
  };
  const inputClass = "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-2";
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex", children: [
    /* @__PURE__ */ jsx(Head, { title: "Register Your Club" }),
    /* @__PURE__ */ jsxs("div", { className: "hidden lg:flex lg:w-5/12 bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-800 flex-col justify-between p-12 relative overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute -top-24 -left-24 w-80 h-80 bg-white/5 rounded-full" }),
      /* @__PURE__ */ jsx("div", { className: "absolute -bottom-32 -right-16 w-96 h-96 bg-white/5 rounded-full" }),
      /* @__PURE__ */ jsx(Link, { href: "/", children: /* @__PURE__ */ jsx("img", { src: mlSportsLogo, alt: "ML Sports", className: "h-11 w-auto object-contain brightness-0 invert" }) }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-6", children: [
          /* @__PURE__ */ jsx("span", { className: "w-2 h-2 bg-emerald-400 rounded-full animate-pulse" }),
          /* @__PURE__ */ jsx("span", { className: "text-white/80 text-xs font-semibold", children: "Setting up your club" })
        ] }),
        /* @__PURE__ */ jsxs("h2", { className: "text-3xl font-black text-white leading-tight mb-5", children: [
          "Launch Your Club",
          /* @__PURE__ */ jsx("br", {}),
          "in Minutes"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-indigo-200 text-base leading-relaxed mb-8", children: "Create your club profile, get a unique joining code, and start inviting athletes, parents, and coaches right away." }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: [
          "Unique club joining code generated automatically",
          "Invite coaches via email invitation",
          "Full billing and subscription management",
          "Training group and schedule management"
        ].map((f) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3 text-indigo-100 text-sm", children: [
          /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 text-emerald-400 shrink-0 mt-0.5", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) }),
          f
        ] }, f)) })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "relative text-indigo-400 text-xs", children: "© 2026 ML SPORT Technologies OÜ." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white overflow-y-auto", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:hidden flex items-center mb-8", children: /* @__PURE__ */ jsx(Link, { href: "/", children: /* @__PURE__ */ jsx("img", { src: mlSportsLogo, alt: "ML Sports", className: "h-10 w-auto object-contain" }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "w-full max-w-lg", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-2", children: /* @__PURE__ */ jsxs(Link, { href: route("register"), className: "inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-6", children: [
          /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) }),
          "Back to options"
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
          /* @__PURE__ */ jsx("span", { className: "inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full border border-indigo-100 mb-3", children: "Club Manager" }),
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-black text-gray-900 mb-1", children: "Register Your Club" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Fill in your club details and create your manager account." })
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 rounded-2xl border border-gray-100 p-5 space-y-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-widest text-gray-400", children: "Club Information" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: labelClass, children: [
                "Club Name ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: data.club_name,
                  onChange: (e) => setData("club_name", e.target.value),
                  className: inputClass,
                  placeholder: "e.g. Elite Taekwondo Academy",
                  required: true
                }
              ),
              /* @__PURE__ */ jsx(InputError, { message: errors.club_name, className: "mt-2" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: labelClass, children: "Club Email" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "email",
                    value: data.club_email,
                    onChange: (e) => setData("club_email", e.target.value),
                    className: inputClass,
                    placeholder: "club@example.com"
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: errors.club_email, className: "mt-2" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: labelClass, children: "Club Phone" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "tel",
                    value: data.club_phone,
                    onChange: (e) => setData("club_phone", e.target.value),
                    className: inputClass,
                    placeholder: "+1 555 000 0000"
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: errors.club_phone, className: "mt-2" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: labelClass, children: "Club Address" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: data.club_address,
                  onChange: (e) => setData("club_address", e.target.value),
                  className: inputClass,
                  placeholder: "123 Main Street, City, Country"
                }
              ),
              /* @__PURE__ */ jsx(InputError, { message: errors.club_address, className: "mt-2" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 rounded-2xl border border-gray-100 p-5 space-y-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-widest text-gray-400", children: "Your Manager Account" }),
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
                  "Confirm Password ",
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
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: processing,
              className: "w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-sm shadow-indigo-200 disabled:opacity-60 disabled:cursor-not-allowed",
              children: processing ? "Creating your club..." : "Create Club & Manager Account"
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
  RegisterClub as default
};
