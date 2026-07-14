import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as Authenticated } from "./AuthenticatedLayout-CkiyEXrL.js";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import "@headlessui/react";
import "axios";
import "./ml-sports-BEC2gdiG.js";
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "";
const STATUS_CONFIG = {
  pending_approval: { label: "Pending Approval", bg: "bg-amber-50", text: "text-amber-700" },
  registered: { label: "Registered", bg: "bg-blue-50", text: "text-blue-700" },
  attended: { label: "Attended", bg: "bg-emerald-50", text: "text-emerald-700" },
  rejected: { label: "Rejected", bg: "bg-red-50", text: "text-red-600" }
};
function AthleteEvents({ events, event_points }) {
  const [joining, setJoining] = useState(null);
  const handleJoin = (ev) => {
    setJoining(ev.id);
    router.post(
      route("athlete.events.join", ev.id),
      {},
      {
        preserveScroll: true,
        onFinish: () => setJoining(null)
      }
    );
  };
  const handlePay = (ev) => {
    setJoining(ev.id);
    router.post(
      route("athlete.events.join", ev.id),
      {},
      {
        preserveScroll: true,
        onSuccess: () => {
          if (ev.stripe_payment_link) {
            window.open(ev.stripe_payment_link, "_blank", "noopener,noreferrer");
          }
        },
        onFinish: () => setJoining(null)
      }
    );
  };
  const upcoming = events.filter((e) => new Date(e.start_date) >= new Date((/* @__PURE__ */ new Date()).toDateString()));
  const past = events.filter((e) => new Date(e.start_date) < new Date((/* @__PURE__ */ new Date()).toDateString()));
  const renderEvent = (ev) => {
    const reg = ev.registration;
    const status = reg?.status;
    const cfg = status ? STATUS_CONFIG[status] : null;
    return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "p-5 flex-1 space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-gray-900 leading-tight", children: ev.name }),
          /* @__PURE__ */ jsx("span", { className: `shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold ${ev.is_free ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-amber-50 text-amber-700 border border-amber-100"}`, children: ev.is_free ? "Free" : `€${parseFloat(ev.price).toFixed(2)}` })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-indigo-600 font-semibold flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }) }),
          fmtDate(ev.start_date),
          ev.end_date && ev.end_date !== ev.start_date ? ` – ${fmtDate(ev.end_date)}` : ""
        ] }),
        ev.location && /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500 flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxs("svg", { className: "w-3.5 h-3.5 text-gray-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: [
            /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" }),
            /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 11a3 3 0 11-6 0 3 3 0 016 0z" })
          ] }),
          ev.location
        ] }),
        ev.description && /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 line-clamp-3 leading-relaxed", children: ev.description }),
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-1.5", children: [
          /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-indigo-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }) }),
          /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold text-indigo-700", children: [
            ev.points,
            " points on attendance"
          ] })
        ] }),
        ev.coaches.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1", children: "Coaches" }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1", children: ev.coaches.map((c) => /* @__PURE__ */ jsx("span", { className: "px-2 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-semibold rounded-md", children: c.name }, c.id)) })
        ] }),
        ev.pdf_url && /* @__PURE__ */ jsxs("a", { href: ev.pdf_url, target: "_blank", rel: "noopener", className: "inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-800 font-semibold", children: [
          /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" }) }),
          "Download Event PDF"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "px-5 py-3.5 bg-slate-50 border-t border-gray-100", children: reg ? /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${cfg?.bg} ${cfg?.text}`, children: [
          status === "attended" && /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }) }),
          cfg?.label
        ] }),
        status === "attended" && /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold text-indigo-600", children: [
          "+",
          ev.points,
          " pts earned"
        ] }),
        status === "registered" && !ev.is_free && ev.stripe_payment_link && /* @__PURE__ */ jsx("a", { href: ev.stripe_payment_link, target: "_blank", rel: "noopener", className: "text-xs font-semibold text-amber-600 hover:text-amber-800", children: "Complete Payment" })
      ] }) : ev.is_free ? /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => handleJoin(ev),
          disabled: joining === ev.id,
          className: "w-full py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-sm",
          children: joining === ev.id ? "Registering…" : "Register"
        }
      ) : /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => handlePay(ev),
          disabled: joining === ev.id,
          className: "w-full py-2 bg-amber-500 text-white text-sm font-bold rounded-xl hover:bg-amber-600 transition-all disabled:opacity-50 shadow-sm flex items-center justify-center gap-2",
          children: [
            /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" }) }),
            joining === ev.id ? "Processing…" : `Pay & Register — €${parseFloat(ev.price).toFixed(2)}`
          ]
        }
      ) })
    ] }, ev.id);
  };
  return /* @__PURE__ */ jsxs(
    Authenticated,
    {
      header: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Club Events" }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500 mt-0.5", children: [
            events.length,
            " event",
            events.length !== 1 ? "s" : "",
            " available to your groups"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2", children: [
          /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-indigo-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" }) }),
          /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold text-indigo-700", children: [
            event_points,
            " pts total"
          ] })
        ] })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Events" }),
        /* @__PURE__ */ jsx("div", { className: "py-8", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8", children: events.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4", children: "🏅" }),
          /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-900 mb-1", children: "No events yet" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Your coach will add events when they're available." })
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          upcoming.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-gray-700 uppercase tracking-wide mb-4", children: "Upcoming Events" }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5", children: upcoming.map(renderEvent) })
          ] }),
          past.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-gray-400 uppercase tracking-wide mb-4", children: "Past Events" }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 opacity-75", children: past.map(renderEvent) })
          ] })
        ] }) }) })
      ]
    }
  );
}
export {
  AthleteEvents as default
};
