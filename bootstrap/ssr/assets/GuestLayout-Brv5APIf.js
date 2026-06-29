import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@inertiajs/react";
import { m as mlSportsLogo } from "./ml-sports-BEC2gdiG.js";
function Guest({ children }) {
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex", children: [
    /* @__PURE__ */ jsxs("div", { className: "hidden lg:flex lg:w-5/12 bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-800 flex-col justify-between p-12 relative overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute -top-24 -left-24 w-80 h-80 bg-white/5 rounded-full" }),
      /* @__PURE__ */ jsx("div", { className: "absolute -bottom-32 -right-16 w-96 h-96 bg-white/5 rounded-full" }),
      /* @__PURE__ */ jsx("div", { className: "absolute top-1/3 right-8 w-32 h-32 bg-white/5 rounded-full" }),
      /* @__PURE__ */ jsx(Link, { href: "/", className: "relative flex items-center", children: /* @__PURE__ */ jsx("img", { src: mlSportsLogo, alt: "ML Sports", className: "h-11 w-auto object-contain brightness-0 invert" }) }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-6", children: [
          /* @__PURE__ */ jsx("span", { className: "w-2 h-2 bg-emerald-400 rounded-full animate-pulse" }),
          /* @__PURE__ */ jsx("span", { className: "text-white/80 text-xs font-semibold", children: "Trusted by 50+ sports clubs" })
        ] }),
        /* @__PURE__ */ jsxs("h2", { className: "text-4xl font-black text-white leading-tight mb-5", children: [
          "Your Club,",
          /* @__PURE__ */ jsx("br", {}),
          "Fully Managed."
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-indigo-200 text-base leading-relaxed mb-10", children: "Athlete tracking, billing automation, and coach coordination — all in one powerful platform built for modern sports clubs." }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-4", children: [
          { val: "500+", label: "Active Athletes" },
          { val: "50+", label: "Clubs Using" },
          { val: "99.9%", label: "Uptime" }
        ].map((s) => /* @__PURE__ */ jsxs("div", { className: "bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10", children: [
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-black text-white", children: s.val }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-indigo-300 mt-1", children: s.label })
        ] }, s.label)) })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "relative text-indigo-400 text-xs", children: "© 2026 SportClub Advanced. All rights reserved." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:hidden flex items-center mb-10", children: /* @__PURE__ */ jsx(Link, { href: "/", children: /* @__PURE__ */ jsx("img", { src: mlSportsLogo, alt: "ML Sports", className: "h-10 w-auto object-contain" }) }) }),
      /* @__PURE__ */ jsx("div", { className: "w-full max-w-md", children })
    ] })
  ] });
}
export {
  Guest as G
};
