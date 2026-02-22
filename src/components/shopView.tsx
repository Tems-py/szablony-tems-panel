import DiscordInfo from "./discordInfo.tsx";
import ShopSidebar from "./shopSidebar.tsx";
import {useNavigate, useParams} from "react-router";
import React, {ReactNode, useEffect, useState} from "react";
import axios from "axios";
import {backendUrl} from "../config.ts";

const ShopView = (props: { page: ReactNode & { props?: { shop?: any } } }) => {
    const {shopId} = useParams();
    const [shop, setShop] = useState<{ "domain": string, "date": string, id: number, diskUsage: number }>({
        id: Number(shopId),
        domain: "Ładowanie...",
        date: "...",
        diskUsage: 0
    })
    const navigator = useNavigate();
    const token = localStorage.getItem("token");
    if (!token) {
        navigator("/login", {replace: true});
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
                        date: r.data.date,
                        diskUsage: r.data.disk_usage
                    })
            }
        ).catch(r => {
            const data = r.response.data
            console.log(data)
            if (data.error === "token_expired" || data.error === "invalid_token") {
                localStorage.clear();
                navigator("/login", {replace: true});
            } else {
                alert("Wystąpił błąd podczas pobierania danych sklepu: " + data.message);
            }
        })
    }

    useEffect(() => {
        if (shop.date === "...") {
            getShopData()
        }
    }, [])


    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <DiscordInfo/>
            <div className="flex flex-col gap-4 lg:flex-row lg:gap-8 h-fit p-1 md:p-4 items-stretch justify-between">
                <ShopSidebar id={shop.id}/>
                {React.isValidElement(props.page) ? React.cloneElement(props.page, {shop}) : props.page}
            </div>
        </div>
    )
}

export default ShopView