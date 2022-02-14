var currentlyShowing = [];

$(document).ajaxComplete(checkSession);

$(document).on("DOMContentLoaded", async function (event) {
  await reloadItems();
  populateFilters();
  if (sessionStorage.getItem("itemId")) {
    const id = sessionStorage.getItem("itemId");
    sessionStorage.clear();
    showItems(currentlyShowing.filter((item) => item._id === id));
  }
});

$("#searchBtn").click(async function () {
  const id = $("#searchText").val();
  const allItems = await getAllItems();
  showItems(allItems.filter((item) => item._id == id));
});

$("#resetBtn").click(function () {
  reloadItems();
  populateFilters();
  $("#searchText").val("");
});

async function populateFilters() {
  const componentObject = await getComponents();
  const filtersList = $("#filters > div > div[data-filter]");

  for (let i = 0; i < filtersList.length; i++) {
    const list = $(filtersList[i]).find("ul")[0];
    list.innerHTML = "";
    const componentName = filtersList[i].dataset.filter;
    componentObject[componentName].sort();

    for (let y = 0; y < componentObject[componentName].length; y++) {
      const componentList = componentObject[componentName];
      const filterItem = document.createElement("li");
      filterItem.innerHTML = `<input type="checkbox" id="${y + componentName}">
      <label for="${y + componentName}" data-entry="${componentName}">${
        componentList[y]
      }</label>`;

      $(list).append(filterItem);
    }
    const allItems = await getAllItems();
    const min = Math.min(...allItems.map((item) => item.price));
    const max = Math.max(...allItems.map((item) => item.price));
    $("#minPrice").val(min).attr("min", min).attr("max", max).next().html(min);
    $("#maxPrice").val(max).attr("min", min).attr("max", max).next().html(max);
  }
}

$("#filterBtn").click(async function () {
  applyFilters();
});

async function applyFilters() {
  const checks = $("#filters > div > div[data-filter]")
    .find("input:checked")
    .parent()
    .find("label");
  var filters = {};
  for (let i = 0; i < checks.length; i++) {
    if (!filters[checks[i].dataset.entry]) {
      filters[checks[i].dataset.entry] = [];
    }
    filters[checks[i].dataset.entry].push(checks[i].innerHTML);
  }
  var filters = {};
  for (let i = 0; i < checks.length; i++) {
    if (!filters[checks[i].dataset.entry]) {
      filters[checks[i].dataset.entry] = [];
    }
    filters[checks[i].dataset.entry].push(checks[i].innerHTML);
  }
  filters.price = {};
  filters.price["$gte"] = $("#minPrice").val();
  filters.price["$lte"] = $("#maxPrice").val();

  await $.ajax({
    method: "GET",
    url: "/nnplus/inv/filter",
    data: { data: JSON.stringify(filters) },
  })
    .done((data) => {
      console.log(data);
      showItems(data);
    })
    .fail((err) => {
      console.log(err);
    });
}

$("#clearFilterBtn").click(function () {
  $("#filters > div > div").find("input:checked").prop("checked", false);
  $("#minPrice")
    .val($("#minPrice").attr("min"))
    .next()
    .html($("#minPrice").val());
  $("#maxPrice")
    .val($("#maxPrice").attr("max"))
    .next()
    .html($("#maxPrice").val());
  reloadItems();
});

$("#discountModal").on("show.bs.modal", async function (event) {
  populateDiscountList();

  $("body").on("change", "#bulkDiscountRange", (event) => {
    const newDiscount = event.target.value;
    showDiscount(newDiscount);
  });

  $("body").on("click", "#confirmDiscountBtn", async (event) => {
    const newDiscountValue = $("#bulkDiscountRange").val();
    var success = true;
    for (let i = 0; i < currentlyShowing.length; i++) {
      await $.ajax({
        method: "PUT",
        url: "/nnplus/inv/editOne",
        data: { id: currentlyShowing[i]._id, discount: newDiscountValue },
      })
        .done(async (data) => {
          console.log(data);
          success = success && true;

          $("#filterBtn").trigger("click");
        })
        .fail((err) => {
          console.los(err);
          success = success && false;
        });
    }

    success
      ? showAlert(
          "Sconto aggiornato con successo",
          event.target.parentElement,
          true
        )
      : showAlert(
          "Sconto aggiornato con successo",
          event.relatedTarget.parentElement,
          true
        );
  });
});

