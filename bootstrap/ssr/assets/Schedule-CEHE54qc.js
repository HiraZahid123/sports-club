import { jsxs, jsx } from "react/jsx-runtime";
import { A as Authenticated } from "./AuthenticatedLayout-DcfkJEmD.js";
import { Head } from "@inertiajs/react";
import "@headlessui/react";
import "react";
import "axios";
import "./ml-sports-BEC2gdiG.js";
const fmtTime = (t) => {
  if (!t) return "";
  const parts = t.split(":");
  return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}`;
};
function CoachSchedule({ schedules = [] }) {
  return /* @__PURE__ */ jsxs(
    Authenticated,
    {
      header: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Training Schedule" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-0.5", children: "View and manage your upcoming training sessions" })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Coach Schedule" }),
        /* @__PURE__ */ jsx("div", { className: "py-8", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4", children: "📅" }),
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-gray-900 mb-2", children: "Weekly Schedule" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-sm max-w-md mx-auto", children: "Your full training schedule will be displayed here. This feature is currently being populated with your assigned group sessions." }),
          /* @__PURE__ */ jsx("div", { className: "mt-8 overflow-hidden rounded-xl border border-gray-100", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-gray-50", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Day" }),
              /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Time" }),
              /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Group" }),
              /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Location" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "bg-white divide-y divide-gray-200 text-left", children: schedules.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 4, className: "px-6 py-8 text-center text-sm text-gray-500", children: "No scheduled training sessions." }) }) : schedules.map((slot) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-slate-50 transition-colors", children: [
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900", children: slot.day_of_week }),
              /* @__PURE__ */ jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: [
                fmtTime(slot.start_time),
                " - ",
                fmtTime(slot.end_time)
              ] }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium", children: slot.group?.name ?? "—" }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: slot.facility?.name ?? slot.location ?? "—" })
            ] }, slot.id)) })
          ] }) })
        ] }) }) })
      ]
    }
  );
}
export {
  CoachSchedule as default
};
