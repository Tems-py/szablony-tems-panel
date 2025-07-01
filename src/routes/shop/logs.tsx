import axios from "axios";
import {backendUrl} from "../../config.ts";
import {useEffect, useRef, useState} from "react";
import MonacoEditor from "react-monaco-editor";

const Logs = (props: { shop: { "domain": string, "date": string, id: number } }) => {
    const [logs, setLogs] = useState("")
    const token = localStorage.getItem("token");
    const monacoEditorRef = useRef<any | null>(null)
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
            if (monacoEditorRef.current) {
                monacoEditorRef.current.editor.setValue(r.data.logs);
            }
        })
    }

    useEffect(() => {
        getLogs()
    }, [])


    return (
        <div className="w-full rounded-lg bg-gray-100 p-10">
            <h2 className="font-bold text-3xl">Logi</h2>
            <p className="my-2">Przydatne przy diagnozowaniu błędów z szablonem.</p>
            <div id="editor" className="w-full h-full rouded-md">
                {logs !== "" && <MonacoEditor
                    // width="800"
                    // height="600"
                    height="800px"
                    language="javascript"
                    theme="vs-dark"
                    value={logs}
                    options={{selectOnLineNumbers: true, readOnly: true}}

                    editorDidMount={(editor) => (monacoEditorRef.current = {editor})}
                    // onChange={::this.onChange}
                    // editorDidMount={::this.editorDidMount}
                />}
            </div>
        </div>
    )
}

export default Logs