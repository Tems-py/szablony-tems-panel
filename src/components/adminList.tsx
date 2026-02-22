import axios from "axios";
import {backendUrl} from "../config.ts";
import {useEffect, useState} from "react";
import {useParams} from "react-router";

const AdminList = () => {
    const {shopId} = useParams();
    const token = localStorage.getItem("token");
    const [admins, setAdmins] = useState<{ id: number, avatar: string, name: string }[]>([])
    const [inviteCode, setInviteCode] = useState<string>("")

    useEffect(() => {
        getAdmins()
    }, [])

    const deleteAdmin = (admin_id: number) => {
        axios.delete(backendUrl + "shop/" + shopId + "/admins", {
            headers: {
                "Authorization": "Bearer " + token
            },
            data: {
                id: admin_id
            }
        }).then(r => {
            if (r.data.error) {
                alert(r.data.message)
            }
            getAdmins()
        })
    }

    const addAdmin = () => {
        axios.post(backendUrl + "shop/" + shopId + "/admins", {
            invite_code: inviteCode
        }, {
            headers: {
                "Authorization": "Bearer " + token
            }
        }).then(r => {
            if (r.data.error) {
                alert(r.data.message)
            }
            getAdmins()
        })
    }

    const getAdmins = () => {
        axios.get(backendUrl + "shop/" + shopId + "/admins", {
            headers: {
                "Authorization": "Bearer " + token
            }
        }).then(r => {
            if (r.data.error) {
                alert(r.data.message)
                return
            }
            setAdmins(r.data)
        })
    }

    return (
        <div>
            <h2 className="font-xl font-bold dark:text-white">Administratorzy sklepu</h2>
            <p className="dark:text-gray-300">Osoby dodane jako administratorzy mogą zarządzać szablonem w Twoim imieniu. Nie mogą dodać
                innych administratorów, ani reinstalować szablonu</p>
            <div className="flex flex-row flex-wrap gap-3 my-3 items-center">
                <input type="text" className="p-3 rounded border-stone-200 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 shadow-md" id="admin_code"
                       onChange={e => setInviteCode(e.target.value)}
                       value={inviteCode}
                       placeholder="Kod zaproszenia"/>
                <button className="bg-green-400 dark:bg-green-700 border-green-700 p-3 rounded hover:bg-green-300 dark:hover:bg-green-600 dark:text-white"
                        id="add_admin" onClick={addAdmin}>Dodaj administratora
                </button>
                <span id="hint" className="p-3 rounded bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-200">Kod zaproszenia możesz znaleźć na stronie głównej <a
                    href="/panel" className="text-indigo-600 dark:text-indigo-400 underline">panelu</a>.</span>
            </div>
            <div className="relative overflow-x-auto mt-3">
                <table className="w-full text text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-indigo-700 dark:text-indigo-400 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 uppercase-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">Nazwa</th>
                        <th scope="col" className="px-6 py-3">Akcje</th>
                    </tr>
                    </thead>
                    <tbody id="admins">
                    {admins.map((admin, i) => (
                        <tr key={i} className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700 p-3">
                            <td className="px-6 py-4 text-lg flex flex-row gap-1 items-center font-medium whitespace-nowrap dark:text-gray-200">
                                <img src={admin.avatar} alt={admin.name + " avatar"} style={{height: "1em"}}/>
                                {(i == 0 ? "👑" : "") + admin.name}
                            </td>
                            {i != 0 && <td>
                                <button
                                    className="p-3 rounded bg-red-300 dark:bg-red-800 text-black dark:text-red-100 font-bold cursor-pointer hover:bg-red-400 dark:hover:bg-red-700"
                                    onClick={() => deleteAdmin(admin.id)}>Usuń administratora
                                </button>
                            </td>}
                            {i == 0 && <td className="dark:text-gray-400">Właściciel sklepu</td>}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AdminList
