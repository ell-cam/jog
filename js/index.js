import People from "./person/people.js";
import Person from "./person/person.js";
import PersonCard from "./person/person-card.js";
import TaskCard from "./task/task-card.js";
import Tags from "./tag.js";
import { clearDashboard, organiseTasks } from "./Helpers/utilities.js";
import Storage from "./storage/storage.js";
import storageAvailable from "./storage/storageexists.js";
// import Task from "./task/task.js";
import SprintDetails from "./graphs/sprintdetails.js";

if (!storageAvailable("localStorage")) {
    alert("This browser does not support local storage");
    throw new Error("This browser does not support local storage");
}


/**
 * ================================================================
 *                      Initialising backlogs
 * ================================================================
 */
if (!Storage.doesKeyExist("backlog")) {
    // Create the product backlog - if it doesn't exist in local storage
    Storage.setItem("backlog", JSON.stringify([]));
}

// ==================================================================

const main = document.querySelector("section.main");
const productBacklogButton = document.querySelector("#product-backlog");
productBacklogButton.addEventListener("click", () => {
    clearDashboard();

    // Clear dates
    const container = document.querySelector(".dates-container");
    if (container) {
        container.remove();
    }

    for (const task of Storage.getBacklog()) {
        if (task.backlog.startsWith("product")) {
            const card = new TaskCard(task);
            main.append(card);
        }
    }
    document.querySelector("#dashboard-title").textContent = "Product Backlog"

    // update the sprint-active class
    const activeSprint = document.querySelector(".sprint-active");
    if (activeSprint) {
        activeSprint.classList.remove("sprint-active");
    }
    productBacklogButton.classList.add("sprint-active");
});


/**
 * ===================================================================================
 *                                Create and add people
 * ===================================================================================
 */
const person1 = new Person("John Doe", "Junior Developer", false, "+380979797979");
const person2 = new Person("Jane", "Developer", false, "+380979797979");
const person3 = new Person("Jack", "Senior Developer", false, "+380979797979");

// Default people have constant ids
person1.id = "person1JohnDoe";
person2.id = "person2Jane";
person3.id = "person3Jack";

People.setPeople([person1, person2, person3]);
const teamContainer = document.querySelector(".team-container");

// Get people from local storage
const storedPeople = Storage.getPeople();
if (storedPeople) {
    for (const person of storedPeople) {
        const { id, name, position, isAdmin, phoneNumber, email } = person;
        People.addPerson(new Person(name, position, isAdmin, phoneNumber, email, id));
    }
}

console.log(People.getAll)

People.getAll.forEach((person) => {
    // Add person to sidebar
    const card = new PersonCard(person);
    teamContainer.append(card);

    // Add person to task datalist
    const personOption = Object.assign(document.createElement("option"), {
        value: person.name,
        id: person.id,
    });
    document.querySelector("#assignee").append(personOption);
});
// ===================================================================================


const tagsDatalist = document.querySelector("datalist#tags");
Tags.getAll.forEach((tag) => {
    const option = Object.assign(document.createElement("option"), {
        value: tag,
    });
    tagsDatalist.append(option);
});


// Extend prototype of html elements to make a setter for dataset
HTMLElement.prototype.setData = function (data) {
    for (const property in data) {
        this.setAttribute(`data-${property}`, data[property]);
    }
}

/**
 * ===================================================================================
 *                               Create and add sprints
 * ===================================================================================
 */
