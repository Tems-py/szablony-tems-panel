import {useNavigate, useParams} from "react-router";
import axios from "axios";
import {backendUrl} from "../config.ts";
import {useEffect, useState} from "react";
import Payment from "../components/payment.tsx";

function Shop() {
    const navigator = useNavigate();
    const {shopId} = useParams();
    const [shop, setShop] = useState<{ "domain": string, "date": string, id: number }>({
        id: Number(shopId),
        domain: "Ładowanie...",
        date: "...",
    })
    const [types, setTypes] = useState<string[]>([])
    const [admins, setAdmins] = useState<{ id: number, avatar: string, name: string }[]>([])


    const token = localStorage.getItem("token");
    if (!token) {
        navigator("/login", {replace: true});
    }

    useEffect(() => {
        axios.get(backendUrl + "shop/" + shopId, {
            headers: {
                "Authorization": "Bearer " + token
            }
        }).then(r => {
                if (r.data.error) {
                    alert(r.data.msg)
                    return
                }

                setShop(
                    {
                        id: Number(shopId),
                        domain: r.data.domain,
                        date: r.data.date
                    })
                setTypes(r.data.types)
                setAdmins(r.data.admins)
            }
        )
    }, [])

    return (
        <div className="">
            <div className="bg-indigo-600 px-4 py-3 text-white">
                <p className="text-center text-sm font-medium">
                    Dołącz na naszego discorda, aby otrzymywać powiadomienia o nowych aktualizacjach i kończących się
                    usługach!
                    <a href="https://discord.gg/ged4vNXqEt" className="inline-block underline"
                       target="_blank">discord.gg</a>
                </p>
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[200px_1fr] lg:gap-8 h-fit p-4">
                <div className="h-full rounded-lg bg-gray-100 p-10 flex flex-col">
                    <a href="/panel"
                       className="text-center inline-block rounded border border-indigo-600 bg-indigo-600 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500 mt-10">Powrót</a>
                    <a href="/shop/{{ shop.id }}"
                       className="text-center inline-block rounded border border-indigo-600 bg-indigo-600 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500 mt-10">Strona
                        główna szablonu</a>
                    <a href="/shop/{{ shop.id }}/config"
                       className="text-center inline-block rounded border border-indigo-600 bg-indigo-600 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500 mt-10">Edycja
                        konfiguracji</a>
                    <a href="/shop/{{ shop.id }}/domain"
                       className="text-center inline-block rounded border border-indigo-600 bg-indigo-600 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500 mt-10">Ustawienia
                        domeny</a>
                    <a href="/shop/{{ shop.id }}/restart"
                       className="text-center inline-block rounded border border-indigo-600 bg-indigo-600 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500 mt-10">Restart
                        szablonu</a>
                    <a href="/shop/{{ shop.id }}/logs"
                       className="text-center inline-block rounded border border-indigo-600 bg-indigo-600 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500 mt-10">Logi</a>
                    <a href="/shop/{{ shop.id }}/files"
                       className="text-center inline-block rounded border border-indigo-600 bg-indigo-600 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500 mt-10">Edytor
                        plików</a>
                </div>
                <div className="h-full rounded-lg bg-gray-100 p-10">
                    <h1 className="font-bold text-3xl mb-4 mt-4">{shop.domain} <span
                        className="text-gray-600 text-xl mx-2 p-2 bg-slate-300 rounded">id: {shop.id}</span></h1>
                    <p>Twój pakiet jest aktywny do <strong className="font-bold">{shop.date}</strong></p>
                    <Payment />

                    <hr className="mt-3"/>
                    <strong className="block font-xl mt-3">Domena</strong>
                    <a className="mt-4 px-4 text-center inline-block rounded border border-indigo-600 bg-indigo-600 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
                       href="/shop/{{ shop.id }}/domain">Ustawienia domeny</a>
                    <p className="text-md mt-1">Darmowa domena: <a href={"https://" + shop.id + ".tems.pl"}
                                                                   target="_blank"
                                                                   className="text-indigo-500 font-bold">{shop.id}.tems.pl</a>.
                        Tej domeny nie można zmienić</p>

                    <hr className="mt-3"/>
                    <strong className="block font-xl mt-3">Logi</strong>
                    <a href="/shop/{{ shop.id }}/logs"
                       className="mt-4 px-4 text-center inline-block rounded border border-indigo-600 bg-indigo-600 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500">Logi</a>
                    <hr className="mt-3"/>
                    <div>
                        <h2 className="font-xl font-bold">Administratorzy sklepu</h2>
                        <p>Osoby dodane jako administratorzy mogą zarządzać szablonem w Twoim imieniu. Nie mogą dodać
                            innych
                            administratorów, ani reinstalować szablonu</p>
                        <div className="flex flex row gap-3 my-3 items-center">
                            <input type="text" className="p-3 rounded border-stone-200" id="admin_code"
                                   placeholder="Kod zaproszenia"></input>
                            <button className="bg-green-400 border-green-700 p-3 rounded hover:bg-green-300"
                                    id="add_admin">Dodaj
                                administratora
                            </button>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 strokeWidth="1.5"
                                 stroke="currentColor" className="size-12" id="info">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"/>
                            </svg>
                            <span id="hint" className="p-3 rounded bg-indigo-200 -ml-3">Kod zaproszenia możesz znaleźć na stronie głównej <a
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
                                            <button className="p-3 rounded bg-red-300 text-black font-bold">Usuń
                                                administratora
                                            </button>
                                        </td>}
                                        {i == 0 && <td>Właściciel sklepu</td>}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <hr className="mt-3"/>
                    <div className="bg-red-200 p-2 rounded mt-3">
                        <h2 className="font-xl font-bold">Reinstalacja szablonu</h2>
                        <p>Reinstalacja szablonu usuwa wszystkie pliki szablonu i instaluje je jeszcze raz. Opcja ta
                            przydatna jest
                            w przypadku chęci zmiany rodzaju szablonu.</p>
                        <p className="text-red-600 font-bold">Tego kroku nie da się cofnąć!</p>
                        <p className="mt-2">Wybierz rodzaj szablonu, który chcesz zainstalować:</p>
                        <select id="reinstall_type" name="type"
                                className="mt-1.5 rounded-lg border-gray-300 text-gray-700 sm:text-sm p-2 w-[300px]">
                            {types.map((type, i) => (
                                <option value={type} key={i}>{type}</option>
                            ))}
                        </select>
                        <p className="mt-2">ID sklepu na vishop.pl</p>
                        <input type="number" id="reinstall_id" name="id" min="1"
                               className="mt-1.5 rounded-lg border-gray-300 text-gray-700 sm:text-sm p-2 w-[300px]"/><br/>
                        <input type="button" id="reinstall" value="Reinstaluj szablon"
                               className="mt-3 p-3 rounded border border-red-400 font-medium text-black hover:bg-red-300"/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Shop
