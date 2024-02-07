/**
 * Summary: Defines Backlog class
 *
 * Authors:
 *  Rishi Bidani
 *  Chris Patrick
 */

import TaskCard from "./task/task-card.js";
import People from "./person/people.js";

const main = document.querySelector("section.main");

class Backlog {
    tasks = [];

    addTask(task) {
        // add to backlog
        this.tasks.push(task);

        // add to UI
        const card = new TaskCard(task);
        main.append(card);

        // add to person
        if (task.assigneeId !== "") {
            const person = People.find(task.assigneeId);
            person.addTask(task.id);
        }
    }

    deleteTask(task) {
        for (var i = 0; i < this.tasks.length; i++) {
            if (this.tasks[i].id === task.id) {
                this.tasks.splice(i, 1);
            }
        }
    }

    find(taskId) {
        return this.tasks.find((task) => taskId === task.id);
    }

    editTask(taskId, taskDetails) {
        let task = this.find(taskId);

        // add to person
        if (task.assigneeId !== "") {
            const person = People.find(task.assigneeId);
            person.removeTask(task.id);
        }
        if (taskDetails.assigneeId !== "") {
            const person = People.find(taskDetails.assigneeId);
            person.addTask(taskId);
        }

        task.editTask(taskDetails);
        const taskCard = document.querySelector(`#${task.id}`);
        taskCard.updateTaskCard(task);
    }
}

export default Backlog;
