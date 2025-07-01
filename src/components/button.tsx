import {Link} from "react-router";
import React from "react";


function Button(props: { href: string, children?: React.ReactNode, highlighted? : Boolean, onClick?: () => void }) {
    let {href, children, highlighted } = props;
    if (!highlighted) highlighted = false
    return (
        <>
            <Link to={href}
                  className={`${highlighted ? "underline underline-offset-4 text-decoration-3" : ""} bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-3 transition-all duration-200 font-bold text-center inline-block hover:bg-gray-200 rounded px-10 font-medium text-black `}>{children}</Link>
        </>
    )
}

export default Button
