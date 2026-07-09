import { jsxs, jsx } from "react/jsx-runtime";
import { A as Authenticated } from "./AuthenticatedLayout-uU_SUfcq.js";
import { Head } from "@inertiajs/react";
import "@headlessui/react";
import "react";
import "axios";
import "./ml-sports-BEC2gdiG.js";
function Dashboard() {
  return /* @__PURE__ */ jsxs(
    Authenticated,
    {
      header: /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Dashboard" }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Dashboard" }),
        /* @__PURE__ */ jsx("div", { className: "py-8", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4", children: "🏠" }),
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-gray-900 mb-2", children: "Welcome to SportClub" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "You're successfully logged in. Use the navigation above to get started." })
        ] }) }) })
      ]
    }
  );
}
export {
  Dashboard as default
};
