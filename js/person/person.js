/**
 * Summary: defines Person class
 *
 * Authors:
 *  Rishi Bidani
 *  Chris Patrick
 *  Marcus Wei
 */

import { IDGenerator } from "../helper/utilities.js";

class Person {
    // add email to the person class constructor 
    constructor(name, position, isAdmin = false, phoneNumber, email) {
        this.id = IDGenerator();
        this.name = name;
        this.position = position;
        this.isAdmin = isAdmin;
        this.tasks = [];
        this.phoneNumber = phoneNumber;
        this.email = email;
    }

    addTask(taskId) {
        if (!this.tasks.includes(taskId)) {
            this.tasks.push(taskId)
            document.querySelector(`person-card#${this.id}`).updatePersonCard(this)
        }
    }

    removeTask(taskId) {
        for (var i = 0; i < this.tasks.length; i++) {
            if (this.tasks[i] === taskId) {
                this.tasks.splice(i, 1)
            }
        }
        document.querySelector(`person-card#${this.id}`).updatePersonCard(this)
    }
}

export default Person;
