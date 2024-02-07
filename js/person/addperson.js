/**
 * Summary: responsbile for adding more people to the dashboard. Includes name, contact and other details
 *
 * Authors:
 *  Rishi Bidani
 *  Chris Patrick
 *  Marcus Wei
 */

import Person from "./person.js";
import People from "./people.js";
import PersonCard from "./person-card.js"

const addPersonBtn = document.querySelector('footer.add-person .btn');
const addPersonForm = document.querySelector('.add-person-form');
const teamContainer = document.querySelector('.team-container');


// This is the button on the bottom of the sidebar
addPersonBtn.addEventListener('click', (e) => {
    toggleAddPersonForm()
})

function toggleAddPersonForm() {
    addPersonForm.classList.toggle('hidden');
    if (addPersonForm.classList.contains('hidden')) {
        addPersonForm.reset();
    }
}

// This is the form that appears when you click the button on the bottom of the sidebar
// Clicking on submit, will add the person to the list of people
//adding email to personal details 
addPersonForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const personDetails = {
        name: document.querySelector('input[name="add-person-name"]').value,
        phone: document.querySelector('input[name="add-person-phone"]').value,
        position: document.querySelector('input[name="add-person-position"]').value,
        email: document.querySelector('input[name="add-person-email"]').value,
        isAdmin: document.querySelector('input[name="add-person-admin"]').checked,
    }
    //adding a email constaint to personDetails variable 
    const { name, phone, position, isAdmin, email } = personDetails;
    const person = new Person(name, position, isAdmin, phone, email);
    People.addPerson(person);
    const card = new PersonCard(person);
    teamContainer.append(card);

    // Add person to task datalist
    const personOption = Object.assign(document.createElement("option"), {
        value: person.name,
        id: person.id,
    });
    document.querySelector("#assignee").append(personOption);
    toggleAddPersonForm()
})