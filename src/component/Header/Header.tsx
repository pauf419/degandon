import { FC, useEffect, useState } from "react";
import m from "./Header.module.sass"
import logo from "../../resource/logo.png"



const Header = () => {

    return (
        <div className={m.ToolbarWrapper}>
            <div className={m.ToolbarHeader}>
                <img src={logo} className={m.HeaderLogo}/>
            </div>
        </div>
    )

}

export default Header