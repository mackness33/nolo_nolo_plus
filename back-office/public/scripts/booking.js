var computerAutolist = [];
var bookingShownList = [];

$(document).ajaxError(checkSession);

$(document).on("DOMContentLoaded", async function (event) {
  await autocompleteUser();

  if (sessionStorage.getItem("emplId")) {
    $("#managePill").trigger("click");
    console.log(sessionStorage.getItem("emplId"));
    const id = sessionStorage.getItem("emplId");
    sessionStorage.clear();

    const bookings = await $.ajax({
      method: "GET",
      url: "/nnplus/booking/getBookingsByEmp",
      data: {
        emp: id,
      },
    }).done((data) => {
      console.log(data);
      showBookings(data);
    });
  } else {
    await getAllBookings();
  }
});

async function autocompleteUser() {
  var mails = [];

  await $.ajax({
    method: "GET",
    url: "/nnplus/user/all",
    data: { attributes: "person.mail" },
  })
    .done((data) => {
      mails = data.map((user) => user.mail);
      userAutoList = mails;
    })
    .fail((err) => {
      console.error(err);
    });

  autocompleteDefault("#addUser", mails);
}

$("#managePill").on("click", async () => {
  // await getAllBookings();
});

$("#addStartDate").on("change", function () {
  compareDates("#addEndDate", "#addStartDate");
  getAvailableItems();
});

$("#addEndDate").on("change", function () {
  compareDates("#addStartDate", "#addEndDate");
  getAvailableItems();
});

function compareDates(main, compare) {
  if (!$(main).val() || $("#addEndDate").val() < $("#addStartDate").val()) {
    $(main).val($(compare).val());
  }
}

async function getAvailableItems() {
  var items;
  await $.ajax({
    method: "GET",
    url: "/nnplus/booking/byDates",
    data: { begin: $("#addStartDate").val(), end: $("#addEndDate").val() },
  })
    .done((data) => {
      console.log(data);
      computerAutolist = data;
      items = data;
    })
    .fail((err) => {
      console.error(err);
    });

  autocompleteDefault("#addComputer", items);
}

function autocompleteDefault(target, source) {
  $(target)
    .autocomplete({
      minLength: 0,
      source: source.sort(),
    })
    .focus(function () {
      $(this).autocomplete("search", "");
    });
}

$("#showItem").on("click", () => {
  const id = $("#addComputer").val();
  if (id) {
    sessionStorage.setItem("itemId", id);
    console.log(sessionStorage.getItem("itemId"));
    window.location.href = "/nnplus/home/inventory";
  }
});

$("#evalBtn").on("click", async () => {
  var user;
  var item = $("#addComputer").val();
  await $.ajax({
    method: "GET",
    url: "/nnplus/user/getOne",
    data: { mail: $("#addUser").val() },
  }).done((data) => {
    user = data;
  });

  if (user && computerAutolist.includes(item)) {
    $.ajax({
      method: "GET",
      url: "/nnplus/inv/getOne",
      data: { id: item },
    }).done(async (data) => {
      console.log(user);
      console.log(data);
      await bookingPreview(
        user,
        data,
        $("#addStartDate").val(),
        $("#addEndDate").val()
      );
    });
  } else {
    showAlert(
      "Utente inesistente o computer non disponibile!",
      $("#addForm")[0],
      false
    );
    $("#bookingPreview").prop("hidden", true);
  }
});

