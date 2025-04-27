const Payment = () => {
    return (
        <div className="flex flex-col w-min gap-2 border rounded-lg border-indigo-600 p-1 mt-2">
            <h2 className="font-xl font-bold">Przedłuż serwer</h2>
            <label className="">
                Ilość dni:
                <br/>
                <input type="range" name="" id="days" min="30" max="365" defaultValue="95"/>
                <input type="number" name="" id="days_num" defaultValue="95"
                       className="mt-1.5 rounded-lg border-gray-300 bg-white  text-gray-700 sm:text-sm p-2"/>
            </label>
            <label htmlFor="">
                Opłata:
                <br/>
                <input type="text" name="" id="amount_to_pay" value="7 zł"
                       className="mt-1.5 rounded-lg border-gray-300 bg-gray-200 text-gray-700 sm:text-sm p-2" disabled readOnly/>
            </label>

            <button
                className="mt-4 px-4 text-center inline-block rounded border border-indigo-600 bg-indigo-600 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
                id="pay">Przedłuż
            </button>
        </div>
    )
}

export  default Payment