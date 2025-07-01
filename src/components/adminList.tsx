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
                admin_id: admin_id
            }
        }).then(r => {
            if (r.data.error) {
                alert(r.data.error)
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
                alert(r.data.msg)
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
                alert(r.data.msg)
                return
            }
            setAdmins(r.data)
        })
    }

    return (
        <div>
            <h2 className="font-xl font-bold">Administratorzy sklepu</h2>
            <p>Osoby dodane jako administratorzy mogą zarządzać szablonem w Twoim imieniu. Nie mogą dodać
                innych
                administratorów, ani reinstalować szablonu</p>
            <div className="flex flex-row flex-wrap gap-3 my-3 items-center">
                <input type="text" className="p-3 rounded border-stone-200 bg-white shadow-md" id="admin_code"
                       onChange={e => setInviteCode(e.target.value)}
                       value={inviteCode}
                       placeholder="Kod zaproszenia"/>
                <button className="bg-green-400 border-green-700 p-3 rounded hover:bg-green-300"
                        id="add_admin" onClick={addAdmin}>Dodaj administratora
                </button>
                {/*<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"*/}
                {/*     strokeWidth="1.5"*/}
                {/*     stroke="currentColor" className="size-12" id="info">*/}
                {/*    <path strokeLinecap="round" strokeLinejoin="round"*/}
                {/*          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"/>*/}
                {/*</svg>*/}
                <span id="hint" className="p-3 rounded bg-indigo-200">Kod zaproszenia możesz znaleźć na stronie głównej <a
                    href="/panel" className="text-indigo-600 underline">panelu</a>.</span>
            </div>
            <div className="relative overflow-x-auto mt-3">
                <table className="w-full text text-left rtl:text-right text-gray-500">
                    <thead
                        className="text-xs text-indigo-700 bg-white border-2 border-gray-100 uppercase-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Nazwa
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Akcje
                        </th>
                    </tr>
                    </thead>
                    <tbody id="admins">
                    {admins.map((admin, i) => (
                        <tr key={i} className="bg-white border-b border-gray-100 p-3">
                            <td className="px-6 py-4 text-lg flex flex-row gap-1 items-center font-medium whitespace-nowrap">
                                <img
                                    src={admin.avatar} alt={admin.name + " avatar"}
                                    style={{height: "1em"}}/>
                                {(i == 0 ? "👑" : "") + admin.name}</td>
                            {i != 0 && <td>
                                <button
                                    className="p-3 rounded bg-red-300 text-black font-bold cursor-pointer"
                                    onClick={() => deleteAdmin(admin.id)}>Usuń administratora
                                </button>
                            </td>}
                            {i == 0 && <td>Właściciel sklepu</td>}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AdminList