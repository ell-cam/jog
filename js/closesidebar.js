/**
 * Summary: Handles logic for opening and closing sidebar
 *
 * Authors:
 *  Rishi Bidani
 */

const closeSidebarButton = document.querySelector(".close-sidebar");
const openSidebarButton = document.querySelector(".open-sidebar");
const sidebar = document.querySelector(".sidebar");

const root = document.documentElement;

closeSidebarButton.addEventListener("click", () => {
    root.style.setProperty("--sidebar-width", "0");
    sidebar.classList.add("closed");
    openSidebarButton.classList.remove("hidden");

    // update task cards
    const task_cards = document.querySelectorAll("section.main task-card");
    for (const task_card of task_cards) {
        task_card.render();
    }
});

openSidebarButton.addEventListener("click", () => {
    root.style.setProperty("--sidebar-width", "20rem");
    sidebar.classList.remove("closed");
    openSidebarButton.classList.add("hidden");

    // update task cards
    const task_cards = document.querySelectorAll("section.main task-card");
    for (const task_card of task_cards) {
        task_card.render()
    }
});
