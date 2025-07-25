// app/routes/login.tsx
import {Form, useActionData, useNavigation} from 'react-router-dom';
import {redirect} from 'react-router-dom';
import type {ActionFunctionArgs} from 'react-router';
import {getArtistByEmail} from '~/lib/db/artist';
import {verifyPassword} from '~/lib/auth/password';
import {createSessionCookie} from '~/lib/auth/session';

export async function action({request}: ActionFunctionArgs) {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return new Response(JSON.stringify({error: 'Email and password are required.'}), {
            status: 400,
            headers: {'Content-Type': 'application/json'},
        });
    }

    const user = await getArtistByEmail(email);
    if (!user || !user.passwordHash) {
        return new Response(JSON.stringify({error: 'Invalid email or password.'}), {
            status: 401,
            headers: {'Content-Type': 'application/json'},
        });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
        return new Response(JSON.stringify({error: 'Invalid email or password.'}), {
            status: 401,
            headers: {'Content-Type': 'application/json'},
        });
    }

    const cookie = createSessionCookie(user.id);
    return redirect('/', {
        headers: {
            'Set-Cookie': cookie,
        },
    });
}

export default function LoginPage() {
    const actionData = useActionData() as {error?: string};
    const navigation = useNavigation();

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">Sign in to ArtSwap</h1>
            <Form method="post" className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        autoComplete="email"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        autoComplete="current-password"
                    />
                </div>
                {actionData?.error && <div className="text-red-500 text-sm">{actionData.error}</div>}
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition"
                    disabled={navigation.state === 'submitting'}
                >
                    {navigation.state === 'submitting' ? 'Signing in...' : 'Sign In'}
                </button>
            </Form>
            <div className="mt-4 text-sm text-center">
                <a href="/forgot-password" className="text-blue-600 hover:underline">
                    Forgot password?
                </a>
            </div>
            <div className="mt-2 text-sm text-center">
                <span>Don't have an account? </span>
                <a href="/signup" className="text-blue-600 hover:underline">
                    Sign up
                </a>
            </div>
        </div>
    );
}
