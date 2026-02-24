import axios from "axios";
import {backendUrl} from "../config.ts";
import {useEffect, useState} from "react";
import Payment from "../components/payment.tsx";
import AdminList from "../components/adminList.tsx";
import Reinstall from "../components/reinstall.tsx";
import Restart from "./shop/restart.tsx";
import {Link} from "react-router";

function Shop(props: { shop: { "domain": string, "date": string, id: number, diskUsage: number } }) {
    const {shop} = props;
    const [types, setTypes] = useState<string[]>([]);
    const [renewDays, setRenewDays] = useState<number>(95);
    const [downloading, setDownloading] = useState(false);
    const token = localStorage.getItem("token");

    const renew = () => {
        axios.get(backendUrl + "shop/" + shop.id + "/renew/" + renewDays, {
            headers: {"Authorization": "Bearer " + token},
        }).then(r => {
            if (r.data.error) {
                alert(r.data.message);
                return;
            }
            window.location.href = r.data.url;
        });
    };

    const getShopData = () => {
        axios.get(backendUrl + "shop/" + shop.id, {
            headers: {"Authorization": "Bearer " + token}
        }).then(r => {
            if (r.data.error) {
                alert(r.data.message);
                return;
            }
            setTypes(r.data.types);
        });
    };

    const downloadZip = () => {
        setDownloading(true);
        axios({
            url: backendUrl + "shop/" + shop.id + "/archive",
            method: 'POST',
            responseType: 'blob',
            headers: {"Authorization": "Bearer " + token}
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${shop.id}_backup.zip`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        }).catch((error) => {
            console.error('Nie udało się pobrać:', error);
            alert("Nie udało się pobrać kopii zapasowej.");
        }).finally(() => {
            setDownloading(false);
        });
    };

    useEffect(() => {
        getShopData();
    }, []);

    return (
        <div className="w-full">
            <div className="p-4 lg:p-6 flex flex-col gap-5">

                {/* Header */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white">{shop.domain}</h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                Pakiet aktywny do{" "}
                                <strong className="font-semibold text-slate-700 dark:text-slate-300">{shop.date}</strong>
                                <span
                                    className="ml-2 text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full font-mono">id: {shop.id}</span>
                            </p>
                        </div>
                        <a
                            href={"https://" + shop.id + ".tems.pl"}
                            target="_blank"
                            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-150"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 strokeWidth="1.5" stroke="currentColor" className="w-3.5 h-3.5">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/>
                            </svg>
                            Otwórz sklep
                        </a>
                    </div>
                </div>

                {/* Quick actions grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                    {/* Domain */}
                    <div
                        className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex flex-col gap-3">
                        <div className="flex items-center gap-2.5">
                            <div
                                className="w-8 h-8 bg-blue-50 dark:bg-blue-950/40 rounded-lg flex items-center justify-center shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth="1.5" stroke="currentColor"
                                     className="w-4 h-4 text-blue-600 dark:text-blue-400">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"/>
                                </svg>
                            </div>
                            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Domena</h2>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 flex-1">
                            Darmowa domena:{" "}
                            <a href={"https://" + shop.id + ".tems.pl"} target="_blank"
                               className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
                                {shop.id}.tems.pl
                            </a>
                        </p>
                        <Link
                            to={"/shop/" + shop.id + "/domain"}
                            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors duration-150 w-fit"
                        >
                            Ustawienia domeny
                        </Link>
                    </div>

                    {/* Logs */}
                    <div
                        className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex flex-col gap-3">
                        <div className="flex items-center gap-2.5">
                            <div
                                className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth="1.5" stroke="currentColor"
                                     className="w-4 h-4 text-slate-600 dark:text-slate-400">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
                                </svg>
                            </div>
                            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Logi</h2>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 flex-1">
                            Sprawdź czy szablon uruchomił się poprawnie i znajdź ewentualne błędy.
                        </p>
                        <Link
                            to={"/shop/" + shop.id + "/logs"}
                            className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-150 w-fit"
                        >
                            Otwórz logi
                        </Link>
                    </div>

                    {/* Backup */}
                    <div
                        className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex flex-col gap-3">
                        <div className="flex items-center gap-2.5">
                            <div
                                className="w-8 h-8 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg flex items-center justify-center shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth="1.5" stroke="currentColor"
                                     className="w-4 h-4 text-emerald-600 dark:text-emerald-400">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/>
                                </svg>
                            </div>
                            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Kopia zapasowa</h2>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 flex-1">
                            Pobierz archiwum ZIP ze wszystkimi plikami szablonu.
                        </p>
                        <button
                            onClick={downloadZip}
                            disabled={downloading}
                            className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-150 w-fit disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {downloading ? (
                                <>
                                    <svg className="w-3.5 h-3.5 animate-spin" xmlns="http://www.w3.org/2000/svg"
                                         fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                strokeWidth="4"/>
                                        <path className="opacity-75" fill="currentColor"
                                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                    </svg>
                                    Pobieranie...
                                </>
                            ) : "Pobierz ZIP"}
                        </button>
                    </div>
                </div>

                {/* Renew + Reinstall row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                    {/* Renew */}
                    <div
                        className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                        <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-1">Przedłuż hosting</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                            Wybierz liczbę dni i opłać przedłużenie planu.
                        </p>
                        <Payment daysHook={[renewDays, setRenewDays]}/>
                        <button
                            onClick={renew}
                            className="mt-4 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors duration-150"
                        >
                            Przedłuż
                        </button>
                    </div>

                    {/* Reinstall */}
                    <div
                        className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                        <Reinstall shop={shop} types={types}/>
                    </div>
                </div>

                {/* Admin list + Restart row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <div
                        className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                        <AdminList/>
                    </div>
                    <div
                        className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                        <Restart shop={shop}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Shop;