function showDiscount(newDisc) {
  const list = $("#discountList > ul");
  for (let i = 0; i < currentlyShowing.length; i++) {
    const newDiscSpan = $(list).find(
      `span[data-id=${currentlyShowing[i]._id}]`
    );
    newDiscSpan.html(
      (
        currentlyShowing[i].price -
        (currentlyShowing[i].price * newDisc) / 100
      ).toFixed(2)
    );
  }
}

function populateDiscountList() {
  const list = $("#discountList > ul");
  for (const i in currentlyShowing) {
    const item = currentlyShowing[i];
    const listItem = document.createElement("li");
    listItem.innerHTML = `
    <b>${item.brand.toUpperCase()} ${item.model.toUpperCase()}</b>
    <div>Sconto attuale: ${item.discount}%</div>
    <div>prezzo scontato attuale: ${
      item.discount
        ? (item.price - item.price * (item.discount / 100)).toFixed(2)
        : item.price
    }</div>
    <div>nuovo prezzo scontato: <span data-id="${item._id}"></span></div>`;
    list.append(listItem);
  }

  showDiscount(0);
}

$("#discountModal").on("hide.bs.modal", async function (event) {
  $("#discountList > ul").html("");
  $("body").off("change", "#bulkDiscountRange");
  $("body").off("click", "#confirmDiscountBtn");
  $("#bulkDiscountRange").val(0).next().html("0");
});

$("#addModal").on("show.bs.modal", async function (event) {
  await reloadAutocomplete();
  if (event.relatedTarget.dataset.origin == "add") {
    addModal();
  } else {
    editModal(event);
  }
});

async function addModal() {
  $("#addTitle")[0].innerHTML = "Aggiungi Computer";
  $("#addButton")[0].innerHTML = "Aggiungi";
  $("#addImage").prop("required", true);

  $("body").on("submit", "#addForm", async (event) => {
    event.preventDefault();
    const form = $("#addForm")[0];

    var types = splitTypes(form.elements[3].value);

    const compInstance = {
      image: await getdataUrl(form.elements[0].files[0]),
      brand: form.elements[1].value.toLowerCase(),
      model: form.elements[2].value.toLowerCase(),
      type: types,
      cpu: form.elements[4].value.toLowerCase(),
      gpu: form.elements[5].value.toLowerCase(),
      ram: form.elements[6].value.toLowerCase(),
      price: form.elements[7].value,
      discount: form.elements[8].value,
      description: form.elements[9].value,
      condition: form.elements[10].value,
      note: form.elements[11].value,
    };
    console.log(compInstance);
    await $.ajax({
      type: "POST",
      url: "/nnplus/inv/insert",
      contentType: "application/json",
      data: JSON.stringify(compInstance),
      beforeSend: showAlert("", $("#addButton")[0].parentElement),
    })
      .done(async (data) => {
        console.log(data);
        showAlert(
          "Computer aggiunto con successo",
          $("#addButton")[0].parentElement,
          true
        );
        $("#addForm")[0].reset();
        $("#rangeValue")[0].innerHTML = "5";
        await reloadAutocomplete();
        await populateFilters();
      })
      .fail(() => {
        console.log("death");
        showAlert(
          "Errore durante l'aggiunta, riprovare",
          $("#addButton")[0].parentElement,
          false
        );
      });
    reloadItems();
  });
}

