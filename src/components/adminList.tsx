import axios from "axios";
import {backendUrl} from "../config.ts";
import {useEffect, useState} from "react";
import {useParams, Link} from "react-router";

const AdminList = () => {
    const {shopId} = useParams();
    const token = localStorage.getItem("token");
    const [admins, setAdmins] = useState<{ id: number, avatar: string, name: string }[]>([]);
    const [inviteCode, setInviteCode] = useState<string>("");

    useEffect(() => {
        getAdmins();
    }, []);

    const deleteAdmin = (admin_id: number) => {
        axios.delete(backendUrl + "shop/" + shopId + "/admins", {
            headers: {"Authorization": "Bearer " + token},
            data: {id: admin_id}
        }).then(r => {
            if (r.data.error) alert(r.data.message);
            getAdmins();
        });
    };

    const addAdmin = () => {
        if (!inviteCode.trim()) return;
        axios.post(backendUrl + "shop/" + shopId + "/admins", {invite_code: inviteCode}, {
            headers: {"Authorization": "Bearer " + token}
        }).then(r => {
            if (r.data.error) alert(r.data.message);
            setInviteCode("");
            getAdmins();
        });
    };

    const getAdmins = () => {
        axios.get(backendUrl + "shop/" + shopId + "/admins", {
            headers: {"Authorization": "Bearer " + token}
        }).then(r => {
            if (r.data.error) {
                alert(r.data.message);
                return;
            }
            setAdmins(r.data);
        });
    };

    return (
        <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Administratorzy sklepu</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 mb-4">
                Admini mogą zarządzać szablonem w Twoim imieniu. Nie mogą dodawać innych adminów ani reinstalować
                szablonu.
            </p>

            <div
                className="flex items-start gap-2.5 p-3 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 rounded-lg text-sm text-indigo-700 dark:text-indigo-300 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                     stroke="currentColor" className="w-4 h-4 shrink-0 mt-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/>
                </svg>
                <span>
                    Kod zaproszenia użytkownika znajdziesz na{" "}
                    <Link to="/panel" className="font-semibold underline underline-offset-2">stronie głównej panelu</Link>.
                </span>
            </div>

            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={inviteCode}
                    onChange={e => setInviteCode(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addAdmin()}
                    placeholder="Wklej kod zaproszenia..."
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                    onClick={addAdmin}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors duration-150 shrink-0"
                >
                    Dodaj
                </button>
            </div>

            {admins.length === 0 ? (
                <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-4">Brak administratorów.</p>
            ) : (
                <div className="flex flex-col gap-2">
                    {admins.map((admin, i) => (
                        <div key={i}
                             className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-700/50">
                            <img src={admin.avatar} alt={admin.name + " avatar"}
                                 className="w-8 h-8 rounded-full shrink-0"/>
                            <span className="flex-1 text-sm font-medium text-slate-900 dark:text-white">
                                {i === 0 ? "👑 " : ""}{admin.name}
                            </span>
                            {i === 0 ? (
                                <span
                                    className="text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">Właściciel</span>
                            ) : (
                                <button
                                    onClick={() => deleteAdmin(admin.id)}
                                    className="text-xs text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 px-2.5 py-1 rounded-lg transition-colors duration-150 font-medium"
                                >
                                    Usuń
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminList;
