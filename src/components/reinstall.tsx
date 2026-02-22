import axios from "axios";
import {backendUrl} from "../config.ts";
import {useState} from "react";

const Reinstall = (props: { shop: { "domain": string, "date": string, id: number }, types: string[] }) => {
    const {shop, types} = props
    const [selectedType, setSelectedType] = useState<string>(types[0])
    const [shopId, setShopId] = useState<number>(0)
    const token = localStorage.getItem("token");
    const reinstall = () => {
        console.log(selectedType, shop.id)
        if (shopId == 0) {
            alert("Podaj ID sklepu!")
            return
        }
        axios.post(backendUrl + "shop/" + shop.id + "/reinstall", {
            "type": selectedType != undefined ? selectedType : types[0],
            id: shopId
        }, {
            headers: {
                "Authorization": "Bearer " + token
            }
        }).then(r => {
            alert(r.data.message)
        })
    }

    return (
        <div className="bg-red-200 dark:bg-red-950 p-2 rounded mt-3 shadow-lg">
            <h2 className="font-xl font-bold dark:text-red-100">Reinstalacja szablonu</h2>
            <p className="dark:text-red-200">Reinstalacja szablonu usuwa wszystkie pliki szablonu i instaluje je jeszcze raz. Opcja ta
                przydatna jest
                w przypadku chęci zmiany rodzaju szablonu.</p>
            <p className="text-red-600 dark:text-red-400 font-bold">Tego kroku nie da się cofnąć!</p>
            <p className="mt-2 dark:text-red-200">Wybierz rodzaj szablonu, który chcesz zainstalować:</p>
            <select id="reinstall_type" name="type" value={selectedType} onChange={e => setSelectedType(e.target.value)}
                    className="mt-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 sm:text-sm p-2 w-full">
                {types.map((type, i) => (
                    <option value={type} key={i}>{type}</option>
                ))}
            </select>
            <p className="mt-2 dark:text-red-200">ID sklepu na vishop.pl</p>
            <input type="number" id="reinstall_id" name="id" min="1" value={shopId} onChange={e => setShopId(Number(e.target.value))}
                   className="mt-1.5 rounded-lg border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 sm:text-sm p-2 w-full bg-gray-50 dark:bg-gray-800"/><br/>
            <input type="button" id="reinstall" value="Reinstaluj szablon" onClick={reinstall}
                   className="mt-3 p-3 rounded border border-red-400 dark:border-red-700 font-medium text-black dark:text-red-200 hover:bg-red-300 dark:hover:bg-red-900"/>
        </div>
    )
}

export default Reinstall