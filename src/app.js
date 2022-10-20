import React, {useEffect, useState} from 'react'
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import Home from "./components/Home";
import Game from "./components/Game";
import "./css/themes.scss";
import "./css/style.css";
import logo from "./images/color-palette.png"
import 'bootstrap/dist/css/bootstrap.min.css';


export default function App() {
    const [logoScale, setLogoScale] = useState(1);
    const [isLightMode, setLightMode] = useState(true);

    useEffect(() => {
        const v = localStorage.getItem("isLightMode");
        setLightMode(v !== null && localStorage.getItem("isLightMode") === "true");
        document.title = "ColorGuesser - Menu";

        for(const name of ["easy-streak", "medium-streak", "hard-streak", "impossible-streak"])
        if(localStorage.getItem(name) === null)
            localStorage.setItem(name, "0");
    }, [])

    function handleDarkMode(bool) {
        setLightMode(bool);
        localStorage.setItem("isLightMode", bool.toString());
    }

    return (
        <div className={`box pt-5 ${isLightMode ? "light-theme" : "dark-theme"}`}>
            <div className="content-box p-5 col-11 col-sm-7 col-md-6 col-xl-4 col-xxl-3 mx-auto ">
                <Router>
                    <Link to="/" className="text-decoration-none">
                        <div className={"col-12 text-center logo-box"} style={{transform: `scale(${logoScale})`}}>
                            <img className="logo" alt="logo" src={logo} />
                            <h1 className="logo-text fw-light">ColorGuesser</h1>
                        </div>
                    </Link>
                    <Routes>
                        <Route exact path='easy' element={<Game setLogoScale={setLogoScale} gameMode="easy" />}/>
                        <Route exact path='medium' element={<Game setLogoScale={setLogoScale} gameMode="medium" />}/>
                        <Route exact path='hard' element={<Game setLogoScale={setLogoScale} gameMode="hard" />}/>
                        <Route exact path='impossible' element={<Game setLogoScale={setLogoScale} gameMode="impossible" />}/>
                        <Route exact path='*' element={<Home setDarkMode={handleDarkMode} isLightMode={isLightMode} />}/>
                    </Routes>
                </Router>
            </div>
        </div>
    );
}