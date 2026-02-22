import React, {useState} from "react";
import axios from "axios";
import {backendUrl} from "../../config.ts";

function Domain(props: { shop: { "domain": string, "date": string, id: number } }) {
    const {shop} = props;
    const [domain, setDomain] = useState("");
    const token = localStorage.getItem("token");
    const [txt, setTxt] = useState({status: "", txt_name: "", txt_value: ""});

    const changeDomain = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        axios.post(backendUrl + "shop/" + shop.id + "/domain", {
            domain: domain
        }, {
            headers: {
                "Authorization": "Bearer " + token
            }
        }).then(r => {
            alert(r.data.message)
        }).catch(err => {
            alert(err.response.data.message)
        })
    }

    const addDomain = () => {
        axios.put(backendUrl + "shop/" + shop.id + "/domain", {}, {
            headers: {
                "Authorization": "Bearer " + token
            }
        }).then(r => {
            alert(r.data.message)
        }).catch(err => {
            alert(err.response.data.message)
        })
    }

    const getTxt = () => {
        axios.get(backendUrl + "shop/" + shop.id + "/domain", {
            headers: {
                "Authorization": "Bearer " + token
            }
        }).then(r => {
            if (r.data.error) {
                alert(r.data.message)
                return
            }
            setTxt(r.data.data)
        }).catch(err => {
            alert(err.response.data.message)
        })
    }

    return (
        <div className="h-full w-full rounded-lg bg-gray-100 dark:bg-gray-800 p-10">
            <h1 className="font-bold text-3xl dark:text-white">Zarządzanie domeną</h1>
            <h2 className="text-2xl dark:text-gray-200">Aktualna domena: {shop.domain}</h2>
            <p className="mt-2 dark:text-gray-300">Dodaj rekord typu <b>CNAME</b> na domenie <b>{shop.domain}</b><br/><img
                src="https://i.imgur.com/amJwOGV.png" alt="przykład cloudflare"/></p>
            <p className="mt-2 dark:text-gray-300">Po dodaniu rekordu, poinformuj o tym nasz system klikając ten przycisk: <br/><input
                type="button" value="Dodaj domenę" id="add_domain" onClick={() => addDomain()}
                className="px-4 text-center inline-block rounded border border-indigo-600 bg-indigo-600 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500 mt-2"/>
            </p>
            <div className="mt-2 dark:text-gray-300">Jeżeli używasz CloudFlare to tyle!<br/>
                Jeżeli nie używasz CloudFlare, musisz także ustawić rekord txt (odczekaj 10s przed kliknięciem tego
                przycisku)<br/>
                <button id="txt" onClick={() => getTxt()}
                        className="px-4 text-center inline-block rounded border border-indigo-600 bg-indigo-600 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500 mt-2">Pokaż
                    txt
                </button>
                {txt.status !== "" &&
                    <div>Typ rekordu: TXT<br/>Nazwa: {txt.txt_name}<br/>Wartość: {txt.txt_value}</div>}
            </div>
            <br/>
            <hr/>
            <h2 className="text-2xl dark:text-gray-200">Zmień domenę</h2>
            <p className="mt-2 dark:text-gray-300">Wpisz nową domenę, którą chcesz ustawić dla tego szablonu. <br/>Uwaga! Po zmianie
                domeny, musisz ponownie ustawić rekordy CNAME i TXT!</p>
            <form action={`/shop/${shop.id}/change_domain`} className="flex flex-col" onSubmit={changeDomain}>
                <input type="text" id="domain" name="domain" value={domain} placeholder={shop.domain}
                       onChange={e => setDomain(e.target.value)}
                       className="px-4 text-left inline-block rounded border border-indigo-600 bg-gray-300 py-3 text-sm font-medium text-black hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500 mt-2 w-[300px]"/>
                <input type="submit" id="change_domain" value="Zmień domenę"
                       className="px-4 text-center inline-block rounded border border-indigo-600 bg-indigo-600 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500 mt-2 w-32"/>
            </form>
        </div>
    )
}

export default Domain