async function editModal(event) {
  $("#addTitle")[0].innerHTML = "Modifica Computer";
  $("#addButton")[0].innerHTML = "Salva modifiche";
  $("#addImage").removeAttr("required");
  var item;
  console.log(event.relatedTarget.dataset.id);

  await $.get("/nnplus/inv/getOne", {
    id: event.relatedTarget.dataset.id,
  }).done((data) => {
    item = data;
  });
  populateModal(item);

  $("body").on("submit", "#addModal", async function (evt) {
    evt.preventDefault();
    await $.get("/nnplus/inv/getOne", {
      id: event.relatedTarget.dataset.id,
    }).done((data) => {
      item = data;
    });
    const newItem = await getModalData(item, event.relatedTarget.dataset.id);

    console.log(newItem);
    $.ajax({
      method: "PUT",
      url: "/nnplus/inv/editOne",
      data: newItem,
      beforeSend: showAlert("", $("#addButton")[0].parentElement),
    })
      .done(async (data) => {
        console.log(data);
        reloadItems();
        showAlert(
          "Dati aggiornati con successo",
          $("#addButton")[0].parentElement,
          true
        );
        await reloadAutocomplete();
        await populateFilters();
      })
      .fail((err) => {
        console.error(err);
        showAlert(
          "Errore durante l'aggiornamento",
          $("#addButton")[0].parentElement,
          false
        );
      });
  });
}

$("#addModal").on("hide.bs.modal", function (event) {
  $("#addForm")[0].reset();
  $("body").off("submit", "#addModal");
  $("#addBrand").autocomplete("destroy");
  $("#addModel").autocomplete("destroy");
  $("#addType").autocomplete("destroy");
  $("#addCpu").autocomplete("destroy");
  $("#addGpu").autocomplete("destroy");
  $("#addRam").autocomplete("destroy");
  $("#rangeValue")[0].innerHTML = "5";
});

$("#bookingModal").on("show.bs.modal", async function (event) {
  autocompleteUser();
  $("#addComputer").val(event.relatedTarget.dataset.id);
  const computerId = event.relatedTarget.dataset.id;
  const alreadyBooked = await getBookedDates(computerId);

  // function dateFilter(date) {
  //   console.log(alreadyBooked);
  //   for (let i = 0; i < alreadyBooked.length; i++) {
  //     const begin = new Date(alreadyBooked[i].begin).getTime();
  //     const end = new Date(alreadyBooked[i].end).getTime();
  //     var current = new Date(date);
  //     current.setTime(current.getTime() + 1 * 60 * 60 * 1000);
  //     current = current.getTime();
  //     if (begin <= current && current <= end) {
  //       console.log(alreadyBooked[i].begin);
  //       return [false];
  //     }
  //   }
  //   return [true];
  // }

  // from = $("#addStartDate").datepicker({
  //   changeMonth: true,
  //   numberOfMonths: 1,
  //   beforeShowDay: dateFilter,
  // });

  // to = $("#addEndDate").datepicker({
  //   changeMonth: true,
  //   numberOfMonths: 1,
  //   beforeShowDay: dateFilter,
  // });
  setUpDatepicker(alreadyBooked);
  var valid = true;

  $("body").on("click", "#evalBtn", async (event) => {
    try {
      var beginChoice = $("#addStartDate").datepicker("getDate").getTime();
      var endChoice = $("#addEndDate").datepicker("getDate").getTime();
    } catch (error) {
      valid = false;
    }

    for (let i = 0; i < alreadyBooked.length; i++) {
      const begin = new Date(alreadyBooked[i].begin).getTime();
      const end = new Date(alreadyBooked[i].end).getTime();
      if (beginChoice < begin && end < endChoice) {
        valid = false;
      }
    }

    var user;
    await $.ajax({
      method: "GET",
      url: "/nnplus/user/getOne",
      data: { mail: $("#addUser").val() },
    }).done((data) => {
      user = data;
    });
    if (user && valid && beginChoice < endChoice) {
      console.log($("#addStartDate").val() + "   " + $("#addEndDate").val());

      await $.ajax({
        method: "GET",
        url: "/nnplus/inv/getOne",
        data: { id: computerId },
      }).done(async (data) => {
        await bookingPreview(
          user,
          data,
          $("#addStartDate").val(),
          $("#addEndDate").val()
        );
      });
    } else {
      $("#addStartDate").val("");
      $("#addEndDate").val("");
      showAlert(
        "utente inesistente o periodo non disponibile!",
        event.target.parentElement,
        false
      );
      $("#bookingPreview").prop("hidden", true);
    }
  });
});

