const StatsBar = (props: { name: string, progress: number }) => {
    const {name, progress} = props
    return (
        <div className="w-full bg-gray-200 rounded-full">
            <div className="bg-indigo-600 rounded-full text-white px-3 py-0.5 flex items-center align-items-center text-sm align-middle text-md shadow-lg"
                 style={{"width": `${progress}%`}}><span>{name}</span></div>
        </div>
    )
}

export default StatsBar