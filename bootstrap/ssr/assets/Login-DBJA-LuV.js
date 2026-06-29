import { jsx, jsxs } from "react/jsx-runtime";
import { I as InputError } from "./InputError-roYfmLKp.js";
import { G as Guest } from "./GuestLayout-Brv5APIf.js";
import { useForm, Head, Link } from "@inertiajs/react";
import "./ml-sports-BEC2gdiG.js";
function Checkbox({
  className = "",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "input",
    {
      ...props,
      type: "checkbox",
      className: "rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:focus:ring-indigo-600 dark:focus:ring-offset-gray-800 " + className
    }
  );
}
function Login({
  status,
  canResetPassword
}) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: "",
    password: "",
    remember: false
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("login"), {
      onFinish: () => reset("password")
    });
  };
  return /* @__PURE__ */ jsxs(Guest, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Sign In" }),
    /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-black text-gray-900 mb-1", children: "Welcome back" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Sign in to your SportClub account" })
    ] }),
    status && /* @__PURE__ */ jsx("div", { className: "mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-medium text-emerald-700", children: status }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-5", children: [
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
            autoFocus: true,
            onChange: (e) => setData("email", e.target.value),
            className: "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all",
            placeholder: "you@example.com"
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.email, className: "mt-2" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "password", className: "block text-sm font-semibold text-gray-700 mb-2", children: "Password" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            id: "password",
            type: "password",
            name: "password",
            value: data.password,
            autoComplete: "current-password",
            onChange: (e) => setData("password", e.target.value),
            className: "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all",
            placeholder: "••••••••"
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.password, className: "mt-2" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
          /* @__PURE__ */ jsx(
            Checkbox,
            {
              name: "remember",
              checked: data.remember,
              onChange: (e) => setData("remember", e.target.checked || false)
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600", children: "Remember me" })
        ] }),
        canResetPassword && /* @__PURE__ */ jsx(
          Link,
          {
            href: route("password.request"),
            className: "text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors",
            children: "Forgot password?"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: processing,
          className: "w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-sm shadow-indigo-200 disabled:opacity-60 disabled:cursor-not-allowed",
          children: processing ? "Signing in..." : "Sign In"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("p", { className: "mt-6 text-center text-sm text-gray-500", children: [
      "Don't have an account?",
      " ",
      /* @__PURE__ */ jsx(Link, { href: route("register"), className: "font-semibold text-indigo-600 hover:text-indigo-700 transition-colors", children: "Create one free" })
    ] })
  ] });
}
export {
  Login as default
};
