import GuestLayout from '@/Layouts/GuestLayout';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Login({ status, canResetPassword }: { status?: string, canResetPassword?: boolean }) {
    useEffect(() => {
        document.title = "Log in - briac-le-meillat";
    }, []);

    return (
        <GuestLayout>
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Log in</h1>
                <p className="mb-4">This feature is disabled in the static demo.</p>
                <Link to="/register" className="text-blue-500 hover:underline">
                    Register
                </Link>
            </div>
        </GuestLayout>
    );
}