const addSprintButton = document.querySelector("a.add__new-sprint");
const sprintContainer = document.querySelector(".sprints-container");
let sprintNumber = 1;
function addNewSprintButton() {
    const sprintIcon = Object.assign(
        document.createElement("a"),
        {
            className: "nav-item nav-logo logo__sprint__text",
            href: "#",
        }
    )

    var colours = ["var(--red-sprint)", "var(--orange-sprint)", "var(--yellow-sprint)", "var(--green-sprint)", "var(--blue-sprint)", 
    "var(--beige-sprint)", "var(--lightorange-sprint)", "var(--lightyellow-sprint)", "var(--lightgreen-sprint)", "var(--lightblue-sprint)"]

    sprintIcon.setData({ sprint: `sprint-${sprintNumber}` });
    const sprintImage = Object.assign(
        document.createElement("div"),
        {
            className: "nav-item nav-logo logo__sprint",
            style: "background-color: " + colours[(sprintNumber-1)%10] + ";",
        }
    )
    
    sprintIcon.append(sprintImage);
    sprintContainer.append(sprintIcon);
    sprintIcon.addEventListener("click", function (e) { displaySprint(this, e) })
    sprintNumber++;
}


addSprintButton.addEventListener("click", () => {
    // More than 10 sprints is not allowed
    if (Storage.highestSprintNumber() > 9) {
        alert("You can't have more than 10 sprints");
        return;
    }
    addNewSprintButton();
    const sprint = {
        name: `sprint-${Storage.highestSprintNumber() + 1}`,
        startDate: new Date(),
        endDate: new Date(),
    }
    Storage.addSprint(sprint);
})

// Initialise sprint icons
const requiredNumberOfSprints = Storage.highestSprintNumber();
for (let i = 0; i < requiredNumberOfSprints; i++) {
    addNewSprintButton();
}

// ===================================================================================

/**
 * ===================================================================================
 *                              Display Sprints
 * ===================================================================================
 */

function displaySprint(self, event) {
    const sprintName = self.dataset.sprint;
    console.log(sprintName)
    const requiredSprint = Storage.getSprint(sprintName);
    clearDashboard();

    // Clear dates
    const container = document.querySelector(".dates-container");
    if (container) {
        container.remove();
    }

    // Add start and end dates input fields
    const startDateInput = Object.assign(document.createElement("input"), {
        type: "date",
        id: "start-date",
        value: requiredSprint.startDate || "",
    });
    const endDateInput = Object.assign(document.createElement("input"), {
        type: "date",
        id: "end-date",
        value: requiredSprint.endDate || "",
    });
    const startDateLabel = Object.assign(document.createElement("label"), {
        for: "start-date",
        textContent: "Start Date",
    });
    const endDateLabel = Object.assign(document.createElement("label"), {
        for: "end-date",
        textContent: "End Date",
    });
    const datesContainer = Object.assign(document.createElement("div"), {
        className: "dates-container",
    });
    startDateLabel.append(startDateInput);
    endDateLabel.append(endDateInput);
    datesContainer.append(startDateLabel, endDateLabel);
    main.append(datesContainer);

    // Add event listeners to start and end date inputs
    startDateInput.addEventListener("change", function (e) {
        const sprints = Storage.getSprints();
        const sprint = sprints[sprintName];
        sprint.startDate = this.value;
        Storage.setItem("sprints", JSON.stringify(sprints));
    })
    endDateInput.addEventListener("change", function (e) {
        const sprints = Storage.getSprints();
        const sprint = sprints[sprintName];
        sprint.endDate = this.value;
        Storage.setItem("sprints", JSON.stringify(sprints));
    })



    // Add tasks to dashboard
    const backlog = Storage.getBacklog();
    for (const task of backlog) {
        if (task.backlog === sprintName) {
            const card = new TaskCard(task);
            main.append(card);
        }
    }

    // update the dashboard title
    document.querySelector("#dashboard-title").textContent = sprintName;

    // update the sprint-active class
    const activeSprint = document.querySelector(".sprint-active");
    if (activeSprint) {
        activeSprint.classList.remove("sprint-active");
    }
    self.classList.add("sprint-active");

    organiseTasks()
}

const backlog = Storage.getBacklog();
for (const task of backlog) {
    if (task.backlog.startsWith("product")) {
        const card = new TaskCard(task);

        main.append(card);
    }
}
const productBacklogIcon = document.querySelector("#product-backlog");
productBacklogIcon.classList.add("sprint-active");

// ===================================================================================
// Update person cards to show the number of tasks assigned to them
People.updatePeopleCards();