async function bookingPreview(user, computer, begin, end) {
  // clean everything at every reload
  $("body").off("click", "#pointsBtn");
  $("body").off("click", "#addDiscountBtn");
  $("body").off("submit", "#addForm");
  $("#bookingPreview").prop("hidden", false);
  $("#discountReason").val("");
  $("#discountAmount").val(0);
  $("#bookingPreview > ul").html("");
  $("#userPoints").html("");

  var discountList = [];
  const priceList = $("#bookingPreview > ul");
  var usedPoints = 0;
  var employeeId;

  $.ajax({
    method: "GET",
    url: "/nnplus/empl/",
  })
    .done((data) => {
      employeeId = data._id;
    })
    .fail((err) => {
      console.error(err);
    });

  const { name, surname } = adjustName(user.name, user.surname);
  $("#userInfo > span").html(`${name} ${surname}`);

  $("#itemInfo > span").html(
    `${computer.brand.toUpperCase()} ${computer.model.toUpperCase()}`
  );

  $("#beginInfo > span").html(`${begin}`);

  $("#endInfo > span").html(`${end}`);

  const days = daysNumber(begin, end) + 1;
  var price = (days * computer.price).toFixed(2);

  // show full price
  const initPrice = document.createElement("li");
  initPrice.innerHTML = `<span>Prezzo iniziale:</span><span>${price}$</span>`;
  $(priceList).append(initPrice);

  const finalPrice = document.createElement("li");
  finalPrice.innerHTML = `<span >Prezzo finale:</span><span id="finalPrice">${price}$</span>`;
  $(priceList).append(finalPrice);

  const updateFinal = (amount) => {
    price = (price - amount).toFixed(2);
    price = price < 0 ? 0 : price;
    $("#finalPrice").html(`${price}$`);
  };

  const printDiscounts = (reason = "nessuna ragione", amount = 0) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `<span>${reason}:</span><span>-${amount}$</span>`;
    $(listItem).insertBefore($("#finalPrice").parent());
    updateFinal(amount);
  };

  const populatePointsSelect = (points) => {
    for (let index = 0; index <= points; index++) {
      const option = document.createElement("option");
      option.setAttribute("value", index);
      option.innerHTML = index;
      $("#userPoints").append(option);
    }
  };

  await $.ajax({
    method: "GET",
    url: "/nnplus/booking/getDiscounts",
    data: { userId: user._id, computerId: computer._id, days: days },
  })
    .done((data) => {
      console.log(data);
      data.discounts.forEach((discount) => {
        printDiscounts(discount.reason, parseFloat(discount.amount).toFixed(2));
        discountList.push({
          reason: discount.reason,
          amount: parseFloat(discount.amount).toFixed(2),
        });
      });
      populatePointsSelect(data.points);
    })
    .fail((err) => {
      console.error(err);
    });

  $("body").on("click", "#pointsBtn", () => {
    usedPoints = $("#userPoints").val();
    const amount = $("#userPoints").val() / 10;
    const used = $("#pointsConsumed");
    if (amount > 0) {
      if (used[0]) {
        updateFinal(-used.attr("data-amount"));
        $("#pointsVal").html(`-${amount}$`);
        updateFinal(amount);
        discountList = discountList.map((disc) => {
          if (disc.reason === "punti fedelta") {
            disc.amount = amount;
          }
          return disc;
        });
      } else {
        const listItem = document.createElement("li");
        listItem.setAttribute("id", "pointsConsumed");
        listItem.setAttribute("data-amount", amount);
        listItem.innerHTML = `<span>Punti fedelta':</span><span id="pointsVal">-${amount}$</span>`;

        $(listItem).insertBefore($("#finalPrice").parent());
        updateFinal(amount);
        discountList.push({ reason: "punti fedelta", amount: amount });
      }
    } else if (used[0]) {
      updateFinal(-used.attr("data-amount"));
      used.remove();
      discountList = discountList.filter(
        (disc) => disc.reason !== "punti fedelta"
      );
    }
    console.log(discountList);
  });

  $("body").on("click", "#addDiscountBtn", () => {
    if ($("#discountReason").val() !== "" && $("#discountAmount").val() !== 0) {
      discountList.push({
        reason: $("#discountReason").val(),
        amount: $("#discountAmount").val(),
        employee: employeeId,
      });
      printDiscounts($("#discountReason").val(), $("#discountAmount").val());
      $("#discountReason").val("");
      $("#discountAmount").val(0);
    } else {
      showAlert(
        "Lo sconto deve essere definito!",
        $("#addForm")[0],
        false,
        true
      );
    }
  });

  $("body").on("submit", "#addForm", async (event) => {
    event.preventDefault();
    console.log("ciaone");
    const booking = {
      user: user._id,
      computer: computer._id,
      begin: begin,
      end: end,
      discounts: discountList,
      starting_price: computer.price * days,
      final_price: price,
      note: $("#addNote").val(),
      points: usedPoints,
    };
    console.log(booking);
    await $.ajax({
      method: "POST",
      url: "/nnplus/booking/addOne",
      data: { data: JSON.stringify(booking) },
    })
      .done(async (data) => {
        console.log(data);
        getAllBookings();
        showAlert(
          "Noleggio creato con successo!",
          $("#addForm")[0],
          true,
          true
        );
        $("#bookingPreview").prop("hidden", true);
        $("#addForm")[0].reset();
        await getAllBookings();
      })
      .fail((err) => {
        console.log(err);
      });
  });
}

