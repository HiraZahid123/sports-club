import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as Authenticated } from "./AuthenticatedLayout-D0_10pNp.js";
import { useForm, Head, router } from "@inertiajs/react";
import { useState, useRef } from "react";
import "@headlessui/react";
import "axios";
import "./ml-sports-BEC2gdiG.js";
const inputClass = "w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all";
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "";
const isFree = (e) => !e.price || parseFloat(e.price) === 0;
const SALARY_OPTIONS = [
  {
    value: "free",
    icon: "🆓",
    label: "FREE",
    title: "Free — No Coach Payment",
    desc: "Coach receives no payment from this event.",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    activeBg: "border-emerald-500 bg-emerald-50/40"
  },
  {
    value: "per_athlete",
    icon: "🏃",
    label: "Per Athlete",
    title: "Option 1 — Per Athlete × Rate",
    desc: "Coach earns a fixed rate for each athlete who attended the event.",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    activeBg: "border-blue-500 bg-blue-50/40"
  },
  {
    value: "fixed",
    icon: "💰",
    label: "Fixed Amount",
    title: "Option 2 — Fixed Amount",
    desc: "Coach receives a flat fee for participating in this event, regardless of attendance.",
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
    activeBg: "border-indigo-500 bg-indigo-50/40"
  },
  {
    value: "per_hour",
    icon: "⏱️",
    label: "Per Hour",
    title: "Option 3 — Per Hour × Event Duration",
    desc: "Coach earns an hourly rate multiplied by the event duration (start → end date hours).",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    activeBg: "border-amber-500 bg-amber-50/40"
  }
];
const SALARY_BADGE = {
  free: { label: "FREE", cls: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  per_athlete: { label: "Per Athlete", cls: "bg-blue-50 text-blue-700 border-blue-100" },
  fixed: { label: "Fixed", cls: "bg-indigo-50 text-indigo-700 border-indigo-100" },
  per_hour: { label: "Per Hour", cls: "bg-amber-50 text-amber-700 border-amber-100" }
};
function EventsIndex({ events, groups, coaches }) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const createFileRef = useRef(null);
  const editFileRef = useRef(null);
  const createForm = useForm({
    name: "",
    description: "",
    location: "",
    start_date: "",
    end_date: "",
    price: "",
    stripe_payment_link: "",
    points: "0",
    group_ids: [],
    coach_ids: [],
    pdf: null,
    remove_pdf: "0",
    coach_salary_type: "",
    coach_salary_rate: ""
  });
  const submitCreate = (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(createForm.data).forEach(([k, v]) => {
      if (k === "group_ids" || k === "coach_ids") {
        v.forEach((id) => fd.append(`${k}[]`, id));
      } else if (k === "pdf" && v instanceof File) {
        fd.append("pdf", v);
      } else if (v !== null) {
        fd.append(k, String(v));
      }
    });
    router.post(route("manager.events.store"), fd, {
      forceFormData: true,
      onSuccess: () => {
        setIsCreating(false);
        createForm.reset();
        if (createFileRef.current) createFileRef.current.value = "";
      }
    });
  };
  const editForm = useForm({
    name: "",
    description: "",
    location: "",
    start_date: "",
    end_date: "",
    price: "",
    stripe_payment_link: "",
    points: "0",
    group_ids: [],
    coach_ids: [],
    pdf: null,
    remove_pdf: "0",
    coach_salary_type: "",
    coach_salary_rate: ""
  });
  const openEdit = (ev) => {
    editForm.setData({
      name: ev.name,
      description: ev.description ?? "",
      location: ev.location ?? "",
      start_date: ev.start_date?.split("T")[0] ?? "",
      end_date: ev.end_date?.split("T")[0] ?? "",
      price: ev.price ?? "",
      stripe_payment_link: ev.stripe_payment_link ?? "",
      points: String(ev.points),
      group_ids: ev.groups.map((g) => String(g.id)),
      coach_ids: ev.coaches.map((c) => String(c.id)),
      pdf: null,
      remove_pdf: "0",
      coach_salary_type: ev.coach_salary_type ?? "",
      coach_salary_rate: ev.coach_salary_rate ?? ""
    });
    setEditingEvent(ev);
    setIsCreating(false);
    if (editFileRef.current) editFileRef.current.value = "";
  };
  const submitEdit = (e) => {
    e.preventDefault();
    if (!editingEvent) return;
    const fd = new FormData();
    Object.entries(editForm.data).forEach(([k, v]) => {
      if (k === "group_ids" || k === "coach_ids") {
        v.forEach((id) => fd.append(`${k}[]`, id));
      } else if (k === "pdf" && v instanceof File) {
        fd.append("pdf", v);
      } else if (v !== null) {
        fd.append(k, String(v));
      }
    });
    router.post(route("manager.events.update", editingEvent.id), fd, {
      forceFormData: true,
      onSuccess: () => {
        setEditingEvent(null);
        editForm.reset();
        if (editFileRef.current) editFileRef.current.value = "";
      }
    });
  };
  const handleDelete = (ev) => {
    if (!confirm(`Delete event "${ev.name}"? This cannot be undone.`)) return;
    setDeleting(ev.id);
    router.delete(route("manager.events.destroy", ev.id), {
      onFinish: () => setDeleting(null)
    });
  };
  const GroupToggle = ({ id, form }) => {
    const active = form.data.group_ids.includes(String(id));
    const g = groups.find((x) => x.id === id);
    const toggle = () => {
      const cur = form.data.group_ids;
      form.setData({ ...form.data, group_ids: active ? cur.filter((x) => x !== String(id)) : [...cur, String(id)] });
    };
    return /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: toggle,
        className: `px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${active ? "bg-indigo-600 text-white border-indigo-600" : "bg-gray-50 text-gray-600 border-gray-200 hover:border-indigo-300"}`,
        children: g.name
      }
    );
  };
  const CoachToggle = ({ id, form }) => {
    const active = form.data.coach_ids.includes(String(id));
    const c = coaches.find((x) => x.id === id);
    const toggle = () => {
      const cur = form.data.coach_ids;
      form.setData({ ...form.data, coach_ids: active ? cur.filter((x) => x !== String(id)) : [...cur, String(id)] });
    };
    return /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: toggle,
        className: `px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${active ? "bg-emerald-600 text-white border-emerald-600" : "bg-gray-50 text-gray-600 border-gray-200 hover:border-emerald-300"}`,
        children: c.name
      }
    );
  };
  const CoachSalarySection = ({ form }) => {
    const type = form.data.coach_salary_type;
    const rate = Number(form.data.coach_salary_rate) || 0;
    const hasCoaches = form.data.coach_ids.length > 0;
    const startDate = form.data.start_date ? new Date(form.data.start_date) : null;
    const endDate = form.data.end_date ? new Date(form.data.end_date) : null;
    const eventDays = startDate && endDate ? Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / 864e5) + 1) : 1;
    return /* @__PURE__ */ jsxs("div", { className: "border border-gray-100 rounded-2xl overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-slate-50 to-gray-50 px-5 py-3.5 border-b border-gray-100 flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsx("div", { className: "w-7 h-7 bg-emerald-100 rounded-lg flex items-center justify-center text-sm", children: "💼" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-gray-700 uppercase tracking-wide", children: "Coach Revenue / Salary" }),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] text-gray-400 mt-0.5", children: hasCoaches ? `${form.data.coach_ids.length} coach${form.data.coach_ids.length !== 1 ? "es" : ""} assigned — set their event pay` : "Assign coaches above first" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-5 space-y-4", children: [
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2.5", children: SALARY_OPTIONS.map((opt) => {
          const isActive = type === opt.value;
          return /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => form.setData({
                ...form.data,
                coach_salary_type: isActive ? "" : opt.value,
                coach_salary_rate: isActive ? "" : form.data.coach_salary_rate
              }),
              className: `flex items-start gap-2.5 p-3.5 rounded-xl border-2 text-left transition-all hover:shadow-sm ${isActive ? opt.activeBg + " shadow-sm" : "border-gray-100 bg-gray-50/50 hover:border-gray-200"}`,
              children: [
                /* @__PURE__ */ jsx("span", { className: "text-lg leading-none mt-0.5 shrink-0", children: opt.icon }),
                /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsx("p", { className: `text-xs font-bold ${isActive ? "text-gray-900" : "text-gray-700"}`, children: opt.title }),
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] text-gray-400 mt-0.5 leading-snug", children: opt.desc })
                ] }),
                isActive && /* @__PURE__ */ jsx("span", { className: "ml-auto shrink-0 w-4 h-4 rounded-full bg-indigo-600 flex items-center justify-center", children: /* @__PURE__ */ jsx("svg", { className: "w-2.5 h-2.5 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 3, d: "M5 13l4 4L19 7" }) }) })
              ]
            },
            opt.value
          );
        }) }),
        type && type !== "free" && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5", children: [
            type === "per_athlete" && "Rate per Athlete (€)",
            type === "fixed" && "Fixed Amount per Coach (€)",
            type === "per_hour" && "Rate per Hour (€)"
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              min: "0",
              step: "0.01",
              value: form.data.coach_salary_rate,
              onChange: (e) => form.setData({ ...form.data, coach_salary_rate: e.target.value }),
              placeholder: "0.00",
              className: inputClass
            }
          )
        ] }),
        type && type !== "free" && rate > 0 && /* @__PURE__ */ jsxs("div", { className: `rounded-xl p-3.5 border text-xs space-y-1.5 ${type === "per_athlete" ? "bg-blue-50 border-blue-100 text-blue-900" : type === "fixed" ? "bg-indigo-50 border-indigo-100 text-indigo-900" : "bg-amber-50 border-amber-100 text-amber-900"}`, children: [
          /* @__PURE__ */ jsx("p", { className: "font-bold text-[10px] uppercase tracking-wide opacity-60 mb-2", children: "Preview (per coach)" }),
          type === "per_athlete" && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsx("span", { children: "Attending athletes (est.):" }),
              /* @__PURE__ */ jsx("span", { className: "font-bold", children: "?" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsx("span", { children: "× Rate:" }),
              /* @__PURE__ */ jsxs("span", { className: "font-bold", children: [
                "€",
                rate.toFixed(2)
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between border-t border-current/20 pt-1 font-black text-sm", children: [
              /* @__PURE__ */ jsx("span", { children: "Total per coach:" }),
              /* @__PURE__ */ jsxs("span", { children: [
                "€",
                rate.toFixed(2),
                " × athletes"
              ] })
            ] })
          ] }),
          type === "fixed" && /* @__PURE__ */ jsxs("div", { className: "flex justify-between font-black text-sm", children: [
            /* @__PURE__ */ jsx("span", { children: "Flat fee per coach:" }),
            /* @__PURE__ */ jsxs("span", { children: [
              "€",
              rate.toFixed(2)
            ] })
          ] }),
          type === "per_hour" && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsx("span", { children: "Event days:" }),
              /* @__PURE__ */ jsx("span", { className: "font-bold", children: eventDays })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsx("span", { children: "× 8 hrs/day × Rate:" }),
              /* @__PURE__ */ jsxs("span", { className: "font-bold", children: [
                "€",
                rate.toFixed(2)
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between border-t border-current/20 pt-1 font-black text-sm", children: [
              /* @__PURE__ */ jsx("span", { children: "Est. per coach:" }),
              /* @__PURE__ */ jsxs("span", { children: [
                "€",
                (eventDays * 8 * rate).toFixed(2)
              ] })
            ] })
          ] })
        ] }),
        type === "free" && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3", children: [
          /* @__PURE__ */ jsx("span", { className: "text-lg", children: "✅" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-emerald-700", children: "Coaches are volunteering — no payment for this event." })
        ] }),
        !type && /* @__PURE__ */ jsx("p", { className: "text-[10px] text-gray-400 text-center py-1", children: "Select an option above to configure coach pay for this event." })
      ] })
    ] });
  };
  const renderForm = (form, onSubmit, fileRef, editing) => {
    const showStripe = form.data.price !== "" && parseFloat(form.data.price || "0") > 0;
    return /* @__PURE__ */ jsxs("form", { onSubmit, className: "p-6 space-y-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5", children: "Event Name *" }),
          /* @__PURE__ */ jsx("input", { type: "text", value: form.data.name, onChange: (e) => form.setData({ ...form.data, name: e.target.value }), placeholder: "e.g. Regional Championship 2026", className: inputClass }),
          form.errors.name && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600", children: form.errors.name })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5", children: "Location" }),
          /* @__PURE__ */ jsx("input", { type: "text", value: form.data.location, onChange: (e) => form.setData({ ...form.data, location: e.target.value }), placeholder: "e.g. Sports Hall A, Dublin", className: inputClass })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5", children: "Start Date *" }),
          /* @__PURE__ */ jsx("input", { type: "date", value: form.data.start_date, onChange: (e) => form.setData({ ...form.data, start_date: e.target.value }), className: inputClass }),
          form.errors.start_date && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600", children: form.errors.start_date })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5", children: "End Date" }),
          /* @__PURE__ */ jsx("input", { type: "date", value: form.data.end_date, onChange: (e) => form.setData({ ...form.data, end_date: e.target.value }), className: inputClass })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-5", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5", children: "Price (€) — blank = free" }),
          /* @__PURE__ */ jsx("input", { type: "number", min: "0", step: "0.01", value: form.data.price, onChange: (e) => form.setData({ ...form.data, price: e.target.value }), placeholder: "0.00", className: inputClass })
        ] }),
        showStripe && /* @__PURE__ */ jsxs("div", { className: "md:col-span-2", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5", children: "Stripe Payment Link *" }),
          /* @__PURE__ */ jsx("input", { type: "url", value: form.data.stripe_payment_link, onChange: (e) => form.setData({ ...form.data, stripe_payment_link: e.target.value }), placeholder: "https://buy.stripe.com/…", className: inputClass }),
          form.errors.stripe_payment_link && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600", children: form.errors.stripe_payment_link })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5", children: "Points Awarded *" }),
          /* @__PURE__ */ jsx("input", { type: "number", min: "0", value: form.data.points, onChange: (e) => form.setData({ ...form.data, points: e.target.value }), placeholder: "10", className: inputClass }),
          form.errors.points && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600", children: form.errors.points })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5", children: "Description" }),
        /* @__PURE__ */ jsx("textarea", { value: form.data.description, onChange: (e) => form.setData({ ...form.data, description: e.target.value }), rows: 3, placeholder: "Event details, rules, schedule…", className: inputClass })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5", children: "Event PDF (optional)" }),
        editing?.pdf_url && form.data.remove_pdf !== "1" && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-2 p-3 bg-amber-50 border border-amber-100 rounded-xl", children: [
          /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 text-amber-500 shrink-0", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" }) }),
          /* @__PURE__ */ jsx("a", { href: editing.pdf_url, target: "_blank", rel: "noopener", className: "text-xs font-semibold text-amber-700 hover:underline truncate", children: "Current PDF attached" }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => form.setData({ ...form.data, remove_pdf: "1" }), className: "ml-auto text-xs text-red-500 hover:text-red-700 font-semibold", children: "Remove" })
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            ref: fileRef,
            type: "file",
            accept: ".pdf",
            onChange: (e) => form.setData({ ...form.data, pdf: e.target.files?.[0] ?? null }),
            className: "w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-indigo-50 file:text-indigo-700 file:text-xs file:font-semibold hover:file:bg-indigo-100 transition-all"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2", children: [
          "Visible to Groups * ",
          /* @__PURE__ */ jsx("span", { className: "text-gray-400 font-normal normal-case", children: "(select at least one)" })
        ] }),
        groups.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 italic", children: "No groups yet — create groups first." }) : /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: groups.map((g) => /* @__PURE__ */ jsx(GroupToggle, { id: g.id, form }, g.id)) }),
        form.errors.group_ids && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600", children: form.errors.group_ids })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2", children: "Assigned Coaches" }),
        coaches.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 italic", children: "No coaches in this club yet." }) : /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: coaches.map((c) => /* @__PURE__ */ jsx(CoachToggle, { id: c.id, form }, c.id)) })
      ] }),
      /* @__PURE__ */ jsx(CoachSalarySection, { form }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3 pt-2 border-t border-gray-100", children: [
        /* @__PURE__ */ jsx("button", { type: "button", onClick: () => {
          setIsCreating(false);
          setEditingEvent(null);
        }, className: "px-5 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-all", children: "Cancel" }),
        /* @__PURE__ */ jsx("button", { type: "submit", disabled: form.processing, className: "px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-sm", children: form.processing ? "Saving…" : editing ? "Save Changes" : "Create Event" })
      ] })
    ] });
  };
  return /* @__PURE__ */ jsxs(
    Authenticated,
    {
      header: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Events" }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500 mt-0.5", children: [
            events.length,
            " event",
            events.length !== 1 ? "s" : ""
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              setIsCreating(!isCreating);
              setEditingEvent(null);
            },
            className: `inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${isCreating ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200"}`,
            children: isCreating ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }),
              "Cancel"
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) }),
              "New Event"
            ] })
          }
        )
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Events" }),
        /* @__PURE__ */ jsx("div", { className: "py-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6", children: [
          isCreating && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-indigo-100", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-indigo-900", children: "Create New Event" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-indigo-600 mt-0.5", children: "Set up a club event for your athletes" })
            ] }),
            renderForm(createForm, submitCreate, createFileRef, null)
          ] }),
          editingEvent && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-amber-100 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-amber-900", children: [
                  "Edit Event — ",
                  editingEvent.name
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-amber-600 mt-0.5", children: "Update event details" })
              ] }),
              /* @__PURE__ */ jsx("button", { onClick: () => setEditingEvent(null), className: "text-amber-400 hover:text-amber-600 transition-colors", children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })
            ] }),
            renderForm(editForm, submitEdit, editFileRef, editingEvent)
          ] }),
          events.length === 0 && !isCreating ? /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4", children: "🏅" }),
            /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-900 mb-1", children: "No events yet" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mb-5", children: "Create your first event to engage athletes and award points." }),
            /* @__PURE__ */ jsx("button", { onClick: () => setIsCreating(true), className: "px-5 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-sm", children: "Create First Event" })
          ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5", children: events.map((ev) => {
            const free = isFree(ev);
            const isEdit = editingEvent?.id === ev.id;
            const salaryBadge = ev.coach_salary_type ? SALARY_BADGE[ev.coach_salary_type] : null;
            return /* @__PURE__ */ jsxs("div", { className: `bg-white rounded-2xl border shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden ${isEdit ? "border-amber-300 ring-2 ring-amber-200" : "border-gray-100"}`, children: [
              /* @__PURE__ */ jsxs("div", { className: "p-5 flex-1 space-y-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-gray-900 leading-tight", children: ev.name }),
                  /* @__PURE__ */ jsx("span", { className: `shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold ${free ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-amber-50 text-amber-700 border border-amber-100"}`, children: free ? "Free" : `€${parseFloat(ev.price).toFixed(2)}` })
                ] }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-indigo-600 font-semibold flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }) }),
                  fmtDate(ev.start_date),
                  ev.end_date && ev.end_date !== ev.start_date ? ` – ${fmtDate(ev.end_date)}` : ""
                ] }),
                ev.location && /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500 flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxs("svg", { className: "w-3.5 h-3.5 text-gray-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: [
                    /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" }),
                    /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 11a3 3 0 11-6 0 3 3 0 016 0z" })
                  ] }),
                  ev.location
                ] }),
                ev.description && /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 line-clamp-2", children: ev.description }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
                  /* @__PURE__ */ jsxs("div", { className: "bg-indigo-50 rounded-xl p-2.5 text-center", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-lg font-black text-indigo-700", children: ev.points }),
                    /* @__PURE__ */ jsx("p", { className: "text-[10px] text-indigo-500 font-semibold uppercase tracking-wide", children: "Points" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "bg-blue-50 rounded-xl p-2.5 text-center", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-lg font-black text-blue-700", children: ev.registrations_count }),
                    /* @__PURE__ */ jsx("p", { className: "text-[10px] text-blue-500 font-semibold uppercase tracking-wide", children: "Registered" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "bg-emerald-50 rounded-xl p-2.5 text-center", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-lg font-black text-emerald-700", children: ev.attended_count }),
                    /* @__PURE__ */ jsx("p", { className: "text-[10px] text-emerald-500 font-semibold uppercase tracking-wide", children: "Attended" })
                  ] })
                ] }),
                salaryBadge && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-gray-400 uppercase tracking-wide", children: "Coach Pay:" }),
                  /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${salaryBadge.cls}`, children: [
                    salaryBadge.label,
                    ev.coach_salary_rate && ev.coach_salary_type !== "free" && ` · €${parseFloat(ev.coach_salary_rate).toFixed(2)}`
                  ] })
                ] }),
                ev.groups.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1", children: "Groups" }),
                  /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1", children: ev.groups.map((g) => /* @__PURE__ */ jsx("span", { className: "px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-semibold rounded-md", children: g.name }, g.id)) })
                ] }),
                ev.coaches.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1", children: "Coaches" }),
                  /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1", children: ev.coaches.map((c) => /* @__PURE__ */ jsx("span", { className: "px-2 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-semibold rounded-md", children: c.name }, c.id)) })
                ] }),
                ev.pdf_url && /* @__PURE__ */ jsxs("a", { href: ev.pdf_url, target: "_blank", rel: "noopener", className: "inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-800 font-semibold", children: [
                  /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" }) }),
                  "View PDF"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "px-5 py-3 bg-slate-50 border-t border-gray-100 flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs("button", { onClick: () => openEdit(ev), className: "inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors", children: [
                  /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" }) }),
                  "Edit"
                ] }),
                /* @__PURE__ */ jsxs("button", { onClick: () => handleDelete(ev), disabled: deleting === ev.id, className: "inline-flex items-center gap-1 text-xs font-semibold text-red-400 hover:text-red-600 transition-colors disabled:opacity-50", children: [
                  /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }),
                  deleting === ev.id ? "Deleting…" : "Delete"
                ] })
              ] })
            ] }, ev.id);
          }) })
        ] }) })
      ]
    }
  );
}
export {
  EventsIndex as default
};
