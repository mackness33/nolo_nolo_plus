var computerAutolist = [];
var bookings_all = [];
var bookings_shown = [];

$(document).on("DOMContentLoaded", async function (event) {
  await autocompleteUser();
  // await getAllBookings();
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
  var price = days * computer.price;

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
        printDiscounts(discount.reason, discount.amount.toFixed(2));
        discountList.push({
          reason: discount.reason,
          amount: discount.amount.toFixed(2),
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
    } else {
      updateFinal(-used.attr("data-amount"));
      used.remove();
      discountList = discountList.filter(
        (disc) => disc.reason !== "punti fedelta"
      );
    }
    console.log(discountList);
  });

  $("body").on("click", "#addDiscountBtn", () => {
    discountList.push({
      reason: $("#discountReason").val(),
      amount: $("#discountAmount").val(),
      employee: employeeId,
    });
    printDiscounts($("#discountReason").val(), $("#discountAmount").val());
    $("#discountReason").val("");
    $("#discountAmount").val(0);
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
      .done((data) => {
        console.log(data);
        showAlert("Noleggio creato con successo!", $("#addForm")[0], true);
        $("#bookingPreview").prop("hidden", true);
        $("#addForm")[0].reset();
      })
      .fail((err) => {
        console.log(err);
      });
  });
}


$("#searchBtn").on("click", async (event) => {
  event.preventDefault();
  console.log('at searchBtn');
  const req = {
    method: "GET",
    url: "/nnplus/booking/getBookings",
  }

  if ($("#searchUser").val()){
    console.log(user);
    const  user = await $.ajax({
      method: "GET",
      url: "/nnplus/user/getOne",
      data: { mail: $("#searchUser").val() },
    });

    req['data'] = { user: user._id };
  }

  bookings = await $.ajax(req);

  if (bookings){
    showBookings(bookings)
  } else {
    console.log("no booking to see");
    showAlert(
      "Utente inesistente o computer non disponibile!",
      $("#searchBookingForm"),
      false
    );
  }

  // if (user) {
  //   $.ajax({
  //     method: "GET",
  //     url: "/nnplus/booking/getBookingsByUser",
  //     data: { user: user._id },
  //   }).done(async (data) => {
  //     console.log(data);
  //     showBookings(data);
  //   });
  // } else {
  //   $.ajax({
  //     method: "GET",
  //     url: "/nnplus/booking/getBookings",
  //   }).done(async (data) => {
  //     console.log(data);
  //     showBookings(data);
  //   });
  // }
});

function showBookings (bookings) {
  for (const booking of bookings){
    const list = document.getElementById("bookingList");

    const computer_model = adjustName(booking.computer.brand, booking.computer.model);
    const user_name = adjustName(booking.user.person.name, booking.user.person.surname);
    const color_status = statusToColor(booking.status);

    const listItem = document.createElement("li");
    listItem.innerHTML = `
    <li class="bookingElement" style="background-color:${color_status}";>
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
          <div>${booking.begin}</div>
        </div>
        <div class="endDate">
          <span class="labelTag">Fine: </span>
          <div>${booking.end}</div>
        </div>
        <div class="finalPrice">
          <span class="labelTag">Prezzo totale: </span>
          <div>${booking.final_price}</div>
        </div>
      </div>
      <div class="buttonGroup">
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editModal">Modifica</button>
        <button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal">Cancella</button>
      </div>
    </li>`;

    list.append(listItem);
    console.log("a booking has been added");
  }

  showAlert ("Lets go!", $("searchBtn"), true);
}

function statusToColor (status) {
  let color;
  switch(status) {
    case 1 : color = "rgb(138, 138, 138)"; break;
    case 2 : color = "rgb(75, 201, 54)"; break;
    case 3 : color = "rgb(215, 203, 33)"; break;
    case 4 : color = "rgb(203, 36, 36)"; break;
    case 5 : color = "rgb(32, 102, 208)"; break;
    // default: color = rgb(1, 1, 1);
    default: color = "rgb(32, 102, 208)";
  }

  return color;
}


function showAlert(text, parent, happy) {
  $("#load").remove();

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
    parent.prepend(alert);
    return;
  }
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
