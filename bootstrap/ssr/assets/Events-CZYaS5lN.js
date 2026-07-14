import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as Authenticated } from "./AuthenticatedLayout-D0_10pNp.js";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import "@headlessui/react";
import "axios";
import "./ml-sports-BEC2gdiG.js";
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "";
const STATUS_CONFIG = {
  pending_approval: { label: "Pending", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  registered: { label: "Registered", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  attended: { label: "Attended", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  rejected: { label: "Rejected", bg: "bg-red-50", text: "text-red-600", border: "border-red-200" }
};
function CoachEvents({ events }) {
  const [expanded, setExpanded] = useState(null);
  const [processing, setProcessing] = useState(null);
  const handleAccept = (eventId, regId) => {
    const key = `${eventId}-${regId}`;
    setProcessing(key);
    router.post(
      route("coach.events.attendance.accept", { event: eventId, registration: regId }),
      {},
      { preserveScroll: true, onFinish: () => setProcessing(null) }
    );
  };
  const handleReject = (eventId, regId) => {
    const key = `r-${eventId}-${regId}`;
    if (!confirm("Reject this athlete's attendance?")) return;
    setProcessing(key);
    router.post(
      route("coach.events.attendance.reject", { event: eventId, registration: regId }),
      {},
      { preserveScroll: true, onFinish: () => setProcessing(null) }
    );
  };
  const upcoming = events.filter((e) => new Date(e.start_date) >= new Date((/* @__PURE__ */ new Date()).toDateString()));
  const past = events.filter((e) => new Date(e.start_date) < new Date((/* @__PURE__ */ new Date()).toDateString()));
  const renderEvent = (ev) => {
    const isOpen = expanded === ev.id;
    const pendingCount = ev.registrations.filter((r) => r.status === "pending_approval" || r.status === "registered").length;
    const attendedCount = ev.registrations.filter((r) => r.status === "attended").length;
    return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setExpanded(isOpen ? null : ev.id),
          className: "w-full text-left px-6 py-5",
          children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap mb-1", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-gray-900", children: ev.name }),
                /* @__PURE__ */ jsx("span", { className: `px-2 py-0.5 rounded-lg text-xs font-bold ${ev.is_free ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-amber-50 text-amber-700 border border-amber-100"}`, children: ev.is_free ? "Free" : `€${parseFloat(ev.price).toFixed(2)}` }),
                ev.coach_salary_type && ev.coach_salary_type !== "free" && /* @__PURE__ */ jsxs("span", { className: "px-2 py-0.5 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100", children: [
                  "Pay: ",
                  ev.coach_salary_type === "per_athlete" ? `€${parseFloat(ev.coach_salary_rate).toFixed(2)}/ath` : ev.coach_salary_type === "fixed" ? `€${parseFloat(ev.coach_salary_rate).toFixed(2)}` : ev.coach_salary_type === "per_hour" ? `€${parseFloat(ev.coach_salary_rate).toFixed(2)}/hr` : "—"
                ] }),
                pendingCount > 0 && /* @__PURE__ */ jsxs("span", { className: "px-2 py-0.5 rounded-lg text-xs font-bold bg-red-50 text-red-600 border border-red-100", children: [
                  pendingCount,
                  " pending"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "text-xs text-indigo-600 font-semibold flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }) }),
                fmtDate(ev.start_date),
                ev.end_date && ev.end_date !== ev.start_date ? ` – ${fmtDate(ev.end_date)}` : "",
                ev.location && /* @__PURE__ */ jsxs("span", { className: "text-gray-400", children: [
                  " · ",
                  ev.location
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 shrink-0", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex gap-2 text-xs font-semibold", children: [
                /* @__PURE__ */ jsxs("span", { className: "bg-blue-50 text-blue-700 px-2 py-1 rounded-lg", children: [
                  ev.registrations.length,
                  " reg"
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg", children: [
                  attendedCount,
                  " attended"
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "bg-indigo-50 text-indigo-700 px-2 py-1 rounded-lg", children: [
                  ev.points,
                  " pts"
                ] })
              ] }),
              /* @__PURE__ */ jsx("svg", { className: `w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) })
            ] })
          ] })
        }
      ),
      isOpen && /* @__PURE__ */ jsxs("div", { className: "border-t border-gray-100 px-6 py-5 space-y-3", children: [
        ev.pdf_url && /* @__PURE__ */ jsxs("a", { href: ev.pdf_url, target: "_blank", rel: "noopener", className: "inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-800 font-semibold mb-1", children: [
          /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" }) }),
          "Event PDF"
        ] }),
        ev.description && /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 leading-relaxed mb-2", children: ev.description }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs font-bold text-gray-400 uppercase tracking-wide", children: [
          "Registrations (",
          ev.registrations.length,
          ")"
        ] }),
        ev.registrations.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 font-medium", children: "No registrations yet" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 mt-1", children: "Athletes will appear here after joining the event." })
        ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-2", children: ev.registrations.map((reg) => {
          const cfg = STATUS_CONFIG[reg.status];
          const accKey = `${ev.id}-${reg.id}`;
          const rejKey = `r-${ev.id}-${reg.id}`;
          const canAct = reg.status === "pending_approval" || reg.status === "registered";
          return /* @__PURE__ */ jsxs("div", { className: `flex items-center justify-between rounded-xl px-4 py-3 border ${cfg.bg} ${cfg.border}`, children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
              /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0", children: reg.user.name.charAt(0).toUpperCase() }),
              /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-gray-900 truncate", children: reg.user.name }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 truncate", children: reg.user.email })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 shrink-0 ml-3", children: [
              /* @__PURE__ */ jsx("span", { className: `px-2.5 py-1 rounded-lg text-xs font-bold ${cfg.bg} ${cfg.text}`, children: cfg.label }),
              canAct && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: () => handleAccept(ev.id, reg.id),
                    disabled: processing === accKey,
                    className: "inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-all disabled:opacity-50 shadow-sm",
                    children: [
                      /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }),
                      processing === accKey ? "…" : "Accept"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: () => handleReject(ev.id, reg.id),
                    disabled: processing === rejKey,
                    className: "inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 text-xs font-bold rounded-lg hover:bg-red-100 border border-red-200 transition-all disabled:opacity-50",
                    children: [
                      /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }),
                      processing === rejKey ? "…" : "Reject"
                    ]
                  }
                )
              ] }),
              reg.status === "attended" && /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold text-indigo-600", children: [
                "+",
                ev.points,
                " pts"
              ] })
            ] })
          ] }, reg.id);
        }) })
      ] })
    ] }, ev.id);
  };
  return /* @__PURE__ */ jsxs(
    Authenticated,
    {
      header: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-900", children: "My Events" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500 mt-0.5", children: [
          events.length,
          " event",
          events.length !== 1 ? "s" : "",
          " assigned to you"
        ] })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Events" }),
        /* @__PURE__ */ jsx("div", { className: "py-8", children: /* @__PURE__ */ jsx("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8", children: events.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4", children: "🏅" }),
          /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-900 mb-1", children: "No events assigned" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Your manager will assign you to events when they're created." })
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          upcoming.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-gray-700 uppercase tracking-wide mb-4", children: "Upcoming Events" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-4", children: upcoming.map(renderEvent) })
          ] }),
          past.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-gray-400 uppercase tracking-wide mb-4", children: "Past Events" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-4 opacity-75", children: past.map(renderEvent) })
          ] })
        ] }) }) })
      ]
    }
  );
}
export {
  CoachEvents as default
};
