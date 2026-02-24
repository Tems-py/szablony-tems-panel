import {useState} from "react";
import axios from "axios";
import {backendUrl} from "../../config.ts";
import {Link} from "react-router";

function Restart(props: { shop: { "domain": string, "date": string, id: number } }) {
    const {shop} = props;
    const token = localStorage.getItem("token");
    const [restartStatus, setRestartStatus] = useState<Date>(new Date());
    const [seconds, setSeconds] = useState<number>(0);
    const [restarting, setRestarting] = useState(false);

    const restart = () => {
        setRestarting(true);
        axios.post(backendUrl + "shop/" + shop.id + "/restart", {}, {
            headers: {"Authorization": "Bearer " + token}
        }).then(r => {
            setRestarting(false);
            alert(r.data.message);
            setRestartStatus(new Date(r.data.restartStatus));
            getSeconds();
            startCountdown();
        }).catch(err => {
            setRestarting(false);
            alert(err.response.data.message);
        });
    };

    const getSeconds = () => {
        const secs = Math.floor(((restartStatus.getTime() + 60_000) - new Date().getTime()) / 1000);
        setSeconds(secs);
        return secs;
    };

    const startCountdown = () => {
        const interval = setInterval(() => {
            if (getSeconds() <= 0) {
                clearInterval(interval);
            }
        }, 1000);
        return () => clearInterval(interval);
    };

    return (
        <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-1">Restart szablonu</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Zmiany w plikach i konfiguracji zostaną zastosowane dopiero po restarcie. Restart trwa do 60 sekund. Jeśli sklep nie wróci, sprawdź{" "}
                <Link to={"/shop/" + shop.id + "/logs"}
                      className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline underline-offset-2">
                    logi
                </Link>.
            </p>

            {seconds > 0 ? (
                <div
                    className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                         stroke="currentColor" className="w-5 h-5 text-amber-500 shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <div>
                        <p className="text-sm font-medium text-amber-700 dark:text-amber-300">Proszę czekać</p>
                        <p className="text-sm text-amber-600 dark:text-amber-400">
                            Możesz zrestartować ponownie za{" "}
                            <strong className="tabular-nums">{seconds}s</strong>
                        </p>
                    </div>
                </div>
            ) : (
                <button
                    onClick={restart}
                    disabled={restarting}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {restarting ? (
                        <>
                            <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none"
                                 viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        strokeWidth="4"/>
                                <path className="opacity-75" fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                            </svg>
                            Restartowanie...
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>
                            </svg>
                            Restartuj
                        </>
                    )}
                </button>
            )}
        </div>
    );
}

export default Restart;
