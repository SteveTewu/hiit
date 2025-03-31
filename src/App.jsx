// src/App.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { workouts, workoutOptions } from './data/workouts';
import { useTimer } from './hooks/useTimer';
import Calendar from './components/Calendar';
import styles from './App.module.css'; // We'll create this CSS module

function App() {
    const [selectedWorkoutId, setSelectedWorkoutId] = useState(workoutOptions[0].value);
    const [workoutHistory, setWorkoutHistory] = useState([]);

    // Load history from localStorage on mount
    useEffect(() => {
        const savedHistory = localStorage.getItem('workoutHistory');
        if (savedHistory) {
            setWorkoutHistory(JSON.parse(savedHistory));
        }
    }, []);

    // Save history to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('workoutHistory', JSON.stringify(workoutHistory));
    }, [workoutHistory]);

    const selectedWorkout = useMemo(() => workouts[selectedWorkoutId], [selectedWorkoutId]);

    const handleWorkoutComplete = () => {
        const today = new Date().toISOString().split('T')[0];
        const newEntry = { date: today, workout: selectedWorkout.name };
        // Avoid duplicate entries for the same day (optional)
        if (!workoutHistory.some(entry => entry.date === today && entry.workout === newEntry.workout)) {
             setWorkoutHistory(prev => [...prev, newEntry].sort((a, b) => new Date(b.date) - new Date(a.date)));
        }
        alert('训练完成！已打卡。');
    };

    const {
        phase,
        currentTime,
        currentSet,
        currentExerciseIndex,
        isPaused,
        progress,
        statusText,
        exerciseName,
        startWorkout,
        pause,
        resume,
        skip,
        reset,
    } = useTimer(selectedWorkout, handleWorkoutComplete);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const completedDates = useMemo(() => workoutHistory.map(entry => entry.date), [workoutHistory]);
    const recentHistory = useMemo(() => workoutHistory.slice(0, 10), [workoutHistory]); // Show recent 10

    return (
        <div className={styles.container}>
            <h1>HIIT 训练助手</h1>

            {/* Workout Selector */}
            <div className={styles.card}>
                <h2>选择训练</h2>
                <select
                    value={selectedWorkoutId}
                    onChange={(e) => setSelectedWorkoutId(e.target.value)}
                    disabled={phase !== 'idle' && phase !== 'finished'}
                    className={styles.select}
                >
                    {workoutOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {phase === 'idle' || phase === 'finished' ? (
                     <button onClick={startWorkout} className={`${styles.button} ${styles.primary}`}>开始训练</button>
                ) : (
                     <button onClick={reset} className={`${styles.button} ${styles.danger}`}>重置/选择其他</button>
                )}
            </div>

            {/* Timer Display */}
            {(phase !== 'idle' && phase !== 'finished') && (
                <div className={`${styles.card} ${styles.timerCard}`}>
                    <h2>{exerciseName}</h2>
                    <div className={styles.timerDisplay}>{formatTime(currentTime)}</div>
                    <div className={styles.timerStatus}>{statusText}</div>

                    {/* Progress Bar */}
                    <div className={styles.progressContainer}>
                        <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>
                    </div>

                    {/* Controls */}
                    <div className={styles.controls}>
                        <button onClick={isPaused ? resume : pause} className={styles.button}>
                            {isPaused ? '继续' : '暂停'}
                        </button>
                        <button onClick={skip} className={styles.button}>跳过</button>
                    </div>
                </div>
            )}

             {/* Exercise List (Optional Enhancement) */}
             {/* You could add a component here to display the full exercise list */}

            {/* Check-in System */}
            <div className={styles.card}>
                <h2>训练打卡</h2>
                <Calendar completedDates={completedDates} />
                <h3>最近记录</h3>
                <ul className={styles.historyList}>
                    {recentHistory.length > 0 ? (
                        recentHistory.map((entry, index) => (
                            <li key={index}>{entry.date}: {entry.workout}</li>
                        ))
                    ) : (
            
