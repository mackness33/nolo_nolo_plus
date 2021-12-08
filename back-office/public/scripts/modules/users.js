const userList = document.getElementById("customerList");
const infoModal = document.getElementById("infoModal");
const editModal = document.getElementById("editModal");
const searchForm = document.getElementById("idSearch");
const resetBtn = document.getElementById("resetBtn");
const addUserForm = document.getElementById("addForm");

addUserForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addUser();
  reloadList();
});

// user search submit event handler
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const type = document.getElementById("searchType").value;
  const text = document.getElementById("customerSearch").value;
  if (type == "mail") {
    showUserByMail(text);
  } else {
    showUserByName(text);
  }
  document.getElementById("customerSearch").value = "";
});

// reset event handler
resetBtn.addEventListener("click", () => {
  reloadList();
  document.getElementById("customerSearch").value = "";
});

// user info modal show event handler
infoModal.addEventListener("show.bs.modal", (event) => {
  populateModal(event, "info");
});

// user info modal hide event handler
infoModal.addEventListener("hide.bs.modal", () => {
  const infoFeedBackList = document.getElementById("infoFeedBackList");
  infoFeedBackList.innerHTML = "";
});

// user edit modal show event handler
editModal.addEventListener("show.bs.modal", (event) => {
  populateModal(event, "edit");
});

// user edit modal hide event handler
editModal.addEventListener("hide.bs.modal", (event) => {
  const editFeedBackList = document.getElementById("editFeedBackList");
  editFeedBackList.innerHTML = "";
});

// Modal page populate for both info and edit
async function populateModal(event, mode) {
  const userId = event.relatedTarget.parentElement.parentElement.id;
  var user;
  await $.get("http://localhost:8000/nnplus/user/getOne", {
    mail: userId,
  }).done((data) => {
    user = data;
  });

  const name = document.getElementById(`${mode}ModalName`);
  const surname = document.getElementById(`${mode}ModalSurname`);
  const birth = document.getElementById(`${mode}ModalBirth`);
  const mail = document.getElementById(`${mode}ModalMail`);
  const status = document.getElementById(`${mode}ModalStatus`);

  if (mode == "info") {
    name.innerHTML = user.name;
    surname.innerHTML = user.surname;
    birth.innerHTML = user.birth.split("T")[0];
    mail.innerHTML = user.mail;

    switch (user.status) {
      case 0:
        status.innerHTML = "Inattivo";
        break;
      case 1:
        status.innerHTML = "Noleggiato";
        break;
      case 2:
        status.innerHTML = "Ritirato";
        break;
      case 3:
        status.innerHTML = "Da Restituire";
        break;
    }
  } else if (mode == "edit") {
    name.value = user.name;
    surname.value = user.surname;
    birth.value = user.birth.split("T")[0];
    mail.value = user.mail;
    status.value = user.status;

    birth.setAttribute("max", new Date().toISOString().split("T")[0]);
  }

  const feedBackList = document.getElementById(`${mode}FeedBackList`);
  user.feedback.forEach((feed) => {
    const feedbackEl = document.createElement("li");
    feedbackEl.classList.add("feedback");
    feedbackEl.id = feed.feedbackId;
    if (mode == "info") {
      feedbackEl.innerHTML = `<div>
                                    <h6>Dipendente:</h6><span class="feedBackName">${
                                      feed.emplCode.name +
                                      " " +
                                      feed.emplCode.surname
                                    }</span>
                            </div>
                            <div>
                                    <h6>Data:</h6><span class="feedBackDate">${
                                      feed.date.split("T")[0]
                                    }</span>
                            </div>
                            <p class="feedBackText">${feed.text}</p>`;
    } else if (mode == "edit") {
      feedbackEl.innerHTML = `<div>
                                    <h6>Dipendente:</h6><span class="feedBackName">${
                                      feed.emplCode.name +
                                      " " +
                                      feed.emplCode.surname
                                    }</span>
                            </div>
                            <div>
                                    <h6>Data:</h6><span class="feedBackDate">${
                                      feed.date.split("T")[0]
                                    }</span>
                            </div>
                            <p class="feedBackText">${feed.text}</p>
                            <button type="button" class="btn btn-danger deleteFeedback" >Elimina</button>`;
    }

    feedBackList.appendChild(feedbackEl);
  });
  if (mode == "edit") {
    setUpEdit();
  }
}

