import {useState} from "react";
import axios from "axios";
import {backendUrl} from "../../config.ts";
import {Link} from "react-router";

function Restart(props: { shop: { "domain": string, "date": string, id: number } }) {
    const {shop} = props;
    const token = localStorage.getItem("token");
    const [restartStatus, setRestartStatus] = useState<Date>(new Date());
    const [seconds, setSeconds] = useState<number>(0);

    const restart = () => {
        axios.post(backendUrl + "shop/" + shop.id + "/restart", {}, {
            headers: {
                "Authorization": "Bearer " + token
            }
        }).then(r => {
            alert(r.data.message)
            setRestartStatus(new Date(r.data.restartStatus))
            getSeconds()
            startCountdown()
        }).catch(err => {
            alert(err.response.data.message)
        })
    }

    const getSeconds = () => {
        const seconds = Math.floor(((restartStatus.getTime() + 60_000) - new Date().getTime()) / 1000);
        console.log(seconds)
        setSeconds(seconds)
        return seconds;
    }

    const startCountdown = () => {
        const interval = setInterval(() => {
            if (getSeconds() <= 0) {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }

    return (
        <div className="h-full w-full rounded-lg bg-gray-100 dark:bg-gray-800 p-10">
            <h1 className="font-bold text-3xl dark:text-white">Restart</h1>
            <p className="dark:text-gray-300">Zmiany zostaną wgrane tylko po zrestartowaniu (przeładowaniu) szablonu.
                Restart trwa zazwyczaj maksymalnie 60 sekund. Jeżeli do tego czasu szablon
                nie będzie działał sprawdź <Link to={"/shop/" + shop.id + "/logs"}
                                                 className="text-indigo-500 font-bold underline">logi</Link> po więcej
                informacji</p>
            {seconds > 0 && <p className="my-2 dark:text-gray-300">Możesz zrestartować szablon za: <span
                className="font-bold">{seconds.toString()}s</span></p>}

            {seconds <= 0 && <button onClick={restart}
                                     className="mt-5 justify-self-end w-fit px-4 text-center inline-block rounded border border-indigo-600 bg-indigo-600 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500">Restartuj</button>}
        </div>
    )
}

export default Restart
