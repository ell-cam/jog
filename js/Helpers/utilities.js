/**
 * Summary: defines commonly used helper functions for use throughout the project
 *
 * Authors:
 *  Rishi Bidani
 *  Chris Patrick
 */

function IDGenerator() {
    // GENERATES UNIQUE ID
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const letter1 = alphabet[Math.floor(Math.random() * alphabet.length)];
    const letter2 = alphabet[Math.floor(Math.random() * alphabet.length)];
    const letter3 = alphabet[Math.floor(Math.random() * alphabet.length)];

    return letter1 + letter2 + letter3 + Date.now();
}

function camelToTitle(string) {
    let captialisedString = string.charAt(0).toUpperCase() + string.slice(1);
    return captialisedString
        .replace(/([A-Z]+)/g, " $1")
        .replace(/([A-Z][a-z])/g, " $1");
}

function camelToKebab(inputString) {
    return inputString
        .split("")
        .map((character) => {
            if (character == character.toUpperCase()) {
                return "-" + character.toLowerCase();
            } else {
                return character;
            }
        })
        .join("");
}

const defaultTags = ["Core", "UI", "Testing"];

function stringTimeToMinutes(stringTime) {
    const hours = stringTime.match(/\d+h/gm);
    const minutes = stringTime.match(/\d+m/gm);
    const hoursToMinutes = hours ? parseInt(hours[0]) * 60 : 0;
    const minutesToMinutes = minutes ? parseInt(minutes[0]) : 0;
    return hoursToMinutes + minutesToMinutes;
}

function minutesToHoursAndMinutes(minutes) {
    var hours = minutes / 60;
    var integer_hours = Math.floor(hours);
    var minutes = (hours - integer_hours) * 60;
    var integer_minutes = Math.round(minutes);
    return {
        hours: integer_hours,
        minutes: integer_minutes,
    };
}

function formatDate(inputDate, format) {
    const date = new Date(inputDate);

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    format = format.replace("dd", day.toString().padStart(2, "0"));

    format = format.replace("MM", month.toString().padStart(2, "0"));

    if (format.includes("yyyy")) {
        format = format.replace("yyyy", year.toString());
    } else if (format.includes("yy")) {
        format = format.replace("yy", year.toString().slice(-2));
    }

    return format;
}

function clearDashboard() {
    // remove task cards
    const main = document.querySelector("section.main");
    const taskCards = main.querySelectorAll("task-card");
    taskCards.forEach((node) => {
        main.removeChild(node);
    });

    // remove status titles
    const taskTypeTitles = main.querySelectorAll(".task-type-title");
    taskTypeTitles.forEach((node) => {
        main.removeChild(node);
    });
}

function organiseTasks() {
    const main = document.querySelector("section.main");
    const tasks = {
        open: [],
        "in-progress": [],
        closed: []
    }
    // get all the task cards
    const taskCards = document.querySelectorAll("task-card");
    clearDashboard()
    // remove the task type titles
    const taskTypeTitles = document.querySelectorAll(".task-type-title");
    taskTypeTitles.forEach((title) => title.remove());

    for (const taskCard of taskCards) {
        tasks[taskCard.dataset.status].push(taskCard);
    }

    if (tasks.open.length > 0) {
        const title = Object.assign(document.createElement("h2"), {
            className: "task-type-title",
            textContent: "Open",
            style: "background-color: var(--blue-primary);",
        })
        main.append(title);
        for (const task of tasks.open) {
            main.append(task);
            const articleTagsInsideTaskCard = task.querySelectorAll("article.task-card");
            // remove the last article tag if there are 2
            if (articleTagsInsideTaskCard.length > 1) {
                articleTagsInsideTaskCard[1].remove();
            }
        }
    }

    if (tasks["in-progress"].length > 0) {
        const title = Object.assign(document.createElement("h2"), {
            className: "task-type-title",
            textContent: "In Progress",
            style: "background-color: var(--orange-primary);",
        })
        main.append(title);
        for (const task of tasks["in-progress"]) {
            main.append(task);
            const articleTagsInsideTaskCard = task.querySelectorAll("article.task-card");
            // remove the last article tag if there are 2
            if (articleTagsInsideTaskCard.length > 1) {
                articleTagsInsideTaskCard[1].remove();
            }

        }
    }

    if (tasks.closed.length > 0) {
        const title = Object.assign(document.createElement("h2"), {
            className: "task-type-title",
            textContent: "Closed",
            style: "background-color: var(--green-primary);",
        })
        main.append(title);
        for (const task of tasks.closed) {
            main.append(task);
            const articleTagsInsideTaskCard = task.querySelectorAll("article.task-card");
            // remove the last article tag if there are 2
            if (articleTagsInsideTaskCard.length > 1) {
                articleTagsInsideTaskCard[1].remove();
            }
        }
    }
}

export {
    IDGenerator,
    camelToTitle,
    camelToKebab,
    stringTimeToMinutes,
    minutesToHoursAndMinutes,
    formatDate,
    clearDashboard,
    organiseTasks,
    defaultTags,
};
