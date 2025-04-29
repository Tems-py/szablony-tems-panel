const FileSystem = () => {
    return (
        <div className="h-full rounded-lg bg-gray-100 p-10 h-full">
            <h2 className="font-bold text-3xl">Edytuj pliki</h2>
            <h3 className="text-xl text-red-900">Jeżeli nie wiesz o co chodzi, to lepiej tego nie ruszaj</h3>
            <p className="" id="currentPath">/</p>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[200px_1fr] lg:gap-8 p-4">
                <div id="sidebar" className="flex flex-col gap-2 min-h-screen">
                    <input
                        className="text-center inline-block rounded border border-indigo-600 bg-indigo-600 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500 disabled:bg-gray-300 disabled:border-gray-300"
                        type="button" value="Zapisz" id="save"/>
                    <input
                        className="text-center inline-block rounded border border-indigo-600 bg-indigo-600 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500 disabled:bg-gray-300 disabled:border-gray-300"
                        type="button" value="Zamień plik" id="upload" disabled/>

                    <div className="p-3 bg-gray-200 rounded-lg flex flex-row gap-2" id="home">
                        <img className="w-5" src="/src/assets/img/home.png" alt=""/>
                        Powrót
                    </div>
                    <div className="p-3 bg-gray-200 rounded-lg">
                        <h1 className="font-bold text-xl">Foldery</h1>
                        <div id="dirs"></div>
                    </div>
                    <div className="p-3 bg-gray-200 rounded-lg">
                        <h1 className="font-bold text-xl">Pliki</h1>
                        <div id="files"></div>
                    </div>
                </div>
                <div id="image_preview" className="hidden bg-no-repeat bg-center w-full h-full pt-2 bg-contain"></div>

                <div id="editor" className="w-full h-full pt-2">
                   {/*<textarea id="input" class="w-full h-full p-3 rounded bg-neutral-800 text-white" spellcheck="false"></textarea>*/}
                </div>

            </div>
        </div>
    )
}

export default FileSystem