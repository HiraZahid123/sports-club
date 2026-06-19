import { InertiaLinkProps, Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}: InertiaLinkProps & { active?: boolean }) {
    return (
        <Link
            {...props}
            className={`flex w-full items-start border-l-4 py-2.5 pe-4 ps-3 text-sm font-semibold transition-all duration-150 ease-in-out focus:outline-none ${
                active
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-transparent text-gray-600 hover:border-indigo-300 hover:bg-indigo-50/60 hover:text-indigo-600'
            } ${className}`}
        >
            {children}
        </Link>
    );
}
