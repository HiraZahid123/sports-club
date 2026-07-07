import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';
import axios from 'axios';
import mlSportsLogo from '../ml-sports.png';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const page = usePage();
    const user = page.props.auth.user;
    const unreadCount = (page.props as any).unreadMessageCount ?? 0;
    const pendingPopups: Array<{ id: number; title: string; body: string; sender: { name: string }; created_at: string }> =
        (page.props as any).pendingImportantMessages ?? [];
    const [dismissedIds, setDismissedIds] = useState<number[]>([]);
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    const activePopup = pendingPopups.find(m => !dismissedIds.includes(m.id));

    const dismissPopup = (id: number) => {
        axios.post(route('messages.read', id));
        setDismissedIds(prev => [...prev, id]);
    };

    const isManager = (user as any).roles?.includes('Manager') || (user as any).roles?.includes('Super Admin');
    const isParent = (user as any).roles?.includes('Parent');

    return (
        <div className="min-h-screen bg-slate-50">
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Left: Logo + Nav */}
                        <div className="flex items-center gap-6">
                            <Link href="/" className="flex items-center shrink-0">
                                <img src={mlSportsLogo} alt="ML Sports" className="h-10 w-auto object-contain" />
                            </Link>

                            {(user as any).club && (
                                <span className="hidden lg:block text-xs font-semibold text-gray-400 border-l border-gray-200 pl-4 uppercase tracking-widest truncate max-w-32">
                                    {(user as any).club.name}
                                </span>
                            )}

                            <div className="hidden sm:flex items-center gap-0.5">
                                <NavLink
                                    href={route('dashboard')}
                                    active={
                                        route().current('dashboard') ||
                                        route().current('manager.dashboard') ||
                                        route().current('coach.dashboard') ||
                                        route().current('athlete.dashboard') ||
                                        route().current('parent.dashboard')
                                    }
                                >
                                    Dashboard
                                </NavLink>

                                {isManager && (
                                    <>
                                        <NavLink href={route('manager.club.edit')} active={route().current('manager.club.edit')}>
                                            Club
                                        </NavLink>
                                        <NavLink href={route('manager.setup.index')} active={route().current('manager.setup.index')}>
                                            Setup
                                        </NavLink>
                                        <NavLink href={route('manager.members.index')} active={route().current('manager.members.index')}>
                                            Members
                                        </NavLink>
                                        <NavLink href={route('manager.coaches.index')} active={route().current('manager.coaches.index')}>
                                            Coaches
                                        </NavLink>
                                        <NavLink href={route('manager.groups.index')} active={route().current('manager.groups.index')}>
                                            Groups
                                        </NavLink>
                                        <NavLink href={route('manager.billing.index')} active={route().current('manager.billing.index')}>
                                            Billing
                                        </NavLink>
                                        <NavLink href={route('manager.reports.index')} active={route().current('manager.reports.index')}>
                                            Reports
                                        </NavLink>
                                        <NavLink href={route('manager.events.index')} active={route().current('manager.events.index')}>
                                            Events
                                        </NavLink>
                                    </>
                                )}

                                {!isManager && !isParent && (user as any).roles?.includes('Athlete') && (
                                    <>
                                        <NavLink href={route('athlete.events.index')} active={route().current('athlete.events.index')}>
                                            Events
                                        </NavLink>
                                        <NavLink href={route('athlete.schedule')} active={route().current('athlete.schedule')}>
                                            Schedule
                                        </NavLink>
                                    </>
                                )}

                                {!isManager && !isParent && (user as any).roles?.includes('Coach') && (
                                    <NavLink href={route('coach.events.index')} active={route().current('coach.events.index')}>
                                        Events
                                    </NavLink>
                                )}

                                {isParent && (
                                    <NavLink href={route('parent.billing')} active={route().current('parent.billing')}>
                                        My Billing
                                    </NavLink>
                                )}

                                <Link
                                    href={route('messages.index')}
                                    className={`relative inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                        route().current('messages.*')
                                            ? 'text-indigo-700 bg-indigo-50'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                                >
                                    Messages
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </Link>
                            </div>
                        </div>

                        {/* Right: User Menu */}
                        <div className="hidden sm:flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full overflow-hidden border border-indigo-200 shrink-0">
                                    {(user as any).profile_photo ? (
                                        <img src={(user as any).profile_photo.startsWith('http://') || (user as any).profile_photo.startsWith('https://') || (user as any).profile_photo.startsWith('blob:') || (user as any).profile_photo.startsWith('data:') ? (user as any).profile_photo : ((user as any).profile_photo.startsWith('/') ? (user as any).profile_photo : '/' + (user as any).profile_photo)} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none"
                                        >
                                            <span className="max-w-28 truncate">{user.name}</span>
                                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>
                                            Profile Settings
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Sign Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Mobile Hamburger */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((prev) => !prev)}
                                className="inline-flex items-center justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors focus:outline-none"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden border-t border-gray-100'}>
                    <div className="space-y-0.5 px-4 pb-4 pt-3">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={
                                route().current('dashboard') ||
                                route().current('manager.dashboard') ||
                                route().current('coach.dashboard') ||
                                route().current('athlete.dashboard') ||
                                route().current('parent.dashboard')
                            }
                        >
                            Dashboard
                        </ResponsiveNavLink>

                        {isManager && (
                            <>
                                <ResponsiveNavLink href={route('manager.club.edit')} active={route().current('manager.club.edit')}>Club Settings</ResponsiveNavLink>
                                <ResponsiveNavLink href={route('manager.setup.index')} active={route().current('manager.setup.index')}>Club Setup</ResponsiveNavLink>
                                <ResponsiveNavLink href={route('manager.members.index')} active={route().current('manager.members.index')}>Manage Members</ResponsiveNavLink>
                                <ResponsiveNavLink href={route('manager.coaches.index')} active={route().current('manager.coaches.index')}>Coaches</ResponsiveNavLink>
                                <ResponsiveNavLink href={route('manager.groups.index')} active={route().current('manager.groups.index')}>Training Groups</ResponsiveNavLink>
                                <ResponsiveNavLink href={route('manager.billing.index')} active={route().current('manager.billing.index')}>Billing & Revenue</ResponsiveNavLink>
                                <ResponsiveNavLink href={route('manager.reports.index')} active={route().current('manager.reports.index')}>Financial Reports</ResponsiveNavLink>
                                <ResponsiveNavLink href={route('manager.events.index')} active={route().current('manager.events.index')}>Events</ResponsiveNavLink>
                            </>
                        )}

                        {!isManager && !isParent && (user as any).roles?.includes('Athlete') && (
                            <>
                                <ResponsiveNavLink href={route('athlete.events.index')} active={route().current('athlete.events.index')}>Events</ResponsiveNavLink>
                                <ResponsiveNavLink href={route('athlete.schedule')} active={route().current('athlete.schedule')}>Schedule</ResponsiveNavLink>
                            </>
                        )}

                        {!isManager && !isParent && (user as any).roles?.includes('Coach') && (
                            <ResponsiveNavLink href={route('coach.events.index')} active={route().current('coach.events.index')}>Events</ResponsiveNavLink>
                        )}

                        {isParent && (
                            <ResponsiveNavLink href={route('parent.billing')} active={route().current('parent.billing')}>My Billing</ResponsiveNavLink>
                        )}

                        <Link
                            href={route('messages.index')}
                            className="flex items-center justify-between w-full py-2 px-3 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            <span>Messages</span>
                            {unreadCount > 0 && (
                                <span className="min-w-[20px] h-5 bg-red-500 text-white text-xs font-black rounded-full flex items-center justify-center px-1.5">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </Link>
                    </div>

                    <div className="border-t border-gray-200 pb-3 pt-4 px-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-9 h-9 rounded-full overflow-hidden border border-indigo-200 shrink-0">
                                {(user as any).profile_photo ? (
                                    <img src={(user as any).profile_photo.startsWith('http://') || (user as any).profile_photo.startsWith('https://') || (user as any).profile_photo.startsWith('blob:') || (user as any).profile_photo.startsWith('data:') ? (user as any).profile_photo : ((user as any).profile_photo.startsWith('/') ? (user as any).profile_photo : '/' + (user as any).profile_photo)} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                        </div>
                        <div className="space-y-0.5">
                            <ResponsiveNavLink href={route('profile.edit')}>Profile Settings</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">Sign Out</ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>

            {/* Important message popup — shows for coaches with unread important alerts */}
            {activePopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
                        {/* Red header */}
                        <div className="bg-gradient-to-r from-red-600 to-orange-500 px-6 py-5 flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-white/70 uppercase tracking-widest mb-0.5">Important Alert from Manager</p>
                                <h3 className="text-lg font-black text-white leading-tight">{activePopup.title}</h3>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="px-6 py-5">
                            <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{activePopup.body}</p>
                            <div className="flex items-center gap-1.5 mt-4 text-xs text-gray-400">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg>
                                <span>From <strong>{activePopup.sender.name}</strong> · {activePopup.created_at}</span>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 pb-6 flex gap-3">
                            <button
                                onClick={() => dismissPopup(activePopup.id)}
                                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-all"
                            >
                                Acknowledge
                            </button>
                            <Link
                                href={route('messages.index')}
                                onClick={() => dismissPopup(activePopup.id)}
                                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-all"
                            >
                                View in Inbox
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
