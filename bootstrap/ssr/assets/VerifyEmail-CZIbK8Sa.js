import { jsxs, jsx } from "react/jsx-runtime";
import { G as Guest } from "./GuestLayout-Brv5APIf.js";
import { useForm, Head, Link } from "@inertiajs/react";
import "./ml-sports-BEC2gdiG.js";
function VerifyEmail({ status }) {
  const { post, processing } = useForm({});
  const submit = (e) => {
    e.preventDefault();
    post(route("verification.send"));
  };
  return /* @__PURE__ */ jsxs(Guest, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Verify Email" }),
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5", children: "📧" }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-black text-gray-900 mb-2", children: "Verify your email" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 leading-relaxed", children: "Thanks for signing up! Please verify your email address by clicking the link we sent you. Didn't receive it? We'll send another." })
    ] }),
    status === "verification-link-sent" && /* @__PURE__ */ jsx("div", { className: "mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-medium text-emerald-700 text-center", children: "A new verification link has been sent to your email address." }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-4", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: processing,
          className: "w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-sm shadow-indigo-200 disabled:opacity-60",
          children: processing ? "Sending..." : "Resend Verification Email"
        }
      ),
      /* @__PURE__ */ jsx(
        Link,
        {
          href: route("logout"),
          method: "post",
          as: "button",
          className: "w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-all text-center block",
          children: "Sign Out"
        }
      )
    ] })
  ] });
}
export {
  VerifyEmail as default
};
