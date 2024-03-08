import './App.css';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { faPause } from '@fortawesome/free-solid-svg-icons';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);

  const [timer, setTimer] = useState(sessionLength * 60);
  const [timerName, setTimerName] = useState("Session");
  const [isRunning, setIsRunning] = useState(false);

  const timerRef = useRef(null);
  const audioRef = useRef(null);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const incrementBreakLength = () => {
    if (breakLength < 15) {
      setBreakLength(breakLength + 1);
      if ((!isRunning) && (timerName === "Break")) {
        setTimer((breakLength + 1) * 60);
      }
    }
  };

  const decrementBreakLength = () => {
    if (breakLength > 1) {
      setBreakLength(breakLength - 1);
      if ((!isRunning) && (timerName === "Break")) {
        setTimer((breakLength - 1) * 60);
      }
    }
  };

  const incrementSessionLength = () => {
    if (sessionLength < 60) {
      setSessionLength(sessionLength + 1);
      if ((!isRunning) && (timerName === "Session")) {
        setTimer((sessionLength + 1) * 60);
      }
    }
  };

  const decrementSessionLength = () => {
    if (sessionLength > 1) {
      setSessionLength(sessionLength - 1);
      if ((!isRunning) && (timerName === "Session")) {
        setTimer((sessionLength - 1) * 60);
      }
    }
  };

  const startTimer = useCallback(() => {
    setIsRunning(true);
    timerRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 0) {
          playSound();
          if (timerName === "Session") {
            console.log("now break");
            setTimerName("Break");
            return breakLength * 60;
          } else {
            console.log("now session");
            setTimerName("Session");
            return sessionLength * 60;
          }
        } else {
          return prevTimer - 1;
        }
      });
    }, 1000);
  }, [breakLength, sessionLength, timerName]);

  const pauseTimer = () => {
    setIsRunning(false);
    clearInterval(timerRef.current);
  };

  const resetTimer = () => {
    setIsRunning(false);
    clearInterval(timerRef.current);
    setBreakLength(5);
    setSessionLength(25 * 60);
    setTimer(25 * 60);
    setTimerName("Session");
  };

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (timer === 0) {
      pauseTimer();
      startTimer();
    }
  }, [timer, startTimer]);

  return (
    <div className="App">
      <audio ref={audioRef} src={'/chime-sound.mp3'} id="beep" />
      <div className='title'>
        Pomodoro Timer
      </div>
      <div className="Cards">
        <div className="card">
          <div id="break-label">Break Length</div>
          <div className="Cards">
            <FontAwesomeIcon icon={faArrowUp} onClick={incrementBreakLength} className='signal' id="break-increment" />
            <div id="break-length"> {breakLength} </div>
            <FontAwesomeIcon icon={faArrowDown} onClick={decrementBreakLength} className='signal' id="break-decrement" />
          </div>
        </div>
        <div className='card'>
          <div id="session-label">Session Length</div>
          <div className="Cards">
            <FontAwesomeIcon icon={faArrowUp} onClick={incrementSessionLength} className='signal' id="session-increment" />
            <div id="session-length"> {sessionLength} </div>
            <FontAwesomeIcon icon={faArrowDown} onClick={decrementSessionLength} className='signal' id="session-decrement" />
          </div>
        </div>
      </div>
      <div className='timername' id="timer-label">
        {timerName}
      </div>
      <div className='time' id="time-left">
        {Math.floor(timer / 60).toString().padStart(2, '0')}:{(timer % 60).toString().padStart(2, '0')}
      </div>
      <div>
        {!isRunning ? (
          <FontAwesomeIcon icon={faPlay} onClick={startTimer} className='signal' id="start_stop" />
        ) : (
          <FontAwesomeIcon icon={faPause} onClick={pauseTimer} className='signal' id="start_stop" />
        )
        }
        <FontAwesomeIcon icon={faRefresh} onClick={resetTimer} className='signal' id="reset" />
      </div>

    </div>
  );
}

export default App;