$("#searchBtn").on("click", async (event) => {
  event.preventDefault();

  await searchBookingsByUser($("#searchUser").val());
});

$("#editModal").on("show.bs.modal", async (event) => {
  function setModal(booking) {
    console.log(booking);
    const computer_model = adjustName(
      booking.computer.brand,
      booking.computer.model
    );
    const user_name = adjustName(
      booking.user.person.name,
      booking.user.person.surname
    );
    const status_object = statusToObject(booking.status, booking._id);
    const begin_without_time = booking.begin.split("T")[0];
    const end_without_time = booking.end.split("T")[0];
    const discounts = listOfDiscounts(booking.discounts);
    const points = listOfPoints(booking.points);

    document.getElementById("editComputer").innerHTML =
      computer_model.full_name;
    document.getElementById("editMail").innerHTML = booking.user.person.mail;
    document.getElementById("editStartDate").value = begin_without_time;
    document.getElementById("editEndDate").value = end_without_time;
    document.getElementById("editPrice").value = booking.final_price;
    document.getElementById("editDiscounts").innerHTML = discounts;
    document.getElementById("editPoints").innerHTML = booking.points;
    document.getElementById("editReturned").innerHTML = booking.returned
      ? "Si"
      : "No";
    document.getElementById("editPayed").innerHTML = booking.payed
      ? "Si"
      : "No";
    document.getElementById("editLate").innerHTML = booking.late ? "Si" : "No";
    document.getElementById("editNote").value = booking.note;
  }

  const booking_id = $(event.relatedTarget.parentElement).data("booking");
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const booking = getBookingFromShown(booking_id);

  setModal(booking);

  document
    .getElementById("editEndDate")
    .setAttribute(
      "min",
      new Date(document.getElementById("editStartDate").value)
        .toISOString()
        .split("T")[0]
    );

  $("body").on("submit", "#editModal", async (event) => {
    event.preventDefault();
    try {
      const booking = {
        begin: new Date(document.getElementById("editStartDate").value),
        end: new Date(document.getElementById("editEndDate").value),
        final_price: document.getElementById("editPrice").value,
        note: document.getElementById("editNote").value,
      };

      const success = await $.ajax({
        method: "PUT",
        url: "/nnplus/booking/updateBooking",
        data: {
          id: booking_id,
          booking: JSON.stringify(booking),
        },
      });

      console.log(success);
      showAlert(
        "Noleggio modificato con successo!",
        $("#editBtn").parent()[0],
        true
      );

      await searchBookingsByUser($("#searchUser").val());
    } catch (err) {
      console.error(err, "Fucking error");

      showAlert(
        "Errore durante la modifica del noleggio!",
        $("#editBtn").parent()[0],
        false
      );
    }
  });
});

$("#editStartDate").on("change", (event) => {
  if ($("#editStartDate").val() > $("#editEndDate").val()) {
    $("#editEndDate").val($("#editStartDate").val());
  }

  $("#editEndDate")[0].setAttribute(
    "min",
    new Date(document.getElementById("editStartDate").value)
      .toISOString()
      .split("T")[0]
  );
});

$("#editModal").on("hide.bs.modal", async function (event) {
  //triggers when modal is closed
  $("body").off("submit", "#editModal");
});

$("#deleteModal").on("show.bs.modal", async (event) => {
  const booking_id = $(event.relatedTarget.parentElement).data("booking");

  $("body").on("click", "#deleteModal", async (event) => {
    event.preventDefault();
    try {
      console.log(event);
      const success = await $.ajax({
        method: "DELETE",
        url: "/nnplus/booking/deleteBooking",
        data: { id: booking_id },
      });

      console.log(success);
      showAlert(
        "Noleggio cancellato con successo!",
        $("#deleteBtn").parent()[0],
        true
      );
      await searchBookingsByUser($("#searchUser").val());
    } catch (err) {
      console.error(err, "Fucking error");

      showAlert(
        "Errore durante la cancellazione del noleggio!",
        $("#deleteBtn").parent()[0],
        false
      );
    }
  });
});

$("#deleteModal").on("hide.bs.modal", async function (event) {
  $("body").off("click", "#deleteBtn");
});

