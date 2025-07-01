import React from 'react';
import Sidebar from "../components/sidebar.tsx";

const Plugins: React.FC = () => {
    // const navigator = useNavigate();
    // const [plugins, setPlugins] = useState<string[]>([])

    const plugins = [
        {
            title: "Vishop Placeholders",
            description: (<div>
                Plugin pozwalajacy wyświetlać najbogatszych graczy, cel miesiąca oraz ostatnie zakupy jako placeholdery.<br/>
                Wymaga PlaceholderAPI i wykupionego hostingu.<br/>
                Dostepne placeholdery: <br/>
                <div className="bg-[#1E1E1E] rounded-lg p-4 font-mono text-sm text-white w-min mt-3">
                    vishop_top_player_[1-3]<br/>
                    vishop_top_spend_[1-3]<br/><br/>

                    vishop_last_player_[1-5]<br/>
                    vishop_last_quantity_[1-5]<br/>
                    vishop_last_status_[1-5]<br/>
                    vishop_last_product_[1-5]<br/><br/>

                    vishop_goal_percent<br/>
                    vishop_goal_bar_1<br/>
                    vishop_goal_bar_2
                </div>
            </div>),
            file: "VishopPlaceholders-1.1.jar",
            image: "placeholders.png",
            filePath: "https://szablony.tems.pl/static/jars/VishopPlaceholders-1.1.jar"
        }
    ]

    return (
        <div className="flex gap-4 flex-col lg:flex-row p-10">
            <Sidebar/>
            <div className="rounded-lg bg-gray-100 p-10 gap-1 flex-grow flex flex-col gap-4">
                <h1 className="text-3xl font-bold">Pluginy</h1>
                <p className="p-3 bg-indigo-500 text-sky-100 rounded border border-indigo-700 ring-gray-300 flex-grow-0">Pluginów
                    możesz dowolnie używać w na swoim serwerze, dopóki jesteś naszym klientem - posiadasz aktywny
                    plan hostingu. Zakaz rozpowszechniania, sprzedaży i przypisywania sobie autorstwa.</p>
                <div className="flex flex-row flex-wrap rounded gap-3 justify-around align-items-center">
                    {plugins.map((plugin, index) => (
                        <div className="p-8 bg-gray-200 w-full flex lg:flex-row flex-col gap-3" key={index}>
                            <div className="p-3 bg-gray-300 rounded flex flex-col align-center justify-center">
                                <img src={"/img/" + plugin.image} alt={plugin.image}
                                     className="h-96 w-full object-contain"/>
                                <h3 className="p-3 font-bold text-xl text-center ">{plugin.title}</h3>
                                <a href={plugin.filePath}
                                   className="m-auto w-min h-min text-white p-3 rounded border border-indigo-600 bg-indigo-600 hover:bg-transparent hover:text-indigo-600 focus:outline"
                                   download>Pobierz {plugin.file}</a>
                            </div>
                            <div className="p-3 bg-gray-300 rounded w-full">{plugin.description}</div>
                        </div>
                    ))}

                    {plugins.length == 0 &&
                        <p className="text-red-600 p-3 bg-red-200 text-center rounded border border-red-500">Nie masz
                            dostępu do tej treści. Musisz posiadać wykupiony plan naszego hostingu</p>}

                </div>

            </div>
        </div>
    )
}

export default Plugins;