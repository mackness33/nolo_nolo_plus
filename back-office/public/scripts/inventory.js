var currentlyShowing = [];

$(document).on("DOMContentLoaded", async function (event) {
  reloadItems();
  populateFilters();
});

$("#resetBtn").click(function () {
  reloadItems();
});

async function populateFilters() {
  const componentObject = await getComponents();
  const filtersList = $("#filters > div > div");

  for (let i = 0; i < filtersList.length; i++) {
    const list = $(filtersList[i]).find("ul")[0];
    const componentName = filtersList[i].dataset.filter;
    componentObject[componentName].sort();

    for (let y = 0; y < componentObject[componentName].length; y++) {
      const componentList = componentObject[componentName];
      const filterItem = document.createElement("li");
      filterItem.innerHTML = `<input type="checkbox" id="${y + componentName}">
      <label for="${y + componentName}">${componentList[y]}</label>`;

      $(list).append(filterItem);
    }
  }
}

$("#filterBtn").click(async function () {
  var allItems;
  const allComponents = await getComponents();

  await $.get("/nnplus/inv/getAll")
    .done(function (data) {
      allItems = data;
    })
    .fail(function (err) {
      conosole.error(err);
    });
  for (const [entry, value] of Object.entries(allComponents)) {
    var filters = [];
    if (entry !== "model") {
      for (let i = 0; i < value.length; i++) {
        const DOMelement = $(`#${i + entry}`);

        const filterName = DOMelement.parent().find("label").html();
        if (DOMelement[0].checked) {
          filters.push(filterName);
        }
      }
      //filters.length ? console.log(filters + " :  " + entry) : null;
      if (filters.length) {
        allItems = allItems.filter((item) => {
          return entry == "type"
            ? item[entry].some((type) => filters.includes(type))
            : filters.includes(item[entry]);
          return filters.includes(item[entry]);
        });
        console.log(allItems);
      }
    }
  }

  showItems(allItems);
});

function filter(items, component, value) {
  for (let i = 0; i < items.length; i++) {
    const element = array[i];
  }
}

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

$("#deleteModal").on("show.bs.modal", function (event) {
  $("#confirmBtn").one("click", async (evt) => {
    const id = event.relatedTarget.dataset.id;
    $.ajax({
      method: "DELETE",
      url: "/nnplus/inv/delete",
      data: { id },
    }).done((data) => {
      console.log(data);
      reloadItems();
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

function reloadItems() {
  $.get("/nnplus/inv/getAll")
    .done(function (data) {
      showItems(data);
    })
    .fail(function (err) {
      conosole.error(err);
    });
}

function showItems(items) {
  currentlyShowing = items;
  $("#itemsContainer")[0].innerHTML = "";
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
    </h5>
    <div class="info-card">
      <ul class="info-card-list">
        <li>
          <div class="info">
            <b>Tipo: </b>
            <div class="types-card set-scroll">
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
                ? item.price - item.price * (item.discount / 100)
                : item.price
            }$/giorno</span>
          </div>
        </li>
        </li>
        <li>
          <div class="text-container">
            <b>Descrizione:</b>
            <span class="desc-card text-card set-scroll">${
              item.description
            }</span>
          </div>
        </li>
        <div class="text-container">
          <b>Note:</b>
          <span class="note-card text-card set-scroll">${item.note}</span>
        </div>
        </li>
      </ul>
      <div class="card-buttons">
        <button class="btn btn-primary" data-id="${
          item._id
        }" data-bs-toggle="modal" data-bs-target="#addModal" data-origin="edit">Cambia informazioni</button>
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

  //console.log(typeof JSON.stringify(splitTypes($("#addType").val())));
  //console.log(typeof $("#addPrice").val());

  const filteredItem = {
    id: id,
    ...(newImg ? { image: newImg } : {}),

    ...(prepareInfo("#addBrand") !== item.brand
      ? { brand: prepareInfo("#addBrand") }
      : {}),

    ...(prepareInfo("#addModel") !== item.model
      ? { model: prepareInfo("#addModel") }
      : {}),

    ...(JSON.stringify(splitTypes($("#addType").val())) !==
    JSON.stringify(item.type)
      ? { type: splitTypes($("#addType").val()) }
      : {}),

    ...(prepareInfo("#addCpu") !== item.cpu
      ? { cpu: prepareInfo("#addCpu") }
      : {}),

    ...(prepareInfo("#addGpu") !== item.gpu
      ? { gpu: prepareInfo("#addGpu") }
      : {}),

    ...(prepareInfo("#addRam") !== item.ram
      ? { ram: prepareInfo("#addRam") }
      : {}),

    ...($("#addPrice").val() !== JSON.stringify(item.price)
      ? { price: $("#addPrice").val() }
      : {}),

    ...($("#addDiscount").val() !== JSON.stringify(item.discount)
      ? { discount: $("#addDiscount").val() }
      : {}),

    ...($("#addDescr").val() !== item.description
      ? { description: $("#addDescr").val() }
      : {}),

    ...($("#addCondition").val() !== JSON.stringify(item.condition)
      ? { condition: $("#addCondition").val() }
      : {}),

    ...($("#addNote").val() !== item.note ? { note: $("#addNote").val() } : {}),
  };

  function prepareInfo(infoId) {
    return $(infoId).val().toLowerCase().trim();
  }

  return filteredItem;
}
