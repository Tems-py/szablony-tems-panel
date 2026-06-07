import {useEffect, useMemo} from "react";
import {Link, useParams} from "react-router";
import {decodeRedirectCode, normalizeRedirectCode} from "../utils/imgUpload.ts";
import ImgRedirectError from "./imgRedirectError.tsx";

function ImgRedirect() {
    const {code} = useParams();

    const targetUrl = useMemo(() => {
        try {
            if (!code) {
                return null;
            }

            const imageId = decodeRedirectCode(normalizeRedirectCode(code));
            if (!imageId) {
                return null;
            }

            const url = new URL(`https://ibb.co/${imageId}`);
            return url.toString();
        } catch {
            return null;
        }
    }, [code]);

    useEffect(() => {
        if (!targetUrl) return;
        window.location.replace(targetUrl);
    }, [targetUrl]);

    if (!targetUrl) {
        return <ImgRedirectError/>;
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-6 md:px-8 md:py-8">
            <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-7 w-7">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 21 10.5m0 0-3.75 3.75M21 10.5H3" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Przekierowanie do obrazka</h1>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Jeśli nic się nie wydarzy, odśwież stronę albo wróć do uploadu.
                </p>
                <Link
                    to="/img"
                    className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-indigo-700"
                >
                    Wróć do /img
                </Link>
            </div>
        </div>
    );
}

export default ImgRedirect;
