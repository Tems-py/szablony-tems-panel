import { useState } from 'react';
import Button from "./button.tsx";
import DarkModeToggle from "./darkModeToggle.tsx";

const ShopSidebar = (props: {id: number}) => {
    const {id} = props;
    const pathName = location.pathname;
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const closeSidebar = () => {
        setIsOpen(false);
    };

    return (
        <>
            {/* Mobile hamburger button - not sticky */}
            <div className="lg:hidden">
                <button
                    onClick={toggleSidebar}
                    className="w-full p-3 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                    aria-label="Otwórz menu nawigacyjne"
                    aria-expanded={isOpen}
                >
                    <div className="flex items-center justify-center gap-2">
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        <span className="text-sm font-medium">Menu</span>
                    </div>
                </button>
            </div>

            {/* Mobile expandable menu */}
            <div
                className={`
                    lg:hidden
                    overflow-hidden
                    transition-all duration-300 ease-in-out
                    ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}

                `}
            >
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 shadow-md">
                    <div className="flex flex-col gap-3">
                        <Button
                            href="/panel"
                            onClick={closeSidebar}
                        >
                            Powrót
                        </Button>
                        <Button
                            href={`/shop/${id}`}
                            highlighted={pathName === `/shop/${id}`}
                            onClick={closeSidebar}
                        >
                            Strona główna szablonu
                        </Button>
                        <Button
                            href={`/shop/${id}/config`}
                            highlighted={pathName === `/shop/${id}/config`}
                            onClick={closeSidebar}
                        >
                            Edycja konfiguracji
                        </Button>
                        <Button
                            href={`/shop/${id}/domain`}
                            highlighted={pathName === `/shop/${id}/domain`}
                            onClick={closeSidebar}
                        >
                            Ustawienia domeny
                        </Button>
                        <Button
                            href={`/shop/${id}/restart`}
                            highlighted={pathName === `/shop/${id}/restart`}
                            onClick={closeSidebar}
                        >
                            Restart
                        </Button>
                        <Button
                            href={`/shop/${id}/logs`}
                            highlighted={pathName === `/shop/${id}/logs`}
                            onClick={closeSidebar}
                        >
                            Logi
                        </Button>
                        <Button
                            href={`/shop/${id}/files`}
                            highlighted={pathName === `/shop/${id}/files`}
                            onClick={closeSidebar}
                        >
                            Edytor plików
                        </Button>
                        <div className="flex justify-center pt-2">
                            <DarkModeToggle/>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop sidebar - unchanged behavior */}
            <div
                className="hidden lg:flex h-full rounded-lg bg-gray-100 dark:bg-gray-800 p-3 lg:p-10 flex-col gap-4"
                role="navigation"
                aria-label="Menu główne sklepu"
            >
                <Button href="/panel">Powrót</Button>
                <Button href={`/shop/${id}`} highlighted={pathName === `/shop/${id}`}>
                    Strona główna szablonu
                </Button>
                <Button href={`/shop/${id}/config`} highlighted={pathName === `/shop/${id}/config`}>
                    Edycja konfiguracji
                </Button>
                <Button href={`/shop/${id}/domain`} highlighted={pathName === `/shop/${id}/domain`}>
                    Ustawienia domeny
                </Button>
                <Button href={`/shop/${id}/restart`} highlighted={pathName === `/shop/${id}/restart`}>
                    Restart
                </Button>
                <Button href={`/shop/${id}/logs`} highlighted={pathName === `/shop/${id}/logs`}>
                    Logi
                </Button>
                <Button href={`/shop/${id}/files`} highlighted={pathName === `/shop/${id}/files`}>
                    Edytor plików
                </Button>
                <div className="flex justify-center mt-auto pt-4">
                    <DarkModeToggle/>
                </div>
            </div>
        </>
    );
};

export default ShopSidebar;
