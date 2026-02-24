import MonacoEditor from 'react-monaco-editor';
import axios from "axios";
import {backendUrl} from "../../config.ts";
import React, {useEffect, useRef, useState} from "react";

const FileSystem = (props: { shop: { "domain": string, "date": string, id: number } }) => {
    const [files, setFiles] = useState([]);
    const [directories, setDirectories] = useState([]);
    const [path, setPath] = useState("");
    const [file, setFile] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const token = localStorage.getItem("token");
    const monacoEditorRef = useRef<any | null>(null);
    const [canEdit, setCanEdit] = useState(false);
    const [canUpload, setCanUpload] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const fileInput = useRef<any | null>(null);

    const getData = (currentPath = "") => {
        axios.get(backendUrl + "shop/" + props.shop.id + "/file_system", {
            params: {path: currentPath},
            headers: {"Authorization": "Bearer " + token}
        }).then(r => {
            if (r.data.error) {
                alert(r.data.message);
                setCanEdit(false);
                setImage(null);
                setCanUpload(false);
                return;
            }
            setFiles(r.data.files);
            setDirectories(r.data.directories);
            setPath(currentPath);
            setCanEdit(false);
            setCanUpload(false);
            setImage(null);

            if (monacoEditorRef.current) {
                monacoEditorRef.current.editor.setValue(r.data);
            }
        });
    };

    const gotToSubDirectory = (directory: string) => {
        getData(path + directory + "/");
        setFile("");
        if (monacoEditorRef.current) {
            monacoEditorRef.current.editor.setValue("");
        }
    };

    const getFile = (file = "") => {
        axios.get(backendUrl + "shop/" + props.shop.id + "/file_system", {
            params: {path: path + file},
            headers: {"Authorization": "Bearer " + token}
        }).then(r => {
            if (r.data.error) {
                alert(r.data.message);
                setCanEdit(false);
                setCanUpload(false);
                setImage(null);
                return;
            }
            if (!r.data.canEdit && !r.data.image) {
                alert(r.data.message);
            }
            if (r.data.image) {
                setImage(r.data.data);
            } else {
                setImage(null);
            }

            setCanEdit(r.data.canEdit);
            setCanUpload(r.data.canUpload);

            if (monacoEditorRef.current) {
                monacoEditorRef.current.editor.setValue(r.data.data);
            }
        });
    };

    const getExtensionIcon = (filename: string) => {
        if (filename.endsWith(".vue")) return "/img/vue.svg";
        else if (filename.endsWith(".js")) return "/img/js.svg";
        else if (filename.endsWith(".json")) return "/img/json.png";
        else if (filename.endsWith(".svg") || filename.endsWith(".png") || filename.endsWith(".jpg") || filename.endsWith(".ico"))
            return "/img/Icons8_flat_picture.svg";
        return "/img/file-icon.svg";
    };

    const changePath = (newPath: string) => {
        setPath(newPath);
        getData(newPath);
    };

    const changeFile = (f: string) => {
        getFile(f);
        setFile(f);
    };

    const saveFile = () => {
        setSaving(true);
        axios.post(backendUrl + "shop/" + props.shop.id + "/file_system", {
            path: path + file,
            data: monacoEditorRef.current.editor.getValue()
        }, {
            headers: {"Authorization": "Bearer " + token}
        }).then(r => {
            setSaving(false);
            if (r.data.error) {
                alert(r.data.message);
                return;
            }
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        });
    };

    const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files === null || e.target.files.length === 0) return;

        const form = new FormData();
        form.append("path", path + file);
        form.append("file", e.target.files[0]);

        axios.put(backendUrl + "shop/" + props.shop.id + "/file_system", form, {
            headers: {"Authorization": "Bearer " + token}
        }).then(r => {
            if (r.data.error) {
                alert(r.data.error);
                return;
            }
            alert("Plik został zastąpiony");
            getFile(file);
        });
    };

    useEffect(() => {
        getData();
    }, []);

    const pathParts = (path + (file || "")).split("/").filter(Boolean);

    return (
        <div className="w-full p-4 lg:p-6 flex flex-col gap-4">

            {/* Header */}
            <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">Edytor plików</h1>
                <div
                    className="flex items-center gap-1.5 mt-2 p-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-lg text-sm text-amber-700 dark:text-amber-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                         stroke="currentColor" className="w-4 h-4 shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
                    </svg>
                    Edytuj pliki tylko jeśli wiesz co robisz — nieprawidłowe zmiany mogą spowodować błędy sklepu.
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-4">

                {/* Sidebar */}
                <div className="flex flex-col gap-2">
                    {/* Action buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={saveFile}
                            disabled={!canEdit || saving}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                                saved
                                    ? "bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400"
                                    : "bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-slate-200 disabled:dark:bg-slate-800 disabled:text-slate-400 disabled:dark:text-slate-600 disabled:cursor-not-allowed"
                            }`}
                        >
                            {saving ? (
                                <svg className="w-3.5 h-3.5 animate-spin" xmlns="http://www.w3.org/2000/svg"
                                     fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            strokeWidth="4"/>
                                    <path className="opacity-75" fill="currentColor"
                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                </svg>
                            ) : saved ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth="1.5" stroke="currentColor" className="w-3.5 h-3.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                                </svg>
                            ) : null}
                            {saved ? "Zapisano" : "Zapisz"}
                        </button>
                        <button
                            onClick={() => fileInput.current?.click()}
                            disabled={!canUpload}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 strokeWidth="1.5" stroke="currentColor" className="w-3.5 h-3.5">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
                            </svg>
                            Zastąp
                        </button>
                    </div>
                    <input type="file" className="hidden" ref={fileInput} onChange={uploadFile}/>

                    {/* Navigate back to root */}
                    <button
                        onClick={() => {
                            changePath("");
                            setFile("");
                        }}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/>
                        </svg>
                        Katalog główny
                    </button>

                    {/* Directories */}
                    {directories.length > 0 && (
                        <div
                            className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                            <div
                                className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
                                <span
                                    className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Foldery</span>
                            </div>
                            <div className="p-1">
                                {directories.map((directory, i) => (
                                    <button
                                        key={i}
                                        onClick={() => gotToSubDirectory(directory)}
                                        className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                                    >
                                        <img src="/img/folder.png" alt="" className="w-4 h-4 shrink-0"/>
                                        <span className="truncate">{directory}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Files */}
                    {files.length > 0 && (
                        <div
                            className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                            <div
                                className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
                                <span
                                    className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Pliki</span>
                            </div>
                            <div className="p-1">
                                {files.map((f: string, i) => (
                                    <button
                                        key={i}
                                        onClick={() => changeFile(f)}
                                        className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm transition-colors text-left ${
                                            file === f
                                                ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300"
                                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                                        }`}
                                    >
                                        <img src={getExtensionIcon(f)} alt="" className="w-4 h-4 shrink-0"/>
                                        <span className="truncate">{f}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Editor area */}
                <div className="flex flex-col gap-2 min-h-0">
                    {/* Breadcrumb */}
                    {(path || file) && (
                        <div
                            className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 font-mono px-1">
                            <span>/</span>
                            {pathParts.map((part, i) => (
                                <span key={i} className="flex items-center gap-1">
                                    {i > 0 && <span>/</span>}
                                    <span
                                        className={i === pathParts.length - 1 ? "text-slate-700 dark:text-slate-300" : ""}>{part}</span>
                                </span>
                            ))}
                        </div>
                    )}

                    {image !== null ? (
                        <div
                            className="flex items-center justify-center min-h-96 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                            <img src={"data:image/png;base64, " + image} alt="Podgląd obrazka"
                                 className="max-w-full max-h-96 object-contain rounded-lg"/>
                        </div>
                    ) : (
                        <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                            <MonacoEditor
                                height="700px"
                                language="javascript"
                                theme="vs-dark"
                                options={{
                                    selectOnLineNumbers: true,
                                    fontSize: 13,
                                    padding: {top: 12},
                                    minimap: {enabled: false},
                                }}
                                editorDidMount={(editor) => (monacoEditorRef.current = {editor})}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileSystem;
