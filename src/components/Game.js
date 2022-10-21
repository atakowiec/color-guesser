import streakIcon from "../images/fire.png"
import {useEffect, useRef, useState} from "react";
import Confetti from "react-confetti";
import React from "react";

export default function Game(props) {
    const [gameData, setGameData] = useState({});
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
        const sameChars = {"easy": 6, "medium":4, "hard":3, "impossible":2}[props.gameMode];

        const res = {
            "answer_1": randomColor,
            "answer_2": randomColor,
            "answer_3": randomColor,
            "correct": randomColor
        }
        for(let i=0; i<sameChars; i++) {
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
                c = c.substring(0, i) + newChar + c.substring(i+1, c.length);
                res[answer] = c;
            }
        }

        setGameData(res);
        elementsMap.current = ["answer_1", "answer_2", "answer_3", "correct"].sort(() => 0.5 - Math.random());
    }

    useEffect(() => {
        props.setLogoScale(0.9);
        generateNewColor();
        return () => props.setLogoScale(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props])

    function handleAnswerClick(answer, e) {
        if(answerGiven.current)
            return;
        answerGiven.current = !answerGiven.current;

        e.target.classList.add("button-click");

        if(answer === gameData["correct"]) {
            streak.current = streak.current + 1;
            e.target.classList.add("correct-button");
            confettiCounter.current++;
        } else {
            streak.current = 0;
            e.target.classList.add("incorrect-button");
        }

        correctElement.current.classList.add("correct-button");

        setGameData(prev => ({...prev}));

        setTimeout(() => {
            generateNewColor();
            e.target.classList.remove("correct-button", "incorrect-button", "button-click");
            correctElement.current.classList.remove("correct-button");
        }, 2000);

        localStorage.setItem(props.gameMode + "-streak", streak.current.toString());
    }

    return (
    <div className="page-content">
        {<Confetti numberOfPieces={150*confettiCounter.current} initialVelocityY={7} recycle={false} />}
        <div className="streak-box">
            <img src={streakIcon} className="streak-icon" alt="streak icon" />
            <span className="streak-count">{streak.current}</span>
        </div>
        <div className="color-box" style={{backgroundColor: "#"+gameData["correct"]}}></div>
        {elementsMap.current.map(e => <button key={gameData[e]}
                                              ref={e==="correct" ? correctElement : null}
                                              onClick={(event) => handleAnswerClick(gameData[e], event)}
                                              className={`answer col-10`}
        >#{gameData[e]}</button>)}
    </div>
    );
}