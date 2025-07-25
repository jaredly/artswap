// app/routes/reset-password.tsx
import {Form, useActionData, useNavigation, useLoaderData} from 'react-router-dom';
import type {ActionFunctionArgs, LoaderFunctionArgs} from 'react-router';
import {verifyJWT} from '~/lib/auth/tokens';
import {getArtistById, updateArtist} from '~/lib/db/artist';
import {hashPassword} from '~/lib/auth/password';

export async function loader({request}: LoaderFunctionArgs) {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');
    if (!token) {
        return {valid: false, message: 'Reset token missing.'};
    }
    const payload = verifyJWT<{artistId: string; type: string}>(token);
    if (!payload || payload.type !== 'password-reset' || !payload.artistId) {
        return {valid: false, message: 'Invalid or expired reset token.'};
    }
    return {valid: true, artistId: payload.artistId, token};
}

export async function action({request}: ActionFunctionArgs) {
    const formData = await request.formData();
    const token = formData.get('token') as string;
    const password = formData.get('password') as string;

    if (!token || !password) {
        return new Response(JSON.stringify({error: 'Token and new password are required.'}), {
            status: 400,
            headers: {'Content-Type': 'application/json'},
        });
    }

    const payload = verifyJWT<{artistId: string; type: string}>(token);
    if (!payload || payload.type !== 'password-reset' || !payload.artistId) {
        return new Response(JSON.stringify({error: 'Invalid or expired reset token.'}), {
            status: 400,
            headers: {'Content-Type': 'application/json'},
        });
    }

    const artist = await getArtistById(payload.artistId);
    if (!artist) {
        return new Response(JSON.stringify({error: 'Artist not found.'}), {
            status: 404,
            headers: {'Content-Type': 'application/json'},
        });
    }

    const passwordHash = await hashPassword(password);
    await updateArtist(artist.id, {passwordHash});
    return new Response(JSON.stringify({success: true, message: 'Password has been reset. You may now sign in.'}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
    });
}

export default function ResetPasswordPage() {
    const loaderData = useLoaderData() as {valid: boolean; message?: string; token?: string};
    const actionData = useActionData() as {error?: string; success?: boolean; message?: string};
    const navigation = useNavigation();

    if (!loaderData.valid) {
        return (
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
                <div className="text-red-600">{loaderData.message}</div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">Set a new password</h1>
            <Form method="post" className="space-y-4">
                <input type="hidden" name="token" value={loaderData.token} />
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        New Password
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
                    {navigation.state === 'submitting' ? 'Resetting...' : 'Reset Password'}
                </button>
            </Form>
            {actionData?.success && (
                <div className="mt-4 text-green-600 text-sm text-center">
                    {actionData.message}
                    <div className="mt-2">
                        <a href="/login" className="text-blue-600 hover:underline">
                            Sign in
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
