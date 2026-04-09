import React, {useState} from 'react';
import {Link} from "react-router";
import Sidebar from "../components/sidebar.tsx";

const token = () => localStorage.getItem("token");

interface Endpoint {
    id: string;
    number: number;
    method: 'GET' | 'POST';
    path: string;
    title: string;
    description: string;
    queryParams?: { name: string; description: string }[];
    body?: string;
    response: string;
    notes?: string;
}

const endpoints: Endpoint[] = [
    {
        id: 'sklep',
        number: 1,
        method: 'GET',
        path: '/panel/shops/{shop_id}/',
        title: 'Sklep',
        description: 'Zwraca pełne dane sklepu: nazwę, właściciela, grę, motyw, logo, nawigację, ustawienia wyglądu, kolory, widgety, status premium i wiele więcej.',
        response: `{
  "id": 1,
  "name": "Przykładowy sklep",
  "owner": 1,
  "game": "minecraft",
  "theme": "light",
  "logo": "https://...",
  "navigation": [
    {
      "id": 564,
      "shop": 1,
      "type": "subpage",
      "name": "Regulamin",
      "url": null,
      "subpage": 495,
      "subpage_name": "Regulamin"
    }
  ],
  "style": "",
  "primary_color": "#AA00FF",
  "home_link": true,
  "online": true,
  "latest_payments": true,
  "richest_player": true,
  "full_color": false,
  "rules": "",
  "ml_widget": "fajnemc.pl",
  "sd_widget": "2",
  "premium_until": "4762-09-06T21:51:45.038141Z",
  "premium": true,
  "announcements": [],
  "monthly_goal_public": 0,
  "domain": "asd.ivall.pl",
  "richest_player_since": null
}`,
    },
    {
        id: 'serwery',
        number: 2,
        method: 'GET',
        path: '/panel/shops/{shop_id}/servers/',
        title: 'Serwery',
        description: 'Zwraca listę serwerów przypisanych do sklepu. Każdy serwer ma nazwę, adres IP oraz ikonę.',
        response: `[
  {
    "id": 1,
    "name": "Survival",
    "shop": 1,
    "ip": "mc.ivall.pl",
    "image": "https://..."
  },
  {
    "id": 1380,
    "name": "BoxPvP",
    "shop": 1,
    "ip": "boxpvp.pl",
    "image": "https://..."
  }
]`,
    },
    {
        id: 'produkty',
        number: 3,
        method: 'GET',
        path: '/panel/shops/{shop_id}/products/',
        title: 'Produkty dla serwera',
        description: 'Zwraca listę produktów dostępnych na danym serwerze. Każdy produkt zawiera ceny we wszystkich systemach płatności, opis, obrazek, ewentualne promocje oraz parametry suwaka ilości.',
        queryParams: [
            {name: 'server', description: 'ID serwera (wymagany)'}
        ],
        response: `[
  {
    "id": 13645,
    "prices": {
      "id": 13649,
      "icehost": "5.00",
      "ivhost": "2.00",
      "skillhost": "10.00",
      "paypal": "5.00",
      "hotpay_transfer": "5.00",
      "hotpay_paysafecard": null,
      "cashbill_transfer": "123.00",
      "cashbill_paysafecard": null,
      "cashbill_paypal": null,
      "paybylink_transfer": "5.00",
      "paybylink_paysafecard": "1.00",
      "simpay_directbilling": "15.00",
      "simpay": "15.00",
      "dpay": null,
      "stripe": "12.00",
      "hotpay_sms": null,
      "paybylink_sms": null
    },
    "promo": "15",
    "name": "VIP",
    "description": "<p>Najtańsza <strong>dostępna</strong> ranga...</p>",
    "short_description": "",
    "image": "https://...",
    "main_price": "5.00",
    "require_player_online": false,
    "slider": false,
    "slider_min": 2,
    "slider_max": 55,
    "slider_name": "Ilość",
    "order": 1,
    "server": 1
  }
]`,
    },
    {
        id: 'produkt',
        number: 4,
        method: 'GET',
        path: '/panel/shops/{shop_id}/products/{product_id}/',
        title: 'Produkt (szczegóły)',
        description: 'Zwraca szczegółowe dane jednego produktu po jego ID — identyczna struktura jak w liście produktów.',
        response: `{
  "id": 13645,
  "prices": { ... },
  "promo": "15",
  "name": "VIP",
  "description": "<p>...</p>",
  "short_description": "",
  "image": "https://...",
  "main_price": "5.00",
  "require_player_online": false,
  "slider": false,
  "slider_min": 2,
  "slider_max": 55,
  "slider_name": "Ilość",
  "order": 1,
  "server": 1
}`,
    },
    {
        id: 'platnosci',
        number: 5,
        method: 'GET',
        path: '/panel/shops/{shop_id}/payments/',
        title: 'Dostawcy płatności',
        description: 'Zwraca listę skonfigurowanych metod płatności sklepu. Dla płatności SMS zawiera listę numerów z cenami i treścią wiadomości.',
        response: `[
  {
    "id": 5,
    "sms_numbers": [
      {
        "id": 2,
        "number": 123,
        "price": 1.23,
        "sms_content": "a"
      },
      {
        "id": 4,
        "number": 123,
        "price": 16.45,
        "sms_content": "123"
      }
    ],
    "is_sms": true,
    "name": "sms",
    "provider": "hotpay_sms",
    "sms_content": ""
  },
  {
    "id": 23,
    "sms_numbers": [],
    "is_sms": false,
    "name": "przelew",
    "provider": "hotpay_transfer",
    "sms_content": ""
  }
]`,
    },
    {
        id: 'ostatnie-zakupy',
        number: 6,
        method: 'GET',
        path: '/panel/shops/{shop_id}/latest_payments/',
        title: 'Ostatnie zakupy',
        description: 'Zwraca listę ostatnich transakcji w sklepie wraz z nickiem gracza, statusem, nazwą produktu, ilością i datą.',
        response: `[
  {
    "player": "test",
    "status": "executed",
    "product_name": "VIP",
    "quantity": 1,
    "server": 1,
    "created_at": "2026-01-28T10:26:56.883807Z"
  },
  {
    "player": "ivall",
    "status": "executed",
    "product_name": "VIP",
    "quantity": 1,
    "server": 1,
    "created_at": "2026-01-17T13:50:04.457655Z"
  }
]`,
    },
    {
        id: 'ogloszenia',
        number: 7,
        method: 'GET',
        path: '/panel/shops/{shop_id}/announcements/',
        title: 'Ogłoszenia',
        description: 'Zwraca listę aktywnych ogłoszeń sklepu. Może być pusta tablica, gdy sklep nie ma ogłoszeń.',
        response: `[]`,
    },
    {
        id: 'najbogatszy',
        number: 8,
        method: 'GET',
        path: '/panel/shops/{shop_id}/richest_player/',
        title: 'Najbogatszy gracz',
        description: 'Zwraca nick gracza, który wydał w sklepie najwięcej środków oraz łączną kwotę jego zakupów.',
        response: `{
  "player": "test",
  "spend": 234.86
}`,
    },
    {
        id: 'podstrona',
        number: 9,
        method: 'GET',
        path: '/panel/shops/{shop_id}/subpages/{subpage_id}/',
        title: 'Podstrona CMS',
        description: 'Zwraca zawartość podstrony CMS sklepu. Treść jest zapisana jako HTML — należy ją renderować bezpośrednio w interfejsie.',
        response: `{
  "id": 495,
  "name": "Regulamin",
  "content": "<h1>Regulamin serwera</h1><ul><li><p>Przestrzegaj netykiety</p></li></ul>",
  "shop": 1
}`,
    },
    {
        id: 'status-platnosci',
        number: 10,
        method: 'GET',
        path: '/panel/shops/{shop_id}/payment-status/{payment_id}/',
        title: 'Status płatności',
        description: 'Sprawdza status konkretnej płatności po jej ID. Przydatne do wyświetlania potwierdzenia zakupu po powrocie ze strony płatności.',
        response: `// Gdy płatność nie istnieje:
{
  "detail": "Not found."
}`,
    },
    {
        id: 'kod-rabatowy',
        number: 11,
        method: 'POST',
        path: '/panel/shops/{shop_id}/codes/use/',
        title: 'Kod rabatowy',
        description: 'Sprawdza i aplikuje kod rabatowy do wybranego produktu. Zwraca dane rabatu lub błąd, gdy kod nie istnieje.',
        body: `{
  "code": "KOD",
  "product": 13645
}`,
        response: `// Gdy kod nie istnieje:
{
  "detail": "No PromoCode matches the given query."
}`,
    },
    {
        id: 'voucher',
        number: 12,
        method: 'POST',
        path: '/panel/shops/{shop_id}/vouchers/use/',
        title: 'Voucher',
        description: 'Realizuje voucher dla podanego gracza. Voucher jest jednorazowy i przypisany do nicku.',
        body: `{
  "player": "NickGracza",
  "code": "KOD"
}`,
        response: `// Gdy voucher nie istnieje:
{
  "detail": "No Voucher matches the given query."
}`,
    },
    {
        id: 'utworzenie-platnosci',
        number: 13,
        method: 'POST',
        path: '/panel/shops/{shop_id}/products/{product_id}/payments/',
        title: 'Utworzenie płatności',
        description: 'Inicjuje nową płatność za produkt. W odpowiedzi zwracany jest URL do bramki płatniczej, na który należy przekierować użytkownika. Parametr success_page powinien zawierać placeholder {PAYMENT_ID} — zostanie on zastąpiony rzeczywistym ID transakcji.',
        body: `{
  "player": "NickGracza",
  "provider": "hotpay_transfer",
  "quantity": 1,
  "success_page": "https://twojadomena.pl/payment/{PAYMENT_ID}"
}`,
        response: `// Błąd walidacji (zły provider):
{
  "provider": ["\"invalid\" is not a valid choice."]
}`,
        notes: 'Wartość {PAYMENT_ID} w success_page jest automatycznie zastępowana przez API — nie zamieniaj jej samodzielnie przed wysłaniem.',
    },
];

