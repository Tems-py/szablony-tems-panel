import {useNavigate, useParams} from "react-router";
import axios from "axios";
import {backendUrl} from "../config.ts";
import {useEffect, useState} from "react";
import Payment from "../components/payment.tsx";
import DiscordInfo from "../components/discordInfo.tsx";
import ShopSidebar from "../components/shopSidebar.tsx";
import AdminList from "../components/adminList.tsx";
import Reinstall from "../components/reinstall.tsx";

function Shop() {
    const navigator = useNavigate();
    const {shopId} = useParams();
    const [shop, setShop] = useState<{ "domain": string, "date": string, id: number }>({
        id: Number(shopId),
        domain: "Ładowanie...",
        date: "...",
    })
    const [types, setTypes] = useState<string[]>([])
    const [renewDays, setRenewDays] = useState<number>(95)

    const token = localStorage.getItem("token");
    if (!token) {
        navigator("/login", {replace: true});
    }

    const renew = () => {
        axios.get(backendUrl + "shop/" + shopId + "/renew/" + renewDays, {
            headers: {
                "Authorization": "Bearer " + token
            },
        }).then(r => {
            if (r.data.error) {
                alert(r.data.msg)
                return
            }
            window.location.href = r.data.url
        })
    }


    const getShopData = () => {
        axios.get(backendUrl + "shop/" + shopId, {
            headers: {
                "Authorization": "Bearer " + token
            }
        }).then(r => {
                if (r.data.error) {
                    alert(r.data.msg)
                    return
                }

                setShop(
                    {
                        id: Number(shopId),
                        domain: r.data.domain,
                        date: r.data.date
                    })
                setTypes(r.data.types)
            }
        )
    }

    useEffect(() => {
        getShopData()
    }, [])

    return (
        <div className="">
            <DiscordInfo/>
            <div className="flex flex-col gap-4 lg:flex-row lg:gap-8 h-fit p-4 items-stretch justify-between">
                <ShopSidebar id={shop.id}/>
                <div className="h-full w-full rounded-lg bg-gray-100 p-10">
                    <h1 className="font-bold text-3xl mb-4 mt-4">{shop.domain} <span
                        className="text-gray-600 text-xl mx-2 p-2 bg-slate-300 rounded">id: {shop.id}</span></h1>
                    <p>Twój pakiet jest aktywny do <strong className="font-bold">{shop.date}</strong></p>
                    <h2 className="font-xl font-bold mb-2">Przedłuż serwer</h2>
                    <Payment daysHook={[renewDays, setRenewDays]}/>
                    <button
                        className="mt-4 px-4 text-center inline-block rounded border border-indigo-600 bg-indigo-600 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
                        onClick={renew}
                        id="pay">Przedłuż
                    </button>

                    <hr className="mt-3"/>
                    <strong className="block font-xl mt-3">Domena</strong>
                    <a className="mt-4 px-4 text-center inline-block rounded border border-indigo-600 bg-indigo-600 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
                       href="/shop/{{ shop.id }}/domain">Ustawienia domeny</a>
                    <p className="text-md mt-1">Darmowa domena: <a href={"https://" + shop.id + ".tems.pl"}
                                                                   target="_blank"
                                                                   className="text-indigo-500 font-bold">{shop.id}.tems.pl</a>.
                        Tej domeny nie można zmienić</p>

                    <hr className="mt-3"/>
                    <strong className="block font-xl mt-3">Logi</strong>
                    <a href="/shop/{{ shop.id }}/logs"
                       className="mt-4 px-4 text-center inline-block rounded border border-indigo-600 bg-indigo-600 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500">Logi</a>
                    <hr className="mt-3"/>
                    <AdminList />
                    <hr className="mt-3"/>
                    <Reinstall shop={shop} types={types}/>
                </div>
            </div>
        </div>
    )
}

export default Shop
