const DiscordInfo = () => {
    return (
        // <div className="bg-indigo-600 px-4 py-3 text-white hidden lg:block">
        //     <p className="text-center text-sm font-medium">
        //         Dołącz na naszego discorda, aby otrzymywać powiadomienia o nowych aktualizacjach i kończących się
        //         usługach! <a href="https://discord.gg/ged4vNXqEt" className="inline-block underline"
        //            target="_blank"> discord.gg</a>
        //     </p>
        // </div>
        <div className="bg-red-200 px-4 py-3 text-black hidden lg:block">
            <p className="text-center font-medium">
                To jest nowy beta panel. Jeżeli coś nie działa poprawnie daj nam znać na naszym <a href="https://discord.gg/ged4vNXqEt" className="inline-block underline text-blue-600"
                             target="_blank"> discordzie</a> i użyj poprzedniego  <a href="https://szablony.tems.pl/panel" className="inline-block underline text-blue-600"
                                                                                           target="_blank">panelu</a>
            </p>
        </div>
    )
}

export default DiscordInfo