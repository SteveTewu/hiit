// src/components/Calendar.jsx
import React from 'react';
import styles from './Calendar.module.css'; // We'll create this CSS module

const Calendar = ({ completedDates }) => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday, 1 = Monday, ...

    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

    const days = [];
    // Add weekday headers
    weekdays.forEach(day => days.push(<div key={`header-${day}`} className={`${styles.day} ${styles.header}`}>{day}</div>));
    // Add empty cells for days before the 1st
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(<div key={`empty-${i}`} className={`${styles.day} ${styles.empty}`}></div>);
    }
    // Add day cells
    for (let i = 1; i <= daysInMonth; i++) {
        const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
        const isToday = i === today.getDate();
        const isCompleted = completedDates.includes(dateStr);

        days.push(
            <div
                key={i}
                className={`
                    ${styles.day}
                    ${isToday ? styles.today : ''}
                    ${isCompleted ? styles.completed : ''}
                `}
            >
                {i}
            </div>
        );
    }

    return (
        <div className={styles.calendarGrid}>
            {days}
        </div>
    );
};

export default Calendar;
