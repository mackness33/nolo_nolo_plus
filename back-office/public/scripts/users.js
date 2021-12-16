const userList = document.getElementById("customerList");
const infoModal = document.getElementById("infoModal");
const editModal = document.getElementById("editModal");
const feedModal = document.getElementById("feedModal");
const deleteModal = document.getElementById("deleteModal");
const addModal = document.getElementById("addModal");
const searchForm = document.getElementById("idSearch");
const resetBtn = document.getElementById("resetBtn");
const addUserForm = document.getElementById("addForm");

document.addEventListener("DOMContentLoaded", async () => {
  reloadList();
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
  document.getElementById("feedForm").addEventListener(
    "submit",
    async (e) => {
      e.preventDefault();
      const userMail = event.relatedTarget.parentElement.parentElement.id;
      console.log(document.getElementById("feedText").value);
      const feed = {
        text: document.getElementById("feedText").value,
        date: new Date().toISOString(),
        userMail: userMail,
      };
      await $.post("/nnplus/user/feed", feed)
        .done((data) => {
          console.log(data);
          document.getElementById("feedForm").reset();
        })
        .fail(() => {
          console.log("morte");
        });
    },
    { once: true }
  );
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

    mail.setAttribute("data-old", user.mail);
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
                            <button id="${
                              feed._id
                            }" type="button" class="btn btn-danger deleteFeedback" >Elimina</button>`;
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

  editform.addEventListener(
    "submit",
    async (event) => {
      event.preventDefault();
      const inputs = editform.elements;

      const user = {
        name: inputs[0].value,
        surname: inputs[1].value,
        birth: inputs[2].value,
        oldMail: inputs[3].getAttribute("data-old"),
        newMail: inputs[3].value,
        status: inputs[4].value,
        feeds: deletedFeed,
      };
      console.log(user);
      $.get("/nnplus/user/checkExist", {
        mail: user.newMail,
      }).done(async (data) => {
        if (!data || user.oldMail === user.newMail) {
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
    },
    { once: true }
  );
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
  await $.get("/nnplus/user/getOne", {
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
                                <button class="btn btn-primary feedback-btn" data-bs-toggle="modal"
                                    data-bs-target="#feedModal">dai feedback</button>
                                <button class="btn btn-danger delete-btn" data-bs-toggle="modal" data-bs-target="#deleteModal">Elimina</button>
                            </div>
                        </div>`;
    userList.appendChild(userEl);
  });
}

export async function reloadList() {
  await $.get("/nnplus/user/all", (data, status) => {
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
