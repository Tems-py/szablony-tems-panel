import React, {useEffect} from 'react';
import axios from "axios";
import {backendUrl} from "../config.ts";
import {Link} from "react-router";

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

    // Inline SVG for a checkmark
    const CheckmarkIcon = ({className}: { className?: string }) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            stroke="currentColor"
            className={className}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
        </svg>
    )

    // Generic placeholder icon for other features
    // const FeatureIcon = ({ className }: { className?: string }) => (
    //     <svg
    //         xmlns="http://www.w3.org/2000/svg"
    //         fill="none"
    //         viewBox="0 0 24 24"
    //         strokeWidth="2"
    //         stroke="currentColor"
    //         className={className}
    //     >
    //         <circle cx="12" cy="12" r="10" />
    //         <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
    //     </svg>
    // )

    const features = [
        {icon: CheckmarkIcon, text: "5 dostępnych szablonów"},
        {icon: CheckmarkIcon, text: "Ochrona Anty-DDOS"},
        {icon: CheckmarkIcon, text: "Łatwa w edycji konfiguracja"},
        {icon: CheckmarkIcon, text: "Profesjonalne wsparcie na Discordzie"},
        {icon: CheckmarkIcon, text: "Automatyczne uruchomienie szablonu"},
        {icon: CheckmarkIcon, text: "Restart szablonu jednym kliknięciem"},
        {icon: CheckmarkIcon, text: "Darmowa subdomena dla szablonu"},
    ]

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
            {/* Hero Section  bg-gradient-to-br from-indigo-500 to-purple-700  */}

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
                            {
                                features.map((feature, i) => (
                                    <li className="flex items-center gap-1" key={i}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             strokeWidth="1.5" stroke="currentColor"
                                             className="h-5 w-5 text-indigo-700">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M4.5 12.75l6 6 9-13.5"/>
                                        </svg>

                                        <span className="text-gray-700"> { feature.text } </span>
                                    </li>
                                ))
                            }
                        </ul>

                        <a href="/login"
                           className="mt-8 block rounded-full border border-indigo-600 bg-indigo-600 px-12 py-3 text-center text-sm font-medium text-white hover:bg-indigo-700 hover:ring-1 hover:ring-indigo-700 focus:outline-none focus:ring active:text-indigo-500"> Zaczynajmy </a>
                    </div>
                </div>
            </div>

            {/* Features & Pricing Section */}
            {/*<section id="price" className="py-16 md:py-24 bg-white">*/}
            {/*    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">*/}
            {/*        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900">Co zyskujesz z*/}
            {/*            nami?</h2>*/}
            {/*        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">*/}
            {/*            /!* Features List *!/*/}
            {/*            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">*/}
            {/*                {features.map((feature, i) => (*/}
            {/*                    <div*/}
            {/*                        key={i}*/}
            {/*                        className="p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 bg-white"*/}
            {/*                    >*/}
            {/*                        <div className="pb-4 flex flex-row items-center gap-4">*/}
            {/*                            <feature.icon className="h-8 w-8 text-purple-600"/>*/}
            {/*                            <h3 className="text-xl font-semibold text-gray-800">{feature.text}</h3>*/}
            {/*                        </div>*/}
            {/*                        /!* Optional: Add more detailed description for each feature *!/*/}
            {/*                    </div>*/}
            {/*                ))}*/}
            {/*            </div>*/}

            {/*            /!* Pricing Card *!/*/}
            {/*            <div*/}
            {/*                className="w-full rounded-2xl border-2 border-purple-600 shadow-xl bg-gradient-to-br from-purple-50 to-pink-50 lg:scale-105">*/}
            {/*                <div className="text-center p-8 bg-purple-100 rounded-t-2xl">*/}
            {/*                    <h3 className="text-3xl font-bold text-purple-800">Hosting szablonów</h3>*/}
            {/*                    <p className="mt-4 text-gray-700">Wszystko, czego potrzebujesz, aby zacząć.</p>*/}
            {/*                </div>*/}
            {/*                <div className="p-8 lg:p-12">*/}
            {/*                    <div className="text-center mb-8">*/}
            {/*                        <strong className="text-6xl font-extrabold text-gray-900">7zł</strong>*/}
            {/*                        <span className="text-xl font-medium text-gray-700">/miesiąc</span>*/}
            {/*                    </div>*/}
            {/*                    <Link*/}
            {/*                        to="/login"*/}
            {/*                        className="inline-flex items-center justify-center w-full py-3 text-lg font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors duration-300"*/}
            {/*                    >*/}
            {/*                        Zaczynajmy*/}
            {/*                    </Link>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</section>*/}

            {/* Templates Showcase Section */}
            <section className="py-16 md:py-24 bg-gray-100">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl">
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900">Odkryj nasze
                        szablony</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {templates.map((template, i) => (
                            <div
                                key={i}
                                className="overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 bg-white"
                            >
                                <Link to={template.url} target="_blank" rel="noopener noreferrer" className="block">
                                    <img
                                        src={`/img/${template.name}.png`} // Using placeholder for images
                                        alt={`Zdjęcie ${template.name}`}
                                        width={500}
                                        height={300}
                                        className="w-full h-auto object-cover rounded-t-xl aspect-video"
                                    />
                                    <div className="p-5 text-center bg-white">
                                        <h3 className="text-2xl font-semibold text-gray-800">{template.name}</h3>
                                        <span
                                            className="inline-flex items-center justify-center mt-4 px-6 py-2 text-base font-medium text-purple-600 border border-purple-600 rounded-full hover:bg-purple-50 hover:text-purple-700 transition-colors duration-300">
                      Zobacz demo
                    </span>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trusted By Section */}
            <section className="py-16 md:py-24 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl">
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900">Zaufali nam</h2>
                    <div
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-center">
                        {shops.map((shop, i) => (
                            <div
                                key={i}
                                className="flex flex-col items-center justify-center p-6 rounded-xl shadow-sm bg-gray-50 h-40 w-full border border-gray-200"
                            >
                                <div style={{width: '80px', height: '80px'}}
                                     className="flex items-center justify-center">
                                    <img
                                        src={shop.url || "/placeholder.svg"}
                                        alt={`Logo ${shop.domain}`}
                                        width={80}
                                        height={80}
                                        className="rounded-md object-contain mb-3"
                                    />
                                </div>
                                <p className="text-md font-medium text-gray-800 text-center">
                                    <Link
                                        to={`https://${shop.id}.tems.pl`}
                                        target="_blank"
                                        rel="nofollow noopener ugc"
                                        className="hover:underline text-gray-600"
                                    >
                                        {shop.domain}
                                    </Link>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="py-16 md:py-24 bg-gray-100 text-center">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">Gotowy, aby zacząć?</h2>
                    <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90 mb-10">
                        Dołącz do grona zadowolonych klientów i przenieś swój sklep vishop.pl na wyższy poziom dzięki
                        naszemu
                        hostingowi.
                    </p>
                    <Link
                        to="/login"
                        className="inline-flex items-center justify-center px-10 py-4 text-xl font-semibold bg-white text-purple-700 hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl rounded-full"
                    >
                        Rozpocznij teraz
                    </Link>
                </div>
            </section>

            {/* Footer Section */}
            <footer className="py-8 bg-gray-800 text-gray-300 text-center text-sm">
                <div className="container mx-auto px-4">
                    <p className="mb-2">&copy; {new Date().getFullYear()} szablony.tems.pl - Wszelkie prawa
                        zastrzeżone.</p>
                    <p>
                        Nasz serwis wykorzystuje pliki cookie. Możesz zmienić ustawienia ich zapisywania w opcjach
                        Twojej
                        przeglądarki internetowej. Używanie naszego serwisu z niezmienionymi ustawieniami, oznacza zgodę
                        na
                        zapisywanie plików cookie w pamięci Twojego urządzenia, które są niezbędne do funkcjonowania
                        serwisu.
                    </p>
                </div>
            </footer>
        </div>
    )
};

export default Index;