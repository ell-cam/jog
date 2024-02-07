/**
 * Summary: Defines task class
 * 
 * Authors: 
 *  Chris Patrick 
 */

import { STATUS, PRIORITY } from "../helpers/enums.js";
import { IDGenerator } from "../Helpers/utilities.js";
import People from '../person/people.js'

class Task {
    constructor(
        title = "",
        description = "",
        tags = [],
        taskType = "feature",
        status = STATUS.open,
        deadline,
        priority = PRIORITY.low,
        assigneeId,
        points = 1,
        trackedTime = 0,
        backlog = "product backlog",
    ) {
        this.id = IDGenerator()
        this.title = title;
        this.description = description;
        this.tags = tags;
        this.taskType = taskType;
        this.status = status;
        this.deadline = deadline;

        this.priority = priority;
        this.assigneeId = assigneeId;
        this.points = points;
        this.trackedTime = trackedTime;

        this.backlog = backlog;
    }

    /**
     *
     * @param {Person} person - A Person to be assigned to this task
     */
    assignPerson(personId) {
        this.assigneeId = personId;
        People.find(personId).addTask(this.id)
    }

    /**
     * 
     * @param {Object} taskDetails - the new details of the task with the same keys as Task
     */
    editTask(taskDetails) {
        for (let key of Object.keys(taskDetails)) {
            this[key] = taskDetails[key];
        }
    }
}

export default Task;
