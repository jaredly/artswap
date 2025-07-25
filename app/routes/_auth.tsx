// app/routes/_auth.tsx
import {Outlet} from 'react-router';
import {Link} from 'react-router-dom';

export default function AuthLayout() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
            <header className="w-full max-w-md px-4 py-6 flex items-center justify-between">
                <Link to="/" className="text-2xl font-bold text-white tracking-tight">
                    ArtSwap
                </Link>
            </header>
            <main className="w-full max-w-md px-4 py-8 bg-white rounded-lg shadow-lg">
                <Outlet />
            </main>
            <footer className="mt-8 text-xs text-gray-400 text-center">&copy; {new Date().getFullYear()} ArtSwap. All rights reserved.</footer>
        </div>
    );
}
