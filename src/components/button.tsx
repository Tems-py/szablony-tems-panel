import {Link} from "react-router";
import React from "react";

function Button(props: { href: string, children?: React.ReactNode, highlighted?: Boolean, onClick?: () => void }) {
    const {href, children, highlighted = false, onClick} = props;
    return (
        <Link
            to={href}
            onClick={onClick}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                highlighted
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
        >
            {children}
        </Link>
    );
}

export default Button;
