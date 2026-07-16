import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as Authenticated } from "./AuthenticatedLayout-DGwI6Ex0.js";
import { Head, router, useForm } from "@inertiajs/react";
import { useState } from "react";
import axios from "axios";
import "@headlessui/react";
import "./ml-sports-BEC2gdiG.js";
function recipientLabel(msg) {
  if (msg.recipient_type === "club") return { text: "All Athletes", cls: "bg-indigo-50 text-indigo-700" };
  if (msg.recipient_type === "coaches") return { text: "All Coaches", cls: "bg-violet-50 text-violet-700" };
  if (msg.recipient_type === "group") return { text: `Group: ${msg.group?.name}`, cls: "bg-sky-50 text-sky-700" };
  return { text: msg.recipient_user?.name ?? "Person", cls: "bg-gray-100 text-gray-700" };
}
function SentList({ messages, onDelete }) {
  if (messages.length === 0) return null;
  return /* @__PURE__ */ jsx("div", { className: "space-y-3", children: messages.map((msg) => {
    const label = recipientLabel(msg);
    return /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm p-5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1 flex-wrap", children: [
          /* @__PURE__ */ jsx("span", { className: `px-2 py-0.5 rounded-md text-xs font-bold ${label.cls}`, children: label.text }),
          msg.message_type === "important" && /* @__PURE__ */ jsxs("span", { className: "px-2 py-0.5 rounded-md text-xs font-bold bg-red-50 text-red-600 flex items-center gap-1", children: [
            /* @__PURE__ */ jsx("svg", { className: "w-3 h-3", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z", clipRule: "evenodd" }) }),
            "Important"
          ] }),
          /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-400", children: msg.created_at })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "font-bold text-gray-900", children: msg.title }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-1 line-clamp-2", children: msg.body })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 flex-shrink-0", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 font-semibold uppercase tracking-wide", children: "Read by" }),
          /* @__PURE__ */ jsx("p", { className: "text-lg font-black text-emerald-600", children: msg.read_count })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => onDelete(msg.id),
            className: "p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors",
            title: "Delete",
            children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" }) })
          }
        )
      ] })
    ] }) }, msg.id);
  }) });
}
function InboxList({ messages }) {
  const [expanded, setExpanded] = useState(null);
  const open = (msg) => {
    setExpanded((prev) => {
      const next = prev === msg.id ? null : msg.id;
      if (next !== null && !msg.is_read) {
        axios.post(route("messages.read", msg.id));
        msg.is_read = true;
      }
      return next;
    });
  };
  if (messages.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm py-12 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3", children: /* @__PURE__ */ jsx("svg", { className: "w-6 h-6 text-gray-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.5, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z" }) }) }),
      /* @__PURE__ */ jsx("p", { className: "font-bold text-gray-900 text-sm", children: "No messages from manager yet" })
    ] });
  }
  return /* @__PURE__ */ jsx("div", { className: "space-y-3", children: messages.map((msg) => /* @__PURE__ */ jsxs(
    "div",
    {
      className: `bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${msg.message_type === "important" ? !msg.is_read ? "border-red-300" : "border-red-100" : !msg.is_read ? "border-indigo-200" : "border-gray-100"}`,
      children: [
        /* @__PURE__ */ jsx("button", { className: "w-full text-left p-5", onClick: () => open(msg), children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: `w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${msg.is_read ? "bg-transparent" : msg.message_type === "important" ? "bg-red-500" : "bg-indigo-500"}` }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2 mb-0.5", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
                /* @__PURE__ */ jsx("p", { className: `font-bold text-gray-900 truncate ${!msg.is_read ? msg.message_type === "important" ? "text-red-900" : "text-indigo-900" : ""}`, children: msg.title }),
                msg.message_type === "important" && /* @__PURE__ */ jsx("span", { className: "flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-600 uppercase tracking-wide", children: "Alert" })
              ] }),
              /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-400 flex-shrink-0", children: msg.created_at })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500 font-semibold", children: [
              "From: ",
              msg.sender.name
            ] }),
            expanded !== msg.id && /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-1.5 line-clamp-1", children: msg.body })
          ] }),
          /* @__PURE__ */ jsx(
            "svg",
            {
              className: `w-4 h-4 text-gray-400 flex-shrink-0 mt-1 transition-transform ${expanded === msg.id ? "rotate-180" : ""}`,
              fill: "none",
              viewBox: "0 0 24 24",
              stroke: "currentColor",
              strokeWidth: 2,
              children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 9l-7 7-7-7" })
            }
          )
        ] }) }),
        expanded === msg.id && /* @__PURE__ */ jsx("div", { className: "px-8 pb-5 pt-1 border-t border-gray-50", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-700 leading-relaxed whitespace-pre-wrap", children: msg.body }) })
      ]
    },
    msg.id
  )) });
}
function ComposeModal({ groups, athletes, coaches = [], isManager, onClose }) {
  const form = useForm({
    title: "",
    body: "",
    recipient_type: "club",
    training_group_id: "",
    recipient_user_id: "",
    message_type: "regular"
  });
  const [userListTarget, setUserListTarget] = useState("athlete");
  const IMPORTANT_MAX = 200;
  const bodyMax = form.data.message_type === "important" ? IMPORTANT_MAX : 5e3;
  const bodyRemaining = bodyMax - form.data.body.length;
  const selectRecipient = (type, target) => {
    form.setData({
      ...form.data,
      recipient_type: type,
      training_group_id: "",
      recipient_user_id: ""
    });
    if (target) setUserListTarget(target);
  };
  const isActiveRecipient = (type, target) => {
    if (form.data.recipient_type !== type) return false;
    if (type === "user" && target) return userListTarget === target;
    return true;
  };
  const submit = (e) => {
    e.preventDefault();
    form.post(route("messages.store"), {
      onSuccess: () => {
        onClose();
        form.reset();
      }
    });
  };
  const btnCls = (active) => `py-2.5 px-3 rounded-xl border-2 text-xs font-bold transition-all ${active ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`;
  const alertBtnCls = (active) => `py-2.5 px-3 rounded-xl border-2 text-xs font-bold transition-all ${active ? "border-red-400 bg-red-50 text-red-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`;
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col", children: [
    /* @__PURE__ */ jsxs("div", { className: `px-6 py-5 ${form.data.message_type === "important" ? "bg-gradient-to-r from-red-600 to-orange-600" : "bg-gradient-to-r from-indigo-600 to-blue-700"}`, children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-white", children: "New Message" }),
      /* @__PURE__ */ jsx("p", { className: "text-white/70 text-sm mt-0.5", children: form.data.message_type === "important" ? "Send an urgent popup alert" : "Send a notification to athletes or coaches" })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "p-6 space-y-4 overflow-y-auto", children: [
      isManager && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5", children: "Message Type" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => form.setData("message_type", "regular"),
              className: btnCls(form.data.message_type === "regular"),
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-1.5", children: [
                  /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" }) }),
                  "Regular Message"
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] font-normal text-gray-400 mt-0.5", children: "Goes to inbox · Long text OK" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => form.setData("message_type", "important"),
              className: alertBtnCls(form.data.message_type === "important"),
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-1.5", children: [
                  /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z", clipRule: "evenodd" }) }),
                  "Important Alert"
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] font-normal text-gray-400 mt-0.5", children: "Popup on login · Max 200 chars" })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5", children: isManager ? "Send To — Athletes" : "Send To" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => selectRecipient("club"), className: btnCls(isActiveRecipient("club")), children: "All Athletes" }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => selectRecipient("group"), className: btnCls(isActiveRecipient("group")), children: "Group" }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => selectRecipient("user", "athlete"), className: btnCls(isActiveRecipient("user", "athlete")), children: "Athlete" })
        ] }),
        isManager && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 mt-3", children: "Send To — Coaches" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => selectRecipient("coaches"), className: btnCls(isActiveRecipient("coaches")), children: "All Coaches" }),
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => selectRecipient("user", "coach"), className: btnCls(isActiveRecipient("user", "coach")), children: "Specific Coach" })
          ] })
        ] })
      ] }),
      form.data.recipient_type === "group" && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5", children: "Select Group" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: form.data.training_group_id,
            onChange: (e) => form.setData("training_group_id", e.target.value),
            className: "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "Choose group..." }),
              groups.map((g) => /* @__PURE__ */ jsx("option", { value: g.id, children: g.name }, g.id))
            ]
          }
        ),
        form.errors.training_group_id && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-600 mt-1", children: form.errors.training_group_id })
      ] }),
      form.data.recipient_type === "user" && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5", children: userListTarget === "coach" ? "Select Coach" : "Select Athlete" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: form.data.recipient_user_id,
            onChange: (e) => form.setData("recipient_user_id", e.target.value),
            className: "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all",
            children: [
              /* @__PURE__ */ jsxs("option", { value: "", children: [
                "Choose ",
                userListTarget === "coach" ? "coach" : "athlete",
                "..."
              ] }),
              (userListTarget === "coach" ? coaches : athletes).map((p) => /* @__PURE__ */ jsx("option", { value: p.id, children: p.name }, p.id))
            ]
          }
        ),
        form.errors.recipient_user_id && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-600 mt-1", children: form.errors.recipient_user_id })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5", children: "Subject" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: form.data.title,
            onChange: (e) => form.setData("title", e.target.value),
            placeholder: form.data.message_type === "important" ? "e.g. URGENT: Training location changed" : "e.g. Training cancelled this Friday",
            className: "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
          }
        ),
        form.errors.title && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-600 mt-1", children: form.errors.title })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1.5", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide", children: form.data.message_type === "important" ? "Alert Message" : "Message" }),
          form.data.message_type === "important" && /* @__PURE__ */ jsxs("span", { className: `text-xs font-bold ${bodyRemaining < 20 ? "text-red-600" : "text-gray-400"}`, children: [
            bodyRemaining,
            " / ",
            IMPORTANT_MAX,
            " chars left"
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            value: form.data.body,
            onChange: (e) => form.setData("body", e.target.value),
            maxLength: bodyMax,
            rows: form.data.message_type === "important" ? 3 : 5,
            placeholder: form.data.message_type === "important" ? "Short, urgent message (max 200 chars)…" : "Write your message here…",
            className: `w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:bg-white focus:outline-none transition-all resize-none ${form.data.message_type === "important" ? "border-red-200 focus:border-red-400 focus:ring-2 focus:ring-red-400/20" : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"}`
          }
        ),
        form.data.message_type === "important" && /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-red-500 mt-1 flex items-center gap-1", children: [
          /* @__PURE__ */ jsx("svg", { className: "w-3 h-3 flex-shrink-0", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z", clipRule: "evenodd" }) }),
          "This message will pop up on the coach's screen when they log in"
        ] }),
        form.errors.body && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-600 mt-1", children: form.errors.body })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-1", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              onClose();
              form.reset();
            },
            className: "flex-1 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-all",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: form.processing,
            className: `flex-1 py-2.5 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50 shadow-sm ${form.data.message_type === "important" ? "bg-red-600 hover:bg-red-700" : "bg-indigo-600 hover:bg-indigo-700"}`,
            children: form.processing ? "Sending…" : form.data.message_type === "important" ? "Send Alert" : "Send Message"
          }
        )
      ] })
    ] })
  ] }) });
}
function MessagesIndex(props) {
  const [showCompose, setShowCompose] = useState(false);
  const [coachTab, setCoachTab] = useState("inbox");
  const deleteMessage = (id) => {
    if (!confirm("Delete this message?")) return;
    router.delete(route("messages.destroy", id));
  };
  const canCompose = props.role === "manager" || props.role === "coach";
  const headerDesc = () => {
    if (props.role === "manager") return "Send notifications to athletes and coaches";
    if (props.role === "coach") return "Messages from your manager · Send to athletes";
    const unread = props.messages.filter((m) => !m.is_read).length;
    return `Inbox${unread > 0 ? ` · ${unread} unread` : ""}`;
  };
  return /* @__PURE__ */ jsxs(
    Authenticated,
    {
      header: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Messages" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-0.5", children: headerDesc() })
        ] }),
        canCompose && /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setShowCompose(true),
            className: "flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-sm shadow-indigo-200 transition-all",
            children: [
              /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 4.5v15m7.5-7.5h-15" }) }),
              "New Message"
            ]
          }
        )
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Messages" }),
        /* @__PURE__ */ jsx("div", { className: "py-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6", children: [
          props.role === "manager" && /* @__PURE__ */ jsx(Fragment, { children: props.sent.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx("svg", { className: "w-7 h-7 text-indigo-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.5, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.981l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z" }) }) }),
            /* @__PURE__ */ jsx("p", { className: "font-bold text-gray-900 text-lg", children: "No messages sent yet" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-1 mb-5", children: "Send your first message to athletes or coaches." }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setShowCompose(true),
                className: "px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all",
                children: "Compose Message"
              }
            )
          ] }) : /* @__PURE__ */ jsx(SentList, { messages: props.sent, onDelete: deleteMessage }) }),
          props.role === "coach" && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex gap-1 bg-gray-100 p-1 rounded-xl w-fit", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => setCoachTab("inbox"),
                  className: `px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${coachTab === "inbox" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`,
                  children: [
                    "Inbox",
                    props.inbox.filter((m) => !m.is_read).length > 0 && /* @__PURE__ */ jsx("span", { className: "ml-1.5 px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-black rounded-full", children: props.inbox.filter((m) => !m.is_read).length })
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setCoachTab("sent"),
                  className: `px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${coachTab === "sent" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`,
                  children: "Sent"
                }
              )
            ] }),
            coachTab === "inbox" && /* @__PURE__ */ jsx(InboxList, { messages: props.inbox }),
            coachTab === "sent" && (props.sent.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm py-12 text-center", children: [
              /* @__PURE__ */ jsx("p", { className: "font-bold text-gray-900 text-sm", children: "No messages sent yet" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-1 mb-4", children: "Send a message to your athletes." }),
              /* @__PURE__ */ jsx("button", { onClick: () => setShowCompose(true), className: "px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all", children: "Compose" })
            ] }) : /* @__PURE__ */ jsx(SentList, { messages: props.sent, onDelete: deleteMessage }))
          ] }),
          props.role === "athlete" && /* @__PURE__ */ jsx(InboxList, { messages: props.messages })
        ] }) }),
        showCompose && canCompose && /* @__PURE__ */ jsx(
          ComposeModal,
          {
            groups: props.groups,
            athletes: props.athletes,
            coaches: props.role === "manager" ? props.coaches : [],
            isManager: props.role === "manager",
            onClose: () => setShowCompose(false)
          }
        )
      ]
    }
  );
}
export {
  MessagesIndex as default
};
