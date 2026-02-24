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
    });
    const navigatorFunction = useNavigate();
    const token = localStorage.getItem("token");

    if (!token) {
        navigatorFunction("/login", {replace: true});
    }

    const getShopData = () => {
        axios.get(backendUrl + "shop/" + shopId, {
            headers: {"Authorization": "Bearer " + token}
        }).then(r => {
            if (r.data.error) {
                alert(r.data.msg);
                return;
            }
            setShop({
                id: Number(shopId),
                domain: r.data.domain,
                date: r.data.date,
                diskUsage: r.data.disk_usage
            });
        }).catch(r => {
            const data = r.response.data;
            if (data.error === "token_expired" || data.error === "invalid_token") {
                localStorage.clear();
                navigatorFunction("/login", {replace: true});
            } else {
                alert("Wystąpił błąd podczas pobierania danych sklepu: " + data.message);
            }
        });
    };

    useEffect(() => {
        if (shop.date === "...") {
            getShopData();
        }
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <DiscordInfo/>
            <div className="flex flex-col gap-4 lg:flex-row lg:gap-5 p-4 items-start">
                <ShopSidebar id={shop.id}/>
                <div className="flex-1 min-w-0">
                    {React.isValidElement(props.page) ? React.cloneElement(props.page, {shop}) : props.page}
                </div>
            </div>
        </div>
    );
};

export default ShopView;
