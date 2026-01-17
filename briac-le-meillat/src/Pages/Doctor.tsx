import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React, { useEffect } from 'react';

export default function Doctor() {
    useEffect(() => {
        document.title = "Espace Médecin - Synapseo";
    }, []);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Espace Médecin
                </h2>
            }
        >
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            Bienvenue dr. !
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
