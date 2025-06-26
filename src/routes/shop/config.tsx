import axios from "axios";
import {backendUrl} from "../../config.ts";
import {useEffect, useRef} from "react";
import MonacoEditor from "react-monaco-editor";

const Config = (props: { shop: { "domain": string, "date": string, id: number } }) => {
    const token = localStorage.getItem("token");
    const monacoEditorRef = useRef<any | null>(null)
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
            if (monacoEditorRef.current) {
                monacoEditorRef.current.editor.setValue(r.data.data);
            }
        })
    }

    const saveConfig = () => {
        axios.post(backendUrl + "shop/" + props.shop.id + "/file_system", {
            path: "nuxt.config.js",
            data: monacoEditorRef.current.editor.getValue()
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
        <div className="w-full rounded-lg bg-gray-100 p-10">
            <h2 className="font-bold text-3xl">Konfiguracja</h2>
            <div className="flex flex-row justify-between">
                <p className="my-2">Podstawowa konfiguracja wyglądu szablonu</p>
                <button
                    onClick={_ => saveConfig()}
                    className="bg-indigo-600 transition-all duration-200 font-bold text-center inline-block rounded border border-indigo-600  px-10 pt-3 pb-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500">Zapisz
                </button>
            </div>
            <div id="editor" className="w-full h-full rouded-md mt-3">
                <MonacoEditor
                    // width="800"
                    // height="600"
                    language="javascript"
                    theme="vs-dark"
                    options={{selectOnLineNumbers: true, "semanticHighlighting.enabled": true}}

                    editorDidMount={(editor) => (monacoEditorRef.current = {editor})}
                    // onChange={::this.onChange}
                    // editorDidMount={::this.editorDidMount}
                />
            </div>
        </div>
    )
}

export default Config