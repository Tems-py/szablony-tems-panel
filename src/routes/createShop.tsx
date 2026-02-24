import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router";
import Sidebar from "../components/sidebar.tsx";
import axios from "axios";
import {backendUrl} from "../config.ts";
import Payment from "../components/payment.tsx";

const CreateShop: React.FC = () => {
    const navigatorFunction = useNavigate();
    const [boughtTemplates, setBoughtTemplates] = useState<string[]>([])
    const [templates, setTemplates] = useState<{ name: string, price: number, id: number, vishop: boolean }[]>([])
    const [error, setError] = useState<string | null>(null)

    const [renewDays, setRenewDays] = useState<number>(95)
    const [domain, setDomain] = useState<string>("")
    const [vishopId, setVishopId] = useState<number>(0)
    const [type, setType] = useState<string>("")
    const [rulesAccepted, setRulesAccepted] = useState<boolean>(false)

    const selectedTemplate = templates.find((t) => t.name === type)

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigatorFunction("/login", {replace: true});
            return;
        }

        axios.get(backendUrl + "panel", {
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
            setBoughtTemplates(response.data.bought_templates);
            setTemplates(response.data.templates);
            setType(response.data.templates[0]?.name || "");
        });
    }, []);

    const buy = () => {
        if (!rulesAccepted) {
            setError("Musisz zaakceptować regulamin, aby kontynuować.");
            return;
        }
        setError(null);
        const token = localStorage.getItem("token");

        axios.post(backendUrl + "buy", {
            domain: domain,
            vishop_id: vishopId,
            template: type,
            days: renewDays
        }, {
            headers: {"Authorization": "Bearer " + token}
        }).then(response => {
            if (response.data.error) {
                setError(response.data.message);
                return;
            }
            window.location.href = response.data.url;
        });
    };

    const buyTemplate = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigatorFunction("/login", {replace: true});
            return;
        }
        const template = templates.find((t) => t.name === type);
        if (template == null) return;

        if (template.vishop) {
            alert("Ten szablon jest dostępny do zakupu w oficjalnym panelu vishop");
            window.location.href = "https://panel.vishop.pl/";
            return;
        }

        axios.post(backendUrl + "buy_template", {template_id: template.id}, {
            headers: {"Authorization": "Bearer " + token}
        }).then(response => {
            if (response.data.error) {
                alert(response.data.message);
                return;
            }
            window.location.href = response.data.url;
        });
    };

    return (
        <div className="flex gap-4 flex-col lg:flex-row p-4 md:p-8 min-h-screen bg-slate-50 dark:bg-slate-950">
            <Sidebar/>

            <main className="flex-grow min-w-0">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Wykup nowy hosting</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Uzupełnij poniższy formularz, aby uruchomić swój sklep.
                    </p>
                </div>

                <div className="max-w-2xl flex flex-col gap-4">

                    {/* Form card */}
                    <div
                        className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col gap-5">

                        {/* Domain */}
                        <div>
                            <label
                                className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                                Domena sklepu
                            </label>
                            <input
                                type="text"
                                placeholder="np. minecraft.pl"
                                value={domain}
                                onChange={e => setDomain(e.target.value)}
                                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">
                                Domena, na której będzie działał Twój sklep. Możesz ją zmienić później.
                            </p>
                        </div>

                        {/* Vishop ID */}
                        <div>
                            <label
                                className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                                ID Vishop
                            </label>
                            <input
                                type="number"
                                placeholder="Wpisz ID sklepu z panel.vishop.pl"
                                value={vishopId}
                                onChange={e => setVishopId(Number(e.target.value))}
                                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">
                                Znajdziesz je w panelu Vishop - służy do synchronizacji danych sklepu.
                            </p>
                        </div>

                        {/* Template type */}
                        <div>
                            <label
                                className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                                Rodzaj szablonu
                            </label>
                            <select
                                value={type}
                                onChange={e => setType(e.target.value)}
                                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                {templates.map((t, i) => (
                                    <option value={t.name} key={i}>
                                        {t.name}{t.price !== 0 && !boughtTemplates.includes(t.name) ? ` - ${t.price} zł` : ""}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Preview + needs to buy notice */}
                        {type && (
                            <div className="flex gap-4 flex-col sm:flex-row items-start">
                                <div
                                    className="w-full sm:w-40 shrink-0 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                                    <img src={"/img/" + type + ".png"} alt={type}
                                         className="w-full h-28 object-cover bg-slate-100 dark:bg-slate-800"/>
                                </div>
                                {selectedTemplate !== undefined && selectedTemplate.price !== 0 && !boughtTemplates.includes(type) && (
                                    <div
                                        className="flex-1 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/60 rounded-lg text-sm text-blue-700 dark:text-blue-300">
                                        <p>Nie masz jeszcze zakupionego tego szablonu.</p>
                                        <button
                                            onClick={buyTemplate}
                                            className="mt-2 text-sm font-semibold underline underline-offset-2 hover:no-underline"
                                        >
                                            Kup szablon za {selectedTemplate.price} zł →
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        <hr className="border-slate-100 dark:border-slate-800"/>

                        {/* Payment */}
                        <div>
                            <label
                                className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-3">
                                Czas trwania
                            </label>
                            <Payment daysHook={[renewDays, setRenewDays]}/>
                        </div>

                        <hr className="border-slate-100 dark:border-slate-800"/>

                        {/* Rules */}
                        <label
                            className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={rulesAccepted}
                                onChange={() => setRulesAccepted(old => !old)}
                                className="mt-0.5 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                                Akceptuję{" "}
                                <a
                                    href="https://szablony.tems.pl/regulamin_platnosci"
                                    className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline underline-offset-2"
                                    target="_blank"
                                >
                                    regulamin płatności
                                </a>
                            </span>
                        </label>

                        {/* Error */}
                        {error != null && (
                            <div
                                className="flex items-start gap-3 p-4 rounded-lg border-l-4 border-red-500 bg-red-50 dark:bg-red-950/30">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                     className="h-5 w-5 text-red-500 shrink-0 mt-0.5">
                                    <path fillRule="evenodd"
                                          d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                                          clipRule="evenodd"/>
                                </svg>
                                <div>
                                    <p className="text-sm font-semibold text-red-700 dark:text-red-300">Błąd</p>
                                    <p className="text-sm text-red-600 dark:text-red-400 mt-0.5">{error}</p>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={buy}
                            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors duration-150"
                        >
                            Przejdź do płatności
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CreateShop;
