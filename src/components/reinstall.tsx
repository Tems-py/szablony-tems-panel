import axios from "axios";
import {backendUrl} from "../config.ts";
import {useState} from "react";

const Reinstall = (props: { shop: { "domain": string, "date": string, id: number }, types: string[] }) => {
    const {shop, types} = props;
    const [selectedType, setSelectedType] = useState<string>(types[0]);
    const [shopId, setShopId] = useState<number>(0);
    const token = localStorage.getItem("token");

    const reinstall = () => {
        if (shopId == 0) {
            alert("Podaj ID sklepu!");
            return;
        }
        axios.post(backendUrl + "shop/" + shop.id + "/reinstall", {
            "type": selectedType != undefined ? selectedType : types[0],
            id: shopId
        }, {
            headers: {"Authorization": "Bearer " + token}
        }).then(r => {
            alert(r.data.message);
        });
    };

    return (
        <div>
            <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-red-100 dark:bg-red-950/40 rounded-lg shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                         stroke="currentColor" className="w-4 h-4 text-red-500 dark:text-red-400">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
                    </svg>
                </div>
                <div>
                    <h2 className="text-base font-semibold text-red-600 dark:text-red-400">Reinstalacja szablonu</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        Usuwa wszystkie pliki szablonu i instaluje je od nowa. Użyj gdy chcesz zmienić rodzaj szablonu.
                    </p>
                    <p className="text-xs font-semibold text-red-500 dark:text-red-400 mt-1">
                        Tej operacji nie można cofnąć!
                    </p>
                </div>
            </div>

            <div
                className="flex flex-col gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-lg">
                <div>
                    <label
                        className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                        Rodzaj szablonu
                    </label>
                    <select
                        value={selectedType}
                        onChange={e => setSelectedType(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                        {types.map((type, i) => (
                            <option value={type} key={i}>{type}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label
                        className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                        ID sklepu na vishop.pl
                    </label>
                    <input
                        type="number"
                        min={1}
                        value={shopId}
                        onChange={e => setShopId(Number(e.target.value))}
                        placeholder="Wpisz ID sklepu"
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>

                <button
                    onClick={reinstall}
                    className="self-start px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-colors duration-150"
                >
                    Reinstaluj szablon
                </button>
            </div>
        </div>
    );
};

export default Reinstall;
