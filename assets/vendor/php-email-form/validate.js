/**
 * PHP Email Form Validation - v3.8
 * URL: https://bootstrapmade.com/php-email-form/
 * Author: BootstrapMade.com
 */
(function () {
  "use strict";

  let forms = document.querySelectorAll(".php-email-form");

  forms.forEach(function (e) {
    e.addEventListener("submit", function (event) {
      event.preventDefault();

      let thisForm = this;

      let action = thisForm.getAttribute("action");
      let recaptcha = thisForm.getAttribute("data-recaptcha-site-key");

      if (!action) {
        displayError(thisForm, "The form action property is not set!");
        return;
      }
      thisForm.querySelector(".loading").classList.add("d-block");
      thisForm.querySelector(".error-message").classList.remove("d-block");
      thisForm.querySelector(".sent-message").classList.remove("d-block");

      let formData = new FormData(thisForm);

      if (recaptcha) {
        if (typeof grecaptcha !== "undefined") {
          grecaptcha.ready(function () {
            try {
              grecaptcha
                .execute(recaptcha, { action: "php_email_form_submit" })
                .then((token) => {
                  formData.set("recaptcha-response", token);
                  php_email_form_submit(thisForm, action, formData);
                });
            } catch (error) {
              displayError(thisForm, error);
            }
          });
        } else {
          displayError(
            thisForm,
            "The reCaptcha javascript API url is not loaded!"
          );
        }
      } else {
        php_email_form_submit(thisForm, action, formData);
      }
    });
  });

  // function php_email_form_submit(thisForm, action, formData) {
  //   fetch(action, {
  //     method: "POST",
  //     body: formData,
  //     headers: { "X-Requested-With": "XMLHttpRequest" },
  //   })
  //     .then((response) => {
  //       if (response.ok) {
  //         return response.text();
  //       } else {
  //         throw new Error(
  //           `${response.status} ${response.statusText} ${response.url}`
  //         );
  //       }
  //     })
  //     .then((data) => {
  //       thisForm.querySelector(".loading").classList.remove("d-block");
  //       if (data.trim() == "OK") {
  //         thisForm.querySelector(".sent-message").classList.add("d-block");
  //         thisForm.reset();
  //       } else {
  //         throw new Error(
  //           data
  //             ? data
  //             : "Form submission failed and no error message returned from: " +
  //               action
  //         );
  //       }
  //     })
  //     .catch((error) => {
  //       displayError(thisForm, error);
  //     });
  // }

  function php_email_form_submit(thisForm, action, formData) {
    // Convert FormData to a URLSearchParams object
    const formParams = new URLSearchParams(formData);

    // Extract values from formParams
    const name = formParams.get("name");
    const email = formParams.get("email");
    const subject = formParams.get("subject");
    const message = formParams.get("message");

    // Construct the mailto link
    const emailSubject = encodeURIComponent(subject || "Default Subject");
    const emailBody = encodeURIComponent(`${message || "No Message"}`);
    const mailtoLink = `mailto:partheshdabhi7370@gmail.com?subject=${emailSubject}&body=${emailBody}`;

    // Open the default email client with the pre-filled details
    window.location.href = mailtoLink;

    // Show the sent message and reset form
    thisForm.querySelector(".loading").classList.remove("d-block");
    thisForm.querySelector(".sent-message").classList.add("d-block");
    setTimeout(function () {
      thisForm.querySelector(".sent-message").classList.remove("d-block");
    }, 5000); // Change 5000 to the desired duration in milliseconds
    thisForm.reset();
  }

  function displayError(thisForm, error) {
    thisForm.querySelector(".loading").classList.remove("d-block");
    thisForm.querySelector(".error-message").innerHTML = error;
    thisForm.querySelector(".error-message").classList.add("d-block");
  }
})();
