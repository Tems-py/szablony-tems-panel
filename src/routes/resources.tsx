import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router";
import Sidebar from "../components/sidebar.tsx";
import axios from "axios";
import {backendUrl} from "../config.ts";

const Resources: React.FC = () => {
    const navigator = useNavigate();
    const [files, setFiles] = useState<string[]>([])

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigator("/login", {replace: true});
        }

        axios.get(backendUrl + "resources", {
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
            setFiles(response.data.files);
        })
    }, [])

    return (
        <div className="flex gap-4 flex-col lg:flex-row p-10">
            <Sidebar/>
            <div className="rounded-lg bg-gray-100 p-10 gap-1 flex-grow flex flex-col gap-4">
                <h1 className="text-3xl font-bold">Zasoby</h1>
                <p className="p-3 bg-indigo-500 text-sky-100 rounded border border-indigo-700 ring-gray-300 flex-grow-0">Zasobów
                    możesz dowolnie używać w swoim sklepie, dopóki jesteś naszym klientem - posiadasz aktywny plan
                    hostingu. Zakaz rozpowszechniania, sprzedaży i przypisywania sobie autorstwa.</p>

                <div className="grid grid-cols-1 lg:grid-cols-4 flex-wrap rounded gap-7 justify-around align-items-center">
                    {files.map((file: string) => (
                        <div className="p-7 bg-white text-center flex flex-col gap-3 rounded shadow-lg justify-between items-center">
                            <img src={"https://szablony.tems.pl/static/" + "resources/" + file} alt={file} />
                            <a href={"https://szablony.tems.pl/static/" + "resources/" + file}
                               className="text-white p-3 rounded border border-indigo-600 bg-indigo-600 hover:bg-transparent hover:text-indigo-600 focus:outline text-center"
                               download>Pobierz {file}</a>
                        </div>
                        ))
                    }

                    {files.length == 0 && <p className="text-red-600 p-3 bg-red-200 text-center rounded border border-red-500">Nie masz
                        dostępu do tej treści. Musisz posiadać wykupiony plan naszego hostingu</p>}
                </div>

            </div>
        </div>
    );
};

export default Resources;