import Button from "./button.tsx";
import {useLocation} from "react-router";

function Sidebar() {
    const location = useLocation()
    const pathName = location.pathname
    return (
        <div className="flex flex-col rounded-lg bg-gray-100 p-8 gap-4">
            <Button href="/panel" highlighted={pathName == "/panel"}>Panel</Button>
            <Button href="/panel/resources" highlighted={pathName == "/panel/resources"}>Zasoby</Button>
            <Button href="/panel/plugins" highlighted={pathName == "/panel/plugins"}>Pluginy</Button>
            <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700"/>
            <Button href="/logout">Wyloguj</Button>
            <div className="flex flex-row items-center justify-center mt-4">
                <div className="w-16 h-16">
                    <img src={localStorage.getItem("avatar") || "no avatar"} alt="avatar"
                         className="w-16 h-16 rounded-xl"/>
                </div>
                <h2 className="text-lg p-2">{localStorage.getItem("name")}</h2>
            </div>
        </div>
    )
}

export default Sidebar
