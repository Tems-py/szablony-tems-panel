import React from 'react';
import Sidebar from "../components/sidebar.tsx";

const Plugins: React.FC = () => {
    const plugins = [
        {
            title: "Vishop Placeholders",
            description: (
                <div className="flex flex-col gap-3">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Plugin pozwala wyświetlać najbogatszych graczy, cel miesiąca oraz ostatnie zakupy jako
                        placeholdery w Twoim sklepie.
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span
                            className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md">Wymaga PlaceholderAPI</span>
                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md">Wymaga aktywnego hostingu</span>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
                            Dostępne placeholdery
                        </p>
                        <div className="bg-[#1E1E1E] rounded-lg p-4 font-mono text-xs text-slate-300 leading-relaxed">
                            <p className="text-slate-500 mb-1">{/* Top gracze */}</p>
                            vishop_top_player_[1-3]<br/>
                            vishop_top_spend_[1-3]<br/>
                            <br/>
                            <p className="text-slate-500 mb-1">{/* Ostatnie zakupy */}</p>
                            vishop_last_player_[1-5]<br/>
                            vishop_last_quantity_[1-5]<br/>
                            vishop_last_status_[1-5]<br/>
                            vishop_last_product_[1-5]<br/>
                            <br/>
                            <p className="text-slate-500 mb-1">{/* Cel miesiąca */}</p>
                            vishop_goal_percent<br/>
                            vishop_goal_bar_1<br/>
                            vishop_goal_bar_2
                        </div>
                    </div>
                </div>
            ),
            file: "VishopPlaceholders-1.1.jar",
            image: "placeholders.png",
            filePath: "https://szablony.tems.pl/static/jars/VishopPlaceholders-1.1.jar"
        }
    ];

    return (
        <div className="flex gap-4 flex-col lg:flex-row p-4 md:p-8 min-h-screen bg-slate-50 dark:bg-slate-950">
            <Sidebar/>

            <main className="flex-grow min-w-0">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pluginy</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Dodatkowe pluginy do wykorzystania na Twoim serwerze.
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
                        Pluginy możesz używać na swoim serwerze dopóki posiadasz aktywny plan hostingu.{" "}
                        <strong>Zakaz rozpowszechniania, sprzedaży i przypisywania sobie autorstwa.</strong>
                    </p>
                </div>

                {plugins.length === 0 ? (
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
                    <div className="flex flex-col gap-4">
                        {plugins.map((plugin, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
                            >
                                <div className="flex flex-col lg:flex-row">
                                    {/* Preview image + download */}
                                    <div
                                        className="lg:w-72 shrink-0 bg-slate-50 dark:bg-slate-800/50 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-700 p-6 flex flex-col items-center gap-4">
                                        <img
                                            src={"/img/" + plugin.image}
                                            alt={plugin.image}
                                            className="w-full max-h-56 object-contain rounded-lg"
                                        />
                                        <div className="text-center">
                                            <p className="text-base font-semibold text-slate-900 dark:text-white mb-3">{plugin.title}</p>
                                            <a
                                                href={plugin.filePath}
                                                download
                                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors duration-150"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                     viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
                                                     className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
                                                </svg>
                                                Pobierz {plugin.file}
                                            </a>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="p-6 flex-1">
                                        {plugin.description}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Plugins;