function MethodBadge({method}: { method: 'GET' | 'POST' }) {
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold font-mono tracking-wide ${
            method === 'GET'
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                : 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
        }`}>
            {method}
        </span>
    );
}

function CopyButton({text}: { text: string }) {
    const [copied, setCopied] = useState(false);
    const copy = () => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    return (
        <button
            onClick={copy}
            title="Kopiuj"
            className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium transition-all duration-150 ${
                copied
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
        >
            {copied ? (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2"
                         stroke="currentColor" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                    </svg>
                    Skopiowano
                </>
            ) : (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                         stroke="currentColor" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"/>
                    </svg>
                    Kopiuj
                </>
            )}
        </button>
    );
}

function EndpointCard({ep}: { ep: Endpoint }) {
    const [open, setOpen] = useState(false);

    return (
        <div id={ep.id}
             className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-150"
            >
                <span
                    className="shrink-0 w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold flex items-center justify-center">
                    {ep.number}
                </span>
                <MethodBadge method={ep.method}/>
                <code
                    className="text-sm font-mono text-slate-700 dark:text-slate-300 flex-1 min-w-0 truncate">{ep.path}</code>
                <span className="text-sm font-semibold text-slate-900 dark:text-white shrink-0 hidden sm:block">
                    {ep.title}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2"
                     stroke="currentColor"
                     className={`w-4 h-4 shrink-0 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/>
                </svg>
            </button>

            {open && (
                <div className="border-t border-slate-100 dark:border-slate-800 px-5 py-4 flex flex-col gap-4">
                    {/* Description */}
                    <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{ep.description}</p>
                    </div>

                    {/* Note */}
                    {ep.notes && (
                        <div className="p-3 bg-amber-50 border border-amber-100 dark:bg-amber-950/30 dark:border-amber-900/40 rounded-lg flex gap-2.5">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                 stroke="currentColor"
                                 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
                            </svg>
                            <p className="text-xs text-amber-700 dark:text-amber-400">{ep.notes}</p>
                        </div>
                    )}

                    {/* Query params */}
                    {ep.queryParams && (
                        <div>
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                                Parametry zapytania
                            </p>
                            <div className="flex flex-col gap-1.5">
                                {ep.queryParams.map(p => (
                                    <div key={p.name}
                                         className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                        <code
                                            className="text-xs font-mono text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">{p.name}</code>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">{p.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Request body */}
                    {ep.body && (
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                    Treść żądania (JSON)
                                </p>
                                <CopyButton text={ep.body}/>
                            </div>
                            <pre
                                className="text-xs font-mono bg-slate-950 dark:bg-black text-slate-300 rounded-lg p-4 overflow-x-auto leading-relaxed">
                                {ep.body}
                            </pre>
                        </div>
                    )}

                    {/* Response */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                Przykładowa odpowiedź
                            </p>
                            <CopyButton text={ep.response}/>
                        </div>
                        <pre
                            className="text-xs font-mono bg-slate-950 dark:bg-black text-slate-300 rounded-lg p-4 overflow-x-auto leading-relaxed">
                            {ep.response}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
}

const VishopDocs: React.FC = () => {
    const isLoggedIn = !!token();

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
                <div
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 max-w-md w-full text-center shadow-sm">
                    <div
                        className="w-14 h-14 bg-indigo-50 dark:bg-indigo-950/60 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor" className="w-7 h-7 text-indigo-600 dark:text-indigo-400">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        Dokumentacja Vishop API
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                        Musisz być zalogowany, aby wyświetlić dokumentację API.
                    </p>
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors duration-150"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"/>
                        </svg>
                        Zaloguj się
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex gap-4 flex-col lg:flex-row p-4 md:p-8 min-h-screen bg-slate-50 dark:bg-slate-950">
            <Sidebar/>

            <main className="flex-grow min-w-0">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Vishop REST API</h1>
                        <span
                            className="px-2 py-0.5 text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 rounded-full">
                            Dokumentacja
                        </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Dokumentacja endpointów REST API platformy Vishop.
                    </p>
                </div>

                <div className="flex flex-col gap-5">
                    {/* General info */}
                    <div
                        className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                        <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Informacje
                            ogólne</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                                    Bazowy URL
                                </p>
                                <code
                                    className="text-sm font-mono text-indigo-600 dark:text-indigo-400">https://dev123.vishop.pl</code>
                            </div>
                            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                                    Format danych
                                </p>
                                <code className="text-sm font-mono text-indigo-600 dark:text-indigo-400">JSON</code>
                            </div>
                        </div>

                        <div className="p-3 bg-blue-50 border border-blue-100 dark:bg-blue-950/30 dark:border-blue-900/40 rounded-lg flex gap-2.5">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                 stroke="currentColor"
                                 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/>
                            </svg>
                            <p className="text-xs text-blue-700 dark:text-blue-400">
                                We wszystkich przykładach <code
                                className="font-mono bg-blue-100 dark:bg-blue-900/40 px-1 rounded">shop_id</code> wynosi{' '}
                                <strong>1</strong>. Zastąp tę wartość rzeczywistym ID swojego sklepu.
                            </p>
                        </div>
                    </div>

                    {/* Table of contents */}
                    <div
                        className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                        <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-3">Spis
                            endpointów</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                            {endpoints.map(ep => (
                                <a
                                    key={ep.id}
                                    href={`#${ep.id}`}
                                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-150 group"
                                >
                                    <span
                                        className="shrink-0 w-5 h-5 rounded bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs font-bold flex items-center justify-center transition-colors">
                                        {ep.number}
                                    </span>
                                    <MethodBadge method={ep.method}/>
                                    <span
                                        className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{ep.title}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Endpoints */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Endpointy</h2>
                            <span
                                className="text-xs text-slate-400 dark:text-slate-500">— kliknij, aby rozwinąć</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            {endpoints.map(ep => (
                                <EndpointCard key={ep.id} ep={ep}/>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default VishopDocs;
