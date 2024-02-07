/**
 * Summary: This file contains code used to control the new task modal. The modal intialises task creation, task description, 
 * priority details and other information. This is collected with a task form and submission system
 * 
 * Authors: 
 *  Rishi Bidani
 *  Chris Patrick 
 *  Marcus Wei
 */

import Tags from "../tag.js";
import Task from "./task.js";
import People from "../person/people.js";
import Storage from "../storage/storage.js";
import TaskCard from "./task-card.js";
import { organiseTasks } from "../helper/utilities.js"

const dialog = document.querySelector("dialog.modal__newtask");
const showDialogButton = document.querySelector(".add-task-btn");
const taskForm = document.querySelector("dialog.modal__newtask form");
const prioritySelectors = document.querySelectorAll("dialog.modal__newtask .priority");
const submitButton = document.querySelector(".modal__newtask .submit");

let taskTags = new Tags();

showDialogButton.addEventListener("click", () => {
    submitButton.textContent = "Create";
    // default due date is today
    const today = new Date();
    const dueDateInput = document.querySelector(".newtask-duedate");
    dueDateInput.value = today.toISOString().split("T")[0];

    // Setup the backlog options from localstorage
    const backlogSelect = document.querySelector("select.newtask-backlog-select");
    const sprintLogos = document.querySelectorAll(".sprints-container a.logo__sprint");
    let backlogOptions = [...sprintLogos].map((item) => {
        return item.dataset.sprint;
    });

    backlogSelect.innerHTML = `<option value="product-backlog">Product Backlog</option>`;
    backlogOptions.forEach((backlog) => {
        const option = document.createElement("option");
        option.value = backlog;
        option.textContent = backlog;
        backlogSelect.append(option);
    })

    dialog.showModal();
});
taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const taskData = getFormDetails();
    const activeSprint = document.querySelector(".sprint-active");

    if (submitButton.textContent === "update") {
        // ProductBacklog.editTask(globalTaskId, taskData);
        const newTask = new Task(...Object.values(taskData));
        // newTask.id = globalTaskId;
        const replaceID = document.querySelector(".modal__newtask").getAttribute("data-taskid");
        newTask.id = replaceID;
        console.log(newTask)
        Storage.updateTask(newTask)

        // update the task card data properties
        const taskCard = document.querySelector(`task-card[data-id="${replaceID}"]`);
        taskCard.dataset.status = taskData.status;
        taskCard.dataset.priority = newTask.priority;
        taskCard.dataset.assignee = newTask.assigneeId;
        taskCard.dataset.backlog = newTask.backlog;

        // Update the people cards to reflect the number of tasks assigned to them
        People.updatePeopleCards();

        reRenderTaskCards()

        const activeSprint = document.querySelector(".sprint-active");
        console.log(activeSprint)
        if (activeSprint.dataset.sprint) {
            organiseTasks()
        }
    } else {
        const task = new Task(...Object.values(taskData));
        Storage.addTask(task);

        const sprintId = activeSprint.id || activeSprint.dataset.sprint

        if (taskData.backlog == sprintId) {
            // Create task card
            const main = document.querySelector("section.main");
            const taskCard = new TaskCard(task);
            // Add task card to the DOM
            main.append(taskCard);
        }

    }
    resetEntireForm();
    dialog.close();
});
taskForm.addEventListener("keypress", (e) => {
    // prevent default for enter
    if (e.key === "Enter") {
        e.preventDefault();
    }
});

let priority = 0;
prioritySelectors.forEach((prioritySelector, index) => {
    prioritySelector.addEventListener("click", (e) => {
        priority = prioritySelectors.length - index;
        prioritySelectors.forEach((prioritySelector) => {
            prioritySelector.classList.remove("active-priority");
        });
        e.target.classList.add("active-priority");
    });
});

const tagInput = document.querySelector("input.newtask-tags");
const tagContainer = document.querySelector(".tags-container");
const mainTitle = document.querySelector(".modal__newtask-main-title");

tagInput.addEventListener("keyup", (e) => handleEnterForTags(e));

function handleEnterForTags(event) {
    event.preventDefault();
    if (event.key === "Enter") {
        // add tag to the list if it does not exist
        const tag = event.target.value;
        if (tag.length > 0) {
            if (Tags.doesNotInclude(tag)) {
                Tags.addTag(tag);
            }
            // create tag element
            addTag(tag);
            tagInput.classList.remove("tag-input-error");
        } else {
            console.error("Tag cannot be empty");
            tagInput.classList.add("tag-input-error");
        }
        // clear input
        event.target.value = "";
    }
}

function addTag(tag) {
    // create tag element
    const tagElement = Object.assign(document.createElement("span"), {
        className: "tag",
        textContent: tag.toUpperCase(),
    });
    if (!taskTags.inDisplayedTags(tag)) {
        tagContainer.append(tagElement);
        taskTags.addToDisplayedTags(tag);
    }
}

function resetEntireForm() {
    taskForm.reset();
    tagContainer.innerHTML = "";
    prioritySelectors.forEach((prioritySelector) => {
        prioritySelector.classList.remove("active-priority");
    });
    priority = 0;
    mainTitle.textContent = "";
    document.querySelector(".timetrack-container").innerHTML = /*html*/ `
        <div class="input-container flex gap-1">
            <input type="date" name="timetrack" id="timetrack">
            <input type="text" name="timeamount" id="timeamount"
                placeholder="1h 30m">
        </div>
    `;
}

const modalBackdrop = document.querySelector("dialog.modal__newtask");
modalBackdrop.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) {
        resetEntireForm();
        dialog.close();
    }
});


function reRenderTaskCards() {
    /**
 * Reload all the task cards when the modal closes
 */
    const taskCards = document.querySelectorAll("task-card");
    taskCards.forEach((taskCard) => {
        taskCard.render();
    })
}

