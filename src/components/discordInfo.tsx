const DiscordInfo = () => {
    return (
        <div className="bg-amber-50 dark:bg-amber-950/20 border-b border-amber-200 dark:border-amber-800/40 px-4 py-2.5 hidden lg:block">
            <p className="text-center text-sm text-amber-800 dark:text-amber-300">
                To jest nowy beta panel - jeśli coś nie działa,{" "}
                <a href="https://discord.gg/ged4vNXqEt" className="font-semibold underline underline-offset-2"
                   target="_blank">daj nam znać na Discordzie</a>{" "}
                lub skorzystaj ze{" "}
                <a href="https://szablony.tems.pl/panel" className="font-semibold underline underline-offset-2"
                   target="_blank">starego panelu</a>.
            </p>
        </div>
    );
};

export default DiscordInfo;