$("#returnModal").on("show.bs.modal", async (event) => {
  const booking_id = $(event.relatedTarget.parentElement).data("booking");

  function setModal(booking) {
    document.getElementById("returnReturned").checked = booking.returned;
    document.getElementById("returnPayed").checked = booking.payed;
    document.getElementById("returnFinalCondition").value =
      booking.final_condition;
    document.getElementById("returnNote").value = booking.note;
  }

  $("body").on("submit", "#returnForm", async (event) => {
    event.preventDefault();

    const certificate = {
      returned: document.getElementById("returnReturned").checked,
      payed: document.getElementById("returnPayed").checked,
      final_condition: $("#returnFinalCondition").val(),
      note: document.getElementById("returnNote").value,
      computer:
        $("#returnFinalCondition").val() <= 5
          ? getComputerFromBookingShown(booking_id)
          : null,
    };

    try {
      const success = await $.ajax({
        method: "PUT",
        url: "/nnplus/booking/certifiedBooking",
        data: {
          id: booking_id,
          certificate: JSON.stringify(certificate),
        },
      });

      console.log(success);
      showAlert(
        "Noleggio certificato con successo!",
        $("#returnSubmit").parent()[0],
        true
      );
      await searchBookingsByUser($("#searchUser").val());
    } catch (err) {
      console.error(err);

      showAlert(
        "Errore durante la certificazione del noleggio!",
        $("#returnSubmit").parent()[0],
        false
      );
    }
  });

  const booking = getBookingFromShown(booking_id);
  setModal(booking);
});

$("#returnModal").on("hide.bs.modal", async function (event) {
  $("body").off("submit", "#returnForm");
});

$("#receiptModal").on("show.bs.modal", async (event) => {
  function setModal(booking) {
    console.log(booking);
    const computer_model = adjustName(
      booking.computer.brand,
      booking.computer.model
    );
    const user_name = adjustName(
      booking.user.person.name,
      booking.user.person.surname
    );
    const status_object = statusToObject(booking.status, booking._id);
    const begin_without_time = booking.begin.split("T")[0];
    const end_without_time = booking.end.split("T")[0];
    const discounts = listOfDiscounts(booking.discounts);
    const points = listOfPoints(booking.points);
    const booking_days = dateDiffInDays(
      new Date(booking.begin),
      new Date(booking.end)
    );

    console.log("starting price: " + booking.starting_price);

    document.getElementById("receiptStartDate").innerHTML = begin_without_time;
    document.getElementById("receiptEndDate").innerHTML = end_without_time;
    document.getElementById("receiptComputer").innerHTML =
      computer_model.full_name;
    document.getElementById("receiptUser").innerHTML = booking.user.person.mail;
    document.getElementById("receiptDays").innerHTML = booking_days;
    document.getElementById("receiptDailyPrice").innerHTML =
      booking.starting_price / booking_days;
    document.getElementById("receiptStartPrice").innerHTML =
      booking.starting_price;

    document.getElementById("receiptDiscounts").innerHTML =
      discountsVisualization(booking.discounts);
    document.getElementById("receiptFinalPrice").innerHTML =
      booking.final_price;
  }

  // second - first
  function dateDiffInDays(first, second) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;

    // Discard the time and time-zone information.
    const utc1 = Date.UTC(
      first.getFullYear(),
      first.getMonth(),
      first.getDate()
    );
    const utc2 = Date.UTC(
      second.getFullYear(),
      second.getMonth(),
      second.getDate()
    );

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }

  function discountsVisualization(discounts) {
    const list_of_discounts = document.createElement("div");

    for (let i = 0; i < discounts.length - 1; i++) {
      list_of_discounts.innerHTML += `
        <div>
          <span class="text-capitalize">Sconto ${discounts[i].reason}:</span>
          <span>${discounts[i].amount}$</span>
        </div>
      `;
    }

    if (discounts.length !== 0) {
      list_of_discounts.innerHTML += `
        <div class="border-bottom">
          <span class="text-capitalize">Sconto ${
            discounts[discounts.length - 1].reason
          }:</span>
          <span>${discounts[discounts.length - 1].amount}$</span>
        </div>
      `;
    }

    return list_of_discounts.innerHTML;
  }

  const booking_id = $(event.relatedTarget.parentElement).data("booking");

  const booking = getBookingFromShown(booking_id);

  setModal(booking);
});

