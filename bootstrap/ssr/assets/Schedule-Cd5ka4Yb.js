import { jsxs, jsx } from "react/jsx-runtime";
import { A as Authenticated } from "./AuthenticatedLayout-DcfkJEmD.js";
import { Head } from "@inertiajs/react";
import "@headlessui/react";
import "react";
import "axios";
import "./ml-sports-BEC2gdiG.js";
function AthleteSchedule() {
  return /* @__PURE__ */ jsxs(
    Authenticated,
    {
      header: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-900", children: "My Schedule" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-0.5", children: "View your upcoming training sessions and events" })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Athlete Schedule" }),
        /* @__PURE__ */ jsx("div", { className: "py-8", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4", children: "📅" }),
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-gray-900 mb-2", children: "My Weekly Schedule" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-sm max-w-md mx-auto", children: "Here you can find all the details about your upcoming training sessions." }),
          /* @__PURE__ */ jsx("div", { className: "mt-8 overflow-hidden rounded-xl border border-gray-100", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-gray-50", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Date & Time" }),
              /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Session Type" }),
              /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Coach" }),
              /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Location" })
            ] }) }),
            /* @__PURE__ */ jsxs("tbody", { className: "bg-white divide-y divide-gray-200 text-left", children: [
              /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900", children: "May 16 • 18:00" }),
                /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: /* @__PURE__ */ jsx("span", { className: "px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs font-bold border border-indigo-100", children: "Elite Sparring" }) }),
                /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: "Master Kim" }),
                /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: "Main Hall" })
              ] }),
              /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900", children: "May 18 • 16:00" }),
                /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: /* @__PURE__ */ jsx("span", { className: "px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-bold border border-emerald-100", children: "Belt Grading Prep" }) }),
                /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: "Coach Lee" }),
                /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: "Training Room B" })
              ] }),
              /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900", children: "May 22 • 17:30" }),
                /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: /* @__PURE__ */ jsx("span", { className: "px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-bold border border-blue-100", children: "Pattern Practice" }) }),
                /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: "Master Kim" }),
                /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: "Main Hall" })
              ] })
            ] })
          ] }) })
        ] }) }) })
      ]
    }
  );
}
export {
  AthleteSchedule as default
};
