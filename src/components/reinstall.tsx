import axios from "axios";
import {backendUrl} from "../config.ts";
import {useState} from "react";

const Reinstall = (props: { shop: { "domain": string, "date": string, id: number }, types: string[] }) => {
    const {shop, types} = props
    const [selectedType, setSelectedType] = useState<string>(types[0])
    const token = localStorage.getItem("token");
    const reinstall = () => {
        console.log(selectedType, shop.id)
        axios.post(backendUrl + "shop/" + shop.id + "/reinstall", {
            type: selectedType,
            id: shop.id
        }, {
            headers: {
                "Authorization": "Bearer " + token
            }
        }).then(r => {
            alert(r.data.msg)
        })
    }

    return (
        <div className="bg-red-200 p-2 rounded mt-3">
            <h2 className="font-xl font-bold">Reinstalacja szablonu</h2>
            <p>Reinstalacja szablonu usuwa wszystkie pliki szablonu i instaluje je jeszcze raz. Opcja ta
                przydatna jest
                w przypadku chęci zmiany rodzaju szablonu.</p>
            <p className="text-red-600 font-bold">Tego kroku nie da się cofnąć!</p>
            <p className="mt-2">Wybierz rodzaj szablonu, który chcesz zainstalować:</p>
            <select id="reinstall_type" name="type" value={selectedType} onChange={e => setSelectedType(e.target.value)}
                    className="mt-1.5 rounded-lg bg-gray-50 border-gray-300 text-gray-700 sm:text-sm p-2 w-[300px]">
                {types.map((type, i) => (
                    <option value={type} key={i}>{type}</option>
                ))}
            </select>
            <p className="mt-2">ID sklepu na vishop.pl</p>
            <input type="number" id="reinstall_id" name="id" min="1"
                   className="mt-1.5 rounded-lg border-gray-300 text-gray-700 sm:text-sm p-2 w-[300px] bg-gray-50"/><br/>
            <input type="button" id="reinstall" value="Reinstaluj szablon" onClick={reinstall}
                   className="mt-3 p-3 rounded border border-red-400 font-medium text-black hover:bg-red-300"/>
        </div>
    )
}

export default Reinstall