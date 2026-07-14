import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as Authenticated } from "./AuthenticatedLayout-D0_10pNp.js";
import { useForm, Head, router } from "@inertiajs/react";
import { useState, useRef } from "react";
import QRCode from "react-qr-code";
import "@headlessui/react";
import "axios";
import "./ml-sports-BEC2gdiG.js";
const inputClass = "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all";
const labelClass = "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5";
function ClubEdit({ club, facilities, join_link, status }) {
  const [codeCopied, setCodeCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [editingCode, setEditingCode] = useState(false);
  const [codeInput, setCodeInput] = useState(club.join_code ?? "");
  const [regenerating, setRegenerating] = useState(false);
  const joinLink = join_link ?? "";
  const copyJoinCode = () => {
    if (!club.join_code) return;
    navigator.clipboard.writeText(club.join_code).then(() => {
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2e3);
    });
  };
  const copyJoinLink = () => {
    if (!joinLink) return;
    navigator.clipboard.writeText(joinLink).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2e3);
    });
  };
  const saveJoinCode = (e) => {
    e.preventDefault();
    router.post(route("manager.club.join-code"), { join_code: codeInput }, {
      onSuccess: () => setEditingCode(false)
    });
  };
  const regenerateCode = () => {
    if (!confirm("Generate a new random code? The old code and any shared links will stop working.")) return;
    setRegenerating(true);
    router.post(route("manager.club.join-code.regenerate"), {}, {
      onFinish: () => setRegenerating(false)
    });
  };
  const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
    name: club.name || "",
    email: club.email || "",
    phone: club.phone || "",
    address: club.address || "",
    description: club.description || "",
    sport_type: club.sport_type || "",
    founding_date: club.founding_date ? club.founding_date.substring(0, 10) : "",
    opening_time: club.opening_time ? club.opening_time.substring(0, 5) : "",
    closing_time: club.closing_time ? club.closing_time.substring(0, 5) : ""
  });
  const submit = (e) => {
    e.preventDefault();
    patch(route("manager.club.update"));
  };
  const fileInput = useRef(null);
  const [preview, setPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [logoError, setLogoError] = useState(null);
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoError(null);
    setPreview(URL.createObjectURL(file));
  };
  const handleLogoUpload = (e) => {
    e.preventDefault();
    if (!logoFile) return;
    setUploading(true);
    setLogoError(null);
    const form = new FormData();
    form.append("logo", logoFile);
    router.post(route("manager.club.logo"), form, {
      onSuccess: () => {
        setLogoFile(null);
        setPreview(null);
        setUploading(false);
      },
      onError: (errs) => {
        setLogoError(errs.logo ?? "Upload failed.");
        setUploading(false);
      }
    });
  };
  const currentLogo = preview ?? (club.logo_path ? club.logo_path.startsWith("http://") || club.logo_path.startsWith("https://") || club.logo_path.startsWith("blob:") || club.logo_path.startsWith("data:") ? club.logo_path : club.logo_path.startsWith("/") ? club.logo_path : "/" + club.logo_path : null);
  return /* @__PURE__ */ jsxs(
    Authenticated,
    {
      header: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Club Settings" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-0.5", children: "Manage your club's profile and contact information" })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Club Settings" }),
        /* @__PURE__ */ jsx("div", { className: "py-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6", children: [
          status === "logo-updated" && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-semibold text-emerald-700", children: [
            /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 shrink-0", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) }),
            "Club photo updated successfully."
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm", children: [
            /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-5 border-b border-emerald-100 rounded-t-2xl overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center", children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 text-emerald-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" }) }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-gray-900", children: "Club Join Code" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-0.5", children: "Share the code, link, or QR with athletes and parents" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setEditingCode(true);
                    setCodeInput(club.join_code ?? "");
                  },
                  className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-200 bg-white text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition-all",
                  children: [
                    /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" }) }),
                    "Edit Code"
                  ]
                }
              )
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-5", children: [
              editingCode && /* @__PURE__ */ jsxs("form", { onSubmit: saveJoinCode, className: "flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-emerald-700 uppercase tracking-wide mb-1", children: "Custom Code (4–12 characters, letters & numbers only)" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      value: codeInput,
                      onChange: (e) => setCodeInput(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "")),
                      maxLength: 12,
                      placeholder: "e.g. DRAGON7",
                      className: "w-full rounded-xl border border-emerald-300 bg-white px-4 py-2.5 text-sm font-mono font-bold text-gray-900 tracking-widest focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all uppercase"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mt-5", children: [
                  /* @__PURE__ */ jsx("button", { type: "submit", className: "px-4 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-all", children: "Save" }),
                  /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setEditingCode(false), className: "px-4 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all", children: "Cancel" })
                ] })
              ] }),
              !club.join_code && !editingCode && /* @__PURE__ */ jsxs("div", { className: "text-center py-4", children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mb-3", children: "No join code set yet." }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-3", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setEditingCode(true),
                      className: "px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-all",
                      children: "Set Custom Code"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: regenerateCode,
                      disabled: regenerating,
                      className: "px-4 py-2 border border-emerald-200 text-emerald-700 text-sm font-semibold rounded-xl hover:bg-emerald-50 transition-all disabled:opacity-50",
                      children: "Generate Random Code"
                    }
                  )
                ] })
              ] }),
              club.join_code && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row gap-6 items-start", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-4", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-gray-400 uppercase tracking-widest mb-2", children: "Club Code" }),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                        /* @__PURE__ */ jsx("p", { className: "text-4xl font-black tracking-[0.35em] text-gray-900 font-mono", children: club.join_code }),
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            type: "button",
                            onClick: copyJoinCode,
                            className: `inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${codeCopied ? "bg-emerald-500 text-white" : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"}`,
                            children: codeCopied ? /* @__PURE__ */ jsxs(Fragment, { children: [
                              /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) }),
                              "Copied!"
                            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                              /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" }) }),
                              "Copy"
                            ] })
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-gray-400 uppercase tracking-widest mb-2", children: "Invite Link" }),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsx("p", { className: "flex-1 text-xs text-gray-600 font-mono bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 truncate min-w-0", children: joinLink }),
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            type: "button",
                            onClick: copyJoinLink,
                            className: `inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all shrink-0 ${linkCopied ? "bg-indigo-600 text-white" : "bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200"}`,
                            children: linkCopied ? /* @__PURE__ */ jsxs(Fragment, { children: [
                              /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) }),
                              "Copied!"
                            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                              /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" }) }),
                              "Copy Link"
                            ] })
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: regenerateCode,
                        disabled: regenerating,
                        className: "inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50",
                        children: [
                          /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" }) }),
                          regenerating ? "Generating…" : "Generate new random code"
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-3 shrink-0", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-gray-400 uppercase tracking-widest self-start", children: "QR Code" }),
                    /* @__PURE__ */ jsx("div", { style: { width: 176, height: 176, padding: 14, background: "#fff", border: "2px solid #f1f5f9", borderRadius: 16, boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)" }, children: /* @__PURE__ */ jsx(
                      QRCode,
                      {
                        value: joinLink,
                        size: 148,
                        bgColor: "#ffffff",
                        fgColor: "#1e293b",
                        level: "M",
                        style: { display: "block", width: 148, height: 148, maxWidth: "none" }
                      }
                    ) }),
                    /* @__PURE__ */ jsx("p", { className: "text-[11px] text-gray-400 text-center max-w-[172px] leading-relaxed", children: "Scan to open the join page with code pre-filled" })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "bg-amber-50 border border-amber-100 rounded-xl px-4 py-3", children: /* @__PURE__ */ jsxs("p", { className: "text-xs text-amber-800 leading-relaxed", children: [
                  /* @__PURE__ */ jsx("strong", { children: "How athletes register:" }),
                  " Scan the QR code or share the invite link — it opens the registration page with the code pre-filled. Or give them the code directly and tell them to go to ",
                  /* @__PURE__ */ jsx("strong", { children: "Register → Join as Athlete or Parent" }),
                  "."
                ] }) })
              ] }),
              status === "join-code-updated" && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-semibold text-emerald-700", children: [
                /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 shrink-0", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) }),
                "Join code updated successfully."
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", children: [
            /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-5 border-b border-indigo-100", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 text-lg", children: "📷" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-indigo-900", children: "Club Photo" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-indigo-600 mt-0.5", children: "Shown on your club profile. JPG, PNG, GIF or WEBP · max 3 MB" })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx("form", { onSubmit: handleLogoUpload, className: "p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
              /* @__PURE__ */ jsx("div", { className: "shrink-0", children: currentLogo ? /* @__PURE__ */ jsx(
                "img",
                {
                  src: currentLogo,
                  alt: "Club logo",
                  className: "w-24 h-24 rounded-2xl object-cover border-2 border-gray-100 shadow-sm"
                }
              ) : /* @__PURE__ */ jsx("div", { className: "w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-100 to-blue-100 border-2 border-indigo-100 flex items-center justify-center", children: /* @__PURE__ */ jsxs("svg", { className: "w-10 h-10 text-indigo-300", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: [
                /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M19 21H5a2 2 0 01-2-2V7a2 2 0 012-2h4l2-3h4l2 3h4a2 2 0 012 2v12a2 2 0 01-2 2z" }),
                /* @__PURE__ */ jsx("circle", { cx: "12", cy: "13", r: "3", strokeWidth: 1.5 })
              ] }) }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-3", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    ref: fileInput,
                    type: "file",
                    accept: "image/jpeg,image/png,image/gif,image/webp",
                    onChange: handleFileChange,
                    className: "hidden"
                  }
                ),
                !logoFile ? /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => fileInput.current?.click(),
                    className: "inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm",
                    children: [
                      /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-gray-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) }),
                      club.logo_path ? "Change Photo" : "Upload Photo"
                    ]
                  }
                ) : /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "submit",
                      disabled: uploading,
                      className: "px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-sm",
                      children: uploading ? "Uploading…" : "Save Photo"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => {
                        setLogoFile(null);
                        setPreview(null);
                        setLogoError(null);
                        if (fileInput.current) fileInput.current.value = "";
                      },
                      className: "px-4 py-2 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all",
                      children: "Cancel"
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-400 truncate max-w-40", children: logoFile.name })
                ] }),
                logoError && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-600", children: logoError }),
                !logoFile && /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400", children: club.logo_path ? 'Click "Change Photo" to upload a new image.' : "No photo uploaded yet." })
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", children: [
            /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-5 border-b border-indigo-100", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 text-lg", children: "🏟️" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-indigo-900", children: "Club Profile" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-indigo-600 mt-0.5", children: "Update your club's public-facing information" })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "p-6 space-y-5", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: labelClass, children: "Club Name" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: data.name,
                    onChange: (e) => setData("name", e.target.value),
                    placeholder: "e.g. Dragon Taekwondo Academy",
                    className: inputClass
                  }
                ),
                errors.name && /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-xs text-red-600", children: errors.name })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: labelClass, children: "Email Address" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "email",
                      value: data.email,
                      onChange: (e) => setData("email", e.target.value),
                      placeholder: "club@example.com",
                      className: inputClass
                    }
                  ),
                  errors.email && /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-xs text-red-600", children: errors.email })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: labelClass, children: "Phone Number" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      value: data.phone,
                      onChange: (e) => setData("phone", e.target.value),
                      placeholder: "+1 (555) 000-0000",
                      className: inputClass
                    }
                  ),
                  errors.phone && /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-xs text-red-600", children: errors.phone })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: labelClass, children: "Address" }),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    value: data.address,
                    onChange: (e) => setData("address", e.target.value),
                    placeholder: "123 Sports Ave, City, State 12345",
                    rows: 3,
                    className: `${inputClass} resize-none`
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: labelClass, children: "Sport Type" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      value: data.sport_type,
                      onChange: (e) => setData("sport_type", e.target.value),
                      placeholder: "e.g. Taekwondo, Soccer, Swimming",
                      className: inputClass
                    }
                  ),
                  errors.sport_type && /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-xs text-red-600", children: errors.sport_type })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: labelClass, children: "Founding Date" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "date",
                      value: data.founding_date,
                      onChange: (e) => setData("founding_date", e.target.value),
                      className: inputClass
                    }
                  ),
                  errors.founding_date && /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-xs text-red-600", children: errors.founding_date })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: labelClass, children: "Opening Time" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "time",
                      value: data.opening_time,
                      onChange: (e) => setData("opening_time", e.target.value),
                      className: inputClass
                    }
                  ),
                  errors.opening_time && /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-xs text-red-600", children: errors.opening_time })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: labelClass, children: "Closing Time" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "time",
                      value: data.closing_time,
                      onChange: (e) => setData("closing_time", e.target.value),
                      className: inputClass
                    }
                  ),
                  errors.closing_time && /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-xs text-red-600", children: errors.closing_time })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: labelClass, children: "Club Description" }),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    value: data.description,
                    onChange: (e) => setData("description", e.target.value),
                    placeholder: "Tell athletes and parents about your club...",
                    rows: 4,
                    className: `${inputClass} resize-none`
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 pt-1", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "submit",
                    disabled: processing,
                    className: "px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-sm shadow-indigo-200",
                    children: processing ? "Saving..." : "Save Changes"
                  }
                ),
                recentlySuccessful && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-sm font-semibold text-emerald-600", children: [
                  /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) }),
                  "Saved successfully"
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx(FacilitiesSection, { facilities }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden", children: [
            /* @__PURE__ */ jsx("div", { className: "bg-red-50 px-6 py-4 border-b border-red-100", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-red-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }) }),
              /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-red-800", children: "Danger Zone" })
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
              /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600 mb-5", children: [
                "Permanently delete this club and all associated data — members, groups, billing history. ",
                /* @__PURE__ */ jsx("strong", { children: "This action cannot be undone." })
              ] }),
              /* @__PURE__ */ jsx("button", { className: "px-5 py-2.5 bg-white border border-red-300 text-red-600 text-sm font-bold rounded-xl hover:bg-red-50 transition-all", children: "Delete Club" })
            ] })
          ] })
        ] }) })
      ]
    }
  );
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
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-5 border-b border-emerald-100 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 text-lg", children: "🏟️" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-emerald-900", children: "Facilities Setup" }),
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
      ] }) : /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between bg-slate-50 hover:bg-slate-100/50 rounded-xl px-4 py-3 border border-gray-100 transition-all", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-gray-900", children: facility.name }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 mt-0.5", children: [facility.type, facility.capacity ? `Capacity ${facility.capacity}` : null].filter(Boolean).join(" · ") || "No details set" })
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
  ClubEdit as default
};
