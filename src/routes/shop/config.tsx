import axios from "axios";
import {backendUrl} from "../../config.ts";
import {useEffect, useState} from "react";
import Editor from "@monaco-editor/react";

const Config = (props: { shop: { "domain": string, "date": string, id: number } }) => {
    const token = localStorage.getItem("token");
    const [config, setConfig] = useState<string>()

    const getConfig = () => {
        axios.get(backendUrl + "shop/" + props.shop.id + "/file_system", {
            params: {
                path: "nuxt.config.js"
            },
            headers: {
                "Authorization": "Bearer " + token
            }
        }).then(r => {
            if (r.data.error) {
                alert(r.data.message)
                return
            }
            console.log(r.data)

            setConfig(r.data.data);
        })
    }

    const saveConfig = () => {
        axios.post(backendUrl + "shop/" + props.shop.id + "/file_system", {
            path: "nuxt.config.js",
            data: config
        }, {
            headers: {
                "Authorization": "Bearer " + token
            }
        }).then(r => {
            if (r.data.error) {
                alert(r.data.message)
                return
            }
            alert("Plik został zapisany")
        })
    }

    useEffect(() => {
        getConfig()
    }, [])


    return (
        <div className="w-full rounded-lg bg-gray-100 dark:bg-gray-800 p-3 lg:p-10">
            <h2 className="font-bold text-3xl dark:text-white">Konfiguracja</h2>
            <div className="flex flex-row justify-between">
                <p className="my-2 dark:text-gray-300">Podstawowa konfiguracja wyglądu szablonu. Pamiętaj, że zmiany zostaną wprowadzone dopiero po restarcie szablonu</p>
                <button
                    onClick={_ => saveConfig()}
                    className="bg-indigo-600 transition-all duration-200 font-bold text-center inline-block rounded border border-indigo-600  px-10 pt-3 pb-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500">Zapisz
                </button>
            </div>
            <div id="editor" className="w-full h-full rouded-md mt-3">
                <Editor
                    height="820px"
                    language="javascript"
                    value={config}
                    onChange={(value) => setConfig(value)}
                    theme="vs-dark"
                    options={{
                        selectOnLineNumbers: true,
                        roundedSelection: false,
                        readOnly: false,
                        cursorStyle: 'line',
                        automaticLayout: true,
                        minimap: {enabled: true},
                        fontSize: 14,
                    }}
                />
            </div>
        </div>
    )
}

export default Config