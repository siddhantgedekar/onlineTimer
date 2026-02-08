import { useRef, useState, useEffect } from "react";
import songPath from '../assets/At My Worst.mp3';

export default function Timer() {
  const [time, setTime] = useState(new Date());
  const [timer, setTimer] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [timerFlag, setTimerFlag] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(songPath);
    audioRef.current.load();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []); // Clock should run independently

  useEffect(() => {
    if (!timerFlag) return;

    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        const { hours, minutes, seconds } = prevTimer;

        // Timer finished
        if (seconds === 0 && minutes === 0 && hours === 0) {
          setTimerFlag(false);
          playAlarm();
          return prevTimer;
        }

        // Countdown logic
        if (seconds > 0) {
          return { ...prevTimer, seconds: seconds - 1 };
        } else if (minutes > 0) {
          return { hours, minutes: minutes - 1, seconds: 59 };
        } else {
          return { hours: hours - 1, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [timerFlag]); // Only depend on timerFlag

    const playAlarm = () => {
        if (audioRef.current) {
        audioRef.current.currentTime = 0; // Reset to start
        audioRef.current.play().catch(err => {
            console.error("Audio play failed:", err);
            // Fallback: Browser notification sound
            alert("⏰ Timer finished!");
        });
        }
    };

  const handleIncrease = () => {
    setTimer((prev) => {
      if (prev.seconds < 59) {
        return { ...prev, seconds: prev.seconds + 1 };
      } else if (prev.minutes < 59) {
        return { ...prev, minutes: prev.minutes + 1, seconds: 0 };
      } else {
        return { hours: prev.hours + 1, minutes: 0, seconds: 0 };
      }
    });
  };

  const handleDecrease = () => {
    setTimer((prev) => {
      if (prev.seconds > 0) {
        return { ...prev, seconds: prev.seconds - 1 };
      } else if (prev.minutes > 0) {
        return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
      } else if (prev.hours > 0) {
        return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
      }
      return prev;
    });
  };

  const handleReset = () => {
    setTimerFlag(false);
    if(audioRef.current) {
        audioRef.current.pause();
    }
    setTimer({ hours: 0, minutes: 0, seconds: 0 });
  };

  const formatTime = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="p-4">
      <div className="border-2 border-gray-400 rounded-lg p-4 text-center">
        <div className="text-2xl mb-4">{time.toLocaleTimeString()}</div>
        <hr className="my-4" />
        
        <div className="p-2 flex flex-col gap-2">
          <label className="font-semibold">Set Timer</label>
          <button
            className="bg-gray-200 border border-gray-400 rounded hover:bg-gray-300 py-2"
            type="button"
            onClick={handleIncrease}
            disabled={timerFlag}
          >
            +
          </button>
          
          <div className="text-center text-4xl font-mono my-4">
            <input type="number" min="0" max="23" value={formatTime(timer.hours)} onChange={(e) => setTimer({...timer, hours: parseInt(e.target.value) || 0})} className="w-18 text-center border border-gray-400 rounded" disabled={timerFlag}/>
            :
            <input type="number" min="0" max="59" value={formatTime(timer.minutes)} onChange={(e) => setTimer({...timer, minutes: parseInt(e.target.value) || 0})} className="w-18 text-center border border-gray-400 rounded" disabled={timerFlag}/>
            :
            <input type="number" min="0" max="59" value={formatTime(timer.seconds)} onChange={(e) => setTimer({...timer, seconds: parseInt(e.target.value) || 0})} className="w-18 text-center border border-gray-400 rounded" disabled={timerFlag}/>
          </div>
          
          <button
            className="bg-gray-200 border border-gray-400 rounded hover:bg-gray-300 py-2"
            type="button"
            onClick={handleDecrease}
            disabled={timerFlag}
          >
            -
          </button>
        </div>
        
        <div className="flex gap-2 justify-center mt-4">
          <button
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            onClick={() => setTimerFlag(true)}
            disabled={timerFlag || (timer.hours === 0 && timer.minutes === 0 && timer.seconds === 0)}
          >
            Start
          </button>
          <button
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}