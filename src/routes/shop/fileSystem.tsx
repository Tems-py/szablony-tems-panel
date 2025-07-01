import MonacoEditor from 'react-monaco-editor';
import axios from "axios";
import {backendUrl} from "../../config.ts";
import React, {useEffect, useRef, useState} from "react";

const FileSystem = (props: { shop: { "domain": string, "date": string, id: number } }) => {
    const [files, setFiles] = useState([])
    const [directories, setDirectories] = useState([])
    const [path, setPath] = useState("")
    const [file, setFile] = useState("")
    const [image, setImage] = useState<string | null>(null)
    const token = localStorage.getItem("token");
    const monacoEditorRef = useRef<any | null>(null)
    const [canEdit, setCanEdit] = useState(false)
    const [canUpload, setCanUpload] = useState(false)
    const fileInput = useRef<any | null>(null)

    const getData = (currentPath = "") => {
        axios.get(backendUrl + "shop/" + props.shop.id + "/file_system", {
            params: {
                path: currentPath
            },
            headers: {
                "Authorization": "Bearer " + token
            }
        }).then(r => {
            if (r.data.error) {
                alert(r.data.message)
                setCanEdit(false)
                setImage(null)
                setCanUpload(false)
                return
            }
            setFiles(r.data.files)
            setDirectories(r.data.directories)
            setPath(currentPath)
            setCanEdit(false)
            setCanUpload(false)
            setImage(null)

            if (monacoEditorRef.current) {
                monacoEditorRef.current.editor.setValue(r.data);
            }
        })
    }

    const gotToSubDirectory = (directory: string) => {
        getData(path + directory + "/")
        setFile("")
        if (monacoEditorRef.current) {
            monacoEditorRef.current.editor.setValue("");
        }
    }

    const getFile = (file = "") => {
        axios.get(backendUrl + "shop/" + props.shop.id + "/file_system", {
            params: {
                path: path + file
            },
            headers: {
                "Authorization": "Bearer " + token
            }
        }).then(r => {
            if (r.data.error) {
                alert(r.data.message)
                setCanEdit(false)
                setCanUpload(false)
                setImage(null)
                return
            }
            if (!r.data.canEdit && !r.data.image) {
                alert(r.data.message)
            }
            if (r.data.image) {
                setImage(r.data.data)
            } else {
                setImage(null)
            }

            setCanEdit(r.data.canEdit)
            setCanUpload(r.data.canUpload)

            if (monacoEditorRef.current) {
                monacoEditorRef.current.editor.setValue(r.data.data);
            }
        })
    }

    const getExtensionImage = (filename: string) => {
        if (filename.endsWith(".vue")) return "/img/vue.svg"
        else if (filename.endsWith(".js")) return "/img/js.svg"
        else if (filename.endsWith(".json")) return "/img/json.png"
        else if (filename.endsWith(".svg")) return "/img/Icons8_flat_picture.svg"
        else if (filename.endsWith(".png")) return "/img/Icons8_flat_picture.svg"
        else if (filename.endsWith(".jpg")) return "/img/Icons8_flat_picture.svg"
        else if (filename.endsWith(".ico")) return "/img/Icons8_flat_picture.svg"

        return "/img/file-icon.svg"
    }

    const changePath = (newPath: string) => {
        setPath(newPath)
        getData(newPath)
    }

    const changeFile = (file: string) => {
        getFile(file)
        setFile(file)
    }

    const saveFile = () => {
        axios.post(backendUrl + "shop/" + props.shop.id + "/file_system", {
            path: path + file,
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

    const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files === null || e.target.files.length === 0) return

        const form = new FormData();
        form.append("path", path + file);
        form.append("file", e.target.files[0]);

        axios.put(backendUrl + "shop/" + props.shop.id + "/file_system", form, {
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
        getData()
    }, [])


    return (
        <div className="h-full w-full rounded-lg bg-gray-100 p-10 h-full">
            <h2 className="font-bold text-3xl">Edytuj pliki</h2>
            <h3 className="text-xl text-red-900">Jeżeli nie wiesz o co chodzi, to lepiej tego nie ruszaj</h3>
            <p>/{path}{file}</p>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[200px_1fr] lg:gap-8 py-4">
                <div id="sidebar" className="flex flex-col gap-2 min-h-screen">
                    <input
                        className="text-center inline-block rounded border border-indigo-600 bg-indigo-600 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500 disabled:bg-gray-300 disabled:border-gray-300"
                        type="button" value="Zapisz" id="save" disabled={!canEdit} onClick={_ => saveFile()}/>
                    <input
                        className="text-center inline-block rounded border border-indigo-600 bg-indigo-600 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500 disabled:bg-gray-300 disabled:border-gray-300"
                        type="button" value="Zamień plik" id="upload" disabled={!canUpload} onClick={() => {
                        if (fileInput.current != null) fileInput.current.click()
                    }}/>
                    <input type="file" className="hidden" ref={fileInput} onChange={(e) => uploadFile(e)}/>


                    <div className="p-3 bg-gray-200 rounded-lg flex flex-row gap-2" onClick={() => {
                        changePath("")
                        setFile("")
                    }}>
                        <img className="w-5" src="/img/home.png" alt=""/>
                        Powrót
                    </div>
                    <div className="p-3 bg-gray-200 rounded-lg">
                        <h1 className="font-bold text-xl">Foldery</h1>
                        <div className="mt-2">
                            {directories.map((directory, i) => (
                                <div key={i} onClick={() => gotToSubDirectory(directory)}
                                     className="flex flex-row gap-2 p-2 hover:bg-gray-300 rounded-lg cursor-pointer">
                                    <img src="/img/folder.png" alt="" className="h-6 w-6"/>
                                    {directory}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="p-3 bg-gray-200 rounded-lg">
                        <h1 className="font-bold text-xl">Pliki</h1>
                        <div className="mt-2">
                            {files.map((file, i) => (
                                <div key={i} onClick={() => changeFile(file)}
                                     className="flex flex-row gap-2 p-2 hover:bg-gray-300 rounded-lg cursor-pointer">
                                    <img src={getExtensionImage(file)} alt="" className="h-6 w-6"/>
                                    {file}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div id="image_preview"
                     className="hidden bg-no-repeat bg-center w-full h-full pt-2 bg-contain"></div>

                <div id="editor" className="w-full h-full rouded-md flex flex-col justify-center align-center items-center">
                    {image === null && <MonacoEditor
                        // width="800"
                        // height="600"
                        language="javascript"
                        theme="vs-dark"
                        // value={content}
                        options={{selectOnLineNumbers: true}}
                        // onChange={(e) => setContent(e)}
                        // onChange={::this.onChange}
                        editorDidMount={(editor) => (monacoEditorRef.current = {editor})}
                    />}
                    {image !== null && <img src={"data:image/png;base64, " + image} alt="Podgląd obrazka"
                                            className=" object-contain"/>}
                </div>

            </div>
        </div>
    )
}

export default FileSystem