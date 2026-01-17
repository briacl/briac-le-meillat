import GuestLayout from '@/Layouts/GuestLayout';
import React, { useEffect } from 'react';

export default function ConfirmPassword() {
    useEffect(() => {
        document.title = "Confirm Password - Synapseo";
    }, []);

    return (
        <GuestLayout>
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                This is a secure area of the application. Please confirm your
                password before continuing.
            </div>

            <div className="text-center">
                <p className="mb-4 font-bold">This feature is disabled in the static demo.</p>
            </div>
        </GuestLayout>
    );
}
