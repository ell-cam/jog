/**
 * Summary: logic for interacting with local storage
 *
 * Authors:
 *  Rishi Bidani
 */

import storageAvailable from "./storageexists.js";

if (!storageAvailable("localStorage")) {
    alert("This browser does not support local storage");
    throw new Error("This browser does not support local storage");
}

export default class Storage {

    static BACKLOG_KEY = "backlog";

    static getItem(key) {
        return localStorage.getItem(key);
    }

    static setItem(key, value) {
        localStorage.setItem(key, value);
    }

    static getBacklog() {
        return JSON.parse(localStorage.getItem(this.BACKLOG_KEY));
    }

    static getTask(taskID) {
        const backlog = JSON.parse(localStorage.getItem(this.BACKLOG_KEY));
        return backlog.find(task => task.id === taskID);
    }

    static getTasksForSprint(sprintName) {
        const backlog = JSON.parse(localStorage.getItem(this.BACKLOG_KEY));
        // iterate through all the tasks and return the tasks with backlog == sprintName
        return backlog.filter(task => task.backlog === sprintName);
    }

    static addTask(task) {
        const backlog = JSON.parse(localStorage.getItem(this.BACKLOG_KEY)) || [];
        console.log(this.BACKLOG_KEY);
        backlog.push(task);
        localStorage.setItem(this.BACKLOG_KEY, JSON.stringify(backlog));
    }

    static updateTask(task) {
        console.log("Task received in storage: ", task);
        const backlog = JSON.parse(localStorage.getItem(this.BACKLOG_KEY));
        // remove the old task and add the new task
        const newBacklog = backlog.filter(t => t.id != task.id);
        newBacklog.push(task);
        localStorage.setItem(this.BACKLOG_KEY, JSON.stringify(newBacklog));
    }

    static removeTask(taskID) {
        const backlog = JSON.parse(localStorage.getItem(this.BACKLOG_KEY));
        const newBacklog = backlog.filter(task => task.id !== taskID);
        localStorage.setItem(this.BACKLOG_KEY, JSON.stringify(newBacklog));
    }

    static doesKeyExist(key) {
        return localStorage.getItem(key) !== null;
    }

    /**
     * Sprint stuff
     */

    static SPRINTS_KEY = "sprints";

    static getSprints() {
        return JSON.parse(localStorage.getItem(this.SPRINTS_KEY)) || [];
    }

    static addSprint(sprint) {
        const newSprint = {
            startDate: sprint.startDate,
            endDate: sprint.endDate,
        }
        const sprints = JSON.parse(localStorage.getItem(this.SPRINTS_KEY)) || {};
        sprints[sprint.name] = newSprint;
        console.log(sprints)
        localStorage.setItem(this.SPRINTS_KEY, JSON.stringify(sprints));
    }

    static highestSprintNumber() {
        const sprints = JSON.parse(localStorage.getItem(this.SPRINTS_KEY));
        if (sprints === null) {
            return 0;
        }
        const sprintNumbers = Object.keys(sprints).map(key => key.split("-")[1]);
        return Math.max(...sprintNumbers);
    }

    static getSprint(sprintName) {
        const sprints = JSON.parse(localStorage.getItem(this.SPRINTS_KEY));
        return sprints[sprintName];
    }

    // People stuff

    static PEOPLE_KEY = "people";
    static getPeople() {
        if (!this.doesKeyExist(this.PEOPLE_KEY)) {
            return null;
        }
        else {
            return JSON.parse(localStorage.getItem(this.PEOPLE_KEY));
        }
    }

    static addPerson(person) {
        const people = JSON.parse(localStorage.getItem(this.PEOPLE_KEY)) || [];
        if (!this.doesPersonExist(person)) {
            people.push(person);
            localStorage.setItem(this.PEOPLE_KEY, JSON.stringify(people));
            return true
        } else {
            // console.log("Person already exists");
            return false
        }
    }

    static doesPersonExist(person) {
        const people = JSON.parse(localStorage.getItem(this.PEOPLE_KEY)) || [];
        return people.some(p => p.name === person.name);
    }

}