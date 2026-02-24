import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router";
import Sidebar from "../components/sidebar.tsx";
import axios from "axios";
import {backendUrl} from "../config.ts";

const Resources: React.FC = () => {
    const navigatorFunction = useNavigate();
    const [files, setFiles] = useState<string[]>([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigatorFunction("/login", {replace: true});
            return;
        }

        axios.get(backendUrl + "resources", {
            headers: {"Authorization": "Bearer " + token}
        }).then(response => {
            if (response.data.error) {
                if (response.data.error === "token_expired" || response.data.error === "token_invalid") {
                    localStorage.clear();
                    navigatorFunction("/login", {replace: true});
                    return;
                }
                alert(response.data.message);
            }
            setFiles(response.data.files);
        });
    }, []);

    return (
        <div className="flex gap-4 flex-col lg:flex-row p-4 md:p-8 min-h-screen bg-slate-50 dark:bg-slate-950">
            <Sidebar/>

            <main className="flex-grow min-w-0">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Zasoby</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Dodatkowe zasoby graficzne do użycia w Twoim sklepie.
                    </p>
                </div>

                {/* License notice */}
                <div
                    className="flex items-start gap-3 p-4 mb-5 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 rounded-xl text-sm text-indigo-700 dark:text-indigo-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                         stroke="currentColor" className="w-5 h-5 shrink-0 mt-0.5">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/>
                    </svg>
                    <p>
                        Zasobów możesz używać w swoim sklepie dopóki posiadasz aktywny plan hostingu.{" "}
                        <strong>Zakaz rozpowszechniania, sprzedaży i przypisywania sobie autorstwa.</strong>
                    </p>
                </div>

                {files.length === 0 ? (
                    <div
                        className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl text-sm text-red-700 dark:text-red-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor" className="w-5 h-5 shrink-0 mt-0.5">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
                        </svg>
                        <p>Nie masz dostępu do tej treści. Musisz posiadać wykupiony plan hostingu.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {files.map((file: string) => (
                            <div
                                key={file}
                                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors duration-150"
                            >
                                <div
                                    className="h-40 bg-slate-50 dark:bg-slate-800 flex items-center justify-center p-4">
                                    <img
                                        src={"https://szablony.tems.pl/static/resources/" + file}
                                        alt={file}
                                        className="max-h-full max-w-full object-contain"
                                    />
                                </div>
                                <div className="p-3 border-t border-slate-100 dark:border-slate-800">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mb-2">{file}</p>
                                    <a
                                        href={"https://szablony.tems.pl/static/resources/" + file}
                                        download
                                        className="flex items-center justify-center gap-1.5 w-full py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition-colors duration-150"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             strokeWidth="1.5" stroke="currentColor" className="w-3.5 h-3.5">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
                                        </svg>
                                        Pobierz
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Resources;
