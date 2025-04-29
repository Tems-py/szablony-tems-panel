import {useNavigate} from "react-router";
import {useEffect} from "react";

function Logout() {
    const navigate = useNavigate();

    localStorage.clear()
    useEffect(() => {
        navigate("/", {replace: true})
    }, [])

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
            <div>
                Trwa wylogowywanie...
            </div>
        </div>
    )
}

export default Logout
