import { jsxs, jsx } from "react/jsx-runtime";
import { A as Authenticated } from "./AuthenticatedLayout-D0_10pNp.js";
import { Head } from "@inertiajs/react";
import "@headlessui/react";
import "react";
import "axios";
import "./ml-sports-BEC2gdiG.js";
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const fmtTime = (t) => {
  if (!t) return "";
  const parts = t.split(":");
  return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}`;
};
function AthleteSchedule({ schedules = [] }) {
  const schedulesByDay = DAYS.reduce((acc, day) => {
    acc[day] = schedules.filter((s) => s.day_of_week === day);
    return acc;
  }, {});
  return /* @__PURE__ */ jsxs(
    Authenticated,
    {
      header: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-900", children: "My Schedule" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-0.5", children: "View your weekly training plan and sessions" })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Athlete Schedule" }),
        /* @__PURE__ */ jsx("div", { className: "py-8", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6", children: schedules.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4", children: "📅" }),
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-gray-900 mb-2", children: "No Training Sessions" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-sm max-w-md mx-auto", children: "You are not assigned to any training groups with an active schedule. Please contact your manager or coach." })
        ] }) : /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-lg font-bold text-gray-900 mb-6 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { children: "📅" }),
            " My Weekly Plan"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-6", children: DAYS.map((day) => {
            const daySlots = schedulesByDay[day];
            if (daySlots.length === 0) return null;
            return /* @__PURE__ */ jsxs("div", { className: "border border-gray-100 rounded-2xl overflow-hidden shadow-sm", children: [
              /* @__PURE__ */ jsx("div", { className: "bg-slate-50 px-5 py-3 border-b border-gray-100", children: /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold text-indigo-900", children: day }) }),
              /* @__PURE__ */ jsx("div", { className: "divide-y divide-gray-100", children: daySlots.map((slot) => {
                const coaches = slot.group.coaches?.map((c) => c.name).join(", ") || "No coach assigned";
                const loc = slot.facility?.name || slot.location || "Main Hall";
                return /* @__PURE__ */ jsxs("div", { className: "p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-slate-50/55 transition-all", children: [
                  /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
                      /* @__PURE__ */ jsx("span", { className: "px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-extrabold border border-indigo-100", children: slot.group.name }),
                      /* @__PURE__ */ jsxs("span", { className: "text-sm font-black text-gray-700", children: [
                        fmtTime(slot.start_time),
                        " - ",
                        fmtTime(slot.end_time)
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500", children: [
                      "Coach: ",
                      /* @__PURE__ */ jsx("strong", { className: "text-gray-700 font-semibold", children: coaches })
                    ] }),
                    slot.notes && /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-400 italic", children: [
                      "Note: ",
                      slot.notes
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-xl px-3 py-1.5 w-fit", children: [
                    /* @__PURE__ */ jsx("span", { children: "📍" }),
                    /* @__PURE__ */ jsx("span", { children: loc })
                  ] })
                ] }, slot.id);
              }) })
            ] }, day);
          }) })
        ] }) }) })
      ]
    }
  );
}
export {
  AthleteSchedule as default
};
