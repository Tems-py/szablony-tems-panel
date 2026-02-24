import React, { useEffect, useState } from 'react';
import axios from "axios";
import { backendUrl } from "../config.ts";
import { Link } from "react-router";

const Index: React.FC = () => {
    const [templates, setTemplates] = useState<{ name: string; url: string }[]>([]);
    const [shops, setShops] = useState<{ domain: string; url: string; id: number }[]>([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        axios.get(backendUrl + "index").then(response => {
            setTemplates(response.data.templates);
            setShops(response.data.shops);
            setLoaded(true);
        });

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap';
        document.head.appendChild(link);
        return () => { if (document.head.contains(link)) document.head.removeChild(link); };
    }, []);

    const features = [
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
            ),
            title: 'Ochrona Anty-DDOS',
            desc: 'Twój sklep pozostaje online niezależnie od ataków.',
            accent: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/50',
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                </svg>
            ),
            title: 'Uruchomienie < 1 minuta',
            desc: 'Po opłaceniu hosting uruchamia się automatycznie. Nie czekasz.',
            accent: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50',
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                </svg>
            ),
            title: 'Łatwy panel zarządzania',
            desc: 'Intuicyjny interfejs do konfiguracji wszystkich ustawień.',
            accent: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60',
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776" />
                </svg>
            ),
            title: 'Edytor plików w przeglądarce',
            desc: 'Modyfikuj pliki szablonu bezpośrednio z poziomu panelu.',
            accent: 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40',
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
            ),
            title: 'Darmowa subdomena',
            desc: 'Sklep dostępny pod adresem id.tems.pl od pierwszej chwili.',
            accent: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40',
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                </svg>
            ),
            title: 'Wsparcie na Discordzie',
            desc: 'Napisz do nas - odpiszemy szybko i rozwiążemy każdy problem.',
            accent: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40',
        },
    ];

    const Tick = () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-emerald-500 shrink-0">
            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
        </svg>
    );

    return (
        <div
            style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
            className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white overflow-x-hidden"
        >

            {/* ── Hero ── */}
            <section className="relative pt-20 pb-28 px-6 text-center overflow-hidden">
                {/* Background glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[480px] pointer-events-none select-none" aria-hidden>
                    <div className="absolute inset-0 bg-gradient-radial from-indigo-400/20 via-violet-300/10 to-transparent dark:from-indigo-600/25 dark:via-violet-700/10 blur-3xl rounded-full" />
                </div>

                <div className="relative max-w-4xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-100 dark:border-indigo-900/80 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-8 select-none">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse shrink-0" />
                        Hosting szablonów vishop.pl
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-slate-900 dark:text-white leading-[1.05] tracking-tight mb-6">
                        Twój sklep,{' '}
                        <span className="text-indigo-600 dark:text-indigo-400">
                            gotowy<br className="hidden sm:block" /> w minutę
                        </span>
                    </h1>

                    <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed mb-10">
                        Hosting szablonów vishop z pełnym panelem zarządzania,
                        darmową subdomeną i natychmiastowym uruchomieniem.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
                        <a
                            href="/login"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-xl transition-colors duration-150 text-base shadow-lg shadow-indigo-500/25"
                        >
                            Zacznij teraz
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                            </svg>
                        </a>
                        <a
                            href="#szablony"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors duration-150 text-base"
                        >
                            Zobacz szablony
                        </a>
                    </div>

                    {/* Stats strip */}
                    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2.5 text-sm text-slate-400 dark:text-slate-500">
                        {[
                            ['Od', '7 zł/miesiąc'],
                            [loaded ? String(templates.length) : '…', 'dostępnych szablonów'],
                            ['Logowanie przez', 'Discord'],
                        ].map(([pre, bold], i) => (
                            <div key={i} className="flex items-center gap-1.5">
                                <Tick />
                                <span>{pre} <strong className="text-slate-600 dark:text-slate-300 font-semibold">{bold}</strong></span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Features ── */}
            <section className="py-20 px-6 border-t border-slate-100 dark:border-slate-800/70">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3">
                            Wszystko, czego potrzebujesz
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-lg">
                            Jeden plan. Wszystkie funkcje. Żadnych niespodzianek.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {features.map((f, i) => (
                            <div
                                key={i}
                                className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-sm transition-all duration-200"
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 shrink-0 ${f.accent}`}>
                                    {f.icon}
                                </div>
                                <h3 className="font-semibold text-slate-900 dark:text-white mb-1.5 text-sm">{f.title}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Pricing ── */}
            <section className="py-20 px-6 bg-slate-50 dark:bg-slate-900/40" id="cennik">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3">Prosty cennik</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-lg">Jeden plan. Wszystkie funkcje. Płacisz tylko za czas.</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-indigo-500 dark:border-indigo-600 p-8 sm:p-10 shadow-xl shadow-indigo-500/10">
                        {/* Header */}
                        <div className="flex flex-wrap items-start justify-between gap-5 mb-8 pb-8 border-b border-slate-100 dark:border-slate-800">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">
                                    Hosting szablonu
                                </p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight">7</span>
                                    <span className="text-2xl font-bold text-slate-900 dark:text-white">zł</span>
                                    <span className="text-slate-400 dark:text-slate-500 ml-1 text-sm">/miesiąc</span>
                                </div>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">Im dłuższy okres - tym większa zniżka</p>
                            </div>
                            <a
                                href="/login"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors text-sm shadow-lg shadow-indigo-500/25 whitespace-nowrap"
                            >
                                Zaczynajmy
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                    <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                                </svg>
                            </a>
                        </div>

                        {/* Feature list */}
                        <div className="grid sm:grid-cols-2 gap-3">
                            {[
                                'Ochrona Anty-DDOS',
                                'Łatwa konfiguracja przez panel',
                                'Wsparcie na Discordzie',
                                'Automatyczne uruchomienie szablonu',
                                'Restart jednym kliknięciem',
                                'Darmowa subdomena (id.tems.pl)',
                                'Edytor plików w przeglądarce',
                                `${loaded ? templates.length : '…'} dostępnych szablonów`,
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2.5">
                                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center shrink-0">
                                        <Tick />
                                    </div>
                                    <span className="text-sm text-slate-600 dark:text-slate-400">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Templates Showcase ── */}
            <section className="py-20 px-6" id="szablony">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3">Odkryj nasze szablony</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-lg">Gotowe szablony sklepów vishop.pl - wybierz swój styl.</p>
                    </div>

                    {templates.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {templates.map((template, i) => (
                                <Link
                                    key={i}
                                    to={template.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group block bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300"
                                >
                                    <div className="overflow-hidden aspect-video bg-slate-100 dark:bg-slate-800">
                                        <img
                                            src={`/img/${template.name}.png`}
                                            alt={`Szablon ${template.name}`}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-4 flex items-center justify-between">
                                        <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{template.name}</h3>
                                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/60 transition-colors">
                                            Demo
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3 h-3">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                            </svg>
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-slate-100 dark:bg-slate-800/60 rounded-2xl aspect-video animate-pulse" />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ── Social proof ── */}
            {shops.length > 0 && (
                <section className="py-20 px-6 border-t border-slate-100 dark:border-slate-800/70">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3">Zaufali nam</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-lg">Sklepy już korzystające z naszego hostingu.</p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {shops.map((shop, i) => (
                                <Link
                                    key={i}
                                    to={`https://${shop.id}.tems.pl`}
                                    target="_blank"
                                    rel="nofollow noopener ugc"
                                    className="flex flex-col items-center p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-md transition-all duration-200 gap-2.5"
                                >
                                    <img
                                        src={shop.url || "/placeholder.svg"}
                                        alt={`Logo ${shop.domain}`}
                                        className="w-12 h-12 rounded-xl object-contain"
                                    />
                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center truncate w-full">
                                        {shop.domain}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── CTA ── */}
            <section className="relative py-24 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-indigo-600 dark:bg-indigo-700" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(255,255,255,0.12),transparent)]" />
                <div className="relative max-w-2xl mx-auto text-center">
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight tracking-tight">
                        Gotowy, aby zacząć?
                    </h2>
                    <p className="text-indigo-200 text-lg mb-10 leading-relaxed">
                        Dołącz do zadowolonych klientów i uruchom swój sklep vishop na wyższym poziomie.
                    </p>
                    <a
                        href="/login"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-indigo-50 text-indigo-700 font-bold rounded-xl text-base transition-colors duration-150 shadow-2xl"
                    >
                        Rozpocznij teraz
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                        </svg>
                    </a>
                    <p className="mt-5 text-indigo-300 text-sm">Od 7 zł/miesiąc · Logowanie przez Discord</p>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="py-10 px-6 bg-slate-900 dark:bg-slate-950 border-t border-slate-800">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
                    <span className="font-bold text-white text-base tracking-tight">
                        szablony<span className="text-indigo-400">.tems</span>
                    </span>
                    <div className="flex items-center gap-6 text-sm text-slate-400">
                        <a href="https://discord.gg/ged4vNXqEt" target="_blank" className="hover:text-white transition-colors">Discord</a>
                        <a href="/login" className="hover:text-white transition-colors">Panel</a>
                        <a href="https://szablony.tems.pl/regulamin_platnosci" target="_blank" className="hover:text-white transition-colors">Regulamin</a>
                    </div>
                    <p className="text-xs text-slate-500">
                        © {new Date().getFullYear()} szablony.tems.pl - Wszelkie prawa zastrzeżone.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Index;
