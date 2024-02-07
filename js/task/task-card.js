/**
 * The <task-card> element will have the following attributes:
 * - data-id: the id of the task
 * - data-priority: the priority of the task
 * - data-status: the status of the task
 * Summary: This file contains code used to create and control task cards. It handles priority with the option for 
 * editing from task card view, task colours for tags and status, shows time tracked and deadline, and expands the 
 * task view when the sidebar is collapsed
 * 
 * Authors: 
 *  Rishi Bidani
 *  Chris Patrick 
 */

import Storage from "../storage/storage.js";
import {
    stringTimeToMinutes,
    minutesToHoursAndMinutes,
    formatDate,
    organiseTasks,
} from "../helper/utilities.js";
import { STATUS } from "../helper/enums.js"
import { editModal } from "./modal-task.js";
import People from "../person/people.js";

const template = document.querySelector("template#task-card");
const sidebar = document.querySelector(".sidebar");

export default class TaskCard extends HTMLElement {
    constructor(task) {
        super();
        this.task = task;
        this.setAttribute("data-id", task.id);
        this.setAttribute("data-priority", task.priority);
        this.setAttribute("data-status", task.status);
        this.setAttribute("data-assignee", task.assigneeId);
        this.setAttribute("data-backlog", task.backlog)

        this.taskProperties()
        this.openModalOnClick()

    }

    taskProperties() {
        // Update all the properties for the task
        this.task = Storage.getTask(this.id);

        // Get the attribute values
        this.id = this.getAttribute("data-id");
        this.priority = this.getAttribute("data-priority");
        this.status = this.getAttribute("data-status");
        this.assignee = this.getAttribute("data-assignee");
        this.backlog = this.getAttribute("data-backlog");

    }

    render() {
        this.taskProperties();
        // Select the elements
        const card = this.querySelector(".task-card");
        const cardTitle = card.querySelector(".task-title");

        // Set the status colour
        const cardStatus = card.querySelector(".task-status");
        cardStatus.setAttribute("data-status", this.status);

        // Set the priority
        const cardPriority = card.querySelectorAll(".task-card .priority");
        for (let i = 0; i < this.task.priority; i++) {
            cardPriority[cardPriority.length - 1 - i].classList.add(
                "active-priority"
            );
        }
        cardPriority.forEach((prioritySelector, index) => {
            prioritySelector.addEventListener("click", (e) => {
                e.stopPropagation();
                this.priority = cardPriority.length - index;
                cardPriority.forEach((prioritySelector) => {
                    prioritySelector.classList.remove("active-priority");
                });
                e.target.classList.add("active-priority");

                // Update the attribute
                this.setAttribute("data-priority", this.priority);
            });
        })

        // Get the task with provided ID
        const task = Storage.getTask(this.id);
        const { title, priority } = task;

        // Set the values
        cardTitle.textContent = title;

        // set deadline
        const expandedView = sidebar.classList.contains("closed");
        card.querySelector(".task-deadline").textContent = formatDate(
            this.task.deadline, expandedView ? "dd/MM/yyyy" : "dd/MM");

        // Get the initials of the assignee
        const assignee = People.find(this.assignee);
        if (assignee) {
            const assigneeName = assignee.name;
            const assigneeInitials = assigneeName.split(" ").slice(0, 2).map((name) => name[0]).join("");
            card.querySelector(".task-assignee").textContent = assigneeInitials;
        }

        const timeTrackedContainer = card.querySelector(".task-time-tracked__content");
        const trackedTime = this.task.trackedTime.filter(item => {
            const [date, time] = Object.entries(item)[0];
            return date && time;
        })

        if (trackedTime.length > 0) {
            const totalTrackedMinutes = trackedTime.reduce((acc, tracked) => {
                const [date, time] = Object.entries(tracked)[0];
                return acc + stringTimeToMinutes(time);
            }, 0)
            const { hours, minutes } = minutesToHoursAndMinutes(totalTrackedMinutes);
            timeTrackedContainer.textContent = `${hours}h ${minutes}m`;
        }

        // allow user to click next button to change status
        const forwardIcon = card.querySelector('.task-finished-icon');
        if (forwardIcon) {
            forwardIcon.addEventListener('click', (e) => {
                e.stopPropagation()
                e.stopImmediatePropagation()
                if (this.status == STATUS.open) {
                    this.setAttribute("data-status", STATUS.inProgress);
                } else if (this.status == STATUS.inProgress) {
                    this.setAttribute("data-status", STATUS.closed);
                }
                organiseTasks()
            })
        }

        // remove next status icon if status == complete, else add status icon
        const icon = card.querySelector(".task-finished-icon");
        if (this.status == STATUS.closed && this.backlog != "product-backlog") {
            icon.textContent = "";
        } else if (this.status != STATUS.closed && this.backlog != "product-backlog") {
            icon.textContent = "forward";
        }

    }
    // Lifecycle method
    connectedCallback() {
        const card = document.importNode(template.content, true);
        const trashImg = Object.assign(document.createElement("img"), {
            src: "../../assets/delete.svg",
            alt: "delete task",
        })

        // const trashImg

        if (this.backlog == "product-backlog") {
            // Then replace the tick mark with the delete icon
            const icon = card.querySelector(".task-card-icon");
            icon.innerHTML = "";
            icon.append(trashImg);
            icon.addEventListener("click", (e) => {
                e.stopPropagation();
                if (window.confirm("Are you sure you want to delete this task?")) {
                    Storage.removeTask(this.id);
                    this.remove();
                } else {
                    return;
                }
            })

        }

        this.appendChild(card);
        this.render()
    }
    // Getter for lifecycle method
    static get observedAttributes() {
        return ["data-id", "data-priority", "data-status", "data-assignee", "data-backlog"];
    }
    // Lifecycle method
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue != newValue && newValue != null && oldValue != null) {
            this.taskProperties();
            this.task.priority = this.priority;
            this.task.status = this.status;
            this.task.assignee = this.assignee;

            // Update the task
            Storage.updateTask(this.task);
        }

        if (name === "data-backlog" && oldValue != newValue && newValue) {
            // remove the task from the dom
            this.remove();
        }
    }

    openModalOnClick() {
        this.addEventListener("click", () => {
            const modal = document.querySelector(".modal__newtask");
            modal.setAttribute("data-taskid", this.id);
            editModal(this.id);
        })
    }
}

window.customElements.define("task-card", TaskCard);
