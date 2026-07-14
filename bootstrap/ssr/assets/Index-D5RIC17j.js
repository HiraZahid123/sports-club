import { jsxs, jsx } from "react/jsx-runtime";
import { A as Authenticated } from "./AuthenticatedLayout-CkiyEXrL.js";
import { Head } from "@inertiajs/react";
import { useState, useEffect } from "react";
import axios from "axios";
import "@headlessui/react";
import "./ml-sports-BEC2gdiG.js";
function ManagerAttendance({
  groups = [],
  selectedGroupId: initialGroupId = "",
  date: initialDate = ""
}) {
  const [selectedGroupId, setSelectedGroupId] = useState(
    initialGroupId ? String(initialGroupId) : groups.length > 0 ? String(groups[0].id) : ""
  );
  const [attendanceDate, setAttendanceDate] = useState(
    initialDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
  );
  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const loadAttendance = () => {
    if (!selectedGroupId || !attendanceDate) return;
    setLoading(true);
    setMessage(null);
    axios.get(route("manager.attendance.load"), {
      params: {
        group_id: selectedGroupId,
        date: attendanceDate
      }
    }).then((res) => {
      setAttendanceList(res.data.attendance);
    }).catch((err) => {
      console.error(err);
      setMessage({ type: "error", text: "Failed to load attendance records." });
    }).finally(() => {
      setLoading(false);
    });
  };
  useEffect(() => {
    loadAttendance();
  }, [selectedGroupId, attendanceDate]);
  const handleStatusChange = (athleteId, status) => {
    setAttendanceList((prev) => prev.map(
      (item) => item.athlete_id === athleteId ? { ...item, status } : item
    ));
  };
  const handlePointsChange = (athleteId, field, value) => {
    setAttendanceList((prev) => prev.map(
      (item) => item.athlete_id === athleteId ? { ...item, [field]: value } : item
    ));
  };
  const submitAttendance = (e) => {
    e.preventDefault();
    if (attendanceList.length === 0) return;
    setSubmitting(true);
    setMessage(null);
    axios.post(route("manager.attendance.save"), {
      training_group_id: Number(selectedGroupId),
      attendance_date: attendanceDate,
      attendance_data: attendanceList
    }).then((res) => {
      setMessage({ type: "success", text: "Attendance saved and athlete points updated successfully!" });
    }).catch((err) => {
      console.error(err);
      setMessage({ type: "error", text: "Failed to save attendance logs. Please check your data." });
    }).finally(() => {
      setSubmitting(false);
    });
  };
  return /* @__PURE__ */ jsxs(
    Authenticated,
    {
      header: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Training Attendance" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-0.5", children: "Manage training logs and adjust athlete points across all groups" })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Manager - Training Attendance" }),
        /* @__PURE__ */ jsx("div", { className: "py-8", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-slate-50 to-indigo-50/30 px-6 py-4 border-b border-gray-150 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-slate-800", children: "Track and Award Points" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mt-0.5", children: "Managers have full access to add or remove training attendances and adjust base/extra points" })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-2xl", children: "📝" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5", children: "Training Group" }),
                /* @__PURE__ */ jsx(
                  "select",
                  {
                    value: selectedGroupId,
                    onChange: (e) => setSelectedGroupId(e.target.value),
                    className: "w-full rounded-xl border border-gray-200 text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white font-medium",
                    children: groups.map((g) => /* @__PURE__ */ jsxs("option", { value: g.id, children: [
                      g.name,
                      " (",
                      g.skill_level,
                      ")"
                    ] }, g.id))
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5", children: "Date" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "date",
                    value: attendanceDate,
                    onChange: (e) => setAttendanceDate(e.target.value),
                    max: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
                    className: "w-full rounded-xl border border-gray-200 text-sm py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white font-medium"
                  }
                )
              ] })
            ] }),
            message && /* @__PURE__ */ jsx("div", { className: `p-4 rounded-xl text-sm font-semibold border ${message.type === "success" ? "bg-emerald-50 border-emerald-100 text-emerald-800" : "bg-red-50 border-red-100 text-red-800"}`, children: message.text }),
            loading ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-20 text-center", children: [
              /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-3" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Retrieving athlete records..." })
            ] }) : /* @__PURE__ */ jsxs("form", { onSubmit: submitAttendance, className: "space-y-4", children: [
              attendanceList.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center py-16 text-gray-400 italic text-sm border-2 border-dashed border-gray-100 rounded-2xl bg-white", children: "No athletes registered in this training group." }) : /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-xl border border-gray-150 shadow-sm", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-gray-100 text-sm text-left", children: [
                /* @__PURE__ */ jsx("thead", { className: "bg-slate-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider", children: /* @__PURE__ */ jsxs("tr", { children: [
                  /* @__PURE__ */ jsx("th", { className: "px-6 py-3.5", children: "Athlete" }),
                  /* @__PURE__ */ jsx("th", { className: "px-6 py-3.5 text-center", children: "Status" }),
                  /* @__PURE__ */ jsx("th", { className: "px-6 py-3.5 text-center", children: "Base Points" }),
                  /* @__PURE__ */ jsx("th", { className: "px-6 py-3.5 text-center", children: "Extra Points" })
                ] }) }),
                /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-100 bg-white", children: attendanceList.map((row) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-slate-50/50 transition-colors", children: [
                  /* @__PURE__ */ jsx("td", { className: "px-6 py-4 font-bold text-gray-900", children: row.name }),
                  /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-center", children: /* @__PURE__ */ jsxs("div", { className: "inline-flex rounded-xl p-1 bg-slate-100 border border-slate-200/50", children: [
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => handleStatusChange(row.athlete_id, "present"),
                        className: `px-4 py-1 text-xs font-bold rounded-lg transition-all ${row.status === "present" ? "bg-emerald-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`,
                        children: "Present"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => handleStatusChange(row.athlete_id, "absent"),
                        className: `px-4 py-1 text-xs font-bold rounded-lg transition-all ${row.status === "absent" ? "bg-rose-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`,
                        children: "Absent"
                      }
                    )
                  ] }) }),
                  /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-center font-semibold", children: /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "number",
                      min: "0",
                      value: row.base_points,
                      onChange: (e) => handlePointsChange(row.athlete_id, "base_points", Math.max(0, parseInt(e.target.value) || 0)),
                      disabled: row.status === "absent",
                      className: "w-20 rounded-lg border border-gray-200 text-center py-1.5 px-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-xs font-bold disabled:opacity-40 disabled:bg-slate-50"
                    }
                  ) }),
                  /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-center font-semibold", children: /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "number",
                      value: row.extra_points,
                      onChange: (e) => handlePointsChange(row.athlete_id, "extra_points", parseInt(e.target.value) || 0),
                      disabled: row.status === "absent",
                      className: "w-20 rounded-lg border border-gray-200 text-center py-1.5 px-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-xs font-bold disabled:opacity-40 disabled:bg-slate-50"
                    }
                  ) })
                ] }, row.athlete_id)) })
              ] }) }),
              attendanceList.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex justify-end pt-3", children: /* @__PURE__ */ jsx(
                "button",
                {
                  type: "submit",
                  disabled: submitting,
                  className: "px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm disabled:opacity-50",
                  children: submitting ? "Saving changes..." : "Save Attendance Records"
                }
              ) })
            ] })
          ] })
        ] }) }) })
      ]
    }
  );
}
export {
  ManagerAttendance as default
};
