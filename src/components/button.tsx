import {Link} from "react-router";
import React from "react";


function Button(props: { href: string, children?: React.ReactNode, highlighted? : Boolean }) {
    let {href, children, highlighted } = props;
    if (!highlighted) highlighted = false
    return (
        <>
            <Link to={href}
                  className={`${highlighted ? "underline underline-offset-4 text-decoration-3" : ""} transition-all duration-200 font-bold text-center inline-block hover:bg-gray-200  rounded px-10 pt-3 pb-3  font-medium text-black focus:outline-none focus:ring `}>{children}</Link>
        </>
    )
}

export default Button
