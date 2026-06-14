import {useLocation, useNavigate} from "react-router";
import DarkModeToggle from "../components/darkModeToggle.tsx";

const NotFound = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleGoBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
            return;
        }

        navigate("/");
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
            <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-6 sm:px-6 lg:px-8">
                <div className="flex justify-end">
                    <DarkModeToggle/>
                </div>

                <div className="flex flex-1 items-center justify-center py-10">
                    <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-10">
                        <div className="text-center">
                            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                                Error 404
                            </p>

                            <h1 className="mt-4 text-7xl font-black leading-none text-slate-200 dark:text-slate-800 sm:text-8xl">
                                404
                            </h1>

                            <h2 className="mt-6 text-2xl font-bold tracking-tight sm:text-4xl">
                                Tej strony nie udalo sie znalezc
                            </h2>

                            <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                                Link moze byc nieaktualny albo adres zostal wpisany z bledem.
                            </p>

                            <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-100 px-4 py-4 text-left dark:border-slate-600 dark:bg-slate-800/70">
                                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
                                    Aktualna sciezka
                                </p>
                                <code className="mt-2 block break-all text-sm text-slate-500 dark:text-slate-400 sm:text-base">
                                    {location.pathname || "/"}
                                    {location.search}
                                    {location.hash}
                                </code>
                            </div>

                            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={handleGoBack}
                                    className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition-colors duration-150 hover:bg-indigo-700"
                                >
                                    Wroc do poprzedniej strony
                                </button>

                                <a
                                    href="/"
                                    className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                                >
                                    Strona glowna
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
