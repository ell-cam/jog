import Storage from "../storage/storage.js";

export default class SprintDetails {
    constructor(sprintName) {
        this.sprintName = sprintName;
    }

    get tasks() {
        // Get the tasks from local storage
        const tasks = Storage.getBacklog();
        // Filter the tasks to get the tasks for this sprint
        return tasks.filter(task => task.backlog === this.sprintName);
    }

    get timeSpent() {
        const time = this.tasks.map(item => {
            let { trackedTime } = item;
            // alter trackedTime to only return the items which have a date and time
            trackedTime = trackedTime.filter(item => {
                const [date, time] = Object.entries(item)[0];
                console.log(date, time)
                return date && time;
            });
            return trackedTime || []
        }).filter(item => item.length > 0).flat();
        console.log(time)


    }

    get totalPoints() {
        return this.tasks.reduce((acc, task) => Number(acc) + Number(task.points), 0);
    }
}

// const a = new SprintDetails("product-backlog");
// a.timeSpent;
// console.log(a.totalPoints)