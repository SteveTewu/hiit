// src/data/workouts.js
export const workouts = {
    monday: {
        id: 'monday',
        name: "周一：全身HIIT",
        warmup: 300, // 5分钟热身
        exercises: [
            { name: "高抬腿跑", work: 30, rest: 30 },
            { name: "俯卧撑", work: 30, rest: 30 },
            { name: "深蹲跳", work: 30, rest: 30 },
            { name: "平板支撑转体", work: 30, rest: 30 },
            { name: "登山者", work: 30, rest: 30 }
        ],
        sets: 4,
        cooldown: 300 // 5分钟放松
    },
    wednesday: {
        id: 'wednesday',
        name: "周三：下半身HIIT",
        warmup: 300,
        exercises: [
            { name: "箭步蹲", work: 40, rest: 20 },
            { name: "臀桥", work: 40, rest: 20 },
            { name: "深蹲", work: 40, rest: 20 },
            { name: "弓步跳", work: 40, rest: 20 },
            { name: "侧向箭步蹲", work: 40, rest: 20 }
        ],
        sets: 4,
        cooldown: 300
    },
    friday: {
        id: 'friday',
        name: "周五：上半身和核心HIIT",
        warmup: 300,
        exercises: [
            { name: "交替俯卧撑", work: 30, rest: 30 },
            { name: "三头肌撑", work: 30, rest: 30 },
            { name: "平板支撑", work: 30, rest: 30 },
            { name: "卷腹", work: 30, rest: 30 },
            { name: "超人式", work: 30, rest: 30 }
        ],
        sets: 4,
        cooldown: 300
    },
    sunday: {
        id: 'sunday',
        name: "周日：心肺HIIT",
        warmup: 300,
        exercises: [
            { name: "波比跳", work: 20, rest: 10 },
            { name: "大跳步", work: 20, rest: 10 },
            { name: "开合跳", work: 20, rest: 10 },
            { name: "高强度深蹲", work: 20, rest: 10 }
        ],
        sets: 8, // Tabata style often uses 8 rounds
        cooldown: 300
    }
};

export const workoutOptions = Object.values(workouts).map(w => ({ value: w.id, label: w.name }));
