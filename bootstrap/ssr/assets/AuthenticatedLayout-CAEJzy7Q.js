import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { Transition } from "@headlessui/react";
import { Link, usePage } from "@inertiajs/react";
import { useState, createContext, useContext } from "react";
import axios from "axios";
import { m as mlSportsLogo } from "./ml-sports-BEC2gdiG.js";
const DropDownContext = createContext({
  open: false,
  setOpen: () => {
  },
  toggleOpen: () => {
  }
});
const Dropdown = ({ children }) => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => {
    setOpen((previousState) => !previousState);
  };
  return /* @__PURE__ */ jsx(DropDownContext.Provider, { value: { open, setOpen, toggleOpen }, children: /* @__PURE__ */ jsx("div", { className: "relative", children }) });
};
const Trigger = ({ children }) => {
  const { open, setOpen, toggleOpen } = useContext(DropDownContext);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { onClick: toggleOpen, children }),
    open && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 z-[9998]",
        onClick: () => setOpen(false)
      }
    )
  ] });
};
const Content = ({
  align = "right",
  width = "48",
  contentClasses = "py-1 bg-white dark:bg-gray-700",
  children
}) => {
  const { open } = useContext(DropDownContext);
  let alignmentClasses = "origin-top";
  if (align === "left") {
    alignmentClasses = "ltr:origin-top-left rtl:origin-top-right start-0";
  } else if (align === "right") {
    alignmentClasses = "ltr:origin-top-right rtl:origin-top-left end-0";
  }
  let widthClasses = "";
  if (width === "48") {
    widthClasses = "w-48";
  }
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(
    Transition,
    {
      show: open,
      enter: "transition ease-out duration-200",
      enterFrom: "opacity-0 scale-95",
      enterTo: "opacity-100 scale-100",
      leave: "transition ease-in duration-75",
      leaveFrom: "opacity-100 scale-100",
      leaveTo: "opacity-0 scale-95",
      children: /* @__PURE__ */ jsx(
        "div",
        {
          className: `absolute z-[9999] mt-2 rounded-md shadow-lg ${alignmentClasses} ${widthClasses}`,
          children: /* @__PURE__ */ jsx(
            "div",
            {
              className: `rounded-md ring-1 ring-black ring-opacity-5 ` + contentClasses,
              children
            }
          )
        }
      )
    }
  ) });
};
const DropdownLink = ({
  className = "",
  children,
  ...props
}) => {
  const { setOpen } = useContext(DropDownContext);
  return /* @__PURE__ */ jsx(
    Link,
    {
      ...props,
      onClick: () => setOpen(false),
      className: "block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:focus:bg-gray-800 " + className,
      children
    }
  );
};
Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = DropdownLink;
function NavLink({
  active = false,
  className = "",
  children,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Link,
    {
      ...props,
      className: "inline-flex items-center border-b-2 px-3 pt-1 pb-0.5 text-sm font-semibold leading-5 transition-all duration-150 ease-in-out focus:outline-none " + (active ? "border-indigo-600 text-indigo-700 bg-indigo-50 rounded-t-lg" : "border-transparent text-gray-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/60 rounded-t-lg focus:border-gray-300 focus:text-gray-700") + " " + className,
      children
    }
  );
}
function ResponsiveNavLink({
  active = false,
  className = "",
  children,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Link,
    {
      ...props,
      className: `flex w-full items-start border-l-4 py-2.5 pe-4 ps-3 text-sm font-semibold transition-all duration-150 ease-in-out focus:outline-none ${active ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-transparent text-gray-600 hover:border-indigo-300 hover:bg-indigo-50/60 hover:text-indigo-600"} ${className}`,
      children
    }
  );
}
function Authenticated({
  header,
  children
}) {
  const page = usePage();
  const user = page.props.auth.user;
  const unreadCount = page.props.unreadMessageCount ?? 0;
  const pendingPopups = page.props.pendingImportantMessages ?? [];
  const [dismissedIds, setDismissedIds] = useState([]);
  const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
  const activePopup = pendingPopups.find((m) => !dismissedIds.includes(m.id));
  const dismissPopup = (id) => {
    axios.post(route("messages.read", id));
    setDismissedIds((prev) => [...prev, id]);
  };
  const isManager = user.roles?.includes("Manager") || user.roles?.includes("Super Admin");
  const isParent = user.roles?.includes("Parent");
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-slate-50", children: [
    /* @__PURE__ */ jsxs("nav", { className: "bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm", children: [
      /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "flex h-16 items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
          /* @__PURE__ */ jsx(Link, { href: "/", className: "flex items-center shrink-0", children: /* @__PURE__ */ jsx("img", { src: mlSportsLogo, alt: "ML Sports", className: "h-10 w-auto object-contain" }) }),
          user.club && /* @__PURE__ */ jsx("span", { className: "hidden lg:block text-xs font-semibold text-gray-400 border-l border-gray-200 pl-4 uppercase tracking-widest truncate max-w-32", children: user.club.name }),
          /* @__PURE__ */ jsxs("div", { className: "hidden sm:flex items-center gap-0.5", children: [
            /* @__PURE__ */ jsx(
              NavLink,
              {
                href: route("dashboard"),
                active: route().current("dashboard") || route().current("manager.dashboard") || route().current("coach.dashboard") || route().current("athlete.dashboard") || route().current("parent.dashboard"),
                children: "Dashboard"
              }
            ),
            isManager && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(NavLink, { href: route("manager.club.edit"), active: route().current("manager.club.edit"), children: "Club" }),
              /* @__PURE__ */ jsx(NavLink, { href: route("manager.setup.index"), active: route().current("manager.setup.index"), children: "Setup" }),
              /* @__PURE__ */ jsx(NavLink, { href: route("manager.members.index"), active: route().current("manager.members.index"), children: "Members" }),
              /* @__PURE__ */ jsx(NavLink, { href: route("manager.coaches.index"), active: route().current("manager.coaches.index"), children: "Coaches" }),
              /* @__PURE__ */ jsx(NavLink, { href: route("manager.groups.index"), active: route().current("manager.groups.index"), children: "Groups" }),
              /* @__PURE__ */ jsx(NavLink, { href: route("manager.billing.index"), active: route().current("manager.billing.index"), children: "Billing" }),
              /* @__PURE__ */ jsx(NavLink, { href: route("manager.reports.index"), active: route().current("manager.reports.index"), children: "Reports" }),
              /* @__PURE__ */ jsx(NavLink, { href: route("manager.events.index"), active: route().current("manager.events.index"), children: "Events" })
            ] }),
            !isManager && !isParent && user.roles?.includes("Athlete") && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(NavLink, { href: route("athlete.events.index"), active: route().current("athlete.events.index"), children: "Events" }),
              /* @__PURE__ */ jsx(NavLink, { href: route("athlete.schedule"), active: route().current("athlete.schedule"), children: "Schedule" })
            ] }),
            !isManager && !isParent && user.roles?.includes("Coach") && /* @__PURE__ */ jsx(NavLink, { href: route("coach.events.index"), active: route().current("coach.events.index"), children: "Events" }),
            isParent && /* @__PURE__ */ jsx(NavLink, { href: route("parent.billing"), active: route().current("parent.billing"), children: "My Billing" }),
            /* @__PURE__ */ jsxs(
              Link,
              {
                href: route("messages.index"),
                className: `relative inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${route().current("messages.*") ? "text-indigo-700 bg-indigo-50" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`,
                children: [
                  "Messages",
                  unreadCount > 0 && /* @__PURE__ */ jsx("span", { className: "absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1", children: unreadCount > 9 ? "9+" : unreadCount })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "hidden sm:flex items-center gap-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full overflow-hidden border border-indigo-200 shrink-0", children: user.profile_photo ? /* @__PURE__ */ jsx("img", { src: user.profile_photo.startsWith("http://") || user.profile_photo.startsWith("https://") || user.profile_photo.startsWith("blob:") || user.profile_photo.startsWith("data:") ? user.profile_photo : user.profile_photo.startsWith("/") ? user.profile_photo : "/" + user.profile_photo, alt: user.name, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx("div", { className: "w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm", children: user.name.charAt(0).toUpperCase() }) }),
          /* @__PURE__ */ jsxs(Dropdown, { children: [
            /* @__PURE__ */ jsx(Dropdown.Trigger, { children: /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                className: "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none",
                children: [
                  /* @__PURE__ */ jsx("span", { className: "max-w-28 truncate", children: user.name }),
                  /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-gray-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) })
                ]
              }
            ) }),
            /* @__PURE__ */ jsxs(Dropdown.Content, { children: [
              /* @__PURE__ */ jsx(Dropdown.Link, { href: route("profile.edit"), children: "Profile Settings" }),
              /* @__PURE__ */ jsx(Dropdown.Link, { href: route("logout"), method: "post", as: "button", children: "Sign Out" })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "-me-2 flex items-center sm:hidden", children: /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setShowingNavigationDropdown((prev) => !prev),
            className: "inline-flex items-center justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors focus:outline-none",
            children: /* @__PURE__ */ jsxs("svg", { className: "h-6 w-6", stroke: "currentColor", fill: "none", viewBox: "0 0 24 24", children: [
              /* @__PURE__ */ jsx(
                "path",
                {
                  className: !showingNavigationDropdown ? "inline-flex" : "hidden",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: "2",
                  d: "M4 6h16M4 12h16M4 18h16"
                }
              ),
              /* @__PURE__ */ jsx(
                "path",
                {
                  className: showingNavigationDropdown ? "inline-flex" : "hidden",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: "2",
                  d: "M6 18L18 6M6 6l12 12"
                }
              )
            ] })
          }
        ) })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: (showingNavigationDropdown ? "block" : "hidden") + " sm:hidden border-t border-gray-100", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-0.5 px-4 pb-4 pt-3", children: [
          /* @__PURE__ */ jsx(
            ResponsiveNavLink,
            {
              href: route("dashboard"),
              active: route().current("dashboard") || route().current("manager.dashboard") || route().current("coach.dashboard") || route().current("athlete.dashboard") || route().current("parent.dashboard"),
              children: "Dashboard"
            }
          ),
          isManager && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(ResponsiveNavLink, { href: route("manager.club.edit"), active: route().current("manager.club.edit"), children: "Club Settings" }),
            /* @__PURE__ */ jsx(ResponsiveNavLink, { href: route("manager.setup.index"), active: route().current("manager.setup.index"), children: "Club Setup" }),
            /* @__PURE__ */ jsx(ResponsiveNavLink, { href: route("manager.members.index"), active: route().current("manager.members.index"), children: "Manage Members" }),
            /* @__PURE__ */ jsx(ResponsiveNavLink, { href: route("manager.coaches.index"), active: route().current("manager.coaches.index"), children: "Coaches" }),
            /* @__PURE__ */ jsx(ResponsiveNavLink, { href: route("manager.groups.index"), active: route().current("manager.groups.index"), children: "Training Groups" }),
            /* @__PURE__ */ jsx(ResponsiveNavLink, { href: route("manager.billing.index"), active: route().current("manager.billing.index"), children: "Billing & Revenue" }),
            /* @__PURE__ */ jsx(ResponsiveNavLink, { href: route("manager.reports.index"), active: route().current("manager.reports.index"), children: "Financial Reports" }),
            /* @__PURE__ */ jsx(ResponsiveNavLink, { href: route("manager.events.index"), active: route().current("manager.events.index"), children: "Events" })
          ] }),
          !isManager && !isParent && user.roles?.includes("Athlete") && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(ResponsiveNavLink, { href: route("athlete.events.index"), active: route().current("athlete.events.index"), children: "Events" }),
            /* @__PURE__ */ jsx(ResponsiveNavLink, { href: route("athlete.schedule"), active: route().current("athlete.schedule"), children: "Schedule" })
          ] }),
          !isManager && !isParent && user.roles?.includes("Coach") && /* @__PURE__ */ jsx(ResponsiveNavLink, { href: route("coach.events.index"), active: route().current("coach.events.index"), children: "Events" }),
          isParent && /* @__PURE__ */ jsx(ResponsiveNavLink, { href: route("parent.billing"), active: route().current("parent.billing"), children: "My Billing" }),
          /* @__PURE__ */ jsxs(
            Link,
            {
              href: route("messages.index"),
              className: "flex items-center justify-between w-full py-2 px-3 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors",
              children: [
                /* @__PURE__ */ jsx("span", { children: "Messages" }),
                unreadCount > 0 && /* @__PURE__ */ jsx("span", { className: "min-w-[20px] h-5 bg-red-500 text-white text-xs font-black rounded-full flex items-center justify-center px-1.5", children: unreadCount > 9 ? "9+" : unreadCount })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "border-t border-gray-200 pb-3 pt-4 px-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
            /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-full overflow-hidden border border-indigo-200 shrink-0", children: user.profile_photo ? /* @__PURE__ */ jsx("img", { src: user.profile_photo.startsWith("http://") || user.profile_photo.startsWith("https://") || user.profile_photo.startsWith("blob:") || user.profile_photo.startsWith("data:") ? user.profile_photo : user.profile_photo.startsWith("/") ? user.profile_photo : "/" + user.profile_photo, alt: user.name, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx("div", { className: "w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold", children: user.name.charAt(0).toUpperCase() }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-gray-900", children: user.name }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: user.email })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
            /* @__PURE__ */ jsx(ResponsiveNavLink, { href: route("profile.edit"), children: "Profile Settings" }),
            /* @__PURE__ */ jsx(ResponsiveNavLink, { method: "post", href: route("logout"), as: "button", children: "Sign Out" })
          ] })
        ] })
      ] })
    ] }),
    header && /* @__PURE__ */ jsx("header", { className: "bg-white border-b border-gray-100", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8", children: header }) }),
    /* @__PURE__ */ jsx("main", { children }),
    activePopup && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-red-600 to-orange-500 px-6 py-5 flex items-start gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center", children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 text-white", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z", clipRule: "evenodd" }) }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-white/70 uppercase tracking-widest mb-0.5", children: "Important Alert from Manager" }),
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-black text-white leading-tight", children: activePopup.title })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "px-6 py-5", children: [
        /* @__PURE__ */ jsx("p", { className: "text-gray-800 text-sm leading-relaxed whitespace-pre-wrap", children: activePopup.body }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 mt-4 text-xs text-gray-400", children: [
          /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" }) }),
          /* @__PURE__ */ jsxs("span", { children: [
            "From ",
            /* @__PURE__ */ jsx("strong", { children: activePopup.sender.name }),
            " · ",
            activePopup.created_at
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "px-6 pb-6 flex gap-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => dismissPopup(activePopup.id),
            className: "flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-all",
            children: "Acknowledge"
          }
        ),
        /* @__PURE__ */ jsx(
          Link,
          {
            href: route("messages.index"),
            onClick: () => dismissPopup(activePopup.id),
            className: "px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-all",
            children: "View in Inbox"
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  Authenticated as A
};
