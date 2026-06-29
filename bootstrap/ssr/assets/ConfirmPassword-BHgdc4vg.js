import { jsxs, jsx } from "react/jsx-runtime";
import { I as InputError } from "./InputError-roYfmLKp.js";
import { G as Guest } from "./GuestLayout-Brv5APIf.js";
import { useForm, Head } from "@inertiajs/react";
import "./ml-sports-BEC2gdiG.js";
function ConfirmPassword() {
  const { data, setData, post, processing, errors, reset } = useForm({
    password: ""
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("password.confirm"), {
      onFinish: () => reset("password")
    });
  };
  return /* @__PURE__ */ jsxs(Guest, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Confirm Password" }),
    /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl mb-4", children: "🔐" }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-black text-gray-900 mb-1", children: "Confirm your password" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "This is a secure area. Please confirm your password before continuing." })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-5", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "password", className: "block text-sm font-semibold text-gray-700 mb-2", children: "Password" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            id: "password",
            type: "password",
            name: "password",
            value: data.password,
            autoFocus: true,
            onChange: (e) => setData("password", e.target.value),
            className: "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all",
            placeholder: "••••••••"
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.password, className: "mt-2" })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: processing,
          className: "w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-sm shadow-indigo-200 disabled:opacity-60",
          children: processing ? "Confirming..." : "Confirm Password"
        }
      )
    ] })
  ] });
}
export {
  ConfirmPassword as default
};
