"use strict";

let searchForm = document.forms[0];
let resultList = document.querySelector('.result');
let input = searchForm.searchstring;

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    resultList.innerHTML = '';
    if (input.nextElementSibling && input.nextElementSibling.classList.contains('error')) {
        input.nextElementSibling.remove();
    };

    if (searchForm.nextElementSibling.classList.contains('notfound')) {
        searchForm.nextElementSibling.remove();
    };

    let inputValue = input.value;

    if (input.value.length <= 2) {
        let error = document.createElement('span');
        error.classList.add('error');
        error.textContent = 'Введите больше 2 символов';
        input.after(error);
        input.oninput = function () {

            if (input.value.length > 2) {
                error.remove();
                input.oninput = null;
            };
        };
    } else if (input.value.length >= 256) {
        let error = document.createElement('span');
        error.classList.add('error');
        error.textContent = 'Введите меньше 256 символов';
        input.after(error);
        input.oninput = function () {

            if (input.value.length < 256) {
                error.remove();
                input.oninput = null;
            };
        };
    } else {
        let response = await fetch(`https://api.github.com/search/repositories?q=${inputValue}&per_page=10`);
        let data = await response.json();
        if (response.ok && data.total_count > 0) {
            for (let item of data.items) {
                resultList.prepend(createItem(item));
            }
        } else {
            let notFound = document.createElement('div');
            notFound.classList.add('notfound');
            notFound.textContent = 'Ничего не найдено';
            resultList.before(notFound);
        };
    };
});

function createItem(repositorieData) {
    let item = document.createElement('li');
    if (repositorieData.description) {
        item.innerHTML = `<a class="repositorie-name" href="${repositorieData.html_url}" target="_blank">${repositorieData.name}</a><br>
        <p class="description">${repositorieData.description}</p>
        <a href="https://github.com/${repositorieData.owner.login}" target="_blank" class="owner-login">${repositorieData.owner.login}</a>`;
    } else {
        item.innerHTML = `<a class="repositorie-name" href="${repositorieData.html_url}" target="_blank">${repositorieData.name}</a><br>
        <a href="https://github.com/${repositorieData.owner.login}" target="_blank" class="owner-login">${repositorieData.owner.login}</a>`;
    }

    return item;
};