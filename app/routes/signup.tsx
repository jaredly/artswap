// app/routes/signup.tsx
import {Form, useActionData, useNavigation} from 'react-router-dom';
import {redirect} from 'react-router-dom';
import type {ActionFunctionArgs} from 'react-router';
import {createArtist, getArtistByEmail} from '~/lib/db/artist';
import {hashPassword} from '~/lib/auth/password';
import {createSessionCookie} from '~/lib/auth/session';

export async function action({request}: ActionFunctionArgs) {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;

    if (!email || !password || !fullName) {
        return new Response(JSON.stringify({error: 'All fields are required.'}), {
            status: 400,
            headers: {'Content-Type': 'application/json'},
        });
    }

    const existing = await getArtistByEmail(email);
    if (existing) {
        return new Response(JSON.stringify({error: 'Email already registered.'}), {
            status: 409,
            headers: {'Content-Type': 'application/json'},
        });
    }

    const passwordHash = await hashPassword(password);
    const user = await createArtist({email, passwordHash, fullName});
    const cookie = createSessionCookie(user.id);

    return redirect('/', {
        headers: {
            'Set-Cookie': cookie,
        },
    });
}

export default function SignupPage() {
    const actionData = useActionData() as {error?: string};
    const navigation = useNavigation();

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">Create your ArtSwap account</h1>
            <Form method="post" className="space-y-4">
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                        Full Name
                    </label>
                    <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        autoComplete="name"
                    />
                </div>
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
                        autoComplete="new-password"
                    />
                </div>
                {actionData?.error && <div className="text-red-500 text-sm">{actionData.error}</div>}
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition"
                    disabled={navigation.state === 'submitting'}
                >
                    {navigation.state === 'submitting' ? 'Creating account...' : 'Sign Up'}
                </button>
            </Form>
            <div className="mt-4 text-sm text-center">
                <span>Already have an account? </span>
                <a href="/login" className="text-blue-600 hover:underline">
                    Sign in
                </a>
            </div>
        </div>
    );
}
