import React, {useEffect, useState} from 'react';
import Button from "../components/button.tsx";
import {Link, useNavigate} from "react-router";
import Sidebar from "../components/sidebar.tsx";
import axios from "axios";
import {backendUrl} from "../config.ts";

const Panel: React.FC = () => {
    const navigator = useNavigate();
    const [adminInvite, setAdminInvite] = useState("")
    const [boughtTemplates, setBoughtTemplates] = useState<string[]>([])
    const [shops, setShops] = useState<{ date: string, domain: string, id: number }[]>([])

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
            setAdminInvite(response.data.admin_invite)
            setBoughtTemplates(response.data.bought_templates)
            setShops(response.data.shops)
        })
    }, [])

    return (
        <div className="flex gap-4 flex-col lg:flex-row p-10">
            <Sidebar/>
            <div className="flex flex-col rounded-lg bg-gray-100 p-10 gap-1 flex-grow">
                <h1 className="text-3xl font-bold">Panel szablonów</h1>
                <div className="flex flex-col gap-3">
                    <h2 className="text-xl">Hosting:</h2>
                    <div className="flex flex-row flex-wrap gap-1.5">
                        {shops.map((shop, i) => (
                            <Link to={"/shop/" + shop.id} key={i}
                               className="p-10 bg-gray-300 rounded-xl flex flex-col justify-center w-64">
                                <p className="font-bold mt-3 text-center inline-block rounded border border-indigo-600 bg-indigo-600 pt-3 pb-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500">{shop.domain}</p>
                                <p className="text-gray-600 text-center mt-1">Sklep aktywny do: <br/>{shop.date}</p>
                            </Link>
                        ))}

                        {shops.length == 0 && <p>Nie masz wykupionego żadnego planu hostingowego</p>}
                    </div>
                    <div>
                        <Button href="/create/shop">Kup hosting</Button>
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <h2 className="text-xl">Twoje dostępne szablony:</h2>
                    <section className="flex flex-row flex-wrap gap-1.5">
                        {boughtTemplates.map((template, i) => (
                            <div className="p-10 bg-gray-300 rounded-xl flex flex-col justify-center w-64" key={i}>
                                <div className="h-32">
                                    <img src={"img/" + template + ".png"}
                                         alt={template}
                                         height="400" className="object-fill"/>
                                </div>
                                <p className="font-bold mt-3 text-center inline-block rounded border border-indigo-600 text-indigo-600 pt-3 pb-3 font-medium flex-grow-0">{template}</p>
                            </div>

                        ))}
                    </section>
                    <section>
                        <Button href="/panel/buy_template">Kup szablony</Button>
                    </section>
                    <section>
                        <p>Twój klucz zaproszenia administratora</p>
                        <div className="flex flex-row gap-3 items-center mt-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                 id="copy_code"
                                 stroke="currentColor"
                                 className="p-1 rounded bg-gray-300 h-12 hover:cursor-pointer hover:bg-gray-200">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"/>
                            </svg>
                            <input id="invite_code" type="text" value={adminInvite} disabled
                                   className="p-3 rounded border-stone-200 w-full"/>
                        </div>

                    </section>
                </div>
            </div>
        </div>
    );
};

export default Panel;