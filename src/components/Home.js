import React from "react";
import {Link} from "react-router-dom";
import { DarkModeSwitch } from 'react-toggle-dark-mode';

export default function Home(props) {
    return (
        <div className="page-content">
            <DarkModeSwitch
                className={"theme-switch"}
                checked={props.isLightMode}
                onChange={props.setDarkMode}
                size={40}
                moonColor={"#212121"}
                sunColor={"#eeeeee"}
            />
            <Link to="/easy"><button className="col-10">EASY</button></Link>
            <Link to="/medium"><button className="col-10">MEDIUM</button></Link>
            <Link to="/hard"><button className="col-10">HARD</button></Link>
            <Link to="/impossible"><button className="col-10">IMPOSSIBLE</button></Link>
        </div>
    );
}