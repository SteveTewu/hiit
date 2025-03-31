document.addEventListener('DOMContentLoaded', function() {
    // 训练数据
    const workouts = {
        monday: {
            name: "周一：全身HIIT",
            warmup: 300, // 5分钟热身
            exercises: [
                {name: "高抬腿跑", work: 30, rest: 30},
                {name: "俯卧撑", work: 30, rest: 30},
                {name: "深蹲跳", work: 30, rest: 30},
                {name: "平板支撑转体", work: 30, rest: 30},
                {name: "登山者", work: 30, rest: 30}
            ],
            sets: 4,
            cooldown: 300 // 5分钟放松
        },
        wednesday: {
            name: "周三：下半身HIIT",
            warmup: 300,
            exercises: [
                {name: "箭步蹲", work: 40, rest: 20},
                {name: "臀桥", work: 40, rest: 20},
                {name: "深蹲", work: 40, rest: 20},
                {name: "弓步跳", work: 40, rest: 20},
                {name: "侧向箭步蹲", work: 40, rest: 20}
            ],
            sets: 4,
            cooldown: 300
        },
        friday: {
            name: "周五：上半身和核心HIIT",
            warmup: 300,
            exercises: [
                {name: "交替俯卧撑", work: 30, rest: 30},
                {name: "三头肌撑", work: 30, rest: 30},
                {name: "平板支撑", work: 30, rest: 30},
                {name: "卷腹", work: 30, rest: 30},
                {name: "超人式", work: 30, rest: 30}
            ],
            sets: 4,
            cooldown: 300
        },
        sunday: {
            name: "周日：心肺HIIT",
            warmup: 300,
            exercises: [
                {name: "波比跳", work: 20, rest: 10},
                {name: "大跳步", work: 20, rest: 10},
                {name: "开合跳", work: 20, rest: 10},
                {name: "高强度深蹲", work: 20, rest: 10}
            ],
            sets: 8,
            cooldown: 300
        }
    };

    // DOM元素
    const startButton = document.getElementById('start-workout');
    const workoutDaySelect = document.getElementById('workout-day');
    const timerSection = document.getElementById('timer-section');
    const exerciseNameElement = document.getElementById('exercise-name');
    const timerElement = document.getElementById('timer');
    const timerStatusElement = document.getElementById('timer-status');
    const progressBar = document.getElementById('progress-bar');
    const nextExerciseElement = document.getElementById('next-exercise');
    const nextExerciseContainer = document.getElementById('next-exercise-container');
    const exerciseListElement = document.getElementById('exercises');
    const pauseResumeButton = document.getElementById('pause-resume');
    const skipButton = document.getElementById('skip');
    const restartButton = document.getElementById('restart');
    const workoutHistoryElement = document.getElementById('workout-history');
    const calendarElement = document.getElementById('calendar');

    // 计时器变量
    let timer;
    let currentTime;
    let currentExerciseIndex = 0;
    let currentSet = 1;
    let isPaused = false;
    let currentWorkout;
    let timerPhase = 'warmup'; // 'warmup', 'work', 'rest', 'cooldown'
    let flattenedExercises = [];

    // 初始化日历
    initCalendar();
    loadWorkoutHistory();

    // 开始训练按钮
    startButton.addEventListener('click', function() {
        const selectedDay = workoutDaySelect.value;
        currentWorkout = workouts[selectedDay];
        
        // 展示计时器部分
        timerSection.style.display = 'block';
        
        // 生成扁平化的练习列表（包括所有组）
        flattenedExercises = [];
        for (let set = 1; set <= currentWorkout.sets; set++) {
            currentWorkout.exercises.forEach(exercise => {
                flattenedExercises.push({
                    ...exercise,
                    set: set,
                    phase: 'work'
                });
                flattenedExercises.push({
                    name: `休息`,
                    time: exercise.rest,
                    set: set,
                    phase: 'rest'
                });
            });
        }
        
        // 生成练习列表
        generateExerciseList();
        
        // 开始热身
        startWarmup();
    });

    // 暂停/继续按钮
    pauseResumeButton.addEventListener('click', function() {
        if (isPaused) {
            resumeTimer();
        } else {
            pauseTimer();
        }
    });

    // 跳过按钮
    skipButton.addEventListener('click', function() {
        clearInterval(timer);
        nextPhase();
    });

    // 重新开始按钮
    restartButton.addEventListener('click', function() {
        clearInterval(timer);
        startWarmup();
    });

    // 开始热身
    function startWarmup() {
        clearExerciseHighlights();
        timerPhase = 'warmup';
        currentExerciseIndex = 0;
        currentSet = 1;
        isPaused = false;
        pauseResumeButton.textContent = '暂停';
        
        exerciseNameElement.textContent = '热身';
        timerStatusElement.textContent = '准备活动';
        nextExerciseContainer.style.display = 'block';
        nextExerciseElement.textContent = currentWorkout.ex
