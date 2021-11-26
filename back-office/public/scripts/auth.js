var request;
      // Bind to the submit event of our form
      // const c = document.getElementById("foo");
      // const cc = $("#foo");
      // const cf = $("form#foo");
      //
      // console.log(c);
      // console.log(cc);
      // console.log(cf);

      // c.addEventListener("submit", () => { console.log('In submit Dio cane'); } );

      $("#myForm").submit(function (event) {
        console.log('In submit finally');

        // Prevent default posting of form - put here to work in case of errors
        event.preventDefault();

        // Abort any pending request
        if (request) {
          request.abort();
        }
        // setup some local variables
        var $form = $(this);

        // Let's select and cache all the fields
        var $inputs = $form.find("input, select, button, textarea");

        // Serialize the data in the form
        var serializedData = $form.serialize();

        console.log("serializedData: " + serializedData);

        // Let's disable the inputs for the duration of the Ajax request.
        // Note: we disable elements AFTER the form data has been serialized.
        // Disabled form elements will not be serialized.
        $inputs.prop("disabled", true);

        // Fire off the request to /form.php
        request = $.ajax({
          url: "/nnplus/login",
          type: "post",
          data: serializedData
        });

        // Callback handler that will be called on success
        request.done(function (response, textStatus, jqXHR) {
          // Log a message to the console
          console.log("Hooray, it worked!");
          console.log("response: " + response);
          console.log("textStatus: " + textStatus);
          console.log("jqXHR: " + JSON.stringify(jqXHR));

          //$("html").html(response);
          window.location.href = 'http://localhost:8000/nnplus/home'; 

        });

        // Callback handler that will be called on failure
        request.fail(function (jqXHR, textStatus, errorThrown) {
          // Log the error to the console
          console.error(
            "The following error occurred: " + textStatus, errorThrown
          );
        });

        // Callback handler that will be called regardless
        // if the request failed or succeeded
        request.always(function () {
          // Reenable the inputs
          $inputs.prop("disabled", false);
        });

      });

    // function hola (){
    //   $.ajax({
    //     url: "/nnplus/home",
    //     type: "get"
    //     // data: serializedData
    //   });
    // }