/**
 * Summary: defines people class which holds a list of Person classes
 *
 * Authors:
 *  Chris Patrick
 */

import Storage from "../storage/storage.js";

class People {
    static #people = Storage.getPeople() || []

    static addPerson(person) {
        if (Storage.addPerson(person)) {
            this.#people.push(person)
        } else {
            console.log("Error adding person to storage")
        }
    }

    static setPeople(people) {
        // Add people to local storage
        for (const person of people) {
            if (Storage.addPerson(person)) {
                this.#people.push(person)
            }
        }
    }

    static deletePerson(person) {
        for (var i = 0; i < this.#people.length; i++) {
            if (this.#people[i].id === person.id) {
                this.#people.splice(i, 1)
            }
        }
    }

    static find(personId) {
        for (let person of this.#people) {
            if (personId === person.id) {
                return person
            }
        }
    }

    static get getAll() {
        return [...this.#people]
    }

    static updatePeopleCards() {
        const personcards = document.querySelectorAll("person-card");
        [...personcards].forEach(personcard => {
            const id = personcard.getAttribute("id");
            const backlog = Storage.getBacklog();
            const tasks = backlog.filter(task => task.assigneeId === id);
            personcard.querySelector(".tasks-number").textContent = tasks.length;
        })

    }
}

export default People;