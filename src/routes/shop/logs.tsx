import axios from "axios";
import {backendUrl} from "../../config.ts";
import {useEffect, useState} from "react";

const Logs = (props: { shop: { "domain": string, "date": string, id: number } }) => {
    const [logs, setLogs] = useState("")
    const token = localStorage.getItem("token");
    const getLogs = () => {
        axios.get(backendUrl + "shop/" + props.shop.id + "/logs", {
            headers: {
                "Authorization": "Bearer " + token
            }
        }).then(r => {
            if (r.data.error) {
                alert(r.data.message)
                return
            }
            setLogs(r.data.logs)
        })
    }

    useEffect(() => {
        getLogs()
    }, [])


    return (
        <div className="h-full w-full rounded-lg bg-gray-100 p-10">
            <h2 className="font-bold text-3xl">Logi</h2>
            <p>Przydatne przy diagnozowaniu błędów z szablonem.</p>
            <textarea disabled name="logs" spellCheck="false" rows={44} cols={170}
                      className="rounded-lg mt-3 bg-neutral-800 p-1 text-white" value={logs} />
        </div>
    )
}

export  default  Logs