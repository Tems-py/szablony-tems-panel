import DiscordInfo from "./discordInfo.tsx";
import ShopSidebar from "./shopSidebar.tsx";
import {useNavigate, useParams} from "react-router";
import React, {ReactNode, useEffect, useState} from "react";
import axios from "axios";
import {backendUrl} from "../config.ts";

const ShopView = (props: { page: ReactNode & { props?: { shop?: any } } }) => {
    const {shopId} = useParams();
    const [shop, setShop] = useState<{ "domain": string, "date": string, id: number }>({
        id: Number(shopId),
        domain: "Ładowanie...",
        date: "...",
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
                        date: r.data.date
                    })
            }
        )
    }

    useEffect(() => {
        if (shop.date === "...") {
            getShopData()
        }
    }, [])


    return (
        <div className="">
            <DiscordInfo/>
            <div className="flex flex-col gap-4 lg:flex-row lg:gap-8 h-fit p-4 items-stretch justify-between">
                <ShopSidebar id={shop.id}/>
                {React.isValidElement(props.page) ? React.cloneElement(props.page, { shop }) : props.page}
            </div>
        </div>
    )
}

export default ShopView