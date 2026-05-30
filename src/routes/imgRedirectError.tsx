import {Link} from "react-router";

function ImgRedirectError() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-6 md:px-8 md:py-8">
            <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-7 w-7">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008v.008H12v-.008ZM21 12a9 9 0 11-18 0 9 9 0 0118 0Z" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Nieprawidłowy link obrazka</h1>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Ten skrót nie zawiera poprawnego adresu docelowego albo został uszkodzony.
                </p>
                <Link
                    to="/img"
                    className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-indigo-700"
                >
                    Przejdź do uploadu
                </Link>
            </div>
        </div>
    );
}

export default ImgRedirectError;
