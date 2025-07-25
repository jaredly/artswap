// app/routes/verify-email.tsx
import {useLoaderData} from 'react-router-dom';
import type {LoaderFunctionArgs} from 'react-router';
import {verifyJWT} from '~/lib/auth/tokens';
import {getArtistById, updateArtist} from '~/lib/db/artist';

export async function loader({request}: LoaderFunctionArgs) {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');
    if (!token) {
        return {success: false, message: 'Verification token missing.'};
    }

    const payload = verifyJWT<{artistId: string}>(token);
    if (!payload || !payload.artistId) {
        return {success: false, message: 'Invalid or expired verification token.'};
    }

    const artist = await getArtistById(payload.artistId);
    if (!artist) {
        return {success: false, message: 'Artist not found.'};
    }

    await updateArtist(artist.id, {status: 'ACTIVE'});
    return {success: true, message: 'Your email has been verified. You may now sign in.'};
}

export default function VerifyEmailPage() {
    const {success, message} = useLoaderData() as {success: boolean; message: string};
    return (
        <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
            <div className={success ? 'text-green-600' : 'text-red-600'}>{message}</div>
            {success && (
                <div className="mt-6">
                    <a href="/login" className="text-blue-600 hover:underline">
                        Sign in
                    </a>
                </div>
            )}
        </div>
    );
}
