/**
 * Summary: provides logic for filtering and displaying filtered person cards by name
 *
 * Authors:
 *  Rishi Bidani
 */

const personFilterSearch = document.querySelector('.search-team');
const people = document.querySelectorAll('person-card');


personFilterSearch.addEventListener("input", () => {
    const searchValue = personFilterSearch.value.toLowerCase().trim();
    let peopleCounter = 0;
    people.forEach(person => {
        const name = person.querySelector('.person-name').textContent.toLowerCase();

        // if the search value is in the name, show the person card
        if (name.indexOf(searchValue) != -1) {
            person.style.display = "";
            peopleCounter++;
        } else {
            person.style.display = "none";
        }
    }
    );

    // if no results are found, show the no results message
    if (peopleCounter == 0) {
        document.querySelector('.no-results').classList.remove('hidden');
    } else {
        document.querySelector('.no-results').classList.add('hidden');
    }
})