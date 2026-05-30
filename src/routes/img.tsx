import React, {useEffect, useRef, useState} from "react";
import {Link} from "react-router";
import DarkModeToggle from "../components/darkModeToggle.tsx";
import {imgbbApiKey} from "../config.ts";
import {
    buildShortImageUrl,
    encodeRedirectCode,
    isUnderFiveMb,
    isValidImageFile,
    type UploadedImageResult,
    uploadImageToImgbb
} from "../utils/imgUpload.ts";

const formatFileSizeLimit = "5 MB";
const uploadHistoryStorageKey = "img-upload-history";
const maxHistoryItems = 12;

type UploadHistoryItem = UploadedImageResult & {
    createdAt: string
};

type StoredUploadHistoryItem = {
    id: string
    displayUrl: string
    createdAt: string
};

const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
};

const getClipboardImage = (event: ClipboardEvent): File | null => {
    const items = event.clipboardData?.items;
    if (!items) return null;

    for (const item of items) {
        if (item.type.startsWith("image/")) {
            const file = item.getAsFile();
            if (file) return file;
        }
    }

    return null;
};

const readUploadHistory = (): UploadHistoryItem[] => {
    try {
        const rawValue = localStorage.getItem(uploadHistoryStorageKey);
        if (!rawValue) return [];

        const parsed = JSON.parse(rawValue) as unknown;
        if (!Array.isArray(parsed)) return [];

        return parsed.filter((item): item is StoredUploadHistoryItem => {
            return typeof item === "object"
                && item !== null
                && typeof item.id === "string"
                && typeof item.displayUrl === "string"
                && typeof item.createdAt === "string";
        }).map((item) => {
            const shortCode = encodeRedirectCode(item.id);

            return {
                id: item.id,
                createdAt: item.createdAt,
                displayUrl: item.displayUrl,
                shortCode,
                shortUrl: buildShortImageUrl(shortCode)
            };
        });
    } catch {
        return [];
    }
};

const writeUploadHistory = (items: StoredUploadHistoryItem[]) => {
    localStorage.setItem(uploadHistoryStorageKey, JSON.stringify(items));
};

