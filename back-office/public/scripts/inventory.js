const addForm = document.getElementById("addform");

// $("#addModal").on("show.bs.modal", (event) => {
//   $("#addType")
//     // .on("keydown", function (event) {
//     //   if (
//     //     event.keyCode === $.ui.keyCode.TAB &&
//     //     $(this).autocomplete("instance").menu.active
//     //   ) {
//     //     event.preventDefault();
//     //   }
//     // })
//     .autocomplete({
//       minLenght: 0,
//       source: async () => {
//         await $.ajax({
//           type: "GET",
//           url: "/nnplus/empl/attr",
//         })
//           .done((data) => {
//             return data;
//           })
//           .fail(() => {
//             return "connection error";
//           });
//       },
//     });
// });

$("#addform").submit(async (event) => {
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

$("#temp").click((event) => {
  $.ajax({
    type: "GET",
    url: "/nnplus/empl/attr",
  })
    .done((data) => {
      console.log(data);
    })
    .fail(() => {
      console.log("death");
    });
});
