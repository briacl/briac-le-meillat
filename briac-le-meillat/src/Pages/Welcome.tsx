import { Link } from 'react-router-dom';
import { useEffect } from 'react';

export default function Welcome() {
    useEffect(() => {
        document.title = "Welcome - briac-le-meillat";
    }, []);

    return (
        <div className="relative flex items-top justify-center min-h-screen bg-gray-100 dark:bg-gray-900 sm:items-center sm:pt-0">
            <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                <div className="flex justify-center pt-8 sm:justify-start sm:pt-0">
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-white">briac-le-meillat</h1>
                </div>
                <div className="mt-8 bg-white dark:bg-gray-800 overflow-hidden shadow sm:rounded-lg">
                    <div className="p-6">
                        <p className="text-gray-600 dark:text-gray-400">
                            Welcome to the briac-le-meillat static demo.
                        </p>
                        <div className="mt-4">
                            <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
                            <span className="mx-2 text-gray-400">|</span>
                            <Link to="/register" className="text-blue-500 hover:underline">Register</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
