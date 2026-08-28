import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as Authenticated } from "./AuthenticatedLayout-DCg19vub.js";
import { useForm, Head } from "@inertiajs/react";
import { useState } from "react";
import "@headlessui/react";
import "axios";
import "./ml-sports-BsguC5B3.js";
function PointsSetup({ categories, settings }) {
  const settingsForm = useForm({
    regular_training_points: settings.regular_training_points,
    points_reset_date: settings.points_reset_date ?? ""
  });
  const submitSettings = (e) => {
    e.preventDefault();
    settingsForm.post(route("manager.points.settings"), {
      preserveScroll: true
    });
  };
  const resetForm = useForm({});
  const triggerReset = () => {
    if (confirm("WARNING: Are you sure you want to reset all athletes' points to 0 now? This will archive their current points in history and can not be undone.")) {
      resetForm.post(route("manager.points.reset"), {
        preserveScroll: true
      });
    }
  };
  const [editingCategory, setEditingCategory] = useState(null);
  const categoryForm = useForm({
    name: "",
    points: 0
  });
  const editCategoryForm = useForm({
    name: "",
    points: 0
  });
  const submitCreateCategory = (e) => {
    e.preventDefault();
    categoryForm.post(route("manager.points.categories.store"), {
      preserveScroll: true,
      onSuccess: () => {
        categoryForm.reset();
      }
    });
  };
  const submitEditCategory = (e) => {
    e.preventDefault();
    if (!editingCategory) return;
    editCategoryForm.put(route("manager.points.categories.update", editingCategory.id), {
      preserveScroll: true,
      onSuccess: () => {
        setEditingCategory(null);
        editCategoryForm.reset();
      }
    });
  };
  const startEditing = (cat) => {
    setEditingCategory(cat);
    editCategoryForm.setData({
      name: cat.name,
      points: cat.points
    });
  };
  const deleteCategory = (cat) => {
    if (confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
      categoryForm.delete(route("manager.points.categories.destroy", cat.id), {
        preserveScroll: true
      });
    }
  };
  const inputClass = "w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all";
  const labelClass = "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5";
  return /* @__PURE__ */ jsxs(
    Authenticated,
    {
      header: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Points System Setup" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-0.5", children: "Configure default attendance points, reset periods, and event categories" })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Points Setup" }),
        /* @__PURE__ */ jsx("div", { className: "py-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", children: [
              /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-indigo-100 flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-indigo-900", children: "Configure Point System" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-indigo-600 mt-0.5", children: "Control default points and automation schedules" })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "text-2xl", children: "⚙️" })
              ] }),
              /* @__PURE__ */ jsxs("form", { onSubmit: submitSettings, className: "p-6 space-y-5", children: [
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: labelClass, children: "Regular Training Attendance Points" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "number",
                        min: "0",
                        value: settingsForm.data.regular_training_points,
                        onChange: (e) => settingsForm.setData("regular_training_points", Math.max(0, parseInt(e.target.value) || 0)),
                        className: inputClass,
                        placeholder: "e.g. 5"
                      }
                    ),
                    settingsForm.errors.regular_training_points && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600", children: settingsForm.errors.regular_training_points }),
                    /* @__PURE__ */ jsx("span", { className: "text-[10px] text-gray-400 mt-1 block", children: "Points awarded automatically on training present attendance." })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: labelClass, children: "Automatic Points Reset Date" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "date",
                        value: settingsForm.data.points_reset_date,
                        onChange: (e) => settingsForm.setData("points_reset_date", e.target.value),
                        className: inputClass
                      }
                    ),
                    settingsForm.errors.points_reset_date && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600", children: settingsForm.errors.points_reset_date }),
                    /* @__PURE__ */ jsx("span", { className: "text-[10px] text-gray-400 mt-1 block", children: "When this date arrives, all athlete points reset to 0 & archive." })
                  ] })
                ] }),
                settings.points_period_start && /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 rounded-xl p-3 border border-slate-100 flex justify-between items-center text-xs", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-gray-500 font-medium", children: "Current Period Start Date:" }),
                  /* @__PURE__ */ jsx("span", { className: "font-mono font-bold text-gray-800", children: settings.points_period_start })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "flex justify-end pt-2", children: /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "submit",
                    disabled: settingsForm.processing,
                    className: "px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm disabled:opacity-50",
                    children: settingsForm.processing ? "Saving..." : "Save Settings"
                  }
                ) })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4 border-b border-red-100 flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-red-900", children: "Manual Reset" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-red-600 mt-0.5", children: "Immediately archive and reset scores" })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "text-2xl", children: "⚠️" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-4 flex-1 flex flex-col justify-between", children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 leading-relaxed", children: "Force a manual reset of all athletes' points. This resets their profile points back to 0, completes the current period, and saves their points in history records for historical archive lookups." }),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: triggerReset,
                    disabled: resetForm.processing,
                    className: "w-full py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-2",
                    children: [
                      "🔄 ",
                      resetForm.processing ? "Resetting..." : "Reset All Points Now"
                    ]
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", children: [
              /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 border-b border-gray-50 flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-gray-900", children: "Event Categories" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-0.5", children: "Categories with fixed points for quick setup" })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "text-lg", children: "🏅" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "divide-y divide-gray-50", children: categories.length === 0 ? /* @__PURE__ */ jsx("div", { className: "py-12 text-center text-gray-400 italic text-sm", children: "No event categories created yet. Create a category on the right." }) : categories.map((cat) => /* @__PURE__ */ jsx("div", { className: "flex justify-between items-center px-6 py-4 hover:bg-slate-50 transition-colors", children: editingCategory?.id === cat.id ? /* @__PURE__ */ jsxs("form", { onSubmit: submitEditCategory, className: "w-full flex items-center gap-3", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: editCategoryForm.data.name,
                    onChange: (e) => editCategoryForm.setData("name", e.target.value),
                    className: "flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none",
                    placeholder: "Category Name",
                    required: true
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    min: "0",
                    value: editCategoryForm.data.points,
                    onChange: (e) => editCategoryForm.setData("points", Math.max(0, parseInt(e.target.value) || 0)),
                    className: "w-20 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-center focus:ring-2 focus:ring-indigo-500 focus:outline-none",
                    placeholder: "Points",
                    required: true
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "flex gap-1.5", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "submit",
                      disabled: editCategoryForm.processing,
                      className: "px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg",
                      children: "Save"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setEditingCategory(null),
                      className: "px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-[10px] font-bold rounded-lg",
                      children: "Cancel"
                    }
                  )
                ] })
              ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-gray-900", children: cat.name }),
                  /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-lg px-2 py-0.5 mt-1", children: [
                    "⭐ ",
                    cat.points,
                    " points"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => startEditing(cat),
                      className: "px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold rounded-lg transition-colors",
                      children: "Edit"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => deleteCategory(cat),
                      className: "px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 text-xs font-semibold rounded-lg transition-colors",
                      children: "Delete"
                    }
                  )
                ] })
              ] }) }, cat.id)) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-emerald-100 flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-emerald-900", children: "Add Event Category" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-emerald-600 mt-0.5", children: "Define category parameters" })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "text-2xl", children: "✨" })
              ] }),
              /* @__PURE__ */ jsxs("form", { onSubmit: submitCreateCategory, className: "p-6 space-y-4 flex-1 flex flex-col justify-between", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: labelClass, children: "Category Name" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        value: categoryForm.data.name,
                        onChange: (e) => categoryForm.setData("name", e.target.value),
                        className: inputClass,
                        placeholder: "e.g. Category A, Local Sparring",
                        required: true
                      }
                    ),
                    categoryForm.errors.name && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600", children: categoryForm.errors.name })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: labelClass, children: "Points Given" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "number",
                        min: "0",
                        value: categoryForm.data.points || "",
                        onChange: (e) => categoryForm.setData("points", Math.max(0, parseInt(e.target.value) || 0)),
                        className: inputClass,
                        placeholder: "e.g. 50",
                        required: true
                      }
                    ),
                    categoryForm.errors.points && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600", children: categoryForm.errors.points })
                  ] })
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "submit",
                    disabled: categoryForm.processing,
                    className: "w-full mt-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-all shadow-sm disabled:opacity-50",
                    children: categoryForm.processing ? "Creating..." : "Create Category"
                  }
                )
              ] })
            ] })
          ] })
        ] }) })
      ]
    }
  );
}
export {
  PointsSetup as default
};