function setUpEdit() {
  const editform = document.getElementById("editForm");
  const deleteButtons = document.querySelectorAll(".deleteFeedback");
  var deletedFeed = [];

  deleteButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      deletedFeed.push(event.target.parentElement.id);
      event.target.parentElement.remove();
    });
  });

  editform.addEventListener("submit", async (event) => {
    event.preventDefault();
    const inputs = editform.elements;

    const user = {
      name: inputs[0].value,
      surname: inputs[1].value,
      birth: inputs[2].value,
      mail: inputs[3].value,
      status: inputs[4].value,
    };
    await $.post("http://localhost:8000/nnplus/user/setOne", user);
    await reloadList();
  });
}

async function addUser() {
  const inputs = addUserForm.elements;

  const user = {
    name: inputs[0].value.toLowerCase(),
    surname: inputs[1].value.toLowerCase(),
    password: inputs[2].value,
    birth: inputs[3].value,
    mail: inputs[4].value,
    status: inputs[5].value,
  };

  $.ajax({
    type: "POST",
    url: "http://localhost:8000/nnplus/user/add",
    contentType: "application/json",
    data: JSON.stringify(user),
  })
    .done(() => {
      console.log("riuscito");
    })
    .fail(() => {
      console.log("morte");
    });
}

// show user by id
async function showUserByMail(mail) {
  var user = [];
  await $.get("http://localhost:8000/nnplus/user/getOne", {
    mail: mail,
  }).done((data) => {
    console.log(data);
    if (data !== "") {
      user.push(data);
    }
    console.log(user);
    showUsers(user);
  });
}

async function showUserByName(fullName) {
  fullName = fullName.toLowerCase();
  const name = fullName.split(" ")[0];
  const surname = fullName.split(" ")[1];
  console.log(name + surname);
  await $.get("http://localhost:8000/nnplus/user/getOne", {
    name: name,
    surname: surname,
  }).done((data) => {
    if (data) {
      showUsers([...data]);
    } else {
      showUsers([]);
    }
  });
}

// show array of user in argument
function showUsers(users) {
  userList.innerHTML = "";
  users.sort((a, b) => {
    return b.status - a.status;
  });
  users.forEach((user) => {
    const userEl = document.createElement("li");
    userEl.classList.add("customer-element");
    var statusString;
    switch (user.status) {
      case 1:
        statusString = "Noleggiato";
        userEl.style.backgroundColor = "rgba(21, 255, 0, 0.397)";
        break;
      case 2:
        statusString = "Ritirato";
        userEl.style.backgroundColor = "rgba(251, 255, 0, 0.397)";
        break;
      case 3:
        statusString = "Da Restituire";
        userEl.style.backgroundColor = "rgba(255, 0, 0, 0.397)";
        break;

      default:
        statusString = "Inattivo";
        break;
    }
    const fullName = adjustName(user.name + " " + user.surname);
    userEl.innerHTML = `<div class="customer-info" id="${user.mail}">
                            <span class="name" tabindex="0">${fullName.name} ${fullName.surname}</span>
                            <div class="detail">
                                <span class="id">${user.mail}</span>
                            </div>
                            <div class="detail">
                                <span class="status">${statusString}</span>
                            </div>
                            <div class="customer-btn">
                                <button class="btn btn-primary info-btn" data-bs-toggle="modal"
                                    data-bs-target="#infoModal" data-id="info${user.mail}">mostra informazioni</button>
                                <button class="btn btn-primary edit-btn" data-bs-toggle="modal"
                                data-bs-target="#editModal" data-id="edit${user.mail}">cambia informazioni</button>
                                <button class="btn btn-primary feedback-btn">dai feedback</button>
                                <button class="btn btn-danger feedback-btn">Elimina</button>
                            </div>
                        </div>`;
    userList.appendChild(userEl);
  });
}

export async function reloadList() {
  await $.get("http://localhost:8000/nnplus/user/all", (data, status) => {
    showUsers(data);
  });
}

// makes fisrt letter of name and surname upercase and return object
function adjustName(fullName) {
  const name =
    fullName.split(" ")[0].charAt(0).toUpperCase() +
    fullName.split(" ")[0].slice(1);

  const surname =
    fullName.split(" ")[1].charAt(0).toUpperCase() +
    fullName.split(" ")[1].slice(1);

  return { name: name, surname: surname };
}
