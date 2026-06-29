import { jsxs, jsx } from "react/jsx-runtime";
import { I as InputError } from "./InputError-roYfmLKp.js";
import { G as Guest } from "./GuestLayout-Brv5APIf.js";
import { useForm, Head, Link } from "@inertiajs/react";
import "./ml-sports-BEC2gdiG.js";
function Register() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    email: "",
    password: "",
    password_confirmation: ""
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("register"), {
      onFinish: () => reset("password", "password_confirmation")
    });
  };
  return /* @__PURE__ */ jsxs(Guest, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Create Account" }),
    /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-black text-gray-900 mb-1", children: "Create your account" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Start managing your sports club today" })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-5", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "name", className: "block text-sm font-semibold text-gray-700 mb-2", children: "Full Name" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            id: "name",
            name: "name",
            type: "text",
            value: data.name,
            autoComplete: "name",
            autoFocus: true,
            onChange: (e) => setData("name", e.target.value),
            className: "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all",
            placeholder: "John Smith",
            required: true
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.name, className: "mt-2" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "email", className: "block text-sm font-semibold text-gray-700 mb-2", children: "Email Address" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            id: "email",
            type: "email",
            name: "email",
            value: data.email,
            autoComplete: "username",
            onChange: (e) => setData("email", e.target.value),
            className: "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all",
            placeholder: "you@example.com",
            required: true
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.email, className: "mt-2" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "password", className: "block text-sm font-semibold text-gray-700 mb-2", children: "Password" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "password",
              type: "password",
              name: "password",
              value: data.password,
              autoComplete: "new-password",
              onChange: (e) => setData("password", e.target.value),
              className: "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all",
              placeholder: "••••••••",
              required: true
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.password, className: "mt-2" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "password_confirmation", className: "block text-sm font-semibold text-gray-700 mb-2", children: "Confirm Password" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "password_confirmation",
              type: "password",
              name: "password_confirmation",
              value: data.password_confirmation,
              autoComplete: "new-password",
              onChange: (e) => setData("password_confirmation", e.target.value),
              className: "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all",
              placeholder: "••••••••",
              required: true
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.password_confirmation, className: "mt-2" })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: processing,
          className: "w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-sm shadow-indigo-200 disabled:opacity-60 disabled:cursor-not-allowed",
          children: processing ? "Creating account..." : "Create Account"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("p", { className: "mt-6 text-center text-sm text-gray-500", children: [
      "Already have an account?",
      " ",
      /* @__PURE__ */ jsx(Link, { href: route("login"), className: "font-semibold text-indigo-600 hover:text-indigo-700 transition-colors", children: "Sign in" })
    ] })
  ] });
}
export {
  Register as default
};
