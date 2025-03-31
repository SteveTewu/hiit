// src/hooks/useTimer.js
import { useState, useEffect, useRef, useCallback } from 'react';

export const useTimer = (workout, onComplete) => {
    const [phase, setPhase] = useState('idle'); // idle, warmup, work, rest, cooldown, finished
    const [currentTime, setCurrentTime] = useState(0);
    const [currentSet, setCurrentSet] = useState(1);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const intervalRef = useRef(null);

    const currentExercise = workout?.exercises[currentExerciseIndex];

    const clearTimerInterval = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const startTimer = useCallback(() => {
        clearTimerInterval();
        intervalRef.current = setInterval(() => {
            setCurrentTime((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                    // Delay slightly before moving to next phase to allow UI update
                    setTimeout(nextPhase, 100); 
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
    }, [clearTimerInterval]); // Added dependency

    const nextPhase = useCallback(() => {
        clearTimerInterval();
        if (!workout) return;

        switch (phase) {
            case 'idle':
                setPhase('warmup');
                setCurrentTime(workout.warmup);
                setCurrentSet(1);
                setCurrentExerciseIndex(0);
                startTimer();
                break;
            case 'warmup':
                setPhase('work');
                setCurrentTime(workout.exercises[0].work);
                startTimer();
                break;
            case 'work':
                setPhase('rest');
                setCurrentTime(currentExercise.rest);
                startTimer();
                break;
            case 'rest':
                const nextExerciseIndex = currentExerciseIndex + 1;
                if (nextExerciseIndex < workout.exercises.length) {
                    setCurrentExerciseIndex(nextExerciseIndex);
                    setPhase('work');
                    setCurrentTime(workout.exercises[nextExerciseIndex].work);
                    startTimer();
                } else {
                    const nextSet = currentSet + 1;
                    if (nextSet <= workout.sets) {
                        setCurrentSet(nextSet);
                        setCurrentExerciseIndex(0);
                        setPhase('work');
                        setCurrentTime(workout.exercises[0].work);
                        startTimer();
                    } else {
                        setPhase('cooldown');
                        setCurrentTime(workout.cooldown);
                        startTimer();
                    }
                }
                break;
            case 'cooldown':
                setPhase('finished');
                onComplete && onComplete();
                break;
            default:
                setPhase('idle');
        }
    }, [phase, workout, currentSet, currentExerciseIndex, currentExercise, startTimer, clearTimerInterval, onComplete]); // Added dependencies

    const pause = () => {
        if (!isPaused && intervalRef.current) {
            clearTimerInterval();
            setIsPaused(true);
        }
    };

    const resume = () => {
        if (isPaused) {
            setIsPaused(false);
            startTimer();
        }
    };

    const skip = () => {
        clearTimerInterval();
        // Directly trigger the logic for moving to the next phase
        nextPhase(); 
    };

    const reset = useCallback(() => {
        clearTimerInterval();
        setPhase('idle');
        setCurrentTime(0);
        setCurrentSet(1);
        setCurrentExerciseIndex(0);
        setIsPaused(false);
    }, [clearTimerInterval]); // Added dependency

    // Cleanup interval on unmount or workout change
    useEffect(() => {
        return () => clearTimerInterval();
    }, [clearTimerInterval]);

    // Reset timer if workout changes
     useEffect(() => {
        reset();
    }, [workout, reset]); // Added dependency


    const getStatusText = () => {
        switch (phase) {
            case 'idle': return '准备就绪';
            case 'warmup': return '热身';
            case 'work': return `运动 (第 ${currentSet}/${workout?.sets || 0} 组)`;
            case 'rest': return '休息';
            case 'cooldown': return '放松拉伸';
            case 'finished': return '训练完成!';
            default: return '';
        }
    };

    const getExerciseName = () => {
        switch (phase) {
            case 'warmup': return '热身';
            case 'work': return currentExercise?.name || '';
            case 'rest': return '休息';
     
