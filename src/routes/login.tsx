import {useNavigate, useSearchParams} from "react-router";
import {useEffect, useState} from "react";
import axios from "axios";
import {backendUrl, loginUrl} from "../config.ts";

function Login() {
    const [searchParams, _] = useSearchParams();
    const navigate = useNavigate();
    const code = searchParams.get("code")
    const [error, setError] = useState<string | null>(null)

    if (code === null) {
        window.location.href = loginUrl
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-950 dark:text-white">
                <div>
                    Przekierowywanie...
                </div>
            </div>
        )
    }

    useEffect(() => {
        if (code !== null)
            axios.get(backendUrl + 'login?code=' + code).then(response => {
                if (response.data.error) {
                    setError("Niepoprawny kod autoryzacji. Spróbuj zalogować się ponownie.")
                    return
                }

                const token = response.data.token
                const username = response.data.name
                const avatar = response.data.avatar

                localStorage.setItem("token", token)
                localStorage.setItem("name", username)
                localStorage.setItem("avatar", avatar)

                navigate("/panel", {replace: true})
            }).catch(() => {
                setError("Wystąpił błąd podczas logowania. Spróbuj ponownie.")
            })
    }, [])

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
            <div className="flex flex-col items-center gap-4">
                {error ? (
                    <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-sm max-w-sm text-center">
                        <div className="font-medium mb-1">Błąd logowania</div>
                        <div>{error}</div>
                        <a
                            href={loginUrl}
                            className="mt-3 inline-block bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium px-4 py-2 transition-colors duration-150"
                        >
                            Spróbuj ponownie
                        </a>
                    </div>
                ) : (
                    <div className="text-slate-600 dark:text-slate-400">
                        Trwa logowanie...
                    </div>
                )}
            </div>
        </div>
    )
}

export default Login
