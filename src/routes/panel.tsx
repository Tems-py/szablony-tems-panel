import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router";
import Sidebar from "../components/sidebar.tsx";
import axios from "axios";
import {backendUrl} from "../config.ts";

const Panel: React.FC = () => {
    const navigatorFunction = useNavigate();
    const [adminInvite, setAdminInvite] = useState("")
    const [boughtTemplates, setBoughtTemplates] = useState<string[]>([])
    const [shops, setShops] = useState<{ date: string, domain: string, id: number }[]>([])
    const [templates, setTemplates] = useState<{ name: string, price: number, id: number, vishop: boolean }[]>([])
    const [copied, setCopied] = useState(false)
    const [inviteHovered, setInviteHovered] = useState(false)

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
            setAdminInvite(response.data.admin_invite);
            setBoughtTemplates(response.data.bought_templates);
            setShops(response.data.shops);
            setTemplates(response.data.templates);
        }).catch(err => {
            if (err.response?.data?.error === "token_expired" || err.response?.data?.error === "invalid_token") {
                localStorage.clear();
                navigatorFunction("/login", {replace: true});
                return;
            }
            alert(err.response?.data?.msg);
        });
    }, []);

    const buyTemplate = (template: { name: string, price: number, id: number, vishop: boolean }) => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigatorFunction("/login", {replace: true});
            return;
        }

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

    const copyCode = () => {
        navigator.clipboard.writeText(adminInvite).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const premiumTemplates = templates.filter(t => t.price !== 0);
    const [previewTemplate, setPreviewTemplate] = useState<{ name: string, price: number, id: number, vishop: boolean } | null>(null);

    return (
        <div className="flex gap-4 flex-col lg:flex-row p-4 md:p-8 min-h-screen bg-slate-50 dark:bg-slate-950">

            {/* Template preview modal */}
            {previewTemplate && (
                <div
                    className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4"
                    onClick={() => setPreviewTemplate(null)}
                >
                    <div
                        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 max-w-md w-full overflow-hidden shadow-xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="relative">
                            <img
                                src={"/img/" + previewTemplate.name + ".png"}
                                alt={previewTemplate.name}
                                className="w-full h-52 object-cover bg-slate-100 dark:bg-slate-800"
                            />
                            <button
                                onClick={() => setPreviewTemplate(null)}
                                className="absolute top-3 right-3 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="flex items-start justify-between gap-3 mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{previewTemplate.name}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Szablon premium - jednorazowy zakup</p>
                                </div>
                                <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                                    {previewTemplate.price} zł
                                </span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => { buyTemplate(previewTemplate); setPreviewTemplate(null); }}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors duration-150"
                                >
                                    Kup szablon za {previewTemplate.price} zł
                                </button>
                                <Link
                                    to="/panel/buy"
                                    onClick={() => setPreviewTemplate(null)}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-150"
                                >
                                    Użyj w nowym hostingu
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Sidebar/>

            <main className="flex-grow min-w-0">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Panel szablonów</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Zarządzaj swoimi usługami i szablonami.
                    </p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-5">
                    {/* Left column */}
                    <div className="flex flex-col gap-5">

                        {/* Your services */}
                        <div
                            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                            <div
                                className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">Twoje
                                        usługi</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Aktywne plany
                                        hostingowe</p>
                                </div>
                                <Link to="/panel/buy"
                                      className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors duration-150 shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                                    </svg>
                                    Nowy hosting
                                </Link>
                            </div>

                            {shops.length === 0 ? (
                                <div className="px-5 py-12 text-center">
                                    <div
                                        className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             strokeWidth="1.5" stroke="currentColor"
                                             className="w-6 h-6 text-slate-400">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"/>
                                        </svg>
                                    </div>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">Brak aktywnych
                                        usług</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                        Kup swój pierwszy plan hostingowy, aby zacząć.
                                    </p>
                                    <Link to="/panel/buy"
                                          className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors duration-150">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M12 4.5v15m7.5-7.5h-15"/>
                                        </svg>
                                        Kup hosting
                                    </Link>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {shops.map((shop) => (
                                        <div
                                            key={shop.id}
                                            onClick={() => navigatorFunction("/shop/" + shop.id)}
                                            className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors duration-150 group"
                                        >
                                            <div
                                                className="w-8 h-8 bg-indigo-50 dark:bg-indigo-950/60 rounded-lg flex items-center justify-center shrink-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                     viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
                                                     className="w-4 h-4 text-indigo-600 dark:text-indigo-400">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                          d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"/>
                                                </svg>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{shop.domain}</p>
                                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Ważny
                                                    do: {shop.date}</p>
                                            </div>
                                            <span
                                                className="text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full shrink-0">#{shop.id}</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 strokeWidth="1.5" stroke="currentColor"
                                                 className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-400 dark:group-hover:text-slate-400 transition-colors shrink-0">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
                                            </svg>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Your templates */}
                        {boughtTemplates.length > 0 && (
                            <div
                                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                                <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">Twoje
                                        szablony</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Szablony dostępne w
                                        Twoim koncie</p>
                                </div>
                                <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {boughtTemplates.map((template) => (
                                        <div
                                            key={template}
                                            className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden flex flex-col hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors duration-150"
                                        >
                                            <img
                                                src={"/img/" + template + ".png"}
                                                alt={template}
                                                className="object-cover w-full h-24 bg-slate-100 dark:bg-slate-800"
                                            />
                                            <div className="p-3 flex flex-col gap-2 flex-1">
                                                <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{template}</p>
                                                <Link
                                                    to="/panel/buy"
                                                    className="text-xs text-center py-1.5 px-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-150 font-medium"
                                                >
                                                    Użyj
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Premium templates */}
                        {premiumTemplates.length > 0 && (
                            <div
                                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                                <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">Szablony
                                        premium</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Płatne szablony do
                                        jednorazowego zakupu</p>
                                </div>
                                <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {premiumTemplates.map((template, i) => (
                                        <div
                                            key={i}
                                            onClick={() => setPreviewTemplate(template)}
                                            className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden flex flex-col hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-sm transition-all duration-150 cursor-pointer group"
                                        >
                                            <div className="relative overflow-hidden">
                                                <img
                                                    src={"/img/" + template.name + ".png"}
                                                    alt={template.name}
                                                    className="object-cover w-full h-24 bg-slate-100 dark:bg-slate-800 group-hover:scale-105 transition-transform duration-200"
                                                />
                                                <span
                                                    className="absolute top-2 right-2 text-xs font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                                                    {template.price} zł
                                                </span>
                                            </div>
                                            <div className="p-3 flex flex-col gap-2 flex-1">
                                                <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{template.name}</p>
                                                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                                                    Kliknij, aby zobaczyć →
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right column — invite code */}
                    <div className="flex flex-col gap-5">
                        <div
                            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                            <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-1">Kod
                                zaproszenia</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                                Podaj ten kod osobie, która chce Cię dodać jako administratora swojego sklepu.
                            </p>
                            <button
                                type="button"
                                onClick={copyCode}
                                onMouseEnter={() => setInviteHovered(true)}
                                onMouseLeave={() => setInviteHovered(false)}
                                onFocus={() => setInviteHovered(true)}
                                onBlur={() => setInviteHovered(false)}
                                title="Najedź, aby podejrzeć. Kliknij, aby skopiować."
                                className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg border text-left transition-all duration-150 ${
                                    copied
                                        ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900"
                                        : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750"
                                }`}
                            >
                                <span
                                    className={`flex-1 min-w-0 text-sm font-mono text-slate-700 dark:text-slate-300 transition duration-150 ${
                                        inviteHovered ? "blur-0" : "blur-sm select-none"
                                    }`}
                                >
                                    {adminInvite || "Brak kodu"}
                                </span>
                                <span
                                    className={`shrink-0 inline-flex items-center gap-1.5 text-xs font-medium ${
                                        copied
                                            ? "text-emerald-600 dark:text-emerald-400"
                                            : "text-slate-500 dark:text-slate-400"
                                    }`}
                                >
                                    {copied ? (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M4.5 12.75l6 6 9-13.5"/>
                                            </svg>
                                            Skopiowano
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"/>
                                            </svg>
                                            Kliknij, aby skopiować
                                        </>
                                    )}
                                </span>
                            </button>
                            {copied && (
                                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">
                                    Skopiowano do schowka!
                                </p>
                            )}
                        </div>

                        {/* Quick links */}
                        <div
                            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Szybkie
                                linki</h2>
                            <div className="flex flex-col gap-1.5">
                                <Link to="/panel/resources"
                                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-150">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 shrink-0">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
                                    </svg>
                                    Pobierz zasoby
                                </Link>
                                <Link to="/panel/plugins"
                                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-150">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 shrink-0">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.959.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z"/>
                                    </svg>
                                    Pluginy
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Panel;
