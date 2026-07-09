import { jsxs, jsx } from "react/jsx-runtime";
import { A as Authenticated } from "./AuthenticatedLayout-uU_SUfcq.js";
import { useForm, Head } from "@inertiajs/react";
import "@headlessui/react";
import "react";
import "axios";
import "./ml-sports-BEC2gdiG.js";
function ClubSetup() {
  const { data, setData, post, processing, errors } = useForm({
    name: "",
    email: "",
    phone: "",
    address: "",
    description: ""
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("manager.club.update"));
  };
  return /* @__PURE__ */ jsxs(
    Authenticated,
    {
      header: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Club Setup" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-0.5", children: "Let's get your club set up in just a few steps" })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Club Setup" }),
        /* @__PURE__ */ jsx("div", { className: "py-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-2xl mx-auto px-4 sm:px-6 lg:px-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-8 text-white mb-6 shadow-lg shadow-indigo-200 relative overflow-hidden", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx("div", { className: "text-3xl mb-3", children: "🏟️" }),
              /* @__PURE__ */ jsx("h3", { className: "text-xl font-black mb-2", children: "Welcome to SportClub!" }),
              /* @__PURE__ */ jsx("p", { className: "text-indigo-200 text-sm leading-relaxed", children: "You're almost ready. Fill in your club's basic details and you'll be up and running in minutes." })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", children: [
            /* @__PURE__ */ jsxs("div", { className: "px-6 py-5 border-b border-gray-50", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-gray-900", children: "Club Information" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-0.5", children: "Provide the basic details of your sports club" })
            ] }),
            /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "p-6 space-y-5", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5", children: "Club Name *" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: data.name,
                    onChange: (e) => setData("name", e.target.value),
                    placeholder: "e.g. Elite Taekwondo Academy",
                    className: "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  }
                ),
                errors.name && /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-xs text-red-600", children: errors.name })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5", children: "Official Email" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "email",
                      value: data.email,
                      onChange: (e) => setData("email", e.target.value),
                      placeholder: "club@example.com",
                      className: "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    }
                  ),
                  errors.email && /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-xs text-red-600", children: errors.email })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5", children: "Phone Number" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      value: data.phone,
                      onChange: (e) => setData("phone", e.target.value),
                      placeholder: "+1 (555) 000-0000",
                      className: "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    }
                  ),
                  errors.phone && /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-xs text-red-600", children: errors.phone })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5", children: "Address" }),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    value: data.address,
                    onChange: (e) => setData("address", e.target.value),
                    placeholder: "123 Sports Ave, City, State 12345",
                    rows: 3,
                    className: "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex items-center justify-end pt-2", children: /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "submit",
                  disabled: processing,
                  className: "inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all disabled:opacity-50 shadow-sm shadow-indigo-200",
                  children: [
                    processing ? "Creating..." : "Create Club & Continue",
                    !processing && /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })
                  ]
                }
              ) })
            ] })
          ] })
        ] }) })
      ]
    }
  );
}
export {
  ClubSetup as default
};
