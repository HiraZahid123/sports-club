import { jsxs, jsx } from "react/jsx-runtime";
import { I as InputError } from "./InputError-roYfmLKp.js";
import { I as InputLabel, T as TextInput } from "./TextInput-f5gRkQj7.js";
import { P as PrimaryButton } from "./PrimaryButton-DDF1xnxF.js";
import { Transition } from "@headlessui/react";
import { usePage, useForm, Link } from "@inertiajs/react";
import "react";
function UpdateProfileInformation({
  mustVerifyEmail,
  status,
  className = ""
}) {
  const user = usePage().props.auth.user;
  const isAthlete = user.roles?.includes("Athlete");
  const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
    name: user.name,
    email: user.email,
    phone: user.phone ?? "",
    id_code: user.id_code ?? "",
    city: user.city ?? "",
    emergency_contact_name: user.emergency_contact_name ?? "",
    emergency_contact_phone: user.emergency_contact_phone ?? "",
    date_of_birth: user.athlete_profile?.date_of_birth ?? ""
  });
  const submit = (e) => {
    e.preventDefault();
    patch(route("profile.update"));
  };
  return /* @__PURE__ */ jsxs("section", { className, children: [
    /* @__PURE__ */ jsxs("header", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-medium text-gray-900 dark:text-gray-100", children: "Profile Information" }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-600 dark:text-gray-400", children: "Update your account's profile information and email address." })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "mt-6 space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(InputLabel, { htmlFor: "name", value: "Name" }),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            id: "name",
            className: "mt-1 block w-full",
            value: data.name,
            onChange: (e) => setData("name", e.target.value),
            required: true,
            isFocused: true,
            autoComplete: "name"
          }
        ),
        /* @__PURE__ */ jsx(InputError, { className: "mt-2", message: errors.name })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(InputLabel, { htmlFor: "email", value: "Email" }),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            id: "email",
            type: "email",
            className: "mt-1 block w-full",
            value: data.email,
            onChange: (e) => setData("email", e.target.value),
            required: true,
            autoComplete: "username"
          }
        ),
        /* @__PURE__ */ jsx(InputError, { className: "mt-2", message: errors.email })
      ] }),
      isAthlete && /* @__PURE__ */ jsxs("div", { className: "border-t border-gray-100 pt-6 mt-6 space-y-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-md font-bold text-gray-800 uppercase tracking-wide", children: "Athlete Details" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "phone", value: "Phone Number" }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                id: "phone",
                className: "mt-1 block w-full",
                value: data.phone,
                onChange: (e) => setData("phone", e.target.value)
              }
            ),
            /* @__PURE__ */ jsx(InputError, { className: "mt-2", message: errors.phone })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "id_code", value: "National ID" }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                id: "id_code",
                className: "mt-1 block w-full",
                value: data.id_code,
                onChange: (e) => setData("id_code", e.target.value)
              }
            ),
            /* @__PURE__ */ jsx(InputError, { className: "mt-2", message: errors.id_code })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "city", value: "City" }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                id: "city",
                className: "mt-1 block w-full",
                value: data.city,
                onChange: (e) => setData("city", e.target.value)
              }
            ),
            /* @__PURE__ */ jsx(InputError, { className: "mt-2", message: errors.city })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "date_of_birth", value: "Date of Birth" }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                id: "date_of_birth",
                type: "date",
                className: "mt-1 block w-full",
                value: data.date_of_birth,
                onChange: (e) => setData("date_of_birth", e.target.value)
              }
            ),
            /* @__PURE__ */ jsx(InputError, { className: "mt-2", message: errors.date_of_birth })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "border-t border-gray-100 pt-4 space-y-4", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold text-gray-700 uppercase tracking-wide", children: "Emergency Contact" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { htmlFor: "emergency_contact_name", value: "Contact Name" }),
              /* @__PURE__ */ jsx(
                TextInput,
                {
                  id: "emergency_contact_name",
                  className: "mt-1 block w-full",
                  value: data.emergency_contact_name,
                  onChange: (e) => setData("emergency_contact_name", e.target.value)
                }
              ),
              /* @__PURE__ */ jsx(InputError, { className: "mt-2", message: errors.emergency_contact_name })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { htmlFor: "emergency_contact_phone", value: "Contact Phone" }),
              /* @__PURE__ */ jsx(
                TextInput,
                {
                  id: "emergency_contact_phone",
                  className: "mt-1 block w-full",
                  value: data.emergency_contact_phone,
                  onChange: (e) => setData("emergency_contact_phone", e.target.value)
                }
              ),
              /* @__PURE__ */ jsx(InputError, { className: "mt-2", message: errors.emergency_contact_phone })
            ] })
          ] })
        ] })
      ] }),
      mustVerifyEmail && user.email_verified_at === null && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-gray-800 dark:text-gray-200", children: [
          "Your email address is unverified.",
          /* @__PURE__ */ jsx(
            Link,
            {
              href: route("verification.send"),
              method: "post",
              as: "button",
              className: "rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800",
              children: "Click here to re-send the verification email."
            }
          )
        ] }),
        status === "verification-link-sent" && /* @__PURE__ */ jsx("div", { className: "mt-2 text-sm font-medium text-green-600 dark:text-green-400", children: "A new verification link has been sent to your email address." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx(PrimaryButton, { disabled: processing, children: "Save" }),
        /* @__PURE__ */ jsx(
          Transition,
          {
            show: recentlySuccessful,
            enter: "transition ease-in-out",
            enterFrom: "opacity-0",
            leave: "transition ease-in-out",
            leaveTo: "opacity-0",
            children: /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Saved." })
          }
        )
      ] })
    ] })
  ] });
}
export {
  UpdateProfileInformation as default
};
