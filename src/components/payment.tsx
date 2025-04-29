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

    return (
        <div className="flex flex-col w-min gap-2 p-4 bg-gray-50 rounded-lg">
            <label className="">
                Ilość dni:
                <br/>
                <input type="range" name="" id="days" min="30" max="365" defaultValue="95" value={days} onChange={e => changeDays(Number(e.target.value))}/>
                <input type="number" name="" id="days_num" defaultValue="95" value={days} onChange={e => changeDays(Number(e.target.value))}
                       className="mt-1.5 rounded-lg border-gray-300 bg-white  text-gray-700 sm:text-sm p-2"/>
            </label>
            <label htmlFor="">
                Opłata:
                <br/>
                <input type="text" name="" id="amount_to_pay" value={cost.toFixed(2) + "zł"}
                       className="mt-1.5 rounded-lg border-gray-300 bg-gray-200 text-gray-700 sm:text-sm p-2" disabled readOnly/>
            </label>
        </div>
    )
}

export  default Payment