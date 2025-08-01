import React, { useState, useEffect } from "react";
import "./MathGame.sass";

const operators = ["+", "-", "*"];
const randomValue = (min, max) => Math.floor(Math.random() * (max - min)) + min;

function generateQuestion() {
  let [num1, num2] = [randomValue(1, 20), randomValue(1, 20)];
  let randomOperator = operators[Math.floor(Math.random() * operators.length)];
  let operatorQuestion = false;

  if (randomOperator === "-" && num2 > num1) [num1, num2] = [num2, num1];

  let solution = eval(`${num1}${randomOperator}${num2}`);
  let randomVar = randomValue(1, 5);
  let answerValue;

  let jsx = null;
  if (randomVar === 1) {
    answerValue = num1;
    jsx = (
      <>
        <input type="number" className="inputValue" placeholder="?" /> {randomOperator} {num2} = {solution}
      </>
    );
  } else if (randomVar === 2) {
    answerValue = num2;
    jsx = (
      <>
        {num1} {randomOperator} <input type="number" className="inputValue" placeholder="?" /> = {solution}
      </>
    );
  } else if (randomVar === 3) {
    answerValue = randomOperator;
    operatorQuestion = true;
    jsx = (
      <>
        {num1} <input type="text" className="inputValue" placeholder="?" maxLength={1} /> {num2} = {solution}
      </>
    );
  } else {
    answerValue = solution;
    jsx = (
      <>
        {num1} {randomOperator} {num2} = <input type="number" className="inputValue" placeholder="?" />
      </>
    );
  }

  return { jsx, answerValue, operatorQuestion };
}

const MathGame = () => {
  const [question, setQuestion] = useState(null);
  const [answerValue, setAnswerValue] = useState("");
  const [operatorQuestion, setOperatorQuestion] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState("");
  const [playing, setPlaying] = useState(false);

  // Focus input on new question
  useEffect(() => {
    if (playing) {
      setTimeout(() => {
        const input = document.querySelector(".inputValue");
        if (input) input.focus();
      }, 100);
    }
  }, [question, playing]);

  const startGame = () => {
    setResult("");
    setErrorMsg("");
    setPlaying(true);
    const { jsx, answerValue, operatorQuestion } = generateQuestion();
    setQuestion(jsx);
    setAnswerValue(answerValue);
    setOperatorQuestion(operatorQuestion);
  };

  const stopGame = (resultText) => {
    setResult(resultText);
    setPlaying(false);
  };

  const handleSubmit = () => {
    setErrorMsg("");
    const input = document.querySelector(".inputValue");
    if (!input || input.value.trim() === "") {
      setErrorMsg("Input Cannot Be Empty");
      return;
    }
    const userInput = input.value.trim();
    if (userInput === String(answerValue)) {
      stopGame(`Yippie!! <span>Correct</span> Answer`);
    } else if (operatorQuestion && !operators.includes(userInput)) {
      setErrorMsg("Please enter a valid operator");
    } else {
      stopGame(`Opps!! <span>Wrong</span> Answer`);
    }
  };

  // Allow Enter to submit
  useEffect(() => {
    if (!playing) return;
    const handler = (e) => {
      if (e.key === "Enter") handleSubmit();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [playing, answerValue, operatorQuestion]);

  return (
    <div>
      <div className="container">
        <h3>Fill In The Blank With Correct Number Or Operator</h3>
        <div id="question">{question}</div>
        <button
          id="submit-btn"
          onClick={handleSubmit}
          disabled={!playing}
        >
          Submit
        </button>
        <p
          id="error-msg"
          className={errorMsg ? "" : "hide"}
          dangerouslySetInnerHTML={{ __html: errorMsg }}
        />
      </div>
      <div className={`controls-container${playing ? " hide" : ""}`}>
        <p id="result" dangerouslySetInnerHTML={{ __html: result }} />
        <button id="start-btn" onClick={startGame}>
          {result ? "Restart" : "Start Game"}
        </button>
      </div>
    </div>
  );
};

export default MathGame;