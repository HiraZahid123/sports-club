import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as Authenticated } from "./AuthenticatedLayout-CAEJzy7Q.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { useState, useRef, useEffect } from "react";
import { b as getBeltStyle, B as BELT_OPTIONS, g as getBeltBadgeStyle } from "./beltHelpers-6FZX55wB.js";
import "@headlessui/react";
import "axios";
import "./ml-sports-BEC2gdiG.js";
const roleConfig = {
  Coach: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  Athlete: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  Parent: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
  Manager: { bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-500" }
};
function beltBadge(belt) {
  if (!belt) return null;
  const cls = getBeltBadgeStyle(belt);
  return /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${cls}`, children: [
    /* @__PURE__ */ jsx("span", { className: "inline-block h-2 w-4 rounded-sm border shrink-0", style: getBeltStyle(belt) }),
    belt
  ] });
}
function MembersIndex({ members }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [showInviteCoach, setShowInviteCoach] = useState(false);
  const inviteForm = useForm({ email: "", payment_option: "manual", payment_rate: "0" });
  const submitInvite = (e) => {
    e.preventDefault();
    inviteForm.post(route("manager.invitations.coach"), {
      onSuccess: () => {
        setShowInviteCoach(false);
        inviteForm.reset();
      }
    });
  };
  const beltDropdownRef = useRef(null);
  const [showBeltDropdown, setShowBeltDropdown] = useState(false);
  useEffect(() => {
    function handleClickOutside(event) {
      if (beltDropdownRef.current && !beltDropdownRef.current.contains(event.target)) {
        setShowBeltDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
    name: "",
    email: "",
    role: "Athlete",
    password: "password123",
    id_code: "",
    phone: "",
    city: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    date_of_birth: "",
    belt_rank: ""
  });
  const openAddForm = () => {
    setEditingMember(null);
    reset();
    clearErrors();
    setIsFormOpen(true);
  };
  const openEditForm = (member) => {
    setEditingMember(member);
    setData({
      name: member.name,
      email: member.email,
      role: member.roles[0]?.name || "Athlete",
      password: "",
      id_code: member.id_code ?? "",
      phone: member.phone ?? "",
      city: member.city ?? "",
      emergency_contact_name: member.emergency_contact_name ?? "",
      emergency_contact_phone: member.emergency_contact_phone ?? "",
      date_of_birth: member.athlete_profile?.date_of_birth ?? "",
      belt_rank: member.athlete_profile?.belt_rank ?? ""
    });
    clearErrors();
    setIsFormOpen(true);
  };
  const closeForm = () => {
    setIsFormOpen(false);
    setEditingMember(null);
    setShowBeltDropdown(false);
    reset();
    clearErrors();
  };
  const submit = (e) => {
    e.preventDefault();
    if (editingMember) {
      put(route("manager.members.update", editingMember.id), { onSuccess: () => closeForm() });
    } else {
      post(route("manager.members.store"), { onSuccess: () => closeForm() });
    }
  };
  const getRoleStyle = (roleName) => roleConfig[roleName] || { bg: "bg-gray-50", text: "text-gray-700", dot: "bg-gray-400" };
  const inputClass = "w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all";
  const labelClass = "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5";
  return /* @__PURE__ */ jsxs(
    Authenticated,
    {
      header: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Member Management" }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500 mt-0.5", children: [
            members.length,
            " total members in your club"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setShowInviteCoach(true),
              className: "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition-all",
              children: [
                /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" }) }),
                "Invite Coach"
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: isFormOpen ? closeForm : openAddForm,
              className: `inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${isFormOpen ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200"}`,
              children: isFormOpen ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }),
                "Cancel"
              ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) }),
                "Add Member"
              ] })
            }
          )
        ] })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Members" }),
        /* @__PURE__ */ jsx("div", { className: "py-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6", children: [
          isFormOpen && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-indigo-100", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-indigo-900", children: editingMember ? "Edit Member" : "Create New Member" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-indigo-600 mt-0.5", children: editingMember ? "Update member details below" : "Fill in the details to add a new member to your club" })
            ] }),
            /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "p-6 space-y-6", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-gray-400 uppercase tracking-widest mb-3", children: "Basic Information" }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: labelClass, children: "Full Name" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        value: data.name,
                        onChange: (e) => setData("name", e.target.value),
                        placeholder: "e.g. John Smith",
                        className: inputClass
                      }
                    ),
                    errors.name && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600", children: errors.name })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: labelClass, children: "Email Address" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "email",
                        value: data.email,
                        onChange: (e) => setData("email", e.target.value),
                        placeholder: "email@example.com",
                        className: inputClass
                      }
                    ),
                    errors.email && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600", children: errors.email })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: labelClass, children: "Club Role" }),
                    /* @__PURE__ */ jsxs(
                      "select",
                      {
                        value: data.role,
                        onChange: (e) => setData("role", e.target.value),
                        className: inputClass,
                        children: [
                          /* @__PURE__ */ jsx("option", { value: "Athlete", children: "Athlete" }),
                          /* @__PURE__ */ jsx("option", { value: "Coach", children: "Coach" }),
                          /* @__PURE__ */ jsx("option", { value: "Parent", children: "Parent" })
                        ]
                      }
                    )
                  ] }),
                  !editingMember && /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: labelClass, children: "Password" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        value: data.password,
                        onChange: (e) => setData("password", e.target.value),
                        placeholder: "Min. 8 characters",
                        className: inputClass
                      }
                    ),
                    errors.password && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600", children: errors.password })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-gray-400 uppercase tracking-widest mb-3", children: "Contact Details" }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: labelClass, children: "Phone Number" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        value: data.phone,
                        onChange: (e) => setData("phone", e.target.value),
                        placeholder: "+1 555 000 0000",
                        className: inputClass
                      }
                    ),
                    errors.phone && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600", children: errors.phone })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: labelClass, children: "City" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        value: data.city,
                        onChange: (e) => setData("city", e.target.value),
                        placeholder: "e.g. London",
                        className: inputClass
                      }
                    ),
                    errors.city && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600", children: errors.city })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: labelClass, children: "ID Code" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        value: data.id_code,
                        onChange: (e) => setData("id_code", e.target.value),
                        placeholder: "National / membership ID",
                        className: inputClass
                      }
                    ),
                    errors.id_code && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600", children: errors.id_code })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-gray-400 uppercase tracking-widest mb-3", children: "Emergency Contact" }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: labelClass, children: "Contact Name" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        value: data.emergency_contact_name,
                        onChange: (e) => setData("emergency_contact_name", e.target.value),
                        placeholder: "e.g. Jane Smith",
                        className: inputClass
                      }
                    ),
                    errors.emergency_contact_name && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600", children: errors.emergency_contact_name })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: labelClass, children: "Contact Phone" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        value: data.emergency_contact_phone,
                        onChange: (e) => setData("emergency_contact_phone", e.target.value),
                        placeholder: "+1 555 000 0001",
                        className: inputClass
                      }
                    ),
                    errors.emergency_contact_phone && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600", children: errors.emergency_contact_phone })
                  ] })
                ] })
              ] }),
              data.role === "Athlete" && /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-gray-400 uppercase tracking-widest mb-3", children: "Athlete Details" }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: labelClass, children: "Date of Birth" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "date",
                        value: data.date_of_birth,
                        onChange: (e) => setData("date_of_birth", e.target.value),
                        className: inputClass
                      }
                    ),
                    errors.date_of_birth && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600", children: errors.date_of_birth })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "relative", ref: beltDropdownRef, children: [
                    /* @__PURE__ */ jsx("label", { className: labelClass, children: "Belt" }),
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => setShowBeltDropdown(!showBeltDropdown),
                        className: "w-full flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-left shadow-sm",
                        children: [
                          /* @__PURE__ */ jsx("span", { className: "flex items-center gap-2", children: data.belt_rank ? /* @__PURE__ */ jsxs(Fragment, { children: [
                            /* @__PURE__ */ jsx("span", { className: "inline-block h-3.5 w-7 rounded border shadow-sm shrink-0", style: getBeltStyle(data.belt_rank) }),
                            /* @__PURE__ */ jsx("span", { className: "font-semibold text-gray-800", children: data.belt_rank })
                          ] }) : /* @__PURE__ */ jsx("span", { className: "text-gray-400", children: "Select Belt" }) }),
                          /* @__PURE__ */ jsx("svg", { className: `w-4 h-4 text-gray-400 transition-transform ${showBeltDropdown ? "rotate-180" : ""}`, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) })
                        ]
                      }
                    ),
                    showBeltDropdown && /* @__PURE__ */ jsx("div", { className: "absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-gray-100 bg-white p-1 shadow-lg focus:outline-none", children: BELT_OPTIONS.map((opt) => /* @__PURE__ */ jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          setData("belt_rank", opt.value);
                          setShowBeltDropdown(false);
                        },
                        className: `flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${data.belt_rank === opt.value ? "bg-indigo-50 text-indigo-700 font-bold" : "text-gray-700 hover:bg-slate-50"}`,
                        children: [
                          /* @__PURE__ */ jsx("span", { className: "inline-block h-3.5 w-7 rounded border shadow-sm shrink-0", style: getBeltStyle(opt.value) }),
                          /* @__PURE__ */ jsx("span", { children: opt.label })
                        ]
                      },
                      opt.value
                    )) }),
                    errors.belt_rank && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600", children: errors.belt_rank })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex justify-end pt-2", children: /* @__PURE__ */ jsx(
                "button",
                {
                  type: "submit",
                  disabled: processing,
                  className: "px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-sm",
                  children: processing ? "Saving…" : editingMember ? "Update Member" : "Save Member"
                }
              ) })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "overflow-x-auto", children: [
            /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
              /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-slate-50 border-b border-gray-100", children: [
                /* @__PURE__ */ jsx("th", { className: "px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide", children: "Member" }),
                /* @__PURE__ */ jsx("th", { className: "px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide", children: "Role" }),
                /* @__PURE__ */ jsx("th", { className: "px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide", children: "Phone" }),
                /* @__PURE__ */ jsx("th", { className: "px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide", children: "City" }),
                /* @__PURE__ */ jsx("th", { className: "px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide", children: "Belt" }),
                /* @__PURE__ */ jsx("th", { className: "px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide", children: "Emergency Contact" }),
                /* @__PURE__ */ jsx("th", { className: "px-6 py-3.5 text-right text-xs font-bold text-gray-500 uppercase tracking-wide", children: "Actions" })
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-50", children: members.map((member) => {
                const roleName = member.roles[0]?.name || "Member";
                const style = getRoleStyle(roleName);
                return /* @__PURE__ */ jsxs("tr", { className: "hover:bg-slate-50/60 transition-colors", children: [
                  /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center text-indigo-700 font-bold text-sm border border-indigo-100 shrink-0", children: member.name.charAt(0).toUpperCase() }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-900 text-sm", children: member.name }),
                      /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-400", children: [
                        member.id_code ? /* @__PURE__ */ jsx("span", { className: "font-mono", children: member.id_code }) : /* @__PURE__ */ jsx("span", { className: "italic", children: "No ID" }),
                        " · ",
                        member.email
                      ] })
                    ] })
                  ] }) }),
                  /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${style.bg} ${style.text}`, children: [
                    /* @__PURE__ */ jsx("span", { className: `w-1.5 h-1.5 rounded-full ${style.dot}` }),
                    roleName
                  ] }) }),
                  /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-sm text-gray-600", children: member.phone || /* @__PURE__ */ jsx("span", { className: "text-gray-300", children: "—" }) }),
                  /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-sm text-gray-600", children: member.city || /* @__PURE__ */ jsx("span", { className: "text-gray-300", children: "—" }) }),
                  /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: roleName === "Athlete" ? beltBadge(member.athlete_profile?.belt_rank) ?? /* @__PURE__ */ jsx("span", { className: "text-gray-300 text-sm", children: "—" }) : /* @__PURE__ */ jsx("span", { className: "text-gray-300 text-sm", children: "—" }) }),
                  /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: member.emergency_contact_name ? /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-700 font-medium", children: member.emergency_contact_name }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400", children: member.emergency_contact_phone || "—" })
                  ] }) : /* @__PURE__ */ jsx("span", { className: "text-gray-300 text-sm", children: "—" }) }),
                  /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2", children: [
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: () => openEditForm(member),
                        className: "px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors",
                        children: "Edit"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      Link,
                      {
                        href: route("manager.members.destroy", member.id),
                        method: "delete",
                        as: "button",
                        className: "px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors",
                        children: "Remove"
                      }
                    )
                  ] }) })
                ] }, member.id);
              }) })
            ] }),
            members.length === 0 && /* @__PURE__ */ jsxs("div", { className: "py-16 text-center", children: [
              /* @__PURE__ */ jsx("div", { className: "w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4", children: "👥" }),
              /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-900 mb-1", children: "No members yet" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Add your first member to get started." })
            ] })
          ] }) })
        ] }) }),
        showInviteCoach && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-amber-100 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-amber-900", children: "Invite a Coach" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-amber-600 mt-0.5", children: "They'll receive an email with an activation link" })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => {
                  setShowInviteCoach(false);
                  inviteForm.reset();
                },
                className: "text-gray-400 hover:text-gray-600 transition-colors",
                children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("form", { onSubmit: submitInvite, className: "p-6 space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Coach Email Address" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "email",
                  value: inviteForm.data.email,
                  onChange: (e) => inviteForm.setData("email", e.target.value),
                  className: "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all",
                  placeholder: "coach@example.com",
                  required: true
                }
              ),
              inviteForm.errors.email && /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-red-600", children: inviteForm.errors.email })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Salary / Revenue Option" }),
              /* @__PURE__ */ jsx("div", { className: "space-y-2", children: [
                { value: "athlete", icon: "👤", label: "Option 1 — Per Athlete × EUR", desc: "Paid per athlete in their training groups." },
                { value: "hourly", icon: "⏱️", label: "Option 2 — EUR Per Hour (Schedule)", desc: "Paid based on scheduled training hours." },
                { value: "manual", icon: "💰", label: "Option 3 — Fixed / Manual Amount", desc: "Manager sets the amount manually each payout." }
              ].map((opt) => /* @__PURE__ */ jsxs(
                "label",
                {
                  className: `flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${inviteForm.data.payment_option === opt.value ? "border-amber-500 bg-amber-50/60" : "border-gray-200 hover:bg-gray-50"}`,
                  children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "radio",
                        name: "invite_payment_option",
                        value: opt.value,
                        checked: inviteForm.data.payment_option === opt.value,
                        onChange: () => inviteForm.setData("payment_option", opt.value),
                        className: "mt-0.5 text-amber-500 focus:ring-amber-400"
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { className: "text-base leading-none mt-0.5", children: opt.icon }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-gray-800", children: opt.label }),
                      /* @__PURE__ */ jsx("p", { className: "text-[11px] text-gray-500 mt-0.5", children: opt.desc })
                    ] })
                  ]
                },
                opt.value
              )) })
            ] }),
            inviteForm.data.payment_option !== "manual" && /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5", children: inviteForm.data.payment_option === "athlete" ? "Price per Athlete (€)" : "Price per Hour (€)" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  step: "0.01",
                  min: "0",
                  value: inviteForm.data.payment_rate,
                  onChange: (e) => inviteForm.setData("payment_rate", e.target.value),
                  placeholder: "0.00",
                  className: "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                }
              ),
              inviteForm.errors.payment_rate && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600", children: inviteForm.errors.payment_rate })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-800", children: "The coach will receive an email with a secure activation link valid for 7 days. They cannot self-register — this is the only way to create a coach account." }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-1", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setShowInviteCoach(false);
                    inviteForm.reset();
                  },
                  className: "flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-all",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "submit",
                  disabled: inviteForm.processing,
                  className: "flex-1 py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-bold transition-all shadow-sm shadow-amber-200 disabled:opacity-60",
                  children: inviteForm.processing ? "Sending..." : "Send Invitation"
                }
              )
            ] })
          ] })
        ] }) })
      ]
    }
  );
}
export {
  MembersIndex as default
};
