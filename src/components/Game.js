import streakIcon from "../images/fire.png"
import {useEffect, useRef, useState} from "react";
import Confetti from "react-confetti";
import React from "react";
import XElement from "./XElement";

export default function Game(props) {
    const [gameData, setGameData] = useState({});
    const [xPos, setXPos] = useState([])
    const elementsMap = useRef([]);
    const confettiCounter = useRef(0);
    const correctElement = useRef();
    const answerGiven = useRef(false);
    const streak = useRef(parseInt(localStorage.getItem(props.gameMode + "-streak")));


    useEffect(() => {
        document.title = "ColorGuesser - "+ props.gameMode.charAt(0).toUpperCase() + props.gameMode.slice(1) + " Mode";
        return () => {document.title = "ColorGuesser - Menu"};
    }, [props.gameMode])

    function generateNewColor() {
        answerGiven.current = false;
        let randomColor = Math.floor(Math.random() * 16777215).toString(16);
        randomColor = "0".repeat(6-randomColor.length)+randomColor;

        const indexes = [0,1,2,3,4,5];
        const differentChars = {"easy": 6, "medium":4, "hard":3, "impossible":2}[props.gameMode];

        const res = {
            "answer_1": randomColor,
            "answer_2": randomColor,
            "answer_3": randomColor,
            "correct": randomColor
        }
        for(let i=0; i<differentChars; i++) {
            const i = Math.floor(Math.random()*indexes.length)
            const randomIndex = indexes[i];
            indexes.splice(i, 1);
            const takenChars = [randomColor[randomIndex]];
            for(const answer of ["answer_1", "answer_2", "answer_3"]) {
                let newChar = takenChars[0];
                while(takenChars.includes(newChar)) {
                    newChar = Math.floor(Math.random() * 16).toString(16);
                }
                takenChars.push(newChar);
                let c = res[answer];
                res[answer] = c.substring(0, i) + newChar + c.substring(i+1, c.length);
            }
        }

        localStorage.setItem("colors-"+props.gameMode, JSON.stringify(res));

        setGameData(res);
        elementsMap.current = ["answer_1", "answer_2", "answer_3", "correct"].sort(() => 0.5 - Math.random());
    }

    useEffect(() => {
        props.setLogoScale(0.9);
        getStarterColor();
        return () => props.setLogoScale(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props])

    function getStarterColor() {
        const stringData = localStorage.getItem("colors-"+props.gameMode);
        if(stringData === null)
            generateNewColor();
        else {
            const data = JSON.parse(stringData);
            setGameData(data);
            elementsMap.current = ["answer_1", "answer_2", "answer_3", "correct"].sort(() => 0.5 - Math.random());
        }
    }

    function handleAnswerClick(answer, e) {
        if(answerGiven.current)
            return;
        answerGiven.current = !answerGiven.current;

        e.target.classList.add("button-click");

        if(answer === gameData["correct"]) {
            streak.current = streak.current + 1;
            e.target.classList.add("correct-button");
            confettiCounter.current++;
            document.getElementById("streak-box").classList.add("button-click");
        } else {
            streak.current = 0;
            e.target.classList.add("incorrect-button");
            addXIcon(e);
        }

        correctElement.current.classList.add("correct-button");

        setGameData(prev => ({...prev}));

        setTimeout(() => {
            generateNewColor();
            e.target.classList.remove("correct-button", "incorrect-button", "button-click");
            correctElement.current.classList.remove("correct-button");
            document.getElementById("streak-box").classList.remove("button-click");
        }, 2000);

        localStorage.setItem(props.gameMode + "-streak", streak.current.toString());
    }

    function addXIcon(event) {
        const x = event.pageX, y = event.pageY;
        setXPos([x,y])
        setTimeout(() => setXPos(prevState => {
            if(prevState[0] === x && prevState[1] === y)
                return [];
            return prevState;
        }), 4000);
    }

    return (
    <div className="page-content">
        {<XElement position={xPos} />}
        {<Confetti numberOfPieces={150*confettiCounter.current} initialVelocityY={7} recycle={false} />}
        <div className="streak-box" id={"streak-box"}>
            <img src={streakIcon} className="streak-icon" alt="streak icon" />
            <span className="streak-count">{streak.current}</span>
        </div>
        <div className="color-box" style={{backgroundColor: "#"+gameData["correct"]}}></div>
        {elementsMap.current.map(e => <button key={gameData[e]+e}
                                              ref={e==="correct" ? correctElement : null}
                                              onClick={(event) => handleAnswerClick(gameData[e], event)}
                                              className={`answer col-10`}
        >#{gameData[e]}</button>)}
    </div>
    );
}