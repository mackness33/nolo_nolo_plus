$("#addModal").on("show.bs.modal", async function (event) {
  console.log("shown");
  var arr = {};

  await $.ajax({
    type: "GET",
    url: "/nnplus/empl/attr",
    contentType: "application/json",
  })
    .done((data) => {
      arr = data;
    })
    .fail(() => {
      return "connection error";
    });

  autocompleteDefault("#addBrand", arr.brand);
  autocompleteDefault("#addModel", arr.model);
  autocompleteTypes(arr.type);
  autocompleteDefault("#addCpu", arr.cpu);
  autocompleteDefault("#addGpu", arr.gpu);
  autocompleteDefault("#addRam", arr.ram);
});

$("#addModal").on("hide.bs.modal", async function (event) {
  $("#addForm")[0].reset();
  $("#addBrand").autocomplete("destroy");
  $("#addModel").autocomplete("destroy");
  $("#addType").autocomplete("destroy");
  $("#addCpu").autocomplete("destroy");
  $("#addGpu").autocomplete("destroy");
  $("#addRam").autocomplete("destroy");
  $("#rangeValue")[0].innerHTML = "5";
});

$("#addForm").submit(async (event) => {
  event.preventDefault();
  //console.log(addForm.elements[0].files[0]);
  // const compInstance = {
  //   image: await getdataUrl(addForm.elements[0].files[0]),
  //   brand: addForm.elements[1].value,
  //   model: addForm.elements[2].value,
  //   type: ["gaming", "desktop"],
  //   cpu: addForm.elements[4].value,
  //   gpu: addForm.elements[5].value,
  //   ram: addForm.elements[6].value,
  //   price: addForm.elements[7].value,
  //   description: addForm.elements[8].value,
  //   condition: addForm.elements[9].value,
  //   note: addForm.elements[10].value,
  // };
  const compInstance = {
    image: await getdataUrl(addForm.elements[0].files[0]),
    brand: "dell".toLowerCase(),
    model: "legion".toLowerCase(),
    type: ["ultrabook", "gaming"],
    cpu: "intel i7-11000k 3.7GHz".toLowerCase(),
    gpu: "nvidia gtx 2060 6gb".toLowerCase(),
    ram: "16gb 3600MHz".toLowerCase(),
    price: 60.0,
    description: "finto",
    condition: 6,
    note: "in realta' e' vero",
  };
  console.log(compInstance);
  await $.ajax({
    type: "POST",
    url: "/nnplus/empl",
    contentType: "application/json",
    data: JSON.stringify(compInstance),
  })
    .done((data) => {
      console.log(data);
    })
    .fail(() => {
      console.log("death");
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

$(function () {
  var availableTags = [
    "ActionScript",
    "AppleScript",
    "Asp",
    "BASIC",
    "C",
    "C++",
    "Clojure",
    "COBOL",
    "ColdFusion",
    "Erlang",
    "Fortran",
    "Groovy",
    "Haskell",
    "Java",
    "JavaScript",
    "Lisp",
    "Perl",
    "PHP",
    "Python",
    "Ruby",
    "Scala",
    "Scheme",
  ];
  $("#temp2").autocomplete({
    source: availableTags,
  });
});

function autocompleteTypes(types) {
  function split(val) {
    return val.split(/,\s*/);
  }
  function extractLast(term) {
    return split(term).pop();
  }

  $("#addType")
    .on("keydown", function (event) {
      if (
        event.keyCode === $.ui.keyCode.TAB &&
        $(this).autocomplete("instance").menu.active
      ) {
        event.preventDefault();
      }
    })
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
        this.value = terms.join(",");
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
      source: list,
    })
    .focus(function () {
      $(this).autocomplete("search", "");
    });
}
