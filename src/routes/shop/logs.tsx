import axios from "axios";
import {backendUrl} from "../../config.ts";
import {useEffect, useRef, useState} from "react";
import MonacoEditor from "react-monaco-editor";

const Logs = (props: { shop: { "domain": string, "date": string, id: number } }) => {
    const [logs, setLogs] = useState("");
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");
    const monacoEditorRef = useRef<any | null>(null);

    const getLogs = () => {
        setLoading(true);
        axios.get(backendUrl + "shop/" + props.shop.id + "/logs", {
            headers: {"Authorization": "Bearer " + token}
        }).then(r => {
            setLoading(false);
            if (r.data.error) {
                alert(r.data.message);
                return;
            }
            setLogs(r.data.logs);
            if (monacoEditorRef.current) {
                monacoEditorRef.current.editor.setValue(r.data.logs);
            }
        });
    };

    useEffect(() => {
        getLogs();
    }, []);

    return (
        <div className="w-full p-4 lg:p-6 flex flex-col gap-4">

            {/* Header */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">Logi szablonu</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Logi uruchamiania — pomocne przy diagnozowaniu błędów. Przewiń na dół, aby zobaczyć
                        najnowsze wpisy.
                    </p>
                </div>
                <button
                    onClick={getLogs}
                    className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-150"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                         stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>
                    </svg>
                    Odśwież
                </button>
            </div>

            {/* Info tip */}
            <div
                className="flex items-center gap-2.5 p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-500 dark:text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                     stroke="currentColor" className="w-4 h-4 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/>
                </svg>
                Logi są tylko do odczytu. Szukaj błędów i ostrzeżeń, które mogą pomóc zdiagnozować problemy ze sklepem. Jeśli potrzebujesz pomocy, skontaktuj się z nami na Discordzie, dołączając te logi. Pamiętaj, że uruchomienie szablonu trwa zazwyczaj około minuty
            </div>

            {/* Editor */}
            {loading ? (
                <div
                    className="flex items-center justify-center h-48 bg-[#1E1E1E] rounded-xl border border-slate-700">
                    <div className="flex items-center gap-3 text-slate-400">
                        <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none"
                             viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        Ładowanie logów...
                    </div>
                </div>
            ) : (
                <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                    <MonacoEditor
                        height="800px"
                        language="plaintext"
                        theme="vs-dark"
                        value={logs}
                        options={{
                            selectOnLineNumbers: true,
                            readOnly: true,
                            fontSize: 13,
                            wordWrap: "on",
                            minimap: {enabled: false},
                            padding: {top: 12},
                        }}
                        editorDidMount={(editor) => (monacoEditorRef.current = {editor})}
                    />
                </div>
            )}
        </div>
    );
};

export default Logs;
