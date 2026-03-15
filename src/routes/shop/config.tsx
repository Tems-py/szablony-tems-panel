import axios from "axios";
import {backendUrl} from "../../config.ts";
import {useEffect, useState} from "react";
import Editor from "@monaco-editor/react";

const Config = (props: { shop: { "domain": string, "date": string, id: number } }) => {
    const token = localStorage.getItem("token");
    const [config, setConfig] = useState<string>();
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [restarting, setRestarting] = useState(false);
    const [restartNeeded, setRestartNeeded] = useState(false);

    const getConfig = () => {
        axios.get(backendUrl + "shop/" + props.shop.id + "/file_system", {
            params: {path: "nuxt.config.js"},
            headers: {"Authorization": "Bearer " + token}
        }).then(r => {
            if (r.data.error) {
                alert(r.data.message);
                return;
            }
            setConfig(r.data.data);
        });
    };

    const saveConfig = () => {
        setSaving(true);
        axios.post(backendUrl + "shop/" + props.shop.id + "/file_system", {
            path: "nuxt.config.js",
            data: config
        }, {
            headers: {"Authorization": "Bearer " + token}
        }).then(r => {
            setSaving(false);
            if (r.data.error) {
                alert(r.data.message);
                return;
            }
            setSaved(true);
            setRestartNeeded(true);
            setTimeout(() => setSaved(false), 2500);
        });
    };

    const doRestart = () => {
        setRestarting(true);
        axios.post(backendUrl + "shop/" + props.shop.id + "/restart", {}, {
            headers: {"Authorization": "Bearer " + token}
        }).then(r => {
            setRestarting(false);
            setRestartNeeded(false);
            alert(r.data.message);
        }).catch(err => {
            setRestarting(false);
            alert(err.response?.data?.message ?? "Błąd restartu");
        });
    };

    useEffect(() => {
        getConfig();
    }, []);

    return (
        <div className="w-full p-4 lg:p-6 flex flex-col gap-4">

            {/* Header */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">Konfiguracja</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Edycja pliku <code
                        className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">nuxt.config.js</code>.
                        Pamiętaj, że zmiany zostaną zastosowane dopiero po restarcie.
                    </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                {restartNeeded && (
                    <button
                        onClick={doRestart}
                        disabled={restarting}
                        className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-medium border border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {restarting ? (
                            <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>
                            </svg>
                        )}
                        {restarting ? "Restartowanie..." : "Restartuj"}
                    </button>
                )}
                <button
                    onClick={saveConfig}
                    disabled={saving}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                        saved
                            ? "bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50"
                    }`}
                >
                    {saving ? (
                        <>
                            <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none"
                                 viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        strokeWidth="4"/>
                                <path className="opacity-75" fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                            </svg>
                            Zapisywanie...
                        </>
                    ) : saved ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                            </svg>
                            Zapisano
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
                            </svg>
                            Zapisz
                        </>
                    )}
                </button>
                </div>
            </div>

            {/* Warning */}
            <div
                className="flex items-center gap-2.5 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-lg text-sm text-amber-700 dark:text-amber-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                     stroke="currentColor" className="w-4 h-4 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
                </svg>
                Po zapisaniu konfiguracji zrestartuj szablon, aby zmiany weszły w życie.
            </div>

            {/* Editor */}
            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <Editor
                    height="820px"
                    language="javascript"
                    value={config}
                    onChange={(value) => setConfig(value)}
                    theme="vs-dark"
                    options={{
                        selectOnLineNumbers: true,
                        roundedSelection: false,
                        readOnly: false,
                        cursorStyle: 'line',
                        automaticLayout: true,
                        minimap: {enabled: true},
                        fontSize: 14,
                        padding: {top: 12},
                    }}
                />
            </div>
        </div>
    );
};

export default Config;
