import GuestLayout from '@/Layouts/GuestLayout';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function ResetPassword() {
    useEffect(() => {
        document.title = "Reset Password - Synapseo";
    }, []);

    return (
        <GuestLayout>
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
                <p className="mb-4">This feature is disabled in the static demo.</p>
                <Link to="/login" className="text-blue-500 hover:underline">
                    Back to Login
                </Link>
            </div>
        </GuestLayout>
    );
}