async function getBookedDates(id) {
  var alreadyBooked = [];
  await $.ajax({
    method: "GET",
    url: "/nnplus/booking/getBookingsByItem",
    data: { id },
  })
    .done((data) => {
      alreadyBooked = data;
      console.log(alreadyBooked);
    })
    .fail((err) => {
      console.error(err);
    });

  return alreadyBooked;
}

function setUpDatepicker(alreadyBooked) {
  $("#addStartDate").datepicker("destroy");
  $("#addEndDate").datepicker("destroy");
  function dateFilter(date) {
    for (let i = 0; i < alreadyBooked.length; i++) {
      const begin = new Date(alreadyBooked[i].begin).getTime();
      const end = new Date(alreadyBooked[i].end).getTime();
      var current = new Date(date);
      current.setTime(current.getTime() + 1 * 60 * 60 * 1000);
      current = current.getTime();
      if (begin <= current && current <= end) {
        return [false];
      }
    }
    return [true];
  }

  from = $("#addStartDate").datepicker({
    changeMonth: true,
    numberOfMonths: 1,
    beforeShowDay: dateFilter,
  });

  to = $("#addEndDate").datepicker({
    changeMonth: true,
    numberOfMonths: 1,
    beforeShowDay: dateFilter,
  });
}

async function bookingPreview(user, computer, begin, end) {
  // clean everything at every reload

  $("#addBookingBtn").removeClass("disabled");
  $("body").off("click", "#pointsBtn");
  $("body").off("click", "#addDiscountBtn");
  $("body").off("submit", "#addBookingForm");
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

  $("body").on("submit", "#addBookingForm", async (event) => {
    event.preventDefault();

    const correctBegin = new Date(begin);
    correctBegin.setTime(correctBegin.getTime() + 1 * 60 * 60 * 1000);
    const correctEnd = new Date(end);
    correctEnd.setTime(correctEnd.getTime() + 1 * 60 * 60 * 1000);

    const booking = {
      user: user._id,
      computer: computer._id,
      begin: correctBegin,
      end: correctEnd,
      discounts: discountList,
      starting_price: computer.price * days,
      final_price: price,
      note: $("#addNote").val(),
      points: usedPoints,
    };
    await $.ajax({
      method: "POST",
      url: "/nnplus/booking/addOne",
      data: { data: JSON.stringify(booking) },
    })
      .done((data) => {
        showAlert(
          "Noleggio creato con successo!",
          $("#addBookingBtn")[0].parentElement,
          true
        );
        $("#bookingPreview").prop("hidden", true);
        $("#addBookingForm")[0].reset();
        $("#addComputer").val(computer._id);
        $("#addBookingBtn").addClass("disabled");
      })
      .fail((err) => {
        console.log(err);
      });
    let alreadyBooked = await getBookedDates(computer._id);
    setUpDatepicker(alreadyBooked);
  });
}

// makes fisrt letter of name and surname upercase and return object
function adjustName(name, surname) {
  const newName = name.charAt(0).toUpperCase() + name.slice(1);

  const newSurname = surname.charAt(0).toUpperCase() + surname.slice(1);

  return { name: newName, surname: newSurname };
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

$("#bookingModal").on("hide.bs.modal", async function (event) {
  $("#addBookingBtn").addClass("disabled");
  $("#bookingPreview").prop("hidden", true);
  $("#addBookingForm")[0].reset();
  $("body").off("click", "#evalBtn");
});

$("#deleteModal").on("show.bs.modal", function (event) {
  $("#confirmBtn").one("click", async (evt) => {
    const id = event.relatedTarget.dataset.id;
    $.ajax({
      method: "DELETE",
      url: "/nnplus/inv/delete",
      data: { id },
    }).done(async (data) => {
      console.log(data);
      await reloadItems();
      await populateFilters();
    });
  });
});

function getdataUrl(img) {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(img);
  });
}

