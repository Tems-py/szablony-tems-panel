import React, {useEffect} from 'react';
import axios from "axios";
import {backendUrl} from "../config.ts";

const Index: React.FC = () => {
    const [templates, setTemplates] = React.useState<{ "name": string, "url": string }[]>([]);
    const [shops, setShops] = React.useState<{ "domain": string, url: string, id: Number }[]>([]);

    useEffect(() => {
        axios.get(backendUrl + "index").then(response => {
            console.log(response.data)
            setTemplates(response.data.templates)
            setShops(response.data.shops)
        })
    }, [])

    return (
        <div className="p-4">
            <div className="flex align-center">
                <h1 className="font-bold text-5xl m-auto p-10 border-b-4 border-indigo-600">Hosting szablonów do
                    vishop.pl</h1>
            </div>

            <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8" id="price">
                <div className="w-96 m-auto">
                    <div
                        className="rounded-2xl border border-indigo-600 p-6 shadow-sm ring-1 ring-indigo-600 sm:order-last sm:px-8 lg:p-12">
                        <div className="text-center">
                            <h2 className="text-lg font-medium text-gray-900">
                                Hosting szablonów
                                <span className="sr-only">Plan</span>
                            </h2>

                            <p className="mt-2 sm:mt-4">
                                <strong className="text-3xl font-bold text-gray-900 sm:text-4xl"> 7zł </strong>

                                <span className="text-sm font-medium text-gray-700">/miesiąc</span>
                            </p>
                        </div>

                        <ul className="mt-6 space-y-2">
                            <li className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 text-indigo-700">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                                </svg>

                                <span className="text-gray-700"> 3 dostępne szablony </span>
                            </li>

                            <li className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 text-indigo-700">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                                </svg>

                                <span className="text-gray-700"> Ochrona Anty-DDOS </span>
                            </li>

                            <li className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 text-indigo-700">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                                </svg>

                                <span className="text-gray-700"> Łatwa w edycji konfiguracja </span>
                            </li>
                            <li className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 text-indigo-700">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                                </svg>

                                <span className="text-gray-700"> Profesjonalne wsparcie na Discordzie </span>
                            </li>
                            <li className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 text-indigo-700">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                                </svg>

                                <span className="text-gray-700"> Automatyczne uruchomienie szablonu</span>
                            </li>
                            <li className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 text-indigo-700">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                                </svg>

                                <span className="text-gray-700"> Restart szablonu jednym kliknięciem</span>
                            </li>
                            <li className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 text-indigo-700">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                                </svg>

                                <span className="text-gray-700"> Darmowa subdomena dla szablonu</span>
                            </li>
                        </ul>

                        <a href="/login"
                           className="mt-8 block rounded-full border border-indigo-600 bg-indigo-600 px-12 py-3 text-center text-sm font-medium text-white hover:bg-indigo-700 hover:ring-1 hover:ring-indigo-700 focus:outline-none focus:ring active:text-indigo-500"> Zaczynajmy </a>
                    </div>
                </div>
            </div>
            <div className="max-w-screen-xl m-auto p-4 rounded bg-gray-300 text-gray-600 text-center text-xl flex-wrap">
                {templates.map((template, i) => (
                    <div className="mb-3" key={i}>
                        {template.name}
                        <a href={template.url} target="_blank"><img
                            src={"img/" + template.name + '.png'} className="mt-2 rounded"
                            alt={"Zdjęcie " + template.name}/></a>
                    </div>
                ))}
            </div>
            <div className="max-w-screen-xl m-auto p-4 rounded bg-gray-300 text-gray-600 text-center text-xl mt-12">
                <h1 className="text-3xl mb-3 text-black">Zaufali nam</h1>
                <div className="w-full relative">
                    <div className="grid grid-cols-4 gap-4">
                            {shops.map((shop, i) => (
                                <div className="swiper-slide" key={i}>
                                    <div
                                        className="bg-indigo-50 rounded-2xl h-96 flex flex-col justify-between items-center">
                                        <img src={shop.url} alt="" className="mt-12 rounded h-64" height="16rem"/>
                                        <p className="text-2xl mb-12"><a href={`https://${shop.id}.tems.pl`}
                                                                         target="_blank"
                                                                         rel="nofollow noopener ugc">{shop.domain}</a>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                </div>
            </div>
            <div className="my-20 font-sm text-gray-800 text-center m-auto w-1/2">Nasz serwis wykorzystuje pliki cookie.
                Możesz zmienić ustawienia ich zapisywania w opcjach Twojej przeglądarki internetowej. Używanie naszego
                serwisu z niezmienionymi ustawieniami, oznacza zgodę na zapisywanie plików cookie w pamięci Twojego
                urządzenia, które są niezbędne do funkcjonowania serwisu.
            </div>

        </div>
    );
};

export default Index;