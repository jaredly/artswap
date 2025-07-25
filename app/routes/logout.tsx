// app/routes/logout.tsx
import {redirect} from 'react-router-dom';
import type {ActionFunctionArgs} from 'react-router';
import {destroySessionCookie} from '~/lib/auth/session';

export async function action({request}: ActionFunctionArgs) {
    return redirect('/login', {
        headers: {
            'Set-Cookie': destroySessionCookie(),
        },
    });
}

export default function LogoutPage() {
    return (
        <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Signed out</h1>
            <div className="text-gray-600 mb-4">You have been signed out.</div>
            <a href="/login" className="text-blue-600 hover:underline">
                Sign in again
            </a>
        </div>
    );
}
