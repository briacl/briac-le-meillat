import GuestLayout from '@/Layouts/GuestLayout';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword({ status }: { status?: string }) {
    useEffect(() => {
        document.title = "Forgot Password - Synapseo";
    }, []);

    return (
        <GuestLayout>
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Forgot your password? No problem. Just let us know your email
                address and we will email you a password reset link that will
                allow you to choose a new one.
            </div>

            <div className="text-center">
                <p className="mb-4 font-bold">This feature is disabled in the static demo.</p>
                <Link to="/login" className="text-blue-500 hover:underline">
                    Back to Login
                </Link>
            </div>
        </GuestLayout>
    );
}
