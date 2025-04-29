import {Link} from "react-router";
import React from "react";


function Button(props: { href: string, children?: React.ReactNode, highlighted? : Boolean }) {
    let {href, children, highlighted } = props;
    if (!highlighted) highlighted = false
    return (
        <>
            <Link to={href}
                  className={`${highlighted ? "bg-indigo-800" : "bg-indigo-600"} transition-all duration-200 font-bold text-center inline-block rounded border border-indigo-600  px-10 pt-3 pb-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500`}>{children}</Link>
        </>
    )
}

export default Button