function ImgRoute() {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const uploadHandlerRef = useRef<(file: File | Blob, filename?: string) => Promise<void>>(async () => {});
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<UploadedImageResult | null>(null);
    const [history, setHistory] = useState<UploadHistoryItem[]>([]);
    const [copiedField, setCopiedField] = useState<"short" | null>(null);

    useEffect(() => {
        setHistory(readUploadHistory());
    }, []);

    const validateFile = (file: File | Blob): string | null => {
        if (!isValidImageFile(file)) {
            return "Możesz wrzucić tylko plik obrazu.";
        }
        if (!isUnderFiveMb(file)) {
            return `Maksymalny rozmiar obrazka to ${formatFileSizeLimit}.`;
        }

        return null;
    };

    const handleCopy = async (type: "short", value: string) => {
        try {
            await copyToClipboard(value);
            setCopiedField(type);
            window.setTimeout(() => setCopiedField((current) => current === type ? null : current), 2000);
        } catch {
            setError("Nie udało się skopiować linku do schowka.");
        }
    };

    const handleUpload = async (file: File | Blob, filename?: string) => {
        if (!imgbbApiKey) {
            setError("Brak konfiguracji VITE_IMGBB_API_KEY. Dodaj klucz API ImgBB, aby włączyć upload.");
            return;
        }

        const validationError = validateFile(file);
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            const uploaded = await uploadImageToImgbb(imgbbApiKey, file, filename);
            setResult(uploaded);
            setHistory((currentHistory) => {
                const createdAt = new Date().toISOString();
                const nextHistory = [
                    {
                        ...uploaded,
                        createdAt
                    },
                    ...currentHistory.filter((item) => item.id !== uploaded.id)
                ].slice(0, maxHistoryItems);

                writeUploadHistory(nextHistory.map((item) => ({
                    id: item.id,
                    displayUrl: item.displayUrl,
                    createdAt: item.createdAt
                })));
                return nextHistory;
            });
        } catch (uploadError) {
            const message = uploadError instanceof Error ? uploadError.message : "upload_failed";
            setError(message === "upload_failed" ? "Upload nie powiódł się. Spróbuj ponownie." : `Upload nie powiódł się: ${message}`);
        } finally {
            setIsUploading(false);
        }
    };

    uploadHandlerRef.current = handleUpload;

    const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        await handleUpload(file, file.name);
        event.target.value = "";
    };

    const onDrop = async (event: React.DragEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setIsDragging(false);

        const file = event.dataTransfer.files?.[0];
        if (!file) return;

        await handleUpload(file, file.name);
    };

    useEffect(() => {
        const onPaste = async (event: ClipboardEvent) => {
            const image = getClipboardImage(event);
            if (!image) return;

            event.preventDefault();
            await uploadHandlerRef.current(image, image.name || "clipboard-image");
        };

        window.addEventListener("paste", onPaste);
        return () => window.removeEventListener("paste", onPaste);
    }, []);

    const clearHistory = () => {
        localStorage.removeItem(uploadHistoryStorageKey);
        setHistory([]);
    };

    const formatHistoryDate = (value: string) => {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return "";
        }

        return new Intl.DateTimeFormat("pl-PL", {
            dateStyle: "short",
            timeStyle: "short"
        }).format(date);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-6 md:px-8 md:py-8">
            <main className="mx-auto flex max-w-4xl flex-col gap-5">
                <section className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Uploader obrazków</h1>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Wklej obrazek albo wybierz go z urządzenia i od razu skopiuj gotowy link.
                        </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                        <DarkModeToggle/>
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Upload obrazka</h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Wklej obrazek, wybierz go z urządzenia albo przeciągnij tutaj. Maksymalny rozmiar: {formatFileSizeLimit}.
                        </p>
                    </div>

                    {!imgbbApiKey && (
                        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700 dark:border-amber-800/50 dark:bg-amber-950/30 dark:text-amber-300">
                            Brak konfiguracji `VITE_IMGBB_API_KEY`. Dodaj publiczny klucz API ImgBB, aby włączyć upload.
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(event) => {
                            event.preventDefault();
                            setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={onDrop}
                        disabled={isUploading || !imgbbApiKey}
                        className={`flex min-h-56 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-all duration-150 ${
                            isDragging
                                ? "border-indigo-400 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-950/30"
                                : "border-slate-300 bg-slate-50 hover:border-indigo-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-indigo-700 dark:hover:bg-slate-800"
                        } disabled:cursor-not-allowed disabled:opacity-60`}
                    >
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-7 w-7">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V6.75m0 0L8.25 10.5M12 6.75l3.75 3.75M3 16.5v1.125c0 .621.504 1.125 1.125 1.125h15.75c.621 0 1.125-.504 1.125-1.125V16.5" />
                            </svg>
                        </div>
                        <p className="text-base font-semibold text-slate-900 dark:text-white">
                            {isUploading ? "Trwa upload..." : "Kliknij, aby wybrać obrazek"}
                        </p>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            Działa też wklejenie z clipboarda oraz przeciągnięcie pliku na desktopie.
                        </p>
                        <span className="mt-4 inline-flex min-h-11 items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                            Wybierz z urządzenia
                        </span>
                    </button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={onFileChange}
                    />

                    {error && (
                        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
                            {error}
                        </div>
                    )}
                </section>

                {result && (
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6">
                        <div className="mb-5">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Gotowe</h2>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Masz już krótki link z przekierowaniem do obrazka.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[220px_1fr]">
                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60">
                                <img src={result.displayUrl} alt="Wgrany obrazek" className="h-full w-full object-cover" />
                            </div>

                            <div className="flex flex-col gap-4">
                                <div>
                                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Link do skopiowania</p>
                                    <div className="flex flex-col gap-2 sm:flex-row">
                                        <input
                                            type="text"
                                            readOnly
                                            value={result.shortUrl}
                                            className="min-h-11 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleCopy("short", result.shortUrl)}
                                            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-indigo-700"
                                        >
                                            {copiedField === "short" ? "Skopiowano" : "Kopiuj"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Historia uploadów</h2>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Zapisywana lokalnie w tej przeglądarce na tym urządzeniu.
                            </p>
                        </div>
                        {history.length > 0 && (
                            <button
                                type="button"
                                onClick={clearHistory}
                                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                                Wyczyść historię
                            </button>
                        )}
                    </div>

                    {history.length === 0 ? (
                        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400">
                            Nie masz jeszcze zapisanych uploadów.
                        </div>
                    ) : (
                        <div className="mt-4 flex flex-col gap-3">
                            {history.map((item) => (
                                <div
                                    key={item.shortCode}
                                    className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 p-4 dark:border-slate-700 lg:grid-cols-[96px_1fr]"
                                >
                                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60">
                                        <img src={item.displayUrl} alt="Historia uploadu" className="h-24 w-full object-cover lg:h-full" />
                                    </div>
                                    <div className="flex min-w-0 flex-col gap-3">
                                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                            <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                                                Upload #{item.id}
                                            </p>
                                            <span className="text-xs text-slate-400 dark:text-slate-500">
                                                {formatHistoryDate(item.createdAt)}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <input
                                                type="text"
                                                readOnly
                                                value={item.shortUrl}
                                                className="min-h-11 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                            />
                                            <div className="flex flex-col gap-2 sm:flex-row">
                                                <button
                                                    type="button"
                                                    onClick={() => handleCopy("short", item.shortUrl)}
                                                    className="inline-flex min-h-11 items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-indigo-700"
                                                >
                                                    Kopiuj link
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                    <div className="flex flex-col gap-5 px-5 py-5 sm:px-6 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
                                Hosting szablonów vishop
                            </p>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Potrzebujesz też hostingu do szablonu?</h2>
                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                Od 7 zł/miesiąc, pełny panel i szybkie uruchomienie.
                            </p>
                        </div>
                        <Link
                            to="/"
                            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-indigo-700"
                        >
                            Zobacz hosting
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default ImgRoute;
