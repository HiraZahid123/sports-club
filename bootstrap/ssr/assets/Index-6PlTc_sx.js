import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as Authenticated } from "./AuthenticatedLayout-DcfkJEmD.js";
import { useForm, Head, router } from "@inertiajs/react";
import { useState } from "react";
import "@headlessui/react";
import "axios";
import "./ml-sports-BEC2gdiG.js";
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAY_SHORT = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun"
};
const DAY_COLOR = {
  Monday: "bg-indigo-100 text-indigo-700",
  Tuesday: "bg-purple-100 text-purple-700",
  Wednesday: "bg-blue-100   text-blue-700",
  Thursday: "bg-cyan-100   text-cyan-700",
  Friday: "bg-emerald-100 text-emerald-700",
  Saturday: "bg-amber-100  text-amber-700",
  Sunday: "bg-rose-100   text-rose-700"
};
const skillConfig = {
  Beginner: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  Intermediate: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  Advanced: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
  Elite: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" }
};
const inputClass = "w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all";
const smallInput = "w-full rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 text-xs text-gray-800 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400/20 transition-all";
const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));
const timeSelectClass = "w-[48px] text-center rounded-lg border border-gray-200 bg-gray-50 px-1 py-1.5 text-xs text-gray-800 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400/20 transition-all cursor-pointer";
const fmt24 = (t) => {
  if (!t) return "";
  const parts = t.split(":");
  return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}`;
};
const blankSlot = () => ({
  day_of_week: "Monday",
  start_time: "09:00",
  end_time: "10:00",
  location: "",
  notes: "",
  facility_id: ""
});
function GroupsIndex({ groups, coaches, athletes, ageCategories, facilities }) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [scheduleSlots, setScheduleSlots] = useState([]);
  const [scheduleSaving, setScheduleSaving] = useState(false);
  const createForm = useForm({
    name: "",
    description: "",
    monthly_price: "",
    capacity: "",
    skill_level: "Beginner",
    age_category_id: ""
  });
  const submitCreate = (e) => {
    e.preventDefault();
    createForm.post(route("manager.groups.store"), {
      onSuccess: () => {
        setIsCreating(false);
        createForm.reset();
      }
    });
  };
  const editForm = useForm({
    name: "",
    description: "",
    monthly_price: "",
    capacity: "",
    skill_level: "Beginner",
    age_category_id: ""
  });
  const openEdit = (group) => {
    editForm.setData({
      name: group.name,
      description: group.description ?? "",
      monthly_price: group.monthly_price,
      capacity: group.capacity ? String(group.capacity) : "",
      skill_level: group.skill_level ?? "Beginner",
      age_category_id: group.age_category_id ? String(group.age_category_id) : ""
    });
    setScheduleSlots(
      group.schedules.length > 0 ? group.schedules.map((s) => ({
        ...s,
        start_time: s.start_time ? s.start_time.substring(0, 5) : "",
        end_time: s.end_time ? s.end_time.substring(0, 5) : "",
        facility_id: s.facility_id ? String(s.facility_id) : ""
      })) : []
    );
    setEditingGroup(group);
    setIsCreating(false);
  };
  const submitEdit = (e) => {
    e.preventDefault();
    if (!editingGroup) return;
    editForm.put(route("manager.groups.update", editingGroup.id), {
      onSuccess: () => {
        setEditingGroup(null);
        editForm.reset();
      }
    });
  };
  const handleAssignCoach = (groupId, coachId) => {
    if (!coachId) return;
    router.post(
      route("manager.groups.assign", groupId),
      { user_id: coachId, role_in_group: "Coach" },
      {
        preserveScroll: true,
        onSuccess: (page) => {
          const updated = page.props.groups.find((g) => g.id === groupId);
          if (updated) setEditingGroup(updated);
        }
      }
    );
  };
  const handleRemoveCoach = (groupId, coachId, coachName) => {
    if (!confirm(`Remove Coach ${coachName} from this group?`)) return;
    router.post(
      route("manager.groups.remove", groupId),
      { user_id: coachId },
      {
        preserveScroll: true,
        onSuccess: (page) => {
          const updated = page.props.groups.find((g) => g.id === groupId);
          if (updated) setEditingGroup(updated);
        }
      }
    );
  };
  const handleAssignAthlete = (groupId, athleteId) => {
    if (!athleteId) return;
    router.post(
      route("manager.groups.assign", groupId),
      { user_id: athleteId, role_in_group: "Athlete" },
      {
        preserveScroll: true,
        onSuccess: (page) => {
          const updated = page.props.groups.find((g) => g.id === groupId);
          if (updated) setEditingGroup(updated);
        }
      }
    );
  };
  const handleRemoveAthlete = (groupId, athleteId, athleteName) => {
    if (!confirm(`Remove ${athleteName} from this group?`)) return;
    router.post(
      route("manager.groups.remove", groupId),
      { user_id: athleteId },
      {
        preserveScroll: true,
        onSuccess: (page) => {
          const updated = page.props.groups.find((g) => g.id === groupId);
          if (updated) setEditingGroup(updated);
        }
      }
    );
  };
  const handleMoveAthlete = (fromGroupId, toGroupId, athleteId) => {
    if (!toGroupId) return;
    router.post(
      route("manager.groups.remove", fromGroupId),
      { user_id: athleteId },
      {
        preserveScroll: true,
        onSuccess: () => {
          router.post(
            route("manager.groups.assign", toGroupId),
            { user_id: athleteId, role_in_group: "Athlete" },
            {
              preserveScroll: true,
              onSuccess: (page) => {
                const updated = page.props.groups.find((g) => g.id === fromGroupId);
                if (updated) setEditingGroup(updated);
              }
            }
          );
        }
      }
    );
  };
  const addSlot = () => setScheduleSlots((prev) => [...prev, blankSlot()]);
  const removeSlot = (idx) => setScheduleSlots((prev) => prev.filter((_, i) => i !== idx));
  const updateSlot = (idx, field, value) => setScheduleSlots((prev) => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  const saveSchedule = () => {
    if (!editingGroup) return;
    setScheduleSaving(true);
    router.post(
      route("manager.groups.schedule", editingGroup.id),
      { schedules: scheduleSlots },
      {
        preserveScroll: true,
        onSuccess: (page) => {
          const updated = page.props.groups.find((g) => g.id === editingGroup.id);
          if (updated) {
            setEditingGroup(updated);
            setScheduleSlots(updated.schedules.map((s) => ({
              ...s,
              start_time: s.start_time ? s.start_time.substring(0, 5) : "",
              end_time: s.end_time ? s.end_time.substring(0, 5) : ""
            })));
          }
          setScheduleSaving(false);
        },
        onError: (errors) => {
          setScheduleSaving(false);
          const firstError = Object.values(errors)[0];
          if (firstError) {
            alert(firstError);
          }
        }
      }
    );
  };
  return /* @__PURE__ */ jsxs(
    Authenticated,
    {
      header: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Training Groups" }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500 mt-0.5", children: [
            groups.length,
            " groups active"
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              setIsCreating(!isCreating);
              setEditingGroup(null);
            },
            className: `inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${isCreating ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200"}`,
            children: isCreating ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }),
              "Cancel"
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) }),
              "New Group"
            ] })
          }
        )
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Training Groups" }),
        /* @__PURE__ */ jsx("div", { className: "py-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6", children: [
          isCreating && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-indigo-100", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-indigo-900", children: "Create Training Group" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-indigo-600 mt-0.5", children: "Define a new group for your club members" })
            ] }),
            /* @__PURE__ */ jsxs("form", { onSubmit: submitCreate, className: "p-6 space-y-5", children: [
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5", children: "Group Name" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: createForm.data.name, onChange: (e) => createForm.setData("name", e.target.value), placeholder: "e.g. Juniors Elite", className: inputClass }),
                  createForm.errors.name && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600", children: createForm.errors.name })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5", children: "Monthly Price (€)" }),
                  /* @__PURE__ */ jsx("input", { type: "number", value: createForm.data.monthly_price, onChange: (e) => createForm.setData("monthly_price", e.target.value), placeholder: "0.00", className: inputClass })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-5", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5", children: "Skill Level" }),
                  /* @__PURE__ */ jsx("select", { value: createForm.data.skill_level, onChange: (e) => createForm.setData("skill_level", e.target.value), className: inputClass, children: ["Beginner", "Intermediate", "Advanced", "Elite"].map((l) => /* @__PURE__ */ jsx("option", { children: l }, l)) })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5", children: "Age Category" }),
                  /* @__PURE__ */ jsxs("select", { value: createForm.data.age_category_id, onChange: (e) => createForm.setData("age_category_id", e.target.value), className: inputClass, children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: "— None —" }),
                    ageCategories.map((c) => /* @__PURE__ */ jsxs("option", { value: c.id, children: [
                      c.name,
                      c.min_age != null || c.max_age != null ? ` (${c.min_age ?? "0"}–${c.max_age ?? "∞"})` : ""
                    ] }, c.id))
                  ] }),
                  ageCategories.length === 0 && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-gray-400", children: "No age categories yet — add some in Club Setup." })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5", children: "Max Capacity" }),
                  /* @__PURE__ */ jsx("input", { type: "number", value: createForm.data.capacity, onChange: (e) => createForm.setData("capacity", e.target.value), placeholder: "20", className: inputClass })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3", children: [
                /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setIsCreating(false), className: "px-5 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-all", children: "Cancel" }),
                /* @__PURE__ */ jsx("button", { type: "submit", disabled: createForm.processing, className: "px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-sm", children: createForm.processing ? "Saving..." : "Create Group" })
              ] })
            ] })
          ] }),
          editingGroup && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-amber-100 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-amber-900", children: [
                  "Edit Group — ",
                  editingGroup.name
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-amber-600 mt-0.5", children: "Update group info, coaches and schedule" })
              ] }),
              /* @__PURE__ */ jsx("button", { onClick: () => setEditingGroup(null), className: "text-amber-400 hover:text-amber-600 transition-colors", children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-8", children: [
              /* @__PURE__ */ jsxs("form", { onSubmit: submitEdit, className: "space-y-5", children: [
                /* @__PURE__ */ jsxs("p", { className: "text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5 text-amber-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" }) }),
                  "Group Information"
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5", children: "Group Name" }),
                    /* @__PURE__ */ jsx("input", { type: "text", value: editForm.data.name, onChange: (e) => editForm.setData("name", e.target.value), className: inputClass }),
                    editForm.errors.name && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600", children: editForm.errors.name })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5", children: "Monthly Price (€)" }),
                    /* @__PURE__ */ jsx("input", { type: "number", value: editForm.data.monthly_price, onChange: (e) => editForm.setData("monthly_price", e.target.value), className: inputClass }),
                    editForm.errors.monthly_price && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600", children: editForm.errors.monthly_price })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5", children: "Description" }),
                  /* @__PURE__ */ jsx("textarea", { value: editForm.data.description, onChange: (e) => editForm.setData("description", e.target.value), rows: 2, placeholder: "Optional description...", className: inputClass })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-5", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5", children: "Skill Level" }),
                    /* @__PURE__ */ jsx("select", { value: editForm.data.skill_level, onChange: (e) => editForm.setData("skill_level", e.target.value), className: inputClass, children: ["Beginner", "Intermediate", "Advanced", "Elite"].map((l) => /* @__PURE__ */ jsx("option", { children: l }, l)) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5", children: "Age Category" }),
                    /* @__PURE__ */ jsxs("select", { value: editForm.data.age_category_id, onChange: (e) => editForm.setData("age_category_id", e.target.value), className: inputClass, children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "— None —" }),
                      ageCategories.map((c) => /* @__PURE__ */ jsxs("option", { value: c.id, children: [
                        c.name,
                        c.min_age != null || c.max_age != null ? ` (${c.min_age ?? "0"}–${c.max_age ?? "∞"})` : ""
                      ] }, c.id))
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5", children: "Max Capacity" }),
                    /* @__PURE__ */ jsx("input", { type: "number", value: editForm.data.capacity, onChange: (e) => editForm.setData("capacity", e.target.value), placeholder: "20", className: inputClass })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3", children: [
                  /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setEditingGroup(null), className: "px-5 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-all", children: "Cancel" }),
                  /* @__PURE__ */ jsx("button", { type: "submit", disabled: editForm.processing, className: "px-6 py-2 bg-amber-500 text-white text-sm font-bold rounded-xl hover:bg-amber-600 transition-all disabled:opacity-50 shadow-sm", children: editForm.processing ? "Saving..." : "Save Group Info" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "border-t border-gray-100 pt-6", children: [
                /* @__PURE__ */ jsxs("p", { className: "text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5 text-indigo-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" }) }),
                  "Coaches"
                ] }),
                /* @__PURE__ */ jsx("div", { className: "space-y-2 mb-3", children: editingGroup.coaches.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 italic py-2 px-3 bg-gray-50 rounded-xl", children: "No coaches assigned yet." }) : editingGroup.coaches.map((coach) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
                    /* @__PURE__ */ jsx("div", { className: "w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[11px] font-bold shadow-sm shrink-0", children: coach.name.charAt(0).toUpperCase() }),
                    /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-indigo-900", children: coach.name }),
                    /* @__PURE__ */ jsx("span", { className: "text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-600 font-semibold", children: "Coach" })
                  ] }),
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => handleRemoveCoach(editingGroup.id, coach.id, coach.name),
                      className: "flex items-center gap-1 text-xs text-red-400 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded-lg transition-all font-medium",
                      children: [
                        /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }),
                        "Remove"
                      ]
                    }
                  )
                ] }, coach.id)) }),
                coaches.filter((c) => !editingGroup.coaches.some((gc) => gc.id === c.id)).length > 0 && /* @__PURE__ */ jsxs(
                  "select",
                  {
                    defaultValue: "",
                    onChange: (e) => {
                      if (e.target.value) {
                        handleAssignCoach(editingGroup.id, e.target.value);
                        e.target.value = "";
                      }
                    },
                    className: "w-full rounded-xl border border-dashed border-indigo-300 bg-indigo-50/50 px-3 py-2 text-sm text-indigo-700 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all",
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", disabled: true, children: "＋ Assign a coach to this group…" }),
                      coaches.filter((c) => !editingGroup.coaches.some((gc) => gc.id === c.id)).map((c) => /* @__PURE__ */ jsx("option", { value: c.id, children: c.name }, c.id))
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "border-t border-gray-100 pt-6", children: [
                /* @__PURE__ */ jsxs("p", { className: "text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5 text-blue-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" }) }),
                  "Athletes",
                  /* @__PURE__ */ jsx("span", { className: "ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-600 text-[10px] font-bold rounded-md", children: editingGroup.athletes.length })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "space-y-2 mb-3", children: editingGroup.athletes.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 italic py-2 px-3 bg-gray-50 rounded-xl", children: "No athletes assigned yet." }) : editingGroup.athletes.map((athlete) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between bg-blue-50 border border-blue-100 rounded-xl px-3 py-2", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
                    /* @__PURE__ */ jsx("div", { className: "w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-[11px] font-bold shadow-sm shrink-0", children: athlete.name.charAt(0).toUpperCase() }),
                    /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-blue-900 truncate", children: athlete.name })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 shrink-0 ml-3", children: [
                    groups.filter((g) => g.id !== editingGroup.id).length > 0 && /* @__PURE__ */ jsxs(
                      "select",
                      {
                        defaultValue: "",
                        onChange: (e) => {
                          if (e.target.value) {
                            handleMoveAthlete(editingGroup.id, e.target.value, athlete.id);
                            e.target.value = "";
                          }
                        },
                        className: "text-xs rounded-lg border border-blue-200 bg-white text-blue-700 px-2 py-1 focus:outline-none focus:border-blue-400 transition-all",
                        children: [
                          /* @__PURE__ */ jsx("option", { value: "", disabled: true, children: "Move to…" }),
                          groups.filter((g) => g.id !== editingGroup.id).map((g) => /* @__PURE__ */ jsx("option", { value: g.id, children: g.name }, g.id))
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => handleRemoveAthlete(editingGroup.id, athlete.id, athlete.name),
                        className: "flex items-center gap-1 text-xs text-red-400 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded-lg transition-all font-medium",
                        children: [
                          /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }),
                          "Remove"
                        ]
                      }
                    )
                  ] })
                ] }, athlete.id)) }),
                athletes.filter((a) => !editingGroup.athletes.some((ga) => ga.id === a.id)).length > 0 && /* @__PURE__ */ jsxs(
                  "select",
                  {
                    defaultValue: "",
                    onChange: (e) => {
                      if (e.target.value) {
                        handleAssignAthlete(editingGroup.id, e.target.value);
                        e.target.value = "";
                      }
                    },
                    className: "w-full rounded-xl border border-dashed border-blue-300 bg-blue-50/50 px-3 py-2 text-sm text-blue-700 focus:border-blue-500 focus:bg-white focus:outline-none transition-all",
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", disabled: true, children: "＋ Assign an athlete to this group…" }),
                      athletes.filter((a) => !editingGroup.athletes.some((ga) => ga.id === a.id)).map((a) => /* @__PURE__ */ jsx("option", { value: a.id, children: a.name }, a.id))
                    ]
                  }
                ),
                athletes.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 italic", children: "No athletes in your club yet. Add members first." })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "border-t border-gray-100 pt-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
                  /* @__PURE__ */ jsxs("p", { className: "text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5 text-emerald-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }) }),
                    "Weekly Schedule"
                  ] }),
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: addSlot,
                      className: "inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-all",
                      children: [
                        /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) }),
                        "Add Slot"
                      ]
                    }
                  )
                ] }),
                scheduleSlots.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-2xl mb-2", children: "📅" }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 font-medium", children: "No schedule yet" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 mt-1", children: 'Click "Add Slot" to add a training session' })
                ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                  /* @__PURE__ */ jsx("div", { className: "grid grid-cols-12 gap-2 px-1", children: ["Day", "Start", "End", "Location", "Notes", ""].map((h, i) => /* @__PURE__ */ jsx("p", { className: `text-[10px] font-bold text-gray-400 uppercase tracking-wide ${i === 0 ? "col-span-2" : i === 3 ? "col-span-3" : i === 4 ? "col-span-2" : i === 5 ? "col-span-1" : "col-span-2"}`, children: h }, i)) }),
                  scheduleSlots.map((slot, idx) => /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-12 gap-2 items-center bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100", children: [
                    /* @__PURE__ */ jsx("div", { className: "col-span-2", children: /* @__PURE__ */ jsx(
                      "select",
                      {
                        value: slot.day_of_week,
                        onChange: (e) => updateSlot(idx, "day_of_week", e.target.value),
                        className: smallInput,
                        children: DAYS.map((d) => /* @__PURE__ */ jsx("option", { children: d }, d))
                      }
                    ) }),
                    /* @__PURE__ */ jsxs("div", { className: "col-span-2 flex items-center justify-start gap-1", children: [
                      /* @__PURE__ */ jsx(
                        "select",
                        {
                          value: (slot.start_time || "09:00").split(":")[0] || "09",
                          onChange: (e) => {
                            const m = (slot.start_time || "09:00").split(":")[1] || "00";
                            updateSlot(idx, "start_time", `${e.target.value}:${m}`);
                          },
                          className: timeSelectClass,
                          style: { appearance: "none", WebkitAppearance: "none", MozAppearance: "none", backgroundImage: "none", paddingLeft: "4px", paddingRight: "4px" },
                          children: HOURS.map((h) => /* @__PURE__ */ jsx("option", { value: h, children: h }, h))
                        }
                      ),
                      /* @__PURE__ */ jsx("span", { className: "text-gray-400 font-bold", children: ":" }),
                      /* @__PURE__ */ jsx(
                        "select",
                        {
                          value: (slot.start_time || "09:00").split(":")[1] || "00",
                          onChange: (e) => {
                            const h = (slot.start_time || "09:00").split(":")[0] || "09";
                            updateSlot(idx, "start_time", `${h}:${e.target.value}`);
                          },
                          className: timeSelectClass,
                          style: { appearance: "none", WebkitAppearance: "none", MozAppearance: "none", backgroundImage: "none", paddingLeft: "4px", paddingRight: "4px" },
                          children: MINUTES.map((m) => /* @__PURE__ */ jsx("option", { value: m, children: m }, m))
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "col-span-2 flex items-center justify-start gap-1", children: [
                      /* @__PURE__ */ jsx(
                        "select",
                        {
                          value: (slot.end_time || "10:00").split(":")[0] || "10",
                          onChange: (e) => {
                            const m = (slot.end_time || "10:00").split(":")[1] || "00";
                            updateSlot(idx, "end_time", `${e.target.value}:${m}`);
                          },
                          className: timeSelectClass,
                          style: { appearance: "none", WebkitAppearance: "none", MozAppearance: "none", backgroundImage: "none", paddingLeft: "4px", paddingRight: "4px" },
                          children: HOURS.map((h) => /* @__PURE__ */ jsx("option", { value: h, children: h }, h))
                        }
                      ),
                      /* @__PURE__ */ jsx("span", { className: "text-gray-400 font-bold", children: ":" }),
                      /* @__PURE__ */ jsx(
                        "select",
                        {
                          value: (slot.end_time || "10:00").split(":")[1] || "00",
                          onChange: (e) => {
                            const h = (slot.end_time || "10:00").split(":")[0] || "10";
                            updateSlot(idx, "end_time", `${h}:${e.target.value}`);
                          },
                          className: timeSelectClass,
                          style: { appearance: "none", WebkitAppearance: "none", MozAppearance: "none", backgroundImage: "none", paddingLeft: "4px", paddingRight: "4px" },
                          children: MINUTES.map((m) => /* @__PURE__ */ jsx("option", { value: m, children: m }, m))
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "col-span-3", children: facilities.length > 0 ? /* @__PURE__ */ jsxs("select", { value: slot.facility_id, onChange: (e) => updateSlot(idx, "facility_id", e.target.value), className: smallInput, children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "— No facility —" }),
                      facilities.map((f) => /* @__PURE__ */ jsx("option", { value: f.id, children: f.name }, f.id))
                    ] }) : /* @__PURE__ */ jsx("input", { type: "text", value: slot.location, onChange: (e) => updateSlot(idx, "location", e.target.value), placeholder: "e.g. Hall A", className: smallInput }) }),
                    /* @__PURE__ */ jsx("div", { className: "col-span-2", children: /* @__PURE__ */ jsx("input", { type: "text", value: slot.notes, onChange: (e) => updateSlot(idx, "notes", e.target.value), placeholder: "Notes…", className: smallInput }) }),
                    /* @__PURE__ */ jsx("div", { className: "col-span-1 flex justify-center", children: /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => removeSlot(idx),
                        className: "text-gray-300 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50",
                        children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) })
                      }
                    ) })
                  ] }, idx))
                ] }),
                /* @__PURE__ */ jsx("div", { className: "flex justify-end mt-4", children: /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: saveSchedule,
                    disabled: scheduleSaving,
                    className: "inline-flex items-center gap-2 px-5 py-2 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-all disabled:opacity-50 shadow-sm",
                    children: scheduleSaving ? /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsxs("svg", { className: "w-4 h-4 animate-spin", fill: "none", viewBox: "0 0 24 24", children: [
                        /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
                        /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8v8z" })
                      ] }),
                      "Saving…"
                    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }),
                      "Save Schedule"
                    ] })
                  }
                ) })
              ] })
            ] })
          ] }),
          groups.length === 0 && !isCreating ? /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4", children: "🏆" }),
            /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-900 mb-1", children: "No training groups yet" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mb-5", children: "Create your first group to start organizing athletes." }),
            /* @__PURE__ */ jsx("button", { onClick: () => setIsCreating(true), className: "px-5 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-sm", children: "Create Your First Group" })
          ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5", children: groups.map((group) => {
            const skillStyle = skillConfig[group.skill_level] || { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200" };
            const fillRatio = group.capacity ? group.athletes_count / group.capacity : 0;
            const fillColor = fillRatio >= 0.9 ? "bg-red-400" : fillRatio >= 0.6 ? "bg-amber-400" : "bg-emerald-400";
            const isEditing = editingGroup?.id === group.id;
            return /* @__PURE__ */ jsxs("div", { className: `bg-white rounded-2xl border shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden ${isEditing ? "border-amber-300 ring-2 ring-amber-200" : "border-gray-100"}`, children: [
              /* @__PURE__ */ jsxs("div", { className: "p-6 flex-1", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-3", children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-gray-900 leading-tight", children: group.name }),
                  /* @__PURE__ */ jsx("span", { className: `ml-2 shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold border ${skillStyle.bg} ${skillStyle.text} ${skillStyle.border}`, children: group.skill_level })
                ] }),
                (group.age_category?.name || group.age_range) && /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-400 font-medium mb-3", children: [
                  "Ages: ",
                  group.age_category?.name ?? group.age_range
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mb-5 line-clamp-2 leading-relaxed", children: group.description || "No description provided." }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 mb-5", children: [
                  /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 rounded-xl p-3", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1", children: "Athletes" }),
                    /* @__PURE__ */ jsxs("p", { className: "text-xl font-black text-gray-900", children: [
                      group.athletes_count,
                      /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium text-gray-400", children: [
                        "/",
                        group.capacity || "∞"
                      ] })
                    ] }),
                    group.capacity > 0 && /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-200 rounded-full h-1.5 mt-2", children: /* @__PURE__ */ jsx("div", { className: `h-1.5 rounded-full ${fillColor} transition-all`, style: { width: `${Math.min(fillRatio * 100, 100)}%` } }) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "bg-emerald-50 rounded-xl p-3", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1", children: "Monthly Fee" }),
                    /* @__PURE__ */ jsxs("p", { className: "text-xl font-black text-emerald-700", children: [
                      "€",
                      group.monthly_price
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2", children: "Coaches" }),
                  group.coaches.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 italic", children: "No coaches assigned" }) : /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: group.coaches.map((coach) => /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-medium px-2.5 py-1 rounded-full", children: [
                    /* @__PURE__ */ jsx("span", { className: "w-4 h-4 rounded-full bg-indigo-500 text-white text-[9px] font-bold flex items-center justify-center shrink-0", children: coach.name.charAt(0).toUpperCase() }),
                    coach.name
                  ] }, coach.id)) })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2", children: "Schedule" }),
                  group.schedules.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 italic", children: "No schedule set" }) : /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: group.schedules.map((s, i) => /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg ${DAY_COLOR[s.day_of_week] ?? "bg-gray-100 text-gray-600"}`, children: [
                    /* @__PURE__ */ jsx("span", { children: DAY_SHORT[s.day_of_week] }),
                    /* @__PURE__ */ jsxs("span", { className: "opacity-70", children: [
                      fmt24(s.start_time),
                      "–",
                      fmt24(s.end_time)
                    ] }),
                    (s.facility?.name || s.location) && /* @__PURE__ */ jsxs("span", { className: "opacity-60", children: [
                      "· ",
                      s.facility?.name ?? s.location
                    ] })
                  ] }, i)) })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "px-6 py-3.5 bg-slate-50 border-t border-gray-100 flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: () => openEdit(group),
                    className: "inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors",
                    children: [
                      /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" }) }),
                      "Edit Group"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-300 font-medium", children: [
                  "ID #",
                  group.id
                ] })
              ] })
            ] }, group.id);
          }) })
        ] }) })
      ]
    }
  );
}
export {
  GroupsIndex as default
};
