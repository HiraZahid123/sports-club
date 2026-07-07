import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const user = usePage().props.auth.user as any;
    const isAthlete = user.roles?.includes('Athlete');

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            phone: user.phone ?? '',
            id_code: user.id_code ?? '',
            city: user.city ?? '',
            emergency_contact_name: user.emergency_contact_name ?? '',
            emergency_contact_phone: user.emergency_contact_phone ?? '',
            date_of_birth: user.athlete_profile?.date_of_birth ?? '',
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Profile Information
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                {isAthlete && (
                    <div className="border-t border-gray-100 pt-6 mt-6 space-y-6">
                        <h3 className="text-md font-bold text-gray-800 uppercase tracking-wide">
                            Athlete Details
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="phone" value="Phone Number" />
                                <TextInput
                                    id="phone"
                                    className="mt-1 block w-full"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                />
                                <InputError className="mt-2" message={errors.phone} />
                            </div>

                            <div>
                                <InputLabel htmlFor="id_code" value="National ID" />
                                <TextInput
                                    id="id_code"
                                    className="mt-1 block w-full"
                                    value={data.id_code}
                                    onChange={(e) => setData('id_code', e.target.value)}
                                />
                                <InputError className="mt-2" message={errors.id_code} />
                            </div>

                            <div>
                                <InputLabel htmlFor="city" value="City" />
                                <TextInput
                                    id="city"
                                    className="mt-1 block w-full"
                                    value={data.city}
                                    onChange={(e) => setData('city', e.target.value)}
                                />
                                <InputError className="mt-2" message={errors.city} />
                            </div>

                            <div>
                                <InputLabel htmlFor="date_of_birth" value="Date of Birth" />
                                <TextInput
                                    id="date_of_birth"
                                    type="date"
                                    className="mt-1 block w-full"
                                    value={data.date_of_birth}
                                    onChange={(e) => setData('date_of_birth', e.target.value)}
                                />
                                <InputError className="mt-2" message={errors.date_of_birth} />
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-4 space-y-4">
                            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                                Emergency Contact
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="emergency_contact_name" value="Contact Name" />
                                    <TextInput
                                        id="emergency_contact_name"
                                        className="mt-1 block w-full"
                                        value={data.emergency_contact_name}
                                        onChange={(e) => setData('emergency_contact_name', e.target.value)}
                                    />
                                    <InputError className="mt-2" message={errors.emergency_contact_name} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="emergency_contact_phone" value="Contact Phone" />
                                    <TextInput
                                        id="emergency_contact_phone"
                                        className="mt-1 block w-full"
                                        value={data.emergency_contact_phone}
                                        onChange={(e) => setData('emergency_contact_phone', e.target.value)}
                                    />
                                    <InputError className="mt-2" message={errors.emergency_contact_phone} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800 dark:text-gray-200">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Saved.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
