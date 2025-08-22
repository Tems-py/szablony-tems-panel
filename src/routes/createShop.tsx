import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router";
import Sidebar from "../components/sidebar.tsx";
import axios from "axios";
import {backendUrl} from "../config.ts";
import Payment from "../components/payment.tsx";

const CreateShop: React.FC = () => {
    const navigator = useNavigate();
    const [boughtTemplates, setBoughtTemplates] = useState<string[]>([])
    const [templates, setTemplates] = useState<{ name: string, price: number, id: number, vishop: boolean }[]>([])
    const [error, setError] = useState<string | null>(null)

    const [renewDays, setRenewDays] = useState<number>(95)
    const [domain, setDomain] = useState<string>("");
    const [vishopId, setVishopId] = useState<number>(0);
    const [type, setType] = useState<string>("");
    const [rulesAccepted, setRulesAccepted] = useState<boolean>(false);

    const selectedTemplate = templates.find((t) => t.name === type)

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigator("/login", {replace: true});
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
                    navigator("/login", {replace: true});
                    return
                }
                alert(response.data.message)

            }
            setBoughtTemplates(response.data.bought_templates)
            setTemplates(response.data.templates)
            setType(response.data.templates[0].name)
        })
    }, [])

    const buy = () => {
        if (!rulesAccepted) {
            setError("Musisz zaakceptować regulamin, aby kontynuować.")
            return
        }

        setError(null)
        const token = localStorage.getItem("token");

        axios.post(backendUrl + "buy", {
            domain: domain,
            vishop_id: vishopId,
            template: type,
            days: renewDays
        }, {
            headers: {
                "Authorization": "Bearer " + token
            }
        }).then(response => {
            if (response.data.error) {
                setError(response.data.message);
                return;
            }
            window.location.href = response.data.url;
        })
    }

    const buyTemplate = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigator("/login", {replace: true});
        }

        const template = templates.find((t) => t.name === type);
        if (template == null) return;

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

    return (
        <div className="flex gap-4 flex-col lg:flex-row p-10">
            <Sidebar/>
            <div
                className="rounded-lg bg-gray-100 p-10 gap-1 flex-grow flex flex-col gap-4 items-center align-items-center">
                <h1 className="text-3xl font-bold mb-4">Wykup nowy sklep</h1>

                <div className="flex flex-col gap-6 lg:w-1/2 bg-white p-6 rounded-lg shadow-md">

                    <label className="block text-s font-medium text-gray-700 bg-white p-3 rounded-lg shadow-md">
                        Domena
                        <input type="text" name="domain" placeholder="minecraft.pl" value={domain}
                               onChange={(e) => setDomain(e.target.value)}
                               className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm p-2"/>
                    </label>
                    <label className="block text-s font-medium text-gray-700 bg-white p-3 rounded-lg shadow-md">
                        ID Vishop
                        <input type="number" name="id" placeholder="0" value={vishopId}
                               onChange={(e) => setVishopId(Number(e.target.value))}
                               className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm p-2"/>
                    </label>
                    <label className="block text-s font-medium text-gray-700 bg-white p-3 rounded-lg shadow-md">
                        Rodzaj szablonu
                        <select name="type" value={type} onChange={(e) => setType(e.target.value)}
                                className="mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm p-2 shadow-sm">
                            {templates.map((type, i) =>
                                <option value={type.name}
                                        key={i}>{type.name}{type.price != 0 && !boughtTemplates.includes(type.name) ? ` - ${type.price}zł` : ""}</option>)}

                        </select>
                    </label>
                    {selectedTemplate != undefined && selectedTemplate.price != 0 && !boughtTemplates.includes(type) && <div className="p-3 rounded bg-blue-300 border border-blue-700">Jeżeli nie masz wykupionego tego szablonu, kup go <span onClick={() => buyTemplate()} className="underline text-indigo-500">tutaj</span></div>}
                    <div className="w-full flex flex-col lg:flex-row gap-6 justify-between ">
                        <div className="flex flex-row w-min gap-2 bg-white p-3 rounded-lg shadow-md">
                            <Payment daysHook={[renewDays, setRenewDays]}/>
                        </div>
                        <div className="flex flex-col bg-white p-3 rounded-lg shadow-md">
                            <img src={"/img/" + type + ".png"} alt={type} width="200" height="200" className="h-full w-full"/>
                        </div>
                    </div>

                    <label> <input type="checkbox" name="" id="" checked={rulesAccepted}
                                   onChange={() => setRulesAccepted(old => !old)}/> Akceptuję <a
                        href="https://szablony.tems.pl/regulamin_platnosci"
                        className="text-indigo-600 hover:text-indigo-500 font-bold rounded-md">regulamin</a>
                    </label>

                    {error != null &&
                        <div role="alert" className="rounded border-s-4 border-red-500 bg-red-50 p-4">
                            <div className="flex items-center gap-2 text-red-800">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                     className="h-5 w-5">
                                    <path fillRule="evenodd"
                                          d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                                          clipRule="evenodd"/>
                                </svg>

                                <strong className="block font-medium">Błąd</strong>
                            </div>

                            <p className="mt-2 text-sm text-red-700">{error}</p>
                        </div>
                    }

                    <button type="submit" onClick={buy}
                            className="inline-block rounded border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500">Kup
                    </button>


                </div>
            </div>
        </div>
    );
};

export default CreateShop;