import axios from "axios";
import {backendUrl} from "../config.ts";
import {useEffect, useState} from "react";
import Payment from "../components/payment.tsx";
import AdminList from "../components/adminList.tsx";
import Reinstall from "../components/reinstall.tsx";
import Restart from "./shop/restart.tsx";
import {Link} from "react-router";

function Shop(props: { shop: { "domain": string, "date": string, id: number, diskUsage: number } }) {
    const {shop} = props
    const [types, setTypes] = useState<string[]>([])
    const [renewDays, setRenewDays] = useState<number>(95)
    const token = localStorage.getItem("token");

    const renew = () => {
        axios.get(backendUrl + "shop/" + shop.id + "/renew/" + renewDays, {
            headers: {
                "Authorization": "Bearer " + token
            },
        }).then(r => {
            if (r.data.error) {
                alert(r.data.message)
                return
            }
            window.location.href = r.data.url
        })
    }

    const getShopData = () => {
        axios.get(backendUrl + "shop/" + shop.id, {
            headers: {
                "Authorization": "Bearer " + token
            }
        }).then(r => {
                if (r.data.error) {
                    alert(r.data.message)
                    return
                }

                setTypes(r.data.types)
            }
        )
    }

    useEffect(() => {
        getShopData()
    }, [])

    return (
        <div className="w-full">
            <div className="h-full w-full rounded-lg bg-gray-100 p-3 lg:p-10 grid grid-cols-1 md:grid-cols-4 gap-4">
                <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-6 flex flex-col gap-4 md:col-span-3">
                    <h1 className="font-bold text-3xl">{shop.domain} <span
                        className="text-gray-600 text-xl mx-2 p-2 bg-slate-300 rounded">id: {shop.id}</span></h1>
                    <p>Twój pakiet jest aktywny do <strong className="font-bold">{shop.date}</strong></p>
                </section>
                <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-6 md:row-span-2">
                    <h2 className="font-xl font-bold mb-2">Przedłuż serwer</h2>
                    <Payment daysHook={[renewDays, setRenewDays]}/>
                    <button
                        className="mt-4 px-4 text-center inline-block rounded border border-indigo-600 bg-indigo-600 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
                        onClick={renew}
                        id="pay">Przedłuż
                    </button>
                </section>


                <section className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-3 flex flex-col gap-3">
                    <strong className="block font-xl">Domena</strong>
                    <p className="text-md">Darmowa domena: <a href={"https://" + shop.id + ".tems.pl"}
                                                              target="_blank"
                                                              className="text-indigo-500 font-bold underline">{shop.id}.tems.pl</a>.
                        Tej domeny nie można zmienić</p>
                    <Link className="justify-self-end w-fit px-4 text-center inline-block rounded border border-indigo-600 bg-indigo-600 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
                       to={"/shop/" + shop.id + "/domain"}>Ustawienia domeny</Link>
                </section>

                <section className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-3 flex flex-col gap-3">
                    <strong className="block font-xl">Logi</strong>
                    <p className="text-md">Tutaj sprawdzisz czy szablon uruchomił się poprawnie oraz znajdziesz ewentualne błędy uruchamiania</p>
                    <a href={"/shop/" + shop.id + "/logs"}
                       className="w-fit mt-4 px-4 text-center inline-block rounded border border-indigo-600 bg-indigo-600 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500">Logi</a>

                </section>

                <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-6 flex flex-col gap-3">
                    {/*<strong className="block font-xl">Zmiana wersji Node.js <span className="text-gray-500 text-sm">domyślnie 14</span></strong>*/}

                    {/*<strong className="block font-xl">Użycie</strong>*/}
                    {/*<StatsBar progress={shop.diskUsage * 100} name="Dysk"/>*/}
                    {/*<StatsBar progress={shop.diskUsage * 100} name="Ram"/>*/}
                    {/*<StatsBar progress={shop.diskUsage * 100} name="CPU"/>*/}
                </section>

                <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-6"><Reinstall shop={shop}
                                                                                                             types={types}/>
                </section>
                <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-6 md:col-span-2"><AdminList/></section>
                <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-6"><Restart shop={shop}/> </section>
            </div>
        </div>
    )
}

export default Shop
