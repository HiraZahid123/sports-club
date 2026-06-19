import { InertiaLinkProps, Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}: InertiaLinkProps & { active: boolean }) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center border-b-2 px-3 pt-1 pb-0.5 text-sm font-semibold leading-5 transition-all duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-indigo-600 text-indigo-700 bg-indigo-50 rounded-t-lg'
                    : 'border-transparent text-gray-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/60 rounded-t-lg focus:border-gray-300 focus:text-gray-700') +
                ' ' + className
            }
        >
            {children}
        </Link>
    );
}
