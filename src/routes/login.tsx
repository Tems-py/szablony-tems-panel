import {useNavigate, useSearchParams} from "react-router";
import {useEffect} from "react";
import axios from "axios";
import {backendUrl, loginUrl} from "../config.ts";

function Login() {
    const [searchParams, _] = useSearchParams();
    const navigate = useNavigate();
    const code = searchParams.get("code")

    if (code === null) {
        window.location.href = loginUrl
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
                <div>
                    Przekierowywanie...
                </div>
            </div>
        )
    }

    useEffect(() => {
        if (code !== null)
            axios.get(backendUrl + 'login?code=' + code).then(response => {
                console.log(response.data)
                if (response.data.error) {
                    alert("Niepoprawny kod autoryzacji")
                    return
                }

                const token = response.data.token
                const username = response.data.name
                const avatar = response.data.avatar

                localStorage.setItem("token", token)
                localStorage.setItem("name", username)
                localStorage.setItem("avatar", avatar)

                navigate("/panel", {replace: true})
            })
    }, [])

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
            <div>
                Trwa logowanie...
            </div>
        </div>
    )
}

export default Login
