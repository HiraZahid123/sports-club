import { jsxs, jsx } from "react/jsx-runtime";
import { A as Authenticated } from "./AuthenticatedLayout-D0_10pNp.js";
import { Head, useForm, router } from "@inertiajs/react";
import { useState } from "react";
import "@headlessui/react";
import "axios";
import "./ml-sports-BEC2gdiG.js";
const inputClass = "w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all";
const labelClass = "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5";
function SetupIndex({ ageCategories, facilities, status }) {
  return /* @__PURE__ */ jsxs(
    Authenticated,
    {
      header: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Club Setup" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-0.5", children: "Define age categories and facilities used across your club" })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Club Setup" }),
        /* @__PURE__ */ jsx("div", { className: "py-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6", children: [
          status && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-semibold text-emerald-700", children: [
            /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 shrink-0", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) }),
            "Saved successfully."
          ] }),
          /* @__PURE__ */ jsx(AgeCategoriesSection, { ageCategories }),
          /* @__PURE__ */ jsx(FacilitiesSection, { facilities })
        ] }) })
      ]
    }
  );
}
function AgeCategoriesSection({ ageCategories }) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const createForm = useForm({ name: "", min_age: "", max_age: "" });
  const editForm = useForm({ name: "", min_age: "", max_age: "" });
  const submitCreate = (e) => {
    e.preventDefault();
    createForm.post(route("manager.age-categories.store"), {
      onSuccess: () => {
        setIsCreating(false);
        createForm.reset();
      }
    });
  };
  const openEdit = (cat) => {
    editForm.setData({
      name: cat.name,
      min_age: cat.min_age != null ? String(cat.min_age) : "",
      max_age: cat.max_age != null ? String(cat.max_age) : ""
    });
    setEditingId(cat.id);
    setIsCreating(false);
  };
  const submitEdit = (e) => {
    e.preventDefault();
    if (!editingId) return;
    editForm.put(route("manager.age-categories.update", editingId), {
      onSuccess: () => setEditingId(null)
    });
  };
  const handleDelete = (cat) => {
    if (!confirm(`Delete age category "${cat.name}"? Groups using it will keep their other data but lose this assignment.`)) return;
    router.delete(route("manager.age-categories.destroy", cat.id));
  };
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-5 border-b border-indigo-100 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 text-lg", children: "🎯" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-indigo-900", children: "Age Categories" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-indigo-600 mt-0.5", children: "Used when creating training groups (e.g. U10, U14, Adult)" })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            setIsCreating(!isCreating);
            setEditingId(null);
          },
          className: `inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${isCreating ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200"}`,
          children: isCreating ? "Cancel" : "+ Add Category"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-4", children: [
      isCreating && /* @__PURE__ */ jsxs("form", { onSubmit: submitCreate, className: "grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 rounded-xl p-4 border border-gray-100", children: [
        /* @__PURE__ */ jsxs("div", { className: "md:col-span-2", children: [
          /* @__PURE__ */ jsx("label", { className: labelClass, children: "Name" }),
          /* @__PURE__ */ jsx("input", { type: "text", value: createForm.data.name, onChange: (e) => createForm.setData("name", e.target.value), placeholder: "e.g. U14", className: inputClass }),
          createForm.errors.name && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600", children: createForm.errors.name })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: labelClass, children: "Min Age" }),
          /* @__PURE__ */ jsx("input", { type: "number", value: createForm.data.min_age, onChange: (e) => createForm.setData("min_age", e.target.value), className: inputClass })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: labelClass, children: "Max Age" }),
          /* @__PURE__ */ jsx("input", { type: "number", value: createForm.data.max_age, onChange: (e) => createForm.setData("max_age", e.target.value), className: inputClass }),
          createForm.errors.max_age && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600", children: createForm.errors.max_age })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "md:col-span-4 flex justify-end", children: /* @__PURE__ */ jsx("button", { type: "submit", disabled: createForm.processing, className: "px-5 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-sm", children: createForm.processing ? "Saving..." : "Create Category" }) })
      ] }),
      ageCategories.length === 0 && !isCreating ? /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400 italic text-center py-6", children: "No age categories yet. Add one to use when creating training groups." }) : /* @__PURE__ */ jsx("div", { className: "space-y-2", children: ageCategories.map((cat) => /* @__PURE__ */ jsx("div", { children: editingId === cat.id ? /* @__PURE__ */ jsxs("form", { onSubmit: submitEdit, className: "grid grid-cols-1 md:grid-cols-4 gap-4 bg-amber-50 rounded-xl p-4 border border-amber-200", children: [
        /* @__PURE__ */ jsxs("div", { className: "md:col-span-2", children: [
          /* @__PURE__ */ jsx("label", { className: labelClass, children: "Name" }),
          /* @__PURE__ */ jsx("input", { type: "text", value: editForm.data.name, onChange: (e) => editForm.setData("name", e.target.value), className: inputClass })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: labelClass, children: "Min Age" }),
          /* @__PURE__ */ jsx("input", { type: "number", value: editForm.data.min_age, onChange: (e) => editForm.setData("min_age", e.target.value), className: inputClass })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: labelClass, children: "Max Age" }),
          /* @__PURE__ */ jsx("input", { type: "number", value: editForm.data.max_age, onChange: (e) => editForm.setData("max_age", e.target.value), className: inputClass })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "md:col-span-4 flex justify-end gap-2", children: [
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setEditingId(null), className: "px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-all", children: "Cancel" }),
          /* @__PURE__ */ jsx("button", { type: "submit", disabled: editForm.processing, className: "px-5 py-2 bg-amber-500 text-white text-sm font-bold rounded-xl hover:bg-amber-600 transition-all disabled:opacity-50 shadow-sm", children: editForm.processing ? "Saving..." : "Save" })
        ] })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border border-gray-100", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-gray-900", children: cat.name }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400", children: cat.min_age != null || cat.max_age != null ? `Ages ${cat.min_age ?? "0"}–${cat.max_age ?? "∞"}` : "No age range set" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => openEdit(cat), className: "text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors", children: "Edit" }),
          /* @__PURE__ */ jsx("button", { onClick: () => handleDelete(cat), className: "text-sm font-semibold text-red-400 hover:text-red-600 transition-colors", children: "Delete" })
        ] })
      ] }) }, cat.id)) })
    ] })
  ] });
}
function FacilitiesSection({ facilities }) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const createForm = useForm({ name: "", type: "", capacity: "", notes: "" });
  const editForm = useForm({ name: "", type: "", capacity: "", notes: "" });
  const submitCreate = (e) => {
    e.preventDefault();
    createForm.post(route("manager.facilities.store"), {
      onSuccess: () => {
        setIsCreating(false);
        createForm.reset();
      }
    });
  };
  const openEdit = (facility) => {
    editForm.setData({
      name: facility.name,
      type: facility.type ?? "",
      capacity: facility.capacity != null ? String(facility.capacity) : "",
      notes: facility.notes ?? ""
    });
    setEditingId(facility.id);
    setIsCreating(false);
  };
  const submitEdit = (e) => {
    e.preventDefault();
    if (!editingId) return;
    editForm.put(route("manager.facilities.update", editingId), {
      onSuccess: () => setEditingId(null)
    });
  };
  const handleDelete = (facility) => {
    if (!confirm(`Delete facility "${facility.name}"? Schedules using it will keep their other data but lose this assignment.`)) return;
    router.delete(route("manager.facilities.destroy", facility.id));
  };
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-5 border-b border-emerald-100 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 text-lg", children: "🏟️" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-emerald-900", children: "Facilities" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-emerald-600 mt-0.5", children: "Courts, fields or rooms used when scheduling training sessions" })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            setIsCreating(!isCreating);
            setEditingId(null);
          },
          className: `inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${isCreating ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-200"}`,
          children: isCreating ? "Cancel" : "+ Add Facility"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-4", children: [
      isCreating && /* @__PURE__ */ jsxs("form", { onSubmit: submitCreate, className: "grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 rounded-xl p-4 border border-gray-100", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: labelClass, children: "Name" }),
          /* @__PURE__ */ jsx("input", { type: "text", value: createForm.data.name, onChange: (e) => createForm.setData("name", e.target.value), placeholder: "e.g. Hall A", className: inputClass }),
          createForm.errors.name && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600", children: createForm.errors.name })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: labelClass, children: "Type" }),
          /* @__PURE__ */ jsx("input", { type: "text", value: createForm.data.type, onChange: (e) => createForm.setData("type", e.target.value), placeholder: "Court / Field / Room", className: inputClass })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: labelClass, children: "Capacity" }),
          /* @__PURE__ */ jsx("input", { type: "number", value: createForm.data.capacity, onChange: (e) => createForm.setData("capacity", e.target.value), className: inputClass })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: labelClass, children: "Notes" }),
          /* @__PURE__ */ jsx("input", { type: "text", value: createForm.data.notes, onChange: (e) => createForm.setData("notes", e.target.value), className: inputClass })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "md:col-span-4 flex justify-end", children: /* @__PURE__ */ jsx("button", { type: "submit", disabled: createForm.processing, className: "px-5 py-2 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-all disabled:opacity-50 shadow-sm", children: createForm.processing ? "Saving..." : "Create Facility" }) })
      ] }),
      facilities.length === 0 && !isCreating ? /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400 italic text-center py-6", children: "No facilities yet. Add one to use when scheduling training sessions." }) : /* @__PURE__ */ jsx("div", { className: "space-y-2", children: facilities.map((facility) => /* @__PURE__ */ jsx("div", { children: editingId === facility.id ? /* @__PURE__ */ jsxs("form", { onSubmit: submitEdit, className: "grid grid-cols-1 md:grid-cols-4 gap-4 bg-amber-50 rounded-xl p-4 border border-amber-200", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: labelClass, children: "Name" }),
          /* @__PURE__ */ jsx("input", { type: "text", value: editForm.data.name, onChange: (e) => editForm.setData("name", e.target.value), className: inputClass })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: labelClass, children: "Type" }),
          /* @__PURE__ */ jsx("input", { type: "text", value: editForm.data.type, onChange: (e) => editForm.setData("type", e.target.value), className: inputClass })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: labelClass, children: "Capacity" }),
          /* @__PURE__ */ jsx("input", { type: "number", value: editForm.data.capacity, onChange: (e) => editForm.setData("capacity", e.target.value), className: inputClass })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: labelClass, children: "Notes" }),
          /* @__PURE__ */ jsx("input", { type: "text", value: editForm.data.notes, onChange: (e) => editForm.setData("notes", e.target.value), className: inputClass })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "md:col-span-4 flex justify-end gap-2", children: [
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setEditingId(null), className: "px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-all", children: "Cancel" }),
          /* @__PURE__ */ jsx("button", { type: "submit", disabled: editForm.processing, className: "px-5 py-2 bg-amber-500 text-white text-sm font-bold rounded-xl hover:bg-amber-600 transition-all disabled:opacity-50 shadow-sm", children: editForm.processing ? "Saving..." : "Save" })
        ] })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border border-gray-100", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-gray-900", children: facility.name }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400", children: [facility.type, facility.capacity ? `Capacity ${facility.capacity}` : null].filter(Boolean).join(" · ") || "No details set" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => openEdit(facility), className: "text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors", children: "Edit" }),
          /* @__PURE__ */ jsx("button", { onClick: () => handleDelete(facility), className: "text-sm font-semibold text-red-400 hover:text-red-600 transition-colors", children: "Delete" })
        ] })
      ] }) }, facility.id)) })
    ] })
  ] });
}
export {
  SetupIndex as default
};