$("#filterBookingForm").on("submit", async (event) => {
  event.preventDefault();
  const form = $("#filterBookingForm")[0];
  const today = new Date().setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const booking_to_view = [];
  const types = {
    future: form.elements[0].checked,
    present: form.elements[1].checked,
    past: form.elements[2].checked,
  };

  if (!types.future && !types.present && !types.past) {
    return;
  }

  for (booking of bookingShownList) {
    if (
      types.future &&
      new Date(booking.begin) > tomorrow &&
      booking.status !== 0
    ) {
      booking_to_view.push(booking);
    }

    if (
      types.present &&
      booking.status !== 5 &&
      new Date(booking.begin) < today &&
      new Date(booking.end) > today &&
      booking.status !== 0
    ) {
      console.log();
      booking_to_view.push(booking);
    }

    if (
      types.past &&
      (new Date(booking.end) < today ||
        booking.status === 0 ||
        booking.status === 5 ||
        booking.status === 4)
    ) {
      booking_to_view.push(booking);
    }
  }

  showBookings(booking_to_view);
});

function getBookingFromShown(booking_id) {
  for (let booking of bookingShownList) {
    if (booking._id === booking_id) {
      return booking;
    }
  }

  return null;
}

function getComputerFromBookingShown(booking_id) {
  for (let booking of bookingShownList) {
    if (booking._id === booking_id) {
      return booking.computer._id;
    }
  }

  return null;
}

async function searchBookingsByUser(mail) {
  console.log(mail);
  if (mail) {
    const user = await $.ajax({
      method: "GET",
      url: "/nnplus/user/getOne",
      data: { mail: mail },
    });

    if (user) {
      const bookings = await $.ajax({
        method: "GET",
        url: "/nnplus/booking/getBookingsByUser",
        data: {
          user: user._id,
        },
      });

      if (bookings) {
        bookingShownList = bookings;
        showBookings(bookingShownList);
      } else {
        console.log("no booking to see");
        showAlert(
          "Utente inesistente o computer non disponibile!",
          $("#searchBookingForm"),
          false
        );
      }
    } else {
      console.log("no booking to see");
      showAlert(
        "Utente inesistente o computer non disponibile!",
        $("#searchBookingForm"),
        false
      );
    }
  } else {
    console.log("show all of them!");
    await getAllBookings();
  }
}

function listOfPoints(points) {
  let points_list = "";

  for (let point = 0; point < points; point++) {
    points_list += `<option value="${point}">${point}</option>`;
  }

  return points_list;
}

function listOfDiscounts(discounts) {
  let discount_list = "";

  for (const discount of discounts) {
    discount_list += `
      <li>
        <div>${discount.reason}</div>
        <div>${discount.amount}$</div>
      </li>
    `;
  }

  return discount_list;
}

async function getAllBookings(query = null) {
  bookings = await $.ajax({
    method: "GET",
    url: "/nnplus/booking/getBookings",
    data: { attributes: query },
  });

  if (bookings) {
    bookingShownList = bookings;
    console.log(bookingShownList);
    showBookings(bookingShownList);
  } else {
    console.log("no booking to see");
    showAlert(
      "Utente inesistente o computer non disponibile!",
      $("#searchBookingForm"),
      false
    );
  }
}

function showBookings(bookings) {
  // console.log("bookings typeof: " + typeof bookings);
  // console.log(bookings);
  const list = document.getElementById("bookingList");

  list.innerHTML = "";

  bookings.sort(function (booking1, booking2) {
    return new Date(booking2.begin) - new Date(booking1.begin);
  });

  for (const booking of bookings) {
    const computer_model = adjustName(
      booking.computer.brand,
      booking.computer.model
    );
    const user_name = adjustName(
      booking.user.person.name,
      booking.user.person.surname
    );
    const status_object = statusToObject(booking.status, booking._id);
    const begin_without_time = booking.begin.split("T")[0];
    const end_without_time = booking.end.split("T")[0];

    const listItem = document.createElement("li");
    listItem.innerHTML = `
      <li class="bookingElement" style="background-color:${status_object.color}">
        <div class="infoGroup">
          <div class="computerModel">
            <span class="labelTag">Computer: </span>
            <div>${computer_model.full_name}</div>
          </div>
          <div class="computerModel">
            <span class="labelTag">Utente: </span>
            <div>${user_name.full_name}</div>
          </div>
          <div class="startDate">
            <span class="labelTag">Inizio: </span>
            <div>${begin_without_time}</div>
          </div>
          <div class="endDate">
            <span class="labelTag">Fine: </span>
            <div>${end_without_time}</div>
          </div>
          <div class="finalPrice">
            <span class="labelTag">Prezzo totale: </span>
            <div>${booking.final_price}</div>
          </div>
        </div>
        ${status_object.buttons}
      </li>`;

    list.append(listItem);
  }
}

