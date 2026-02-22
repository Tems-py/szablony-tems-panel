import {Link} from "react-router";
import {useState} from "react";

function Navbar() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className="bg-gray-900 shadow-lg py-4">
            {" "}
            {/* Dark background */}
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4">
                <Link to="/" className="flex items-center">
                    <img src="/favicon.ico" alt="Logo" width={32} height={32} className="h-8 w-8 mr-3" />
                    <span className="self-center text-2xl font-bold whitespace-nowrap text-white">Szablony</span>{" "}
                    {/* White text for logo */}
                </Link>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    type="button"
                    className="inline-flex items-center p-2 w-10 h-10 justify-center text-gray-400 rounded-lg md:hidden hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
                    aria-controls="navbar-default"
                    aria-expanded={isOpen ? "true" : "false"}
                >
                    <span className="sr-only">Open main menu</span>
                    <svg
                        className="w-5 h-5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 17 14"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M1 1h15M1 7h15M1 13h15"
                        />
                    </svg>
                </button>
                <div className="flex items-center gap-2">
                    <div className={`${isOpen ? "block" : "hidden"} w-full md:block md:w-auto`} id="navbar-default">
                        <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-700 rounded-lg bg-gray-800 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-gray-900">
                            <li>
                                <a
                                    href="https://discord.gg/ged4vNXqEt"
                                    className="block py-2 pl-3 pr-4 text-gray-300 rounded hover:bg-gray-700 md:hover:bg-transparent md:border-0 md:hover:text-purple-400 md:p-0"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Discord
                                </a>
                            </li>
                            <li>
                                <Link
                                    to="/panel"
                                    className="block py-2 pl-3 pr-4 text-gray-300 rounded hover:bg-gray-700 md:hover:bg-transparent md:border-0 md:hover:text-purple-400 md:p-0"
                                >
                                    Panel
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
