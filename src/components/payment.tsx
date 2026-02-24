import React, {useState} from "react";

const Payment = (props: { daysHook: [number, React.Dispatch<React.SetStateAction<number>>] }) => {
    const [days, setDays] = props.daysHook;
    const [cost, setCost] = useState(20);

    const calcCost = (value: number) => 7 + 0.2 * (value - 30);

    const changeDays = (value: number) => {
        setCost(calcCost(value));
        setDays(value);
    };

    const discount = (((days * (7 / 30)) - cost) / cost) * 100;

    return (
        <div className="flex flex-col gap-4 w-full">
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Liczba dni</label>
                    <input
                        type="number"
                        value={days}
                        min={30}
                        max={365}
                        onChange={e => changeDays(Number(e.target.value))}
                        className="w-20 text-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm px-2 py-1.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>
                <input
                    type="range"
                    min={30}
                    max={365}
                    value={days}
                    onChange={e => changeDays(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 mt-1">
                    <span>30 dni</span>
                    <span>365 dni</span>
                </div>
            </div>

            <div
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-700">
                <span className="text-sm text-slate-500 dark:text-slate-400">Do zapłaty</span>
                <div className="flex items-center gap-2">
                    {discount > 0 && (
                        <span
                            className="text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                            -{discount.toFixed(0)}%
                        </span>
                    )}
                    <span className="text-xl font-bold text-slate-900 dark:text-white">{cost.toFixed(2)} zł</span>
                </div>
            </div>

            <p className="text-xs text-slate-400 dark:text-slate-500">
                Im dłuższy okres czasu, tym większa zniżka!
            </p>
        </div>
    );
};

export default Payment;
