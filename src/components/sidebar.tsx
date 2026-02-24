import {Link, useLocation} from "react-router";
import DarkModeToggle from "./darkModeToggle.tsx";

const navItems = [
    {
        href: "/panel",
        label: "Przegląd",
        exact: true,
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                 stroke="currentColor" className="w-4 h-4 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/>
            </svg>
        )
    },
    {
        href: "/panel/resources",
        label: "Zasoby",
        exact: true,
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                 stroke="currentColor" className="w-4 h-4 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
            </svg>
        )
    },
    {
        href: "/panel/plugins",
        label: "Pluginy",
        exact: true,
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                 stroke="currentColor" className="w-4 h-4 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.959.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z"/>
            </svg>
        )
    }
];

function Sidebar() {
    const {pathname} = useLocation();
    const avatar = localStorage.getItem("avatar");
    const name = localStorage.getItem("name");

    const isActive = (href: string, exact: boolean) =>
        exact ? pathname === href : pathname.startsWith(href);

    return (
        <aside
            className="flex flex-col shrink-0 w-56 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-3 h-fit">
            <div className="px-3 py-2 mb-1">
                <span
                    className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Nawigacja</span>
            </div>

            <nav className="flex flex-col gap-0.5 flex-1">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        to={item.href}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                            isActive(item.href, item.exact)
                                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                    >
                        {item.icon}
                        {item.label}
                    </Link>
                ))}

                <div className="my-2 border-t border-slate-100 dark:border-slate-800"/>

                <Link
                    to="/logout"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all duration-150"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                         stroke="currentColor" className="w-4 h-4 shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"/>
                    </svg>
                    Wyloguj
                </Link>
            </nav>

            <div
                className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 min-w-0">
                {avatar && (
                    <img src={avatar} alt="avatar"
                         className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-slate-800 shrink-0"/>
                )}
                <span
                    className="text-sm font-medium text-slate-700 dark:text-slate-200 flex-1 truncate min-w-0">{name}</span>
                <DarkModeToggle/>
            </div>
        </aside>
    );
}

export default Sidebar;
