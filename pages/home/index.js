/* Desenvolva sua lógica aqui... */

function state(initialValue) {
	let value = initialValue;

	function getValue() {
		return value;
	}

	function setValue(newValue) {
		value = newValue;
	}

	return [getValue, setValue];
}

const [database, setDatabase] = state(jobsData);
const [jobsSelected, setJobsSelected] = state([]);

function showJobs(jobsList = database()) {
	const container = document.querySelector("#jobs");

	jobsList.forEach((job) => {
		container.insertAdjacentHTML(
			"beforeend",
			`<li class="card" >
    <div class="card-header">
      <h2 class="title-4">${job.title}</h2>
      <span class="text-3">${job.enterprise}</span>
      <span class="text-3">${job.location}</span>
    </div>
    <div class="card-body">
      <p class="text-2">${job.descrition}</p>
    </div>
    <div class="card-footer">
      <span class="text-3">${job.modalities
				.map((item) => item)
				.join(" | ")}</span>
      <button onClick={addJob(${job.id})} class="btn add" id=${
				job.id
			}>Candidatar</button>
    </div>
  </li>`
		);
	});
	return container;
}

function addJob(id, jobs = database()) {
	const jobSelected = jobs.find((item) => item.id === id);

	setJobsSelected([...jobsSelected(), jobSelected]);

	showInSelected();
	updateList();
	buttonEventChange(id);

	const jobSelectedJSON = JSON.stringify(jobsSelected());
	localStorage.setItem("job-selected", jobSelectedJSON);
}

function showInSelected(jobs = jobsSelected()) {
	const container = document.querySelector("#selected-jobs");

	container.innerHTML = "";

	jobs.forEach((job) => {
		container.insertAdjacentHTML(
			"beforeend",
			`<li class="aside-item">
    <div class="item-info">
      <h2 class="title-5">${job.title}</h2>
      <span class="text-3">${job.enterprise}</span>
      <span class="text-3">${job.location}</span>
    </div>
    <button class="remove" onClick={removeFromSelected(${job.id})} id=${job.id}><img src="../../assets/img/trash.svg" alt="remove button"></button>
  </li>`
		);
	});
}

function removeFromSelected(id, jobs = jobsSelected()) {
	const jobDeleted = jobs.findIndex((item) => item.id === id);

	const newSelectedJobs = [...jobs];

	newSelectedJobs.splice(jobDeleted, 1);

	setJobsSelected(newSelectedJobs);

	showInSelected();
	updateList();
	buttonEventChange(id);

	const jobDeletedJSON = JSON.stringify(newSelectedJobs);
	localStorage.setItem("job-selected", jobDeletedJSON);
}

function updateList() {
	const empty = document.querySelector(".empty");
	const selectedJobsList = document.querySelectorAll("#selected-jobs li");

	if (selectedJobsList.length > 0) {
		empty.classList.add("hide");
	} else {
		empty.classList.remove("hide");
	}
}

function buttonEventChange(id) {
	const button = document.getElementById(id);

	const buttonText = ["Candidatar", "Remover candidatura"];

	button.classList.toggle("active");

	if (button.classList.contains("active")) {
		button.innerText = buttonText[1];
		button.setAttribute("onclick", `removeFromSelected(${id})`);
	} else {
		button.innerText = buttonText[0];
		button.setAttribute("onclick", `addJob(${id})`);
	}
}

function getLocalStorage() {
	const dataInLocalStorageJSON = localStorage.getItem("job-selected");

	if (dataInLocalStorageJSON !== "[]") {
		const dataInLocalStorage = JSON.parse(dataInLocalStorageJSON);
		const localStorageId = dataInLocalStorage.map((item) => item.id);
		const buttons = document.querySelectorAll(".add");

		for (const button of buttons) {
			const buttonsId = button.getAttribute("id");

			for (const id of localStorageId) {
				if (+buttonsId === id) {
					buttonEventChange(id);
				}
			}
		}

		setJobsSelected(dataInLocalStorage);
		showInSelected();
		updateList();
	}
}

showJobs();
updateList();
showInSelected();
getLocalStorage();