dialog.addEventListener("close", () => reRenderTaskCards());

function getFormDetails() {
    let assigneeId = "";
    // ===================== Get values of the form =====================
    const title = document.querySelector(".modal__newtask-main-title").textContent;
    const description = document.querySelector("dialog.modal__newtask .newtask-description").value;
    const tags = taskTags.displayedTags;
    const deadline = document.querySelector("dialog.modal__newtask .newtask-duedate").value;
    const points = document.querySelector("dialog.modal__newtask .newtask-points-select").value;
    const assignee = document.querySelector("dialog.modal__newtask .newtask-assignee").value;
    const backlog = document.querySelector("dialog.modal__newtask .newtask-backlog-select").value;
    const taskStatus = document.querySelector("dialog.modal__newtask .status-btn input:checked");
    const taskType = document.querySelector("dialog.modal__newtask .radio-button input:checked").value;
    const timeTrackerElements = document.querySelectorAll(".timetrack-container .input-container");
    // ===================================================================

    // if the status is null then the default status is open
    const status = taskStatus ? taskStatus.value : "open";

    // If assignee is not empty, get the id of the assignee
    if (assignee !== "") {
        const personDataList = document.querySelectorAll("datalist#assignee option");
        assigneeId = [...personDataList].find((node) => node.value === assignee).id;
    }

    // Convert time tracker elements to an array of objects
    const trackedTime = Object.assign([], [...timeTrackerElements].map((element) => {
        const key = element.querySelector("#timetrack").value;
        const value = element.querySelector("#timeamount").value;
        return { [key]: value };
    }));

    const data = {
        title,
        description,
        tags,
        taskType,
        status,
        deadline,
        priority,
        assigneeId,
        points,
        trackedTime,
        backlog
    };
    return data;
}

const newTimeTrackButton = document.querySelector(".newtask-add-time");
newTimeTrackButton.addEventListener("click", (e) => {
    addTimeTrackRow();
});

function addTimeTrackRow(trackedDate = null, trackedTime = null) {
    /**
     * This function adds a new row to the time tracker
     * @param {string} trackedDate: Entered date
     * @param {string} trackedTime: Entered time
     */
    const timeTrackContainer = Object.assign(document.createElement("div"), {
        className: "input-container flex gap-1",
    });
    const timeTrackInputDate = Object.assign(document.createElement("input"), {
        id: "timetrack",
        type: "date",
        value: trackedDate,
    });
    const timeTrackInputTime = Object.assign(document.createElement("input"), {
        id: "timeamount",
        type: "text",
        placeholder: "1h 30m",
        value: trackedTime,
    });

    timeTrackContainer.append(timeTrackInputDate, timeTrackInputTime);
    document.querySelector(".timetrack-container").append(timeTrackContainer);
}

function editModal(taskId) {
    const task = Storage.getTask(taskId);
    const { title, points, description, tags, deadline, priority, assigneeId, status, taskType, trackedTime, backlog } = task;
    const assignee = People.find(assigneeId);
    const assigneeName = assignee ? assignee.name : "";

    // form selectors
    const titleInput = document.querySelector(".modal__newtask-main-title");
    const descriptionInput = document.querySelector("dialog.modal__newtask .newtask-description");
    const pointsInput = document.querySelector("dialog.modal__newtask .newtask-points-select");
    const assigneeInput = document.querySelector("dialog.modal__newtask .newtask-assignee");
    const backlogInput = document.querySelector("dialog.modal__newtask .newtask-backlog-select");
    const statusInput = document.querySelectorAll("dialog.modal__newtask .status-btn input[name='status']");
    const taskTypeInput = document.querySelectorAll("dialog.modal__newtask .radio-button input[name='newtask-type']");
    const dueDateInput = document.querySelector("dialog.modal__newtask .newtask-duedate");
    const prioritySelectors = document.querySelectorAll(".priority");

    submitButton.textContent = "update";

    // set the options for backlogInput
    // get the number of sprints
    const sprints = Storage.getSprints();
    const sprintsCount = Object.keys(sprints).length;
    backlogInput.innerHTML = `<option value="product-backlog">Product Backlog</option>`;
    for (let i = 1; i <= sprintsCount; i++) {
        const option = Object.assign(
            document.createElement("option"),
            {
                value: `sprint-${i}`,
                textContent: `Sprint ${i}`,
            }
        )
        backlogInput.append(option);
    }

    // set values of the form
    console.log(status)
    titleInput.textContent = title;
    descriptionInput.value = description;
    pointsInput.value = points;
    assigneeInput.value = assigneeName;
    backlogInput.value = backlog;
    dueDateInput.value = deadline;
    // Set the status
    [...statusInput].forEach((input) => {
        if (input.value === status) {
            input.checked = true;
        }
    });
    // set the task type
    [...taskTypeInput].forEach((input) => {
        if (input.value === taskType) {
            input.checked = true;
        }
    })

    // set priority
    prioritySelectors.forEach((prioritySelector) => {
        prioritySelector.classList.remove("active-priority");
    });
    for (let i = 0; i < priority; i++) {
        prioritySelectors[prioritySelectors.length - 1 - i].classList.add(
            "active-priority"
        );
    }

    // set the tags of the task
    tagContainer.innerHTML = "";
    taskTags.setTags([]); // reset the tagss
    tags.forEach(tag => addTag(tag));

    // set the time tracker
    document.querySelector(".timetrack-container").innerHTML = "";
    trackedTime.forEach(item => {
        const [date, time] = Object.entries(item)[0];
        if (date && time) {
            console.log(date, time);
            addTimeTrackRow(date, time);
        }
    })


    console.log(task)
    dialog.showModal();
}

export { editModal };