async function getComponents() {
  var arr = {};

  await $.ajax({
    type: "GET",
    url: "/nnplus/inv/allComponents",
    contentType: "application/json",
  })
    .done((data) => {
      arr = data;
    })
    .fail(() => {
      return "connection error";
    });

  return arr;
}

function autocompleteTypes(types) {
  types.sort();
  function split(val) {
    return val.split(/,\s*/);
  }
  function extractLast(term) {
    return split(term).pop();
  }

  $("#addType")
    .autocomplete({
      minLength: 0,
      source: function (request, response) {
        // delegate back to autocomplete, but extract the last term
        response($.ui.autocomplete.filter(types, extractLast(request.term)));
      },
      focus: function () {
        // prevent value inserted on focus
        return false;
      },
      select: function (event, ui) {
        var terms = split(this.value);
        // remove the current input
        terms.pop();
        // add the selected item
        terms.push(ui.item.value);
        // add placeholder to get the comma-and-space at the end
        terms.push("");
        this.value = terms.join(", ");
        return false;
      },
    })
    .focus(function () {
      $(this).autocomplete("search", "");
    });
}

function autocompleteDefault(DOMelement, list) {
  $(DOMelement)
    .autocomplete({
      minLength: 0,
      source: list.sort(),
    })
    .focus(function () {
      $(this).autocomplete("search", "");
    });
}

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

