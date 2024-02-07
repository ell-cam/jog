/**
 * Summary: This file contains code used to create and control task cards
 * 
 * Authors: 
 *  Rishi Bidani
 *  Chris Patrick 
 */

import { STATUS } from "../Helpers/enums.js";
import {
    stringTimeToMinutes,
    minutesToHoursAndMinutes,
    formatDate,
} from "../helpers/utilities.js";
import { editModal } from "./modal-task.js";
import People from '../person/people.js'
import Storage from "../storage/storage.js";

const template = document.querySelector("template#task-card");
const sidebar = document.querySelector(".sidebar");

export default class TaskCard extends HTMLElement {
    constructor(task) {
        super();
        this.id = task.id;
        this.task = task;

        sidebar.classList.contains("closed")
            ? this.expandedView = true
            : this.expandedView = false

    }
    connectedCallback() {
        const card = document.importNode(template.content, true);
        this.setComponentValues(card);
        this.handlePriority(card);
        this.appendChild(card);
    }

    updateTaskCard(task) {
        this.task = task;
        this.setComponentValues(this);
    }

    updateExpandedView(expanded) {
        this.expandedView = expanded;
        this.setComponentValues(this);
    }

    handlePriority(card) {
        const prioritySelectors = card.querySelectorAll(".task-card .priority");
        const Backlogs = Storage.getBacklog()

        prioritySelectors.forEach((prioritySelector, index) => {
            prioritySelector.addEventListener("click", (e) => {
                this.task.priority = prioritySelectors.length - index;
                prioritySelectors.forEach((prioritySelector) => {
                    prioritySelector.classList.remove("active-priority");
                });
                e.target.classList.add("active-priority");

                // update the value in the actual task
                const task = Backlogs.find((task) => task.id === this.id);
                task.priority = this.task.priority;
                Storage.updateTask(task);
            });
        });
    }

    setComponentValues(card) {
        // set title
        card.querySelector(".task-title").textContent = this.task.title;
        let colour = "";
        switch (this.task.status) {
            case STATUS.open:
                colour = "blue";
                break;
            case STATUS.inProgress:
                colour = "orange";
                break;
            case STATUS.closed:
                colour = "green";
                break;
            default:
                colour = "blue";
        }

        // set status
        card.querySelector(".task-status").classList.remove(
            "blue",
            "orange",
            "green"
        );
        card.querySelector(".task-status").classList.add(colour);

        // set priority
        const prioritySelectors = card.querySelectorAll(".task-card .priority");
        prioritySelectors.forEach((prioritySelector) => {
            prioritySelector.classList.remove("active-priority");
        });
        for (let i = 0; i < this.task.priority; i++) {
            prioritySelectors[prioritySelectors.length - 1 - i].classList.add(
                "active-priority"
            );
        }

        // set deadline
        if (this.expandedView == true) {
            card.querySelector(".task-deadline").textContent = formatDate(this.task.deadline, "dd/MM/yyyy");
        } else {
            card.querySelector(".task-deadline").textContent = formatDate(this.task.deadline, "dd/MM");
        }


        // set time tracked
        let total_minute_time = 0;
        for (const time of this.task.trackedTime) {
            total_minute_time += stringTimeToMinutes(Object.values(time)[0]);
        }
        let { hours, minutes } = minutesToHoursAndMinutes(total_minute_time);

        if (this.expandedView == true) {
            card.querySelector(".task-time-tracked__content").textContent = `${hours}hr ${minutes}min`
        } else {
            if (minutes >= 30) {
                hours += 1
            }
            card.querySelector(".task-time-tracked__content").textContent = `${hours}hr`
        }

        // set assignee
        // if (this.task.assigneeId) {
        //     const person = People.find(this.task.assigneeId)
        //     const names = person.name.split(' ')
        //     let initials = '';
        //     for (const name of names) {
        //         initials += name[0].toUpperCase()
        //     }
        //     card.querySelector(".task-assignee").textContent = initials
        // }


        card.querySelector(".task-card-main").onclick = (event) => {
            if (
                event.path[0].className === "task-title" ||
                event.path[0].className === "task-card-main"
            ) {
                editModal(this.id);
            }
        };
    }
}

window.customElements.define("task-card", TaskCard);
