import GuestLayout from '@/Layouts/GuestLayout';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function VerifyEmail() {
    useEffect(() => {
        document.title = "Verify Email - briac-le-meillat";
    }, []);

    return (
        <GuestLayout>
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Thanks for signing up! Before getting started, could you verify
                your email address by clicking on the link we just emailed to
                you? If you didn't receive the email, we will gladly send you
                another.
            </div>

            <div className="text-center">
                <p className="mb-4 font-bold">This feature is disabled in the static demo.</p>
                <Link to="/logout" className="text-blue-500 hover:underline">
                    Log Out
                </Link>
            </div>
        </GuestLayout>
    );
}
