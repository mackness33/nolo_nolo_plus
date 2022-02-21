const userList = document.getElementById("customerList");
const infoModal = document.getElementById("infoModal");
const editModal = document.getElementById("editModal");
const feedModal = document.getElementById("feedModal");
const deleteModal = document.getElementById("deleteModal");
const addModal = document.getElementById("addModal");
const searchForm = document.getElementById("idSearch");
const resetBtn = document.getElementById("resetBtn");
const addUserForm = document.getElementById("addForm");
$(document).ajaxComplete(checkSession);

document.addEventListener("DOMContentLoaded", async () => {
  reloadList();
});

$("#filterForm").submit(async function (e) {
  e.preventDefault();

  const filters = $("#filterForm")[0];
  var selected = [];
  for (let index = 0; index < filters.elements.length; index++) {
    if (filters.elements[index].checked) {
      selected.push(index);
    }
  }

  var users = [];

  await $.get("/nnplus/user/all", (data) => {
    users = data;
  });

  const filteredUsers = users.filter((user) => {
    if (selected.includes(user.status)) return user;
  });
  showUsers(filteredUsers);
});

addUserForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  console.log("INTO addUser");
  addUser();
});

addModal.addEventListener("hide.bs.modal", () => {
  addUserForm.reset();
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

feedModal.addEventListener("show.bs.modal", (event) => {
  $("body").on("submit", "#feedForm", async (e) => {
    console.log("DO FEED");
    e.preventDefault();
    const userMail = event.relatedTarget.parentElement.parentElement.id;
    const feed = {
      text: document.getElementById("feedText").value,
      date: new Date().toISOString(),
      userMail: userMail,
    };
    await $.post("/nnplus/user/feed", feed)
      .done((data) => {
        document.getElementById("feedForm").reset();
        showAlert(
          "feedback aggiunto con successo",
          document.getElementById("feedSubmit").parentElement,
          true
        );
      })
      .fail(() => {
        showAlert(
          "aggiunta del feedback fallito",
          document.getElementById("feedSubmit").parentElement,
          false
        );
      });
  });
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
  $("body").off("submit", "#editForm");
});

deleteModal.addEventListener("show.bs.modal", (event) => {
  const userMail = event.relatedTarget.parentElement.parentElement.id;
  document.getElementById("confirmBtn").addEventListener(
    "click",
    () => {
      $.post("/nnplus/user/deleteOne", { mail: userMail })
        .done((data) => {
          console.log(data);
          reloadList();
        })
        .fail(() => {
          console.error("failed to delete");
        });
    },
    { once: true }
  );
});

feedModal.addEventListener("hide.bs.modal", (event) => {
  $("body").off("submit", "#feedForm");
});

// Modal page populate for both info and edit
async function populateModal(event, mode) {
  const userId = event.relatedTarget.parentElement.parentElement.id;
  var user;
  await $.get("/nnplus/user/getOne", {
    mail: userId,
    mode: mode,
  }).done((data) => {
    console.log(data);
    user = data;
  });

  const name = document.getElementById(`${mode}ModalName`);
  const surname = document.getElementById(`${mode}ModalSurname`);
  const birth = document.getElementById(`${mode}ModalBirth`);
  const mail = document.getElementById(`${mode}ModalMail`);
  const status = document.getElementById(`${mode}ModalStatus`);
  const points = document.getElementById(`${mode}ModalPoints`);

  if (mode == "info") {
    name.innerHTML = user.name;
    surname.innerHTML = user.surname;
    birth.value = user.birth.split("T")[0];
    mail.innerHTML = user.mail;
    points.innerHTML = user.points;
    switch (user.status) {
      case 4:
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
    points.value = user.points;
    mail.setAttribute("data-old", user.mail);
    birth.setAttribute("max", new Date().toISOString().split("T")[0]);
  }

  const feedBackList = document.getElementById(`${mode}FeedBackList`);
  user.feedback.forEach((feed, index) => {
    const feedbackEl = document.createElement("li");
    feedbackEl.classList.add("feedback");
    feedbackEl.setAttribute("tabindex", "0");
    feedbackEl.setAttribute("aria-label", `feedback numero ${index + 1}`);
    feedbackEl.id = feed.feedbackId;
    if (mode == "info") {
      feedbackEl.innerHTML = `<div tabindex="0">
                                    <b>Dipendente: </b><span class="feedBackName">${
                                      feed.emplCode.name +
                                      " " +
                                      feed.emplCode.surname
                                    }</span>
                            </div>
                            <div tabindex="0">
                                    <b aria-label="Data del feedback">Data: </b><input type="date" value="${
                                      feed.date.split("T")[0]
                                    }" class="feedBackDate" readonly>

                                    </input>
                            </div>
                            <p tabindex="0" class="feedBackText">${
                              feed.text
                            }</p>`;
    } else if (mode == "edit") {
      feedbackEl.innerHTML = `<div tabindex="0">
                                    <b>Dipendente: </b><span class="feedBackName">${
                                      feed.emplCode.name +
                                      " " +
                                      feed.emplCode.surname
                                    }</span>
                            </div>
                            <div tabindex="0">
                                    <b aria-label="Data del feedback">Data: </b><input type="date" value="${
                                      feed.date.split("T")[0]
                                    }" class="feedBackDate" readonly></input>
                            </div>
                            <p tabindex="0" class="feedBackText">${
                              feed.text
                            }</p>
                            <button id="${
                              feed._id
                            }" type="button" class="btn btn-danger deleteFeedback" aria-label="elimina feedback numero ${
        index + 1
      }">Elimina</button>`;
    }

    feedBackList.appendChild(feedbackEl);
  });
  if (mode == "edit") {
    setUpEdit(user);
  }
}

function setUpEdit(user) {
  const editform = document.getElementById("editForm");
  const deleteButtons = document.querySelectorAll(".deleteFeedback");
  var deletedFeed = [];

  deleteButtons.forEach((button) => {
    button.addEventListener(
      "click",
      (event) => {
        deletedFeed.push(button.id);
        event.target.parentElement.remove();
      },
      { once: true }
    );
  });
  $("body").on("submit", "#editForm", async function (e) {
    // editform.onsubmit = async (event) => {
    e.preventDefault();
    const inputs = editform.elements;

    const user = {
      name: inputs[0].value,
      surname: inputs[1].value,
      birth: inputs[2].value,
      oldMail: inputs[3].getAttribute("data-old"),
      mail: inputs[3].value,
      status: inputs[4].value,
      points: inputs[5].value,
      feeds: deletedFeed,
      role: 2,
    };
    console.log(user);
    $.get("/nnplus/user/checkExist", {
      mail: user.mail,
    }).done(async (data) => {
      console.log(data);
      if (!data || user.oldMail === user.mail) {
        await $.post("/nnplus/user/setOne", user);
        reloadList();
        showAlert(
          "Modificato con successo",
          document.getElementById("editBtn").parentElement,
          true
        );
      } else {
        showAlert(
          "Mail gia' in utilizzo",
          document.getElementById("editBtn").parentElement,
          false
        );
      }
    });
  });
}

async function addUser() {
  const inputs = addUserForm.elements;
  const img = await getdataUrl(inputs[7].files[0]);

  const user = {
    name: inputs[0].value.toLowerCase(),
    surname: inputs[1].value.toLowerCase(),
    password: inputs[2].value,
    birth: inputs[3].value,
    mail: inputs[4].value,
    status: 4,
    points: inputs[6].value,
    picture: img,
    role: 3,
  };
  await $.get("/nnplus/user/checkExist", {
    mail: user.mail,
  }).done((data) => {
    if (!data) {
      $.ajax({
        type: "POST",
        url: "/nnplus/user/add",
        contentType: "application/json",
        data: JSON.stringify(user),
      })
        .done(() => {
          console.log("riuscito");
          addUserForm.reset();
          reloadList();
          showAlert(
            "Account aggiunto con successo",
            document.getElementById("addBtn").parentElement,
            true
          );
        })
        .fail(() => {
          console.log("morte");
        });
    } else {
      showAlert(
        "Mail gia' in utilizzo",
        document.getElementById("addBtn").parentElement,
        false
      );
    }
  });
}

function showAlert(text, parent, happy) {
  if (!document.getElementById("alert")) {
    const alert = document.createElement("span");
    alert.setAttribute("role", "alert");
    alert.textContent = text;
    alert.setAttribute("id", "alert");
    alert.classList.add("animate__animated", "animate__bounceIn");
    happy ? (alert.style.color = "green") : (alert.style.color = "red");
    parent.prepend(alert);
    setTimeout(() => {
      alert.remove();
    }, 3000);
  } else {
    console.log("not doing");
  }
}

// show user by id
async function showUserByMail(mail) {
  var user = [];
  await $.get("/nnplus/user/getOne", {
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
  await $.get("/nnplus/user/getMany", {
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
    userEl.setAttribute("tabindex", "0");
    userEl.setAttribute(
      "aria-label",
      "utente " + user.name + " " + user.surname
    );
    userEl.setAttribute("id", user.mail);
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

    userEl.innerHTML = `<div class="customer-info">
                            <div class="no-btns">
                            <div class="detail">
                            <span class="name" tabindex="0"><b style="display:inline;">Nome:</b> ${
                              fullName.name
                            } ${fullName.surname}</span>
                            </div>
                            <div class="detail">
                                <span class="id" tabindex="0"><b style="display:inline;">Email:</b> ${
                                  user.mail
                                }</span>
                            </div>
                            <div class="detail">
                                <span class="status" tabindex="0"><b style="display:inline;">Status:</b> ${statusString}</span>
                            </div>
                            </div>

                        </div>
                        <div class="customer-btn">
                                <button class="btn btn-primary info-btn" data-bs-toggle="modal"
                                    data-bs-target="#infoModal" data-id="info${
                                      user.mail
                                    }" aria-label="mostra le informazioni di ${
      fullName.name
    } ${fullName.surname}">mostra informazioni</button>
                                <button class="btn btn-primary edit-btn" data-bs-toggle="modal"
                                data-bs-target="#editModal" data-id="edit${
                                  user.mail
                                }" aria-label="cambia le informazioni di ${
      fullName.name
    } ${fullName.surname}">cambia informazioni</button>
                                <button class="btn btn-primary feedback-btn" data-bs-toggle="modal"
                                    data-bs-target="#feedModal" aria-label="fornisci un feedback su ${
                                      fullName.name
                                    } ${fullName.surname}">dai feedback</button>
                                    ${
                                      user.status !== 1 && user.status !== 2
                                        ? `<button class="btn btn-danger delete-btn" aria-label="elimina l'account di  ${fullName.name} ${fullName.surname}" data-bs-toggle="modal" data-bs-target="#deleteModal">Elimina</button>
                                    </div>`
                                        : ""
                                    }
                        </div>`;
    userList.appendChild(userEl);
  });
}

async function reloadList() {
  await $.get("/nnplus/user/all", (data) => {
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

// checks if response is html, which means the session has expired
function checkSession(evt, xhr, options) {
  console.log(evt);
  console.log(xhr);
  console.log(options);
  if (xhr.getResponseHeader("content-type").includes("html")) {
    window.location.href = "/nnplus/login";
  }
}

function getdataUrl(img) {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(img);
  });
}
