import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as Authenticated } from "./AuthenticatedLayout-DGwI6Ex0.js";
import { usePage, Head, router } from "@inertiajs/react";
import { useRef, useState } from "react";
import DeleteUserForm from "./DeleteUserForm-D0kPVq8V.js";
import UpdatePasswordForm from "./UpdatePasswordForm-KUjEBxiO.js";
import UpdateProfileInformation from "./UpdateProfileInformationForm-ByHc9hmJ.js";
import AthleteSubscriptions from "./AthleteSubscriptions-DSoh_c6Q.js";
import JoinGroupForm from "./JoinGroupForm-C-TneV5Z.js";
import "@headlessui/react";
import "axios";
import "./ml-sports-BEC2gdiG.js";
import "./InputError-roYfmLKp.js";
import "./InputLabel-DDs2XNYP.js";
import "./TextInput-egt9uCZ_.js";
import "./PrimaryButton-DDF1xnxF.js";
function ProfilePhotoCard({ status }) {
  const user = usePage().props.auth.user;
  const fileInput = useRef(null);
  const [preview, setPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [photoError, setPhotoError] = useState(null);
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoError(null);
    setPreview(URL.createObjectURL(file));
  };
  const handleUpload = (e) => {
    e.preventDefault();
    if (!photoFile) return;
    setUploading(true);
    setPhotoError(null);
    const form = new FormData();
    form.append("photo", photoFile);
    router.post(route("profile.photo"), form, {
      onSuccess: () => {
        setPhotoFile(null);
        setPreview(null);
        setUploading(false);
      },
      onError: (errs) => {
        setPhotoError(errs.photo ?? "Upload failed.");
        setUploading(false);
      }
    });
  };
  const currentPhoto = preview ?? (user.profile_photo ? user.profile_photo.startsWith("http://") || user.profile_photo.startsWith("https://") || user.profile_photo.startsWith("blob:") || user.profile_photo.startsWith("data:") ? user.profile_photo : user.profile_photo.startsWith("/") ? user.profile_photo : "/" + user.profile_photo : null);
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-5 border-b border-indigo-100", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 text-lg", children: "📷" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-indigo-900", children: "Profile Photo" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-indigo-600 mt-0.5", children: "Shown across the platform. JPG, PNG, GIF or WEBP · max 3 MB" })
      ] })
    ] }) }),
    status === "photo-updated" && /* @__PURE__ */ jsxs("div", { className: "mx-6 mt-4 flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-semibold text-emerald-700", children: [
      /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 shrink-0", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) }),
      "Profile photo updated successfully."
    ] }),
    /* @__PURE__ */ jsx("form", { onSubmit: handleUpload, className: "p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
      /* @__PURE__ */ jsx("div", { className: "shrink-0", children: currentPhoto ? /* @__PURE__ */ jsx(
        "img",
        {
          src: currentPhoto,
          alt: "Profile",
          className: "w-24 h-24 rounded-full object-cover border-2 border-gray-100 shadow-sm"
        }
      ) : /* @__PURE__ */ jsx("div", { className: "w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 border-2 border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-3xl", children: user.name?.charAt(0).toUpperCase() }) }),
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
        !photoFile ? /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => fileInput.current?.click(),
            className: "inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm",
            children: [
              /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-gray-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) }),
              user.profile_photo ? "Change Photo" : "Upload Photo"
            ]
          }
        ) : /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
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
                setPhotoFile(null);
                setPreview(null);
                setPhotoError(null);
                if (fileInput.current) fileInput.current.value = "";
              },
              className: "px-4 py-2 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-400 truncate max-w-xs", children: photoFile.name })
        ] }),
        photoError && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-600", children: photoError }),
        !photoFile && /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400", children: user.profile_photo ? 'Click "Change Photo" to upload a new image.' : "No photo uploaded yet." })
      ] })
    ] }) })
  ] });
}
function Edit({
  mustVerifyEmail,
  status,
  mySubscriptions = [],
  availablePlans = []
}) {
  const user = usePage().props.auth.user;
  const isAthlete = user.roles?.includes("Athlete");
  return /* @__PURE__ */ jsxs(
    Authenticated,
    {
      header: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Profile Settings" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-0.5", children: "Manage your personal information and account security" })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Profile" }),
        /* @__PURE__ */ jsx("div", { className: "py-8", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-3xl space-y-6 px-4 sm:px-6 lg:px-8", children: [
          /* @__PURE__ */ jsx(ProfilePhotoCard, { status }),
          /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8", children: /* @__PURE__ */ jsx(
            UpdateProfileInformation,
            {
              mustVerifyEmail,
              status,
              className: "max-w-xl"
            }
          ) }),
          isAthlete && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8", children: /* @__PURE__ */ jsx(AthleteSubscriptions, { subscriptions: mySubscriptions }) }),
            availablePlans.length > 0 && /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8", children: /* @__PURE__ */ jsx(JoinGroupForm, { availablePlans }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8", children: /* @__PURE__ */ jsx(UpdatePasswordForm, { className: "max-w-xl" }) }),
          /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl border border-red-100 shadow-sm p-6 sm:p-8", children: /* @__PURE__ */ jsx(DeleteUserForm, { className: "max-w-xl" }) })
        ] }) })
      ]
    }
  );
}
export {
  Edit as default
};
