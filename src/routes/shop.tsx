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
                            className="flex items-center justify-center gap-2 px-3 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-150 w-fit min-w-[124px] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {downloading ? (
                                <>
                                    <svg
                                        className="w-4 h-4 animate-spin text-emerald-600 dark:text-emerald-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <circle cx="12" cy="12" r="9" className="opacity-25" stroke="currentColor" strokeWidth="2.5"/>
                                        <path
                                            d="M12 3a9 9 0 019 9"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    Pobieranie...
                                </>
                            ) : (
                                <>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.8"
                                        stroke="currentColor"
                                        className="w-4 h-4"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 3v12m0 0l-4-4m4 4l4-4M4.5 17.25v.75A2.25 2.25 0 006.75 20.25h10.5A2.25 2.25 0 0019.5 18v-.75"
                                        />
                                    </svg>
                                    Pobierz ZIP
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Renew + Restart + Partners */}
                <div className="flex flex-col sm:flex-row gap-5 items-stretch">
                    <div
                        className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5 w-full sm:w-72 shrink-0">
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

                    {/* Restart + Informacje (kolumna) */}
                    <div className="flex flex-col gap-5 flex-1">
                        <div
                            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                            <Restart shop={shop}/>
                        </div>

                        {/* Informacje */}
                        <div
                            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex flex-col gap-4">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg flex items-center justify-center shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth="1.5" stroke="currentColor"
                                         className="w-4 h-4 text-indigo-600 dark:text-indigo-400">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/>
                                    </svg>
                                </div>
                                <h2 className="text-base font-semibold text-slate-900 dark:text-white">Informacje</h2>
                            </div>

                            <a
                                href="https://wiki.vishop.pl"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors duration-150 group"
                            >
                                <img
                                    src="https://www.google.com/s2/favicons?domain=vishop.pl&sz=32"
                                    alt="Wiki vishop"
                                    className="w-5 h-5 shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">Wiki</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">wiki.vishop.pl — dokumentacja i poradniki</p>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth="1.5" stroke="currentColor"
                                     className="w-4 h-4 text-slate-400 shrink-0 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
                                </svg>
                            </a>

                            <a
                                href="https://discord.gg/2VZUEuTjc8"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors duration-150 group"
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor"
                                     className="w-5 h-5 shrink-0 text-[#5865F2]">
                                    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                                </svg>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">Discord</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">FAQ i pomoc techniczna</p>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth="1.5" stroke="currentColor"
                                     className="w-4 h-4 text-slate-400 shrink-0 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Partners */}
                    <div
                        className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex-1 flex flex-col gap-4">
                        <div>
                            <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-1">Usługi partnerskie</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Polecani partnerzy tems.pl</p>
                        </div>

                        {/* ivhost */}
                        <div className="flex flex-col gap-2.5 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2.5">
                                <img
                                    src="https://www.google.com/s2/favicons?domain=ivhost.pl&sz=32"
                                    alt="ivhost"
                                    className="w-6 h-6  shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white">ivhost</span>
                                    <span className="ml-2 text-xs text-slate-400 dark:text-slate-500">Hosting</span>
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                +10% do doładowania przy rejestracji z kodem
                            </p>
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                                <span className="text-sm font-mono font-semibold px-2.5 py-1 rounded-md text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 tracking-wide">
                                    Kod: tems
                                </span>
                                <a
                                    href="https://panel.ivhost.pl/wallet"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md transition-colors duration-150 hover:opacity-90"
                                    style={{backgroundColor: '#6ee7b7', color: '#0f4c35'}}
                                >
                                    Przejdź
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth="2" stroke="currentColor" className="w-3 h-3">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/>
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* simpay */}
                        <div className="flex flex-col gap-2.5 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2.5">
                                <img
                                    src="https://www.google.com/s2/favicons?domain=simpay.pl&sz=32"
                                    alt="SimPay"
                                    className="w-6 h-6  shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white">SimPay</span>
                                    <span className="ml-2 text-xs text-slate-400 dark:text-slate-500">Operator płatności</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                                <span className="text-sm font-mono font-semibold px-2.5 py-1 rounded-md text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 tracking-wide">
                                    Kod: temspl
                                </span>
                                <a
                                    href="https://panel.simpay.pl/ref/temspl"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md transition-colors duration-150 hover:opacity-90"
                                    style={{backgroundColor: '#00d14f', color: '#fff'}}
                                >
                                    Przejdź (reflink)
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth="2" stroke="currentColor" className="w-3 h-3">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Admin list + Reinstall — obok siebie */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <div
                        className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                        <AdminList/>
                    </div>

                    <div
                        className="bg-white dark:bg-slate-900 rounded-xl border border-red-200 dark:border-red-900/50 p-5">
                        <Reinstall shop={shop} types={types}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Shop;
