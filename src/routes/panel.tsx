import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router";
import Sidebar from "../components/sidebar.tsx";
import axios from "axios";
import {backendUrl} from "../config.ts";

const Panel: React.FC = () => {
    const navigatorFunction = useNavigate();
    const [adminInvite, setAdminInvite] = useState("")
    const [boughtTemplates, setBoughtTemplates] = useState<string[]>([])
    const [shops, setShops] = useState<{ date: string, domain: string, id: number }[]>([])
    const [templates, setTemplates] = useState<{ name: string, price: number, id: number, vishop: boolean }[]>([])

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigatorFunction("/login", {replace: true});
        }

        axios.get(backendUrl + "panel", {
            headers: {
                "Authorization": "Bearer " + token
            }
        }).then(response => {
            console.log(response.data)
            if (response.data.error) {
                if (response.data.error === "token_expired" || response.data.error === "token_invalid") {
                    localStorage.clear()
                    navigatorFunction("/login", {replace: true});
                    return
                }
                alert(response.data.message)

            }
            setAdminInvite(response.data.admin_invite)
            setBoughtTemplates(response.data.bought_templates)
            setShops(response.data.shops)
            setTemplates(response.data.templates)
        })
    }, [])

    const buyTemplate = (template: { name: string, price: number, id: number, vishop: boolean }) => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigatorFunction("/login", {replace: true});
        }

        if (template.vishop) {
            alert("Ten szablon jest dostępny do zakupu w oficjalnym panelu vishop")
            window.location.href = "https://panel.vishop.pl/";
            return
        }

        axios.post(backendUrl + "buy_template", {
            template_id: template.id
        }, {
            headers: {
                "Authorization": "Bearer " + token
            }
        }).then(response => {
            if (response.data.error) {
                alert(response.data.message);
                return;
            }
            window.location.href = response.data.url;
        })
    }

    const copyCode = () => {
        navigator.clipboard.writeText(adminInvite).then(() => {
          alert("Skopiowano kod zaproszenia do schowka!")
        })
    }

    return (
        <div className="flex gap-4 flex-col lg:flex-row p-2 md:p-10">
            <Sidebar/>
            <div className="rounded-lg bg-gray-100 p-2 md:p-10 gap-1 flex-grow">
                <h1 className="text-3xl font-bold mb-4">Panel szablonów</h1>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <section className="md:col-span-2 lg:col-span-3">
                        <div className="bg-white p-3 md:p-6 rounded-lg shadow-md lg:col-span-2">
                            <h2 className="text-xl font-semibold mb-2 text-gray-800 mb-4">Twoje usługi</h2>
                            <Link to="/panel/buy"
                                  className="py-2 px-4 bg-gray-800 text-white rounded-md hover:bg-gray-700">Kup
                                hosting</Link>
                            <p className="text-gray-600 my-4">Zarządzaj swoimi planami hostingu szablonów</p>
                            {shops.length == 0 && <p>Nie masz wykupionego żadnego planu hostingowego</p>}
                            {shops.length != 0 && <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50 w-full">
                                    <tr>
                                        <th scope="col"
                                            className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                                            Nazwa
                                        </th>
                                        {/*<th scope="col"*/}
                                        {/*    className="px-6 py-3 text-left  font-medium text-gray-500 uppercase tracking-wider">*/}
                                        {/*    Status*/}
                                        {/*</th>*/}
                                        <th scope="col"
                                            className="px-6 py-3 text-left  font-medium text-gray-500 uppercase tracking-wider">
                                            Ważny do
                                        </th>
                                        <th scope="col"
                                            className="px-6 py-3 text-left  font-medium text-gray-500 uppercase tracking-wider">
                                            Akcje
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {shops.map((shop) => (
                                        <tr key={shop.id} onClick={() => navigatorFunction("/shop/" + shop.id)}
                                            className="cursor-pointer hover:bg-gray-100 hover:text-md transition-all duration-100">
                                            <td className="px-6 py-4 whitespace-nowrap"><span
                                                className="px-3 py-2 rounded-lg border border-gray-300 hover:border-gray-400 box-border">{shop.domain}</span></td>
                                            {/*<td className="px-6 py-4 whitespace-nowrap">{shop.status == 200 ? "Działa" : "Błąd"}</td>*/}
                                            <td className="px-6 py-4 whitespace-nowrap ">{shop.date}</td>
                                            <td className="px-3 py-2 whitespace-nowrap"><span
                                                className="px-3 py-2 rounded-lg border border-transparent hover:border-gray-300 box-border">Zarządzaj</span>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>}
                        </div>
                    </section>

                    <section className="w-full">
                        <div className="bg-white p-3 md:p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-2 text-gray-800">Kod zaproszenia</h2>
                            <p className="text-gray-600 mb-4">Podaj ten kod osobie, która chce Cię dodać jako
                                administratora.</p>
                            <div className="flex flex-row gap-3 items-center mt-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     onClick={copyCode}
                                     strokeWidth="1.5"
                                     id="copy_code"
                                     stroke="currentColor"
                                     className="p-1 rounded bg-gray-300 h-12 hover:cursor-pointer hover:bg-gray-200">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"/>
                                </svg>
                                <input id="invite_code" type="text" value={adminInvite} disabled
                                       className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-500"/>
                            </div>
                        </div>
                    </section>

                    <section className="md:col-span-2">
                        <div className="bg-white p-3 md:p-6 rounded-lg shadow-md lg:col-span-3">
                            <h2 className="text-xl font-semibold mb-2 text-gray-800">Dostępne szablony</h2>
                            <p className="text-gray-600 mb-4">Darmowe i płatne szablony, których możesz użyć</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {boughtTemplates.map((template) => (
                                    <div
                                        key={template}
                                        className="border border-gray-200 rounded-lg overflow-hidden flex flex-col items-center text-center bg-white shadow-sm"
                                    >
                                        <img
                                            src={"/img/" + template + ".png"}
                                            alt={template}
                                            width={150}
                                            height={100}
                                            className="object-cover w-full h-24 rounded-t-lg"
                                        />
                                        <div className="p-4 flex-1 flex flex-col justify-between w-full">
                                            <h3 className="font-semibold text-lg mb-2 text-gray-800">{template}</h3>
                                            <Link to={`/panel/buy`}
                                                className="w-full py-2 px-4 border border-gray-300 bg-white text-gray-800 rounded-md hover:bg-gray-100 cursor-pointer">
                                                Użyj tego szablonu
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                    <section className="lg:col-span-2">
                        <div className="bg-white p-3 md:p-6 rounded-lg shadow-md lg:col-span-3">
                            <h2 className="text-xl font-semibold mb-2 text-gray-800">Szablony do zakupu</h2>
                            <p className="text-gray-600 mb-4">Szablony premium, dostępne za opłatą</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {templates.filter((template) => template.price != 0).map((template, i) => (
                                    <div
                                        key={i}
                                        className="border border-gray-200 rounded-lg overflow-hidden flex flex-col items-center text-center bg-white shadow-sm"
                                    >
                                        <img
                                            src={"/img/" + template.name + ".png"}
                                            alt={template.name}
                                            width={150}
                                            height={100}
                                            className="object-cover w-full h-24 rounded-t-lg"
                                        />
                                        <div className="p-4 flex-1 flex flex-col justify-between w-full">
                                            <h3 className="font-semibold text-lg mb-2 text-gray-800">{template.name}</h3>
                                            <p className="text-gray-500 mb-4">{template.price == 0 ? "Darmowy" : `${template.price}zł`}</p>
                                            {template.price != 0 && <button
                                                onClick={() => buyTemplate(template)}
                                                className="w-full py-2 px-4 bg-gray-800 text-white rounded-md hover:bg-gray-700 pointer">
                                                Kup ten szablon
                                            </button>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Panel;