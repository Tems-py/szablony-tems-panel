import React, {useState} from "react";
import axios from "axios";
import {backendUrl} from "../../config.ts";

function Domain(props: { shop: { "domain": string, "date": string, id: number } }) {
    const {shop} = props;
    const [domain, setDomain] = useState("");
    const token = localStorage.getItem("token");
    const [txt, setTxt] = useState({status: "", txt_name: "", txt_value: ""});
    const [addingDomain, setAddingDomain] = useState(false);

    const changeDomain = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        axios.post(backendUrl + "shop/" + shop.id + "/domain", {domain}, {
            headers: {"Authorization": "Bearer " + token}
        }).then(r => {
            alert(r.data.message);
        }).catch(err => {
            alert(err.response.data.message);
        });
    };

    const addDomain = () => {
        setAddingDomain(true);
        axios.put(backendUrl + "shop/" + shop.id + "/domain", {}, {
            headers: {"Authorization": "Bearer " + token}
        }).then(r => {
            setAddingDomain(false);
            alert(r.data.message);
        }).catch(err => {
            setAddingDomain(false);
            alert(err.response.data.message);
        });
    };

    const getTxt = () => {
        axios.get(backendUrl + "shop/" + shop.id + "/domain", {
            headers: {"Authorization": "Bearer " + token}
        }).then(r => {
            if (r.data.error) {
                alert(r.data.message);
                return;
            }
            setTxt(r.data.data);
        }).catch(err => {
            alert(err.response.data.message);
        });
    };

    return (
        <div className="w-full p-4 lg:p-6 flex flex-col gap-5">

            {/* Header */}
            <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">Zarządzanie domeną</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Aktualna domena:{" "}
                    <span className="font-medium text-slate-700 dark:text-slate-300">{shop.domain}</span>
                </p>
            </div>

            {/* How to connect domain */}
            <div
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">Podłącz domenę</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        Wykonaj poniższe kroki, aby podłączyć własną domenę do swojego sklepu.
                    </p>
                </div>

                <div className="p-5 flex flex-col gap-5">

                    {/* Step 1 */}
                    <div className="flex gap-4">
                        <div
                            className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                            1
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                                Dodaj rekord CNAME w panelu DNS swojej domeny
                            </p>
                            <div
                                className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                                <table className="w-full text-sm">
                                    <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                        <th className="px-4 py-2.5 text-left">Typ</th>
                                        <th className="px-4 py-2.5 text-left">Nazwa</th>
                                        <th className="px-4 py-2.5 text-left">Wartość</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr className="border-t border-slate-100 dark:border-slate-800">
                                        <td className="px-4 py-2.5 font-mono text-slate-900 dark:text-white">CNAME</td>
                                        <td className="px-4 py-2.5 font-mono text-slate-900 dark:text-white">{shop.domain}</td>
                                        <td className="px-4 py-2.5 font-mono text-indigo-600 dark:text-indigo-400">szablony.tems.pl</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                                Przykład w panelu Cloudflare:
                            </p>
                            <img src="https://i.imgur.com/amJwOGV.png" alt="przykład cloudflare"
                                 className="mt-2 max-w-md rounded-lg border border-slate-200 dark:border-slate-700"/>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex gap-4">
                        <div
                            className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                            2
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                                Poinformuj nasz system o nowej domenie
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                                Po dodaniu rekordu CNAME kliknij poniższy przycisk, aby nasz system zweryfikował domenę.
                            </p>
                            <button
                                onClick={addDomain}
                                disabled={addingDomain}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors duration-150 disabled:opacity-50"
                            >
                                {addingDomain && (
                                    <svg className="w-3.5 h-3.5 animate-spin" xmlns="http://www.w3.org/2000/svg"
                                         fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                strokeWidth="4"/>
                                        <path className="opacity-75" fill="currentColor"
                                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                    </svg>
                                )}
                                Dodaj domenę
                            </button>
                        </div>
                    </div>

                    {/* Step 3 - Non-Cloudflare TXT */}
                    <div className="flex gap-4">
                        <div
                            className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                            3
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                                (Opcjonalnie) Rekord TXT - tylko dla użytkowników bez Cloudflare
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                                Użytkownicy Cloudflare mogą pominąć ten krok. Dla pozostałych - odczekaj 10 sekund
                                po kroku 2, następnie pobierz dane rekordu TXT.
                            </p>
                            <button
                                onClick={getTxt}
                                className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-150"
                            >
                                Pobierz dane rekordu TXT
                            </button>

                            {txt.status !== "" && (
                                <div
                                    className="mt-3 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                                    <table className="w-full text-sm">
                                        <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                            <th className="px-4 py-2.5 text-left">Typ</th>
                                            <th className="px-4 py-2.5 text-left">Nazwa</th>
                                            <th className="px-4 py-2.5 text-left">Wartość</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr className="border-t border-slate-100 dark:border-slate-800">
                                            <td className="px-4 py-2.5 font-mono text-slate-900 dark:text-white">TXT</td>
                                            <td className="px-4 py-2.5 font-mono text-slate-900 dark:text-white break-all">{txt.txt_name}</td>
                                            <td className="px-4 py-2.5 font-mono text-indigo-600 dark:text-indigo-400 break-all">{txt.txt_value}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Change domain */}
            <div
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-1">Zmień domenę</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    Po zmianie domeny musisz ponownie wykonać wszystkie powyższe kroki dla nowej domeny.
                </p>

                <form onSubmit={changeDomain} className="flex flex-col sm:flex-row gap-3 max-w-md">
                    <input
                        type="text"
                        value={domain}
                        onChange={e => setDomain(e.target.value)}
                        placeholder={shop.domain}
                        className="flex-1 px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors duration-150 shrink-0"
                    >
                        Zmień domenę
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Domain;
