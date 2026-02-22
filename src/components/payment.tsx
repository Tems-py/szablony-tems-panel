import React, {useState} from "react";

const Payment = (props: {daysHook: [number, React.Dispatch<React.SetStateAction<number>>]}) => {
    const [days, setDays] = props.daysHook
    const [cost, setCost] = useState(20)
    const calcCost = (value: number) => {
        return ((7 + 0.2 * (value - 30)))
    }

    const changeDays = (value: number) => {
        setCost(calcCost(value))
        setDays(value)
    }

    const calculateDiscount = ()  => {
     return (((days * (7 / 30)) - cost) / cost) * 100
    }

    return (
        <div className="flex flex-col w-min gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg h-fit">
            <label className="flex flex-col gap-2">
                <div className="dark:text-gray-200">Ilość dni:</div>
                <input type="range" name="" id="days" min="30" max="365" value={days} onChange={e => changeDays(Number(e.target.value))}/>
                <input type="number" name="" id="days_num" value={days} onChange={e => changeDays(Number(e.target.value))}
                       className="mt-1.5 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 sm:text-sm p-2"/>
            </label>
            <label className="flex flex-col gap-2">
                <div className="dark:text-gray-200">Opłata: {calculateDiscount() != 0 && <span className="p-1 m-1 text-sm rounded-full text-white bg-green-600 font-bold">Zniżka -{calculateDiscount().toFixed(0)}%</span>}</div>

                <input type="text" name="" id="amount_to_pay" value={cost.toFixed(2) + "zł"}
                       className="mt-1.5 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 sm:text-sm p-2" disabled readOnly/>

            </label>
        </div>
    )
}

export  default Payment