import Button from "./button.tsx";

const ShopSidebar = (props: {id: number}) => {
    const {id} = props
    return (
        <div className="h-full rounded-lg bg-gray-100 p-10 flex flex-col gap-4">
            <Button href="/panel">Powrót</Button>
            <Button href={`/shop/${id}`}>Strona głowna szablonu</Button>
            <Button href={`/shop/${id}/config`}>Edycja konfiguracji</Button>
            <Button href={`/shop/${id}/domain`}>Ustawienia domeny</Button>
            <Button href={`/shop/${id}/restart`}>Restart</Button>
            <Button href={`/shop/${id}/logs`}>Logi</Button>
            <Button href={`/shop/${id}/files`}>Edytor plików</Button>
        </div>
    )
}

export default ShopSidebar