/**
 * Summary: defines custom HTML element that is responsible the displaying and 
 *          logic of person cards.
 * 
 * Authors:
 *  Rishi Bidani
 *  Chris Patrick
 */

import People from "./people.js";
import TaskCard from '../task/task-card.js';
import { clearDashboard } from "../helper/utilities.js";
import Storage from "../storage/storage.js";

const template = document.querySelector("template#person-card");
const main = document.querySelector("section.main");

//adding email to person constructor 
export default class PersonCard extends HTMLElement {
    constructor(person) {
        super();
        this.id = person.id;
        this.name = person.name;
        this.taskCount = person.tasks.length;
        this.position = person.position;
        this.email = person.email; //email add
    }
    connectedCallback() {
        const card = document.importNode(template.content, true);
        card.querySelector(".person-card").onclick = () => {
            this.displayTasksForPerson()
        };
        this.setComponentValues(card)
        this.appendChild(card);
    }

    displayTasksForPerson() {
        clearDashboard()
        const person = People.find(this.id);
        console.log(person)
        // for (const taskId of person.tasks) {
        //     for (const backlog in Backlogs) {
        //         const task = Backlogs[backlog].find(taskId);
        //         if (typeof task !== "undefined") {
        //             const card = new TaskCard(task)
        //             main.append(card)
        //         }
        //     }
        // }
        const tasks = Storage.getBacklog().filter(task => {
            if (task.assigneeId === this.id) {
                return task;
            }
        });
        for (const task of tasks) {
            const card = new TaskCard(task)
            main.append(card)
        }


        document.querySelector("#dashboard-title").textContent = `${this.name}'s tasks`
    }

    updatePersonCard(person) {
        this.name = person.name;
        this.taskCount = person.tasks.length;
        this.position = person.position;
        this.setComponentValues(this);
    }

    setComponentValues(card) {
        card.querySelector(".person-name").textContent = this.name;
        card.querySelector(".tasks-number").textContent = this.taskCount;
        card.querySelector(".position").textContent = this.position;
    }
}

window.customElements.define("person-card", PersonCard);
