import moment from 'moment';

// Process Data
export const processData = (data, muscle) => {

    const counts = {};
    const exerciseCounts = {}; // Track counts for each exercise_name

    const filteredEntries = data.filter((entry) => {
        switch (muscle) {
            case 'chest':
            case 'clavicular_head':
            case 'sternal_head':
            case 'abdominal_head':
            case 'lats':
            case 'back':
            case 'mid_back':
            case 'mid_traps':
            case 'rhomboids':
            case 'biceps':
            case 'triceps':
            case 'shoulder':
            case 'anterior_deltoids':
            case 'lateral_deltoids':
            case 'posterior_deltoids':
            case 'upper_traps':
            case 'quads':
            case 'hamstrings':
            case 'glutes':
            case 'adductors':
            case 'legs':
            case 'calves':
            case 'abdominals':
            case 'arms':
            case 'aerobics':
                return entry[muscle] === true;
            default:
                return true;
        }
    });

    filteredEntries.forEach((entry) => {
        const weekStart = moment(entry.date).startOf('isoWeek').format('YYYY-MM-DD');
        counts[weekStart] = (counts[weekStart] || 0) + 1;

        // Track counts for each exercise_name
        const exerciseName = entry.exercise_name || 'Unknown Exercise';
        exerciseCounts[weekStart] = exerciseCounts[weekStart] || [];
        const existingExercise = exerciseCounts[weekStart].find((exercise) => exercise.name === exerciseName);

        if (existingExercise) {
            existingExercise.count += 1;
        } else {
            exerciseCounts[weekStart].push({ name: exerciseName, count: 1 });
        }
    });

    const earliestWeek = moment(filteredEntries[0].date).startOf('isoWeek');
    const latestWeek = moment(filteredEntries[filteredEntries.length - 1].date).startOf('isoWeek');

    const allWeeks = [];
    let currentWeek = earliestWeek.clone();

    while (currentWeek.isSameOrBefore(latestWeek)) {
        allWeeks.push(currentWeek.format('YYYY-MM-DD'));
        currentWeek.add(1, 'week');
    }

    // Initialize data and exerciseData arrays with zeros for weeks with no workouts
    const dataArr = allWeeks.map(week => counts[week] || 0);
    const exerciseDataArr = allWeeks.map(week => exerciseCounts[week] || []);

    return { labels: allWeeks, data: dataArr, exerciseData: exerciseDataArr };
};