async function reloadAutocomplete() {
  var arr = {};

  arr = await getComponents();

  autocompleteDefault("#addBrand", arr.brand);
  autocompleteDefault("#addModel", arr.model);
  autocompleteTypes(arr.type);
  autocompleteDefault("#addCpu", arr.cpu);
  autocompleteDefault("#addGpu", arr.gpu);
  autocompleteDefault("#addRam", arr.ram);
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

async function getAllItems() {
  var items;
  await $.get("/nnplus/inv/getAll")
    .done(function (data) {
      items = data;
    })
    .fail(function (err) {
      console.error(err);
    });
  return items;
}

async function reloadItems() {
  await $.get("/nnplus/inv/getAll")
    .done(function (data) {
      showItems(data);
    })
    .fail(function (err) {
      console.error(err);
    });
}

function showItems(items) {
  currentlyShowing = items;
  $("#itemsContainer")[0].innerHTML = "";

  if (isEmpty(items)) {
    return;
  }

  items.forEach((item) => {
    const itemElement = document.createElement("div");
    itemElement.setAttribute(
      "class",
      "item-instance col-lg-2 col-md-3 col-sm-4"
    );
    itemElement.innerHTML = `<div class="card">
  <img class="card-img-top"
    src="${item.image}" alt=""
    srcset="">
  </img>
  <div class="card-body">
    <h5 class="card-title" tabindex="0">
      <div class="brand-card">${item.brand.toUpperCase()}</div>
      <div class="model-card">${item.model.toUpperCase()}</div>
      <div class="ref-card">Rif: ${item._id}</div>
    </h5>
    <div class="info-card">
      <ul class="info-card-list">
        <li>
          <div class="info">
            <b>Tipo: </b>
            <div class="types-card">
              <ul>
              </ul>
            </div>
          </div>
        </li>
        <li>
          <div class="info">
            <b>Processore:</b>
            <span class="cpu-card">${item.cpu.toUpperCase()}</span>
          </div>
        </li>
        <li>
          <div class="info">
            <b>Scheda grafica:</b>
            <span class="gpu-card">${item.gpu.toUpperCase()}</span>
          </div>
        </li>
        <li>
          <div class="info">
            <b>Memoria:</b>
            <span class="ram-card">${item.ram.toUpperCase()}</span>
          </div>
        </li>
        <li>
          <div class="info">
            <b>Condizione:</b>
            <span class="condition-card">${item.condition}/10</span>
          </div>
        </li>
        <li>
          <div class="info">
            <b>Prezzo originale:</b>
            <span class="price-card">${item.price}$/giorno</span>
          </div>
        </li>
        <li>
          <div class="info">
            <b>Sconto:</b>
            <span class="discount-card">${
              item.discount ? item.discount : 0
            }%</span>
          </div>
          <li>
          <div class="info">
            <b>Prezzo scontato:</b>
            <span class="price-card">${
              item.discount
                ? (item.price - item.price * (item.discount / 100)).toFixed(2)
                : item.price
            }$/giorno</span>
          </div>
        </li>
        </li>
        <li>
          <div class="text-container">
            <b>Descrizione:</b>
            <span class="desc-card">${item.description}</span>
          </div>
        </li>
        <div class="text-container">
          <b>Note:</b>
          <span class="note-card ">${item.note}</span>
        </div>
        </li>
      </ul>
      <div class="card-buttons">
        <button class="btn btn-primary" data-id="${
          item._id
        }" data-bs-toggle="modal" data-bs-target="#addModal" data-origin="edit">Cambia informazioni</button>
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#bookingModal" data-id="${
          item._id
        }">Noleggia computer</button>
        <button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal" data-id="${
          item._id
        }">Elimina</button>
      </div>
    </div>
  </div>
</div>`;
    const typeList = $(itemElement).find(".types-card > ul")[0];
    for (let index = 0; index < item.type.length; index++) {
      const listItem = document.createElement("li");
      listItem.innerHTML = item.type[index];
      $(typeList).append(listItem);
    }
    $("#itemsContainer").append(itemElement);
  });
}

function isEmpty(items) {
  $("#notFound").remove();
  $("#bulkDiscountBtn").removeClass("disabled");

  if (!items.length) {
    const notFound = document.createElement("h3");
    notFound.setAttribute("id", "notFound");
    notFound.innerHTML = "Nessun computer trovato...:C";
    $("#bulkDiscountBtn").addClass("disabled");
    $(".items-list").append(notFound);
  } else {
    return false;
  }
}

function populateModal(item) {
  $("#addBrand")[0].value = item.brand;
  $("#addModel")[0].value = item.model;
  $("#addCpu")[0].value = item.cpu;
  $("#addGpu")[0].value = item.gpu;
  $("#addRam")[0].value = item.ram;
  $("#addPrice")[0].value = item.price;
  console.log(item.discount ? item.discount : 0);
  $("#addDiscount")[0].value = item.discount ? item.discount : 0;
  $("#addDescr")[0].value = item.description;
  $("#rangeValue")[0].innerHTML = "66";
  $("#rangeValue")[0].innerHTML = item.condition;
  $("#addCondition")[0].value = item.condition;
  $("#addNote")[0].value = item.note;

  var typeString = "";
  for (let index = 0; index < item.type.length; index++) {
    typeString = typeString.concat(item.type[index]);
    typeString = typeString + ", ";
  }

  $("#addType")[0].value = typeString;
}

function splitTypes(string) {
  var types = string.toLowerCase().split(", ");
  if (types[types.length - 1] == "") {
    types.pop();
  }
  return types;
}

async function getModalData(item, id) {
  var newImg;
  console.log("sonq");
  if ($("#addImage")[0].value) {
    newImg = await getdataUrl($("#addImage")[0].files[0]);
  } else {
    newImg = null;
  }

  const filteredItem = {
    id: id,
    ...(newImg ? { image: newImg } : {}),
    brand: $("#addBrand").val(),
    model: $("#addModel").val(),
    type: splitTypes($("#addType").val()),
    cpu: $("#addCpu").val(),
    gpu: $("#addGpu").val(),
    ram: $("#addRam").val(),
    price: $("#addPrice").val(),
    discount: $("#addDiscount").val(),
    description: $("#addDescr").val(),
    condition: $("#addCondition").val(),
    note: $("#addNote").val(),
  };
  return filteredItem;
}

function checkSession(evt, xhr, options) {
  console.log(xhr);
  if (xhr.getResponseHeader("content-type").includes("html")) {
    window.location.href = "/nnplus/login";
  }
}
