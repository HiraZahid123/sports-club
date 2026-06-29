import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Head, Link } from "@inertiajs/react";
import { m as mlSportsLogo } from "./ml-sports-BEC2gdiG.js";
function Welcome({ auth }) {
  return /* @__PURE__ */ jsxs("div", { className: "bg-white text-gray-900 min-h-screen font-sans", children: [
    /* @__PURE__ */ jsx(Head, { title: "Welcome to Elite Sports Club" }),
    /* @__PURE__ */ jsx("nav", { className: "fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-6 h-16 flex items-center justify-between", children: [
      /* @__PURE__ */ jsx(Link, { href: "/", children: /* @__PURE__ */ jsx("img", { src: mlSportsLogo, alt: "ML Sports", className: "h-10 w-auto object-contain" }) }),
      /* @__PURE__ */ jsxs("div", { className: "hidden md:flex items-center gap-8 text-sm font-semibold text-gray-500", children: [
        /* @__PURE__ */ jsx("a", { href: "#features", className: "hover:text-indigo-600 transition-colors", children: "Features" }),
        /* @__PURE__ */ jsx("a", { href: "#how-it-works", className: "hover:text-indigo-600 transition-colors", children: "How It Works" }),
        /* @__PURE__ */ jsx("a", { href: "#pricing", className: "hover:text-indigo-600 transition-colors", children: "Pricing" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3", children: auth.user ? /* @__PURE__ */ jsx(Link, { href: route("dashboard"), className: "px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-sm transition-all shadow-sm", children: "Go to Dashboard" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(Link, { href: route("login"), className: "text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors", children: "Sign In" }),
        /* @__PURE__ */ jsx(Link, { href: route("register"), className: "px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-sm transition-all shadow-sm", children: "Get Started Free" })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "relative pt-32 pb-20 lg:pt-44 lg:pb-32 overflow-hidden bg-gradient-to-b from-slate-50 to-white", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-20 right-0 w-[600px] h-[600px] bg-indigo-50 rounded-full -translate-y-1/2 translate-x-1/3 opacity-60 blur-3xl" }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-50 rounded-full translate-y-1/2 -translate-x-1/3 opacity-60 blur-3xl" }),
      /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-6 relative z-10", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl", children: [
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 text-xs font-bold uppercase tracking-widest mb-8", children: [
          /* @__PURE__ */ jsx("span", { className: "w-2 h-2 bg-indigo-500 rounded-full animate-pulse" }),
          "Next-Generation Club Management"
        ] }),
        /* @__PURE__ */ jsxs("h1", { className: "text-5xl lg:text-7xl font-black leading-[1.05] mb-6 tracking-tight text-gray-900", children: [
          "Elevate Your",
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600", children: "Sports Club" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xl text-gray-500 mb-10 leading-relaxed max-w-2xl", children: "The all-in-one platform for Taekwondo academies and sports clubs. Manage athletes, automate billing, and coordinate coaches — all from one professional dashboard." }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-4", children: [
          /* @__PURE__ */ jsxs("a", { href: "#join", className: "inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-base transition-all shadow-lg shadow-indigo-200", children: [
            "Get Started Free",
            /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })
          ] }),
          /* @__PURE__ */ jsx("a", { href: "#features", className: "inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-bold text-base transition-all border border-gray-200 shadow-sm", children: "See How It Works" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-12 flex flex-wrap items-center gap-6 text-sm text-gray-400", children: ["No credit card required", "Free 14-day trial", "Cancel anytime"].map((item) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-emerald-500", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) }),
          item
        ] }, item)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "border-y border-gray-100 bg-white py-10", children: /* @__PURE__ */ jsx("div", { className: "max-w-5xl mx-auto px-6", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-8 text-center", children: [
      { val: "500+", label: "Active Athletes" },
      { val: "50+", label: "Sports Clubs" },
      { val: "€2M+", label: "Revenue Managed" },
      { val: "99.9%", label: "Platform Uptime" }
    ].map((stat) => /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "text-3xl lg:text-4xl font-black text-indigo-600", children: stat.val }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 font-medium mt-1", children: stat.label })
    ] }, stat.label)) }) }) }),
    /* @__PURE__ */ jsxs("div", { id: "features", className: "max-w-7xl mx-auto px-6 py-24", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-16", children: [
        /* @__PURE__ */ jsx("span", { className: "inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-widest rounded-full mb-4", children: "Features" }),
        /* @__PURE__ */ jsx("h2", { className: "text-4xl font-black text-gray-900 mb-4", children: "Everything Your Club Needs" }),
        /* @__PURE__ */ jsx("p", { className: "text-lg text-gray-500 max-w-2xl mx-auto", children: "From athlete onboarding to financial reporting, we've built every tool your sports club needs to run at its best." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: [
        {
          icon: "🏆",
          color: "bg-amber-50 text-amber-600 border-amber-100",
          title: "Athlete Grading & Tracking",
          desc: "Track belt progression, attendance records, and technical skills with dynamic progress visualizers and performance analytics."
        },
        {
          icon: "💳",
          color: "bg-emerald-50 text-emerald-600 border-emerald-100",
          title: "Automated Billing",
          desc: "Recurring subscriptions, smart payment tracking, and automatic access locking for overdue accounts. Never chase a payment again."
        },
        {
          icon: "📅",
          color: "bg-blue-50 text-blue-600 border-blue-100",
          title: "Smart Scheduling",
          desc: "Coordinate multiple training groups and coaches with conflict-aware calendars, event management, and automated notifications."
        },
        {
          icon: "👥",
          color: "bg-purple-50 text-purple-600 border-purple-100",
          title: "Role-Based Access",
          desc: "Separate portals for managers, coaches, athletes, and parents. Everyone sees exactly what they need, nothing more."
        },
        {
          icon: "📊",
          color: "bg-indigo-50 text-indigo-600 border-indigo-100",
          title: "Financial Analytics",
          desc: "Revenue trends, coach compensation tracking, payout history, and monthly reports to keep your club financially healthy."
        },
        {
          icon: "🔒",
          color: "bg-rose-50 text-rose-600 border-rose-100",
          title: "Secure & Reliable",
          desc: "Enterprise-grade security with role-based permissions, data encryption, and 99.9% uptime SLA for mission-critical operations."
        }
      ].map((feature) => /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-8 group", children: [
        /* @__PURE__ */ jsx("div", { className: `inline-flex items-center justify-center w-12 h-12 rounded-xl text-2xl border ${feature.color} mb-5`, children: feature.icon }),
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors", children: feature.title }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-sm leading-relaxed", children: feature.desc })
      ] }, feature.title)) })
    ] }),
    /* @__PURE__ */ jsx("div", { id: "how-it-works", className: "bg-slate-50 py-24", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-16", children: [
        /* @__PURE__ */ jsx("span", { className: "inline-block px-4 py-1.5 bg-white text-indigo-600 text-xs font-bold uppercase tracking-widest rounded-full border border-indigo-100 mb-4", children: "Simple Process" }),
        /* @__PURE__ */ jsx("h2", { className: "text-4xl font-black text-gray-900 mb-4", children: "Up and Running in Minutes" }),
        /* @__PURE__ */ jsx("p", { className: "text-lg text-gray-500 max-w-2xl mx-auto", children: "No complex setup. No IT team required. Start managing your club professionally today." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: [
        {
          step: "01",
          title: "Create Your Club",
          desc: "Register your club, add your information, and configure your subscription plans in under 5 minutes."
        },
        {
          step: "02",
          title: "Add Your Members",
          desc: "Invite athletes, coaches, and parents. They get role-specific portals with exactly the access they need."
        },
        {
          step: "03",
          title: "Run at Full Speed",
          desc: "Automate billing, track progress, manage schedules, and generate reports — all from your dashboard."
        }
      ].map((step, i) => /* @__PURE__ */ jsxs("div", { className: "relative bg-white rounded-2xl border border-gray-100 shadow-sm p-8", children: [
        i < 2 && /* @__PURE__ */ jsx("div", { className: "hidden md:block absolute top-12 -right-4 z-10 text-gray-300", children: /* @__PURE__ */ jsx("svg", { className: "w-8 h-8", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M9 5l7 7-7 7" }) }) }),
        /* @__PURE__ */ jsx("span", { className: "text-5xl font-black text-indigo-50 block mb-4", children: step.step }),
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-gray-900 mb-3", children: step.title }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-sm leading-relaxed", children: step.desc })
      ] }, step.step)) })
    ] }) }),
    /* @__PURE__ */ jsx("div", { id: "join", className: "bg-slate-50 py-24", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto px-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsx("span", { className: "inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-widest rounded-full border border-indigo-100 mb-4", children: "Get Started" }),
        /* @__PURE__ */ jsx("h2", { className: "text-4xl font-black text-gray-900 mb-4", children: "How Would You Like to Join?" }),
        /* @__PURE__ */ jsx("p", { className: "text-lg text-gray-500 max-w-2xl mx-auto", children: "Every account is tied to the correct club with role-based access. Choose your path below." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
        {
          href: route("register.club"),
          color: "bg-indigo-600",
          badgeColor: "bg-indigo-50 text-indigo-600 border-indigo-100",
          badge: "Club Managers",
          title: "Register a Club",
          desc: "Create your club profile and manager account. Get a unique joining code for your members.",
          btn: "Register Your Club",
          btnClass: "bg-indigo-600 hover:bg-indigo-700 text-white"
        },
        {
          href: route("register.join"),
          color: "bg-emerald-500",
          badgeColor: "bg-emerald-50 text-emerald-600 border-emerald-100",
          badge: "Athletes & Parents",
          title: "Join as Athlete or Parent",
          desc: "Use your club's joining code or invitation link. Parents can manage multiple children under one account.",
          btn: "Join a Club",
          btnClass: "bg-emerald-500 hover:bg-emerald-600 text-white"
        },
        {
          href: "#",
          color: "bg-amber-500",
          badgeColor: "bg-amber-50 text-amber-600 border-amber-100",
          badge: "Coaches",
          title: "Activate Coach Account",
          desc: "Coach accounts are invite-only. Your club manager sends you a personalised activation link via email.",
          btn: "Check Your Invite Email",
          btnClass: "bg-amber-500 hover:bg-amber-600 text-white opacity-75",
          disabled: true
        }
      ].map((card) => /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm p-7 flex flex-col", children: [
        /* @__PURE__ */ jsx("span", { className: `inline-block self-start px-3 py-1 text-xs font-bold rounded-full border ${card.badgeColor} mb-4`, children: card.badge }),
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-black text-gray-900 mb-3", children: card.title }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 leading-relaxed flex-1 mb-6", children: card.desc }),
        card.disabled ? /* @__PURE__ */ jsx("span", { className: `w-full py-3 px-4 rounded-xl text-sm font-bold text-center cursor-default ${card.btnClass}`, children: card.btn }) : /* @__PURE__ */ jsx(Link, { href: card.href, className: `w-full py-3 px-4 rounded-xl text-sm font-bold text-center transition-all ${card.btnClass}`, children: card.btn })
      ] }, card.title)) })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden bg-gradient-to-br from-indigo-600 to-blue-700 py-24", children: [
      /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 opacity-10", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full -translate-y-1/2" }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 right-1/4 w-64 h-64 bg-white rounded-full translate-y-1/2" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative max-w-3xl mx-auto px-6 text-center", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-4xl lg:text-5xl font-black text-white mb-6 leading-tight", children: "Ready to Transform Your Club?" }),
        /* @__PURE__ */ jsx("p", { className: "text-indigo-200 text-lg mb-10 leading-relaxed", children: "Join 50+ sports clubs already using SportClub to streamline operations, delight members, and grow their programs." }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-center gap-4", children: [
          /* @__PURE__ */ jsx(Link, { href: route("register"), className: "px-8 py-4 bg-white text-indigo-700 hover:bg-indigo-50 rounded-xl font-bold text-base transition-all shadow-lg", children: "Get Started" }),
          /* @__PURE__ */ jsx(Link, { href: route("login"), className: "px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-base transition-all border border-white/20", children: "Sign In" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("footer", { className: "bg-gradient-to-b from-blue-50 to-blue-100 border-t border-blue-100 py-10", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-6", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center gap-3 text-center", children: [
      /* @__PURE__ */ jsx(
        "img",
        {
          src: mlSportsLogo,
          alt: "ML SPORT Technologies",
          className: "h-8 w-auto mb-1"
        }
      ),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-xs", children: "© 2026 ML SPORT Technologies OÜ. All rights reserved." }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-3 text-xs text-gray-500", children: [
        /* @__PURE__ */ jsx("a", { href: "#", className: "hover:text-blue-600 transition-colors", children: "Privacy" }),
        /* @__PURE__ */ jsx("span", { className: "text-gray-300", children: "|" }),
        /* @__PURE__ */ jsx("a", { href: "#", className: "hover:text-blue-600 transition-colors", children: "Terms" })
      ] })
    ] }) }) })
  ] });
}
export {
  Welcome as default
};
