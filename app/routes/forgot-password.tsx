// app/routes/forgot-password.tsx
import {Form, useActionData, useNavigation} from 'react-router-dom';
import type {ActionFunctionArgs} from 'react-router';
import {getArtistByEmail} from '~/lib/db/artist';
import {createJWT} from '~/lib/auth/tokens';

export async function action({request}: ActionFunctionArgs) {
    const formData = await request.formData();
    const email = formData.get('email') as string;

    if (!email) {
        return new Response(JSON.stringify({error: 'Email is required.'}), {
            status: 400,
            headers: {'Content-Type': 'application/json'},
        });
    }

    const user = await getArtistByEmail(email);
    if (!user) {
        return new Response(JSON.stringify({error: 'No account found for that email.'}), {
            status: 404,
            headers: {'Content-Type': 'application/json'},
        });
    }

    const token = createJWT({artistId: user.id, type: 'password-reset'}, '1h');
    // TODO: Send password reset email with link containing token

    return new Response(JSON.stringify({success: true, message: 'A password reset link has been sent.'}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
    });
}

export default function ForgotPasswordPage() {
    const actionData = useActionData() as {error?: string; success?: boolean; message?: string};
    const navigation = useNavigation();

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">Forgot your password?</h1>
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
                {actionData?.error && <div className="text-red-500 text-sm">{actionData.error}</div>}
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition"
                    disabled={navigation.state === 'submitting'}
                >
                    {navigation.state === 'submitting' ? 'Sending...' : 'Send Reset Link'}
                </button>
            </Form>
            {actionData?.success && <div className="mt-4 text-green-600 text-sm text-center">{actionData.message}</div>}
        </div>
    );
}