function statusToObject(status, id) {
  let statObj = {
    color: "",
    buttons: `<div class="buttonGroup" data-booking="${id}">`,
  };

  switch (status) {
    case 1:
      {
        statObj["color"] = "rgba(105, 105, 105, 0.562)";
        statObj[
          "buttons"
        ] = `${statObj.buttons}<button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editModal">Modifica</button>
          <button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal">Cancella</button>
        </div>`;
      }
      break; // on hold
    case 2:
      {
        statObj["color"] = "rgba( 0, 128, 0, 0.514 )";
        statObj[
          "buttons"
        ] = `${statObj.buttons}<button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editModal">Modifica</button>
          <button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal">Cancella</button>
         </div>`;
      }
      break; // future
    case 3:
      {
        statObj["color"] = "rgba(255, 255, 0, 0.507)";
        statObj[
          "buttons"
        ] = `${statObj.buttons}<button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editModal">Modifica</button>
          <button class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#returnModal">Consegna</button>
        </div>`;
      }
      break; // current
    case 4:
      {
        statObj["color"] = "rgba(255, 0, 0, 0.507)";
        statObj[
          "buttons"
        ] = `${statObj.buttons}<button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editModal">Modifica</button>
          <button class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#returnModal">Consegna</button>
        </div>`;
      }
      break; // alarm
    case 5:
      {
        statObj["color"] = "rgba(0, 132, 255, 0.685)";
        statObj[
          "buttons"
        ] = `${statObj.buttons}<button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#receiptModal">Mostra
        </div>`;
      }
      break; // done
    default:
      statObj = {
        color: "rgba(0, 0, 0, 0.801)",
        buttons: "",
      }; // revoked
  }

  return statObj;
}

function showAlert(text, parent, happy, before = true) {
  $("#load").remove();

  console.log("goind");
  if (!text) {
    const alert = document.createElement("span");
    alert.setAttribute("role", "alert");
    alert.textContent = "caricamento...";
    alert.setAttribute("id", "load");
    alert.classList.add(
      "animate__animated",
      "animate__pulse",
      "animate__infinite"
    );
    alert.style.color = "blue";
    if (before) {
      parent.prepend(alert);
    } else {
      parent.append(alert);
    }
    return;
  }
  if (!document.getElementById("alert")) {
    const alert = document.createElement("span");
    alert.setAttribute("role", "alert");
    alert.textContent = text;
    alert.setAttribute("id", "alert");
    alert.classList.add("animate__animated", "animate__bounceIn");
    happy ? (alert.style.color = "green") : (alert.style.color = "red");
    if (before) {
      parent.prepend(alert);
    } else {
      parent.append(alert);
    }
    setTimeout(() => {
      alert.remove();
    }, 3000);
  } else {
    console.log("showAlert error");
  }
}

// makes fisrt letter of name and surname upercase and return object
function adjustName(name, surname) {
  const newName = name.charAt(0).toUpperCase() + name.slice(1);

  const newSurname = surname.charAt(0).toUpperCase() + surname.slice(1);

  const fullName = `${newName} ${newSurname}`;

  return { name: newName, surname: newSurname, full_name: fullName };
}

function daysNumber(start, end) {
  const date1 = new Date(start);
  const date2 = new Date(end);

  // One day in milliseconds
  const oneDay = 1000 * 60 * 60 * 24;

  // Calculating the time difference between two dates
  const diffInTime = date2.getTime() - date1.getTime();

  // Calculating the no. of days between two dates
  const diffInDays = Math.round(diffInTime / oneDay);

  return diffInDays;
}

function checkSession(evt, xhr, options, erro) {
  console.log(xhr);
  if (xhr.status === 302) {
    window.location.href = "/nnplus/login";
  }
}
