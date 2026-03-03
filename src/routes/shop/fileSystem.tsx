import Editor from '@monaco-editor/react';
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
    const [createType, setCreateType] = useState<"file" | "directory" | null>(null);
    const [newItemName, setNewItemName] = useState("");
    const [creating, setCreating] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [language, setLanguage] = useState("plaintext");
    const createInputRef = useRef<HTMLInputElement>(null);

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
            setDeleteConfirm(null);

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

    const getLanguage = (filename: string): string => {
        const ext = filename.split(".").pop()?.toLowerCase() ?? "";
        const map: Record<string, string> = {
            js: "javascript", jsx: "javascript",
            ts: "typescript", tsx: "typescript",
            vue: "html", html: "html", htm: "html",
            css: "css", scss: "scss", less: "less",
            json: "json",
            xml: "xml", svg: "xml",
            php: "php",
            md: "markdown",
            yml: "yaml", yaml: "yaml",
            sh: "shell",
            sql: "sql",
            py: "python",
            txt: "plaintext",
        };
        return map[ext] ?? "plaintext";
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
        setLanguage(getLanguage(f));
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

    const createItem = () => {
        if (!newItemName.trim()) return;
        setCreating(true);
        axios.patch(backendUrl + "shop/" + props.shop.id + "/file_system", {
            path: path + newItemName.trim(),
            type: createType
        }, {
            headers: {"Authorization": "Bearer " + token}
        }).then(r => {
            setCreating(false);
            if (r.data.error) {
                alert(r.data.error);
                return;
            }
            setCreateType(null);
            setNewItemName("");
            getData(path);
        });
    };

    const deleteItem = (itemPath: string) => {
        setDeleting(true);
        axios.delete(backendUrl + "shop/" + props.shop.id + "/file_system", {
            data: {path: itemPath},
            headers: {"Authorization": "Bearer " + token}
        }).then(r => {
            setDeleting(false);
            setDeleteConfirm(null);
            if (r.data.error) {
                alert(r.data.error);
                return;
            }
            if (itemPath === path + file) {
                setFile("");
                setCanEdit(false);
                setCanUpload(false);
                setImage(null);
                if (monacoEditorRef.current) {
                    monacoEditorRef.current.editor.setValue("");
                }
            }
            getData(path);
        });
    };

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        if (createType && createInputRef.current) {
            createInputRef.current.focus();
        }
    }, [createType]);

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
                    Edytuj pliki tylko jeśli wiesz co robisz - nieprawidłowe zmiany mogą spowodować błędy sklepu.
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-4">

                {/* Sidebar */}
                <div className="flex flex-col gap-2">
                    {/* Save / Upload buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={saveFile}
                            disabled={!canEdit || saving}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
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
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
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

                    {/* Create new file / directory */}
                    {createType === null ? (
                        <div className="flex gap-2">
                            <button
                                onClick={() => { setCreateType("file"); setNewItemName(""); }}
                                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth="1.5" stroke="currentColor" className="w-3.5 h-3.5">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
                                </svg>
                                Nowy plik
                            </button>
                            <button
                                onClick={() => { setCreateType("directory"); setNewItemName(""); }}
                                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth="1.5" stroke="currentColor" className="w-3.5 h-3.5">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"/>
                                </svg>
                                Nowy folder
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1.5 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                {createType === "file" ? "Nowy plik" : "Nowy folder"}{path ? ` w /${path}` : ""}
                            </span>
                            <input
                                ref={createInputRef}
                                value={newItemName}
                                onChange={e => setNewItemName(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === "Enter") createItem();
                                    if (e.key === "Escape") { setCreateType(null); setNewItemName(""); }
                                }}
                                placeholder={createType === "file" ? "nazwa.vue" : "nazwa-folderu"}
                                className="w-full px-2 py-1.5 text-sm rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                            <div className="flex gap-1.5">
                                <button
                                    onClick={createItem}
                                    disabled={!newItemName.trim() || creating}
                                    className="flex-1 py-1.5 rounded-md text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                                >
                                    {creating ? "Tworzenie..." : "Utwórz"}
                                </button>
                                <button
                                    onClick={() => { setCreateType(null); setNewItemName(""); }}
                                    className="flex-1 py-1.5 rounded-md text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                                >
                                    Anuluj
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Navigate back to root */}
                    <button
                        onClick={() => {
                            changePath("");
                            setFile("");
                        }}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
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
                                {directories.map((directory, i) => {
                                    const dirPath = path + directory;
                                    const isConfirming = deleteConfirm === dirPath;
                                    return (
                                        <div
                                            key={i}
                                            className={`group flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm transition-colors ${
                                                isConfirming
                                                    ? "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400"
                                                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                                            }`}
                                        >
                                            <button
                                                onClick={() => !isConfirming && gotToSubDirectory(directory)}
                                                className="flex items-center gap-2 flex-1 min-w-0 text-left cursor-pointer"
                                            >
                                                <img src="/img/folder.png" alt="" className="w-4 h-4 shrink-0"/>
                                                <span className="truncate">{directory}</span>
                                            </button>
                                            {isConfirming ? (
                                                <div className="flex items-center gap-1 shrink-0">
                                                    <button
                                                        onClick={() => deleteItem(dirPath)}
                                                        disabled={deleting}
                                                        className="px-1.5 py-0.5 text-xs rounded font-medium bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                                                    >
                                                        Usuń
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm(null)}
                                                        className="px-1.5 py-0.5 text-xs rounded font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={e => { e.stopPropagation(); setDeleteConfirm(dirPath); }}
                                                    className="opacity-0 group-hover:opacity-100 shrink-0 p-0.5 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer"
                                                    title="Usuń folder"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                         viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
                                                         className="w-3.5 h-3.5">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
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
                                {files.map((f: string, i) => {
                                    const filePath = path + f;
                                    const isConfirming = deleteConfirm === filePath;
                                    return (
                                        <div
                                            key={i}
                                            className={`group flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm transition-colors ${
                                                isConfirming
                                                    ? "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400"
                                                    : file === f
                                                        ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300"
                                                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                                            }`}
                                        >
                                            <button
                                                onClick={() => !isConfirming && changeFile(f)}
                                                className="flex items-center gap-2 flex-1 min-w-0 text-left cursor-pointer"
                                            >
                                                <img src={getExtensionIcon(f)} alt="" className="w-4 h-4 shrink-0"/>
                                                <span className="truncate">{f}</span>
                                            </button>
                                            {isConfirming ? (
                                                <div className="flex items-center gap-1 shrink-0">
                                                    <button
                                                        onClick={() => deleteItem(filePath)}
                                                        disabled={deleting}
                                                        className="px-1.5 py-0.5 text-xs rounded font-medium bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                                                    >
                                                        Usuń
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm(null)}
                                                        className="px-1.5 py-0.5 text-xs rounded font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={e => { e.stopPropagation(); setDeleteConfirm(filePath); }}
                                                    className="opacity-0 group-hover:opacity-100 shrink-0 p-0.5 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer"
                                                    title="Usuń plik"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                         viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
                                                         className="w-3.5 h-3.5">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
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
                            <Editor
                                height="700px"
                                language={language}
                                theme="vs-dark"
                                options={{
                                    selectOnLineNumbers: true,
                                    fontSize: 13,
                                    padding: {top: 12},
                                    minimap: {enabled: false},
                                }}
                                onMount={(editor) => (monacoEditorRef.current = {editor})}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileSystem;
