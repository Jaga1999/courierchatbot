$(document).ready(function () {
  var sendBtn = $("#send");
  var converse = $("#converse");
  var textbox = $("#textbox");
  let isLoggedIn = false;
  let globalUsername = "";

  // Define HTML form for file upload
  const fileUploadForm = `
   <form id="file-upload-form" enctype="multipart/form-data">
   <div class="alert alert-info file-upload-form">
     Please select a file to upload:
   </div>
   <div class="form-group">
     <label for="file" class="form-label">Choose file:</label>
     <input type="file" class="form-control-file" id="file" name="file">
   </div>
   <button type="submit" class="btn btn-primary">Upload</button>
   <button type="button" id="cancel-form" class="btn btn-secondary">Cancel</button>
 </form> 
 `;

  // Define HTML forms for the four options
  const loginForm = `
  <form id='login-form'>
    <div class="alert alert-info track-form">
      Please Login to track your parcel:
    </div>
    <div class='form-group'>
      <label for='c_username'>Username:</label>
      <input type='text' class='form-control' id='c_username' name='c_username' required>
    </div>
    <div class='form-group'>
      <label for='c_password'>Password:</label>
      <input type='password' class='form-control' id='c_password' name='c_password' required>
    </div>
    <button type='submit' class='btn btn-primary'>Login</button>
    <button type='button' id='cancel-btn' class='btn btn-secondary ml-3'>Cancel</button>
    <p class="mt-3">Don't have an account yet? <a href="#" id="register">Register now</a>.</p>
  </form>
`;

  const LogoutButton = `<button id='logout-btn' class='btn btn-secondary' style='position: absolute; top: 15px; right: 60px;'>LogOut</button>`;

  const registerForm = `
  <form id="register-form">
    <div class="alert alert-info track-form">
        Please Enter details for register:
    </div>
    <div class="form-group">
      <label for="username">Username:</label>
      <input type="text" class="form-control" id="username" name="username" required>
    </div>
    <div class="form-group">
      <label for="email">Email:</label>
      <input type="email" class="form-control" id="email" name="email" required>
    </div>
    <div class="form-group">
      <label for="password">Password:</label>
      <input type="password" class="form-control" id="password" name="password" required>
    </div>
    <div class="form-group">
      <label for="confirm-password">Confirm Password:</label>
      <input type="password" class="form-control" id="confirm-password" name="confirm-password" required>
			<span id='message' class='alert-danger'></span>
    </div>
    <button type="submit" class="btn btn-primary" id="submitBtn">Register</button>
    <button type="button" class="btn btn-secondary" id='cancel-btn'>Cancel</button>
    <p class="mt-3">Already registered? <a href="#" id="back-login">Log-In</a>.</p>
  </form>
`;

  var trackForm = `
  <form id="track-form">
    <div class="alert alert-info track-form">
      Please enter the parcel tracking number:
    </div>
    <div class="form-group">
      <label for="tracking-number">Tracking Number:</label>
      <input type="text" class="form-control" id="tracking-number" name="tracking-number" required>
    </div>
    <input type="submit" class="btn btn-primary" value="Track">
    <button type="button" id="cancel-form" class="btn btn-secondary">Cancel</button>
  </form>
`;

  var quoteForm = `
  <form id="quote-form">
    <div class="alert alert-info quotation-form">
      Please enter the package dimensions and weight:
    </div>
    <div class="form-group">
      <label for="from-location">From Location:</label>
      <input type="text" class="form-control" id="from-location" name="from-location" required>
    </div>
    <div class="form-group">
      <label for="to-location">To Location:</label>
      <input type="text" class="form-control" id="to-location" name="to-location" required>
    </div>
    <div class="form-group">
      <label for="weight">Weight (in kg):</label>
      <input type="number" class="form-control" id="weight" name="weight" required>
    </div>
    <input type="submit" class="btn btn-primary" value="Get Quote">
    <button type="button" id="cancel-form" class="btn btn-secondary">Cancel</button>
  </form>
`;

  var franchiseForm = `
  <form id="franchise-form">
    <div class="alert alert-info franchise-form">
      Please enter your details to receive more information about our franchise opportunities:
    </div>
    <div class="form-group">
      <label for="name">Name:</label>
      <input type="text" class="form-control" id="name" name="name" required>
    </div>
    <div class="form-group">
      <label for="email">Email:</label>
      <input type="email" class="form-control" id="email" name="email" required>
    </div>
    <div class="form-group">
      <label for="mobile">Mobile:</label>
      <input type="tel" class="form-control" id="mobile" name="mobile" required>
    </div>
    <div class="form-group">
      <label for="city">City:</label>
      <select class="form-control" id="city" name="city" required>
        <option value="">Select City</option>
        <option value="Mumbai">Mumbai</option>
        <option value="Delhi">Delhi</option>
        <option value="Bangalore">Bangalore</option>
        <option value="Hyderabad">Hyderabad</option>
        <option value="Chennai">Chennai</option>
      </select>
    </div>
    <div class="form-group">
      <label for="address">Address:</label>
      <input type="text" class="form-control" id="address" name="address" required>
    </div>
    <div class="form-group">
      <label for="pincode">Pincode:</label>
      <input type="text" class="form-control" id="pincode" name="pincode" required>
    </div>
    <input type="submit" class="btn btn-primary" value="Submit">
    <button type="button" id="cancel-form" class="btn btn-secondary">Cancel</button>
  </form>
`;

  // Define function to add bot messages
  function addBotItem(message) {
    converse.append(
      '<p class="bot-message regular p-2 me-3 mb-1 text-white" style="border-radius:15px;background-color: #3f8fd2;"><strong>Bot:</strong> ' +
        message +
        "</p>"
    );
    converse.scrollTop(converse.prop("scrollHeight"));
  }

  // Define function to add user messages
  function addUserItem(message) {
    converse.append(
      '<p class="user-message regular p-2 ms-3 mb-1" style="border-radius:15px;background-color: #c0c4c9;"><strong>You:</strong> ' +
        message +
        "</p>"
    );
    converse.scrollTop(converse.prop("scrollHeight"));
  }

  // Define function to handle "track my parcel" option
  function trackParcel() {
    converse.append(trackForm);
    $("#tracking-number").focus();
    converse.scrollTop(converse.prop("scrollHeight"));
    var trackingNumber; // declare trackingNumber variable outside the submit function
    var user;
    if (globalUsername === "") {
      user = "guest user";
    } else {
      user = globalUsername;
    }
    $("#track-form").submit(function (e) {
      e.preventDefault();
      trackingNumber = $(this).find('input[name="tracking-number"]').val();
      if (trackingNumber !== "") {
        // Make AJAX request to get parcel tracking data
        $.post(
          "getresponse.php",
          { tracker_id: trackingNumber, trackuser: user },
          function (data) {
            var data = JSON.parse(data);
            addBotItem(
              "Here is the tracking information for parcel " +
                trackingNumber +
                ":<br>" +
                "Current status: " +
                data.status +
                ":<br>" +
                "Current City: " +
                data.city
            );
          }
        );
        converse.find("#track-form").remove();
      } else {
        addBotItem("Please enter a valid tracking number.");
      }
    });
    $("#cancel-form").click(function (e) {
      e.preventDefault();
      converse.find("#track-form").remove();
    });
  }

  function login() {
    converse.append(loginForm);
    $("#c_username").focus();
    converse.scrollTop(converse.prop("scrollHeight"));
    $("#login-form").submit(function (e) {
      e.preventDefault();
      username = $(this).find('input[name="c_username"]').val();
      password = $(this).find('input[name="c_password"]').val();
      $.post(
        "getresponse.php",
        { username: username, password: password },
        function (data) {
          if (data === "success") {
            converse.find("#login-form").remove();
            converse.append(LogoutButton);
            $("#logout-btn").click(() => {
              converse.find("#logout-btn").remove();
              if (converse.find("#track-form")) {
                converse.find("#track-form").remove();
              }
              isLoggedIn = 0;
              globalUsername = "";
              addBotItem("Logged Out Successfully!");
              setTimeout(() => {
                converse.empty();
                initial();
                optionmessage();
              }, 1000);
            });
            isLoggedIn = 1;
            globalUsername = username;
            trackParcel();
          } else if (data === "password incorrect") {
            converse.find("#login-form").remove();
            converse.append(
              "<div class='alert alert-info'>password Incorrect! Try again</div>."
            );
          } else if (data === "username not found") {
            converse.find("#login-form").remove();
            addBotItem(
              "<div class='alert alert-info'>Username Not Found! Try again</div>."
            );
          } else {
            converse.find("#login-form").remove();
            addBotItem("Login failed. Please try again.");
          }
        }
      );
    });
    $("#cancel-btn").click(function (e) {
      e.preventDefault();
      converse.find("#login-form").remove();
    });
    $("#register").click(function (e) {
      e.preventDefault();
      converse.find("#login-form").remove();
      handleRegisterClick();
    });
  }

  function handleRegisterClick() {
    converse.find("#login-form").remove();
    converse.append(registerForm);
    $("#username").focus();
    converse.scrollTop(converse.prop("scrollHeight"));
    var password = converse.find("#password");
    var retypePassword = converse.find("#confirm-password");
    var message = converse.find("#message");
    var submitBtn = converse.find("#submitBtn");

    function validatePassword() {
      if (password.val() != retypePassword.val()) {
        message.html("Passwords do not match!");
        submitBtn.prop("disabled", true);
      } else {
        message.html("");
        submitBtn.prop("disabled", false);
      }
    }
    retypePassword.on("blur", validatePassword);

    $("#register-form").submit(function (e) {
      e.preventDefault();
      user = $(this).find('input[name="username"]').val();
      pass = $(this).find('input[name="password"]').val();
      retypepassS = $(this).find('input[name="confirm-password"]').val();
      email = $(this).find('input[name="email"]').val();
      $.post(
        "getresponse.php",
        { newuser: user, pass: pass, email: email },
        function (data) {
          if (data === "success") {
            converse.find("#register-form").remove();
            converse.append(
              "<div class='alert alert-info'>User Registered Successfully!</div>"
            );
          } else if (data === "username_taken") {
            converse.find("#register-form").remove();
            converse.append(
              "<div class='alert alert-danger'>Username already Exist! Try again with another Username.</div>"
            );
          } else if (data === "email_taken") {
            converse.find("#register-form").remove();
            converse.append(
              "<div class='alert alert-danger'>Email already Exist! Try again with another Email.</div>"
            );
          } else {
            converse.find("#register-form").remove();
            converse.append("Register failed. Please try again.");
          }
        }
      );
    });

    $("#cancel-btn").click(function (e) {
      e.preventDefault();
      converse.find("#register-form").remove();
    });
    $("#back-login").click(function (e) {
      e.preventDefault();
      converse.find("#register-form").remove();
      login();
    });
  }

  function uploadFile() {
    converse.append(fileUploadForm);
    $("#file").focus();
    converse.scrollTop(converse.prop("scrollHeight"));
    if (globalUsername === "") {
      user = "guest user";
    } else {
      user = globalUsername;
    }
    $("#file-upload-form").submit(function (event) {
      event.preventDefault();
      var formData = new FormData(this);
      formData.append("user", user);
      fetch("getresponse.php", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            return response.text();
          } else {
            throw new Error("Network response was not ok");
          }
        })
        .then((data) => {
          if (data === "success") {
            addBotItem("File uploaded successfully");
            converse.find("#file-upload-form").remove();
          }
        })
        .catch((error) => {
          addBotItem("Something went wrong! try again!");
          console.error("Error:", error);
          converse.find("#file-upload-form").remove();
        });
    });

    $("#cancel-form").click(function (e) {
      e.preventDefault();
      converse.find("#file-upload-form").remove();
    });
  }

  // Define function to handle "quotation" option
  function getQuote() {
    converse.append(quoteForm);
    $("#from-location").focus();
    converse.scrollTop(converse.prop("scrollHeight"));

    $("#quote-form").submit(function (e) {
      e.preventDefault();
      var fromLocation = $(this).find('input[name="from-location"]').val();
      var toLocation = $(this).find('input[name="to-location"]').val();
      var weight = $(this).find('input[name="weight"]').val();
      var quote = calculateQuote(fromLocation, toLocation, weight);
      var user;
      if (globalUsername === "") {
        user = "guest user";
      } else {
        user = globalUsername;
      }
      if (quote !== null) {
        $.post(
          "getresponse.php",
          {
            quotationuser: user,
          },
          function (data) {
            if (data === "success") {
              addBotItem(
                "The estimated shipping cost from: " +
                  fromLocation.toUpperCase() +
                  " To: " +
                  toLocation.toUpperCase() +
                  " of Weight " +
                  weight +
                  " KG is $" +
                  quote
              );
            } else {
              addBotItem("Something went wrong in quotation.");
            }
          }
        );
      } else {
        addBotItem("Something went wrong. Please try again.");
      }
      converse.find("#quote-form").remove();
    });
    $("#cancel-form").click(function (e) {
      e.preventDefault();
      converse.find("#quote-form").remove();
    });
  }

  function calculateQuote(fromLocation, toLocation, weight) {
    // Check if all fields are valid
    if (fromLocation !== "" && toLocation !== "" && weight !== "") {
      // Perform quotation calculation
      const baseCharge = 50;
      const perKgCharge = 10;
      const courierCharge =
        weight > 1 ? baseCharge + (weight - 1) * perKgCharge : baseCharge; // Simple calculation for demonstration purposes

      return courierCharge.toFixed(2);
    } else {
      return null;
    }
  }

  // Define function to handle "franchise" option
  function getFranchise() {
    converse.append(franchiseForm);
    $("#name").focus();
    converse.scrollTop(converse.prop("scrollHeight"));

    $("#franchise-form").submit(function (e) {
      e.preventDefault();
      var name = $(this).find('input[name="name"]').val();
      var email = $(this).find('input[name="email"]').val();
      var phone = $(this).find('input[name="mobile"]').val();
      var city = $(this).find('select[name="city"]').val();
      var address = $(this).find('input[name="address"]').val();
      var pincode = $(this).find('input[name="pincode"]').val();
      var user;
      if (globalUsername === "") {
        user = "guest user";
      } else {
        user = globalUsername;
      }
      // Make AJAX request to submit franchise form
      $.post(
        "getresponse.php",
        {
          fname: name,
          femail: email,
          fmobile: phone,
          fcity: city,
          faddress: address,
          fpincode: pincode,
          user: user,
        },
        function (data) {
          if (data === "success") {
            addBotItem(
              "Thank you for your interest in our franchise opportunities! We will contact you soon."
            );
          } else {
            addBotItem("Something went wrong in franchise.");
          }
        }
      );
      converse.find("#franchise-form").remove();
    });
    $("#cancel-form").click(function (e) {
      e.preventDefault();
      converse.find("#franchise-form").remove();
    });
  }
  function initial() {
    converse.append(
      "<div class='alert alert-info'>Welcome to shipping company!</div>"
    );
  }
  function optionmessage() {
    // Handle initial welcome message and user input
    addBotItem(
      "Please select one of the following options: <br>1. Track My Parcel <br>2. Get a Quotation <br>3. Add Franchise Opportunities."
    );
  }
  initial();
  optionmessage();

  function handleUserMessage(message) {
    addUserItem(message);
    switch (message.toLowerCase()) {
      case "track my parcel":
      case "track parcel":
      case "1":
        handleTrackParcel();
        break;
      case "get a quotation":
      case "2":
      case "quotation":
        handleGetQuote();
        break;
      case "learn more about our franchise opportunities":
      case "3":
      case "add franchise":
      case "franchise":
        handleGetFranchise();
        break;
      case "4":
        handleuploadFile();
        break;
      case "help":
      case "show options":
      case "options":
      case "what can you do":
      case "show menu":
      case "menu":
        handleOptionMessage();
        break;
      case "hello":
      case "hi":
        addBotItem("Hello, How can I help You");
        break;
      case "clear":
        converse.empty();
        setTimeout(() => {
          optionmessage();
        }, 500);
        break;
      default:
        handleDefaultResponse(message);
        break;
    }
  }

  function handleKeyDownEvent(e) {
    if (e.keyCode == 13) {
      e.preventDefault();
      var message = textbox.val().trim();
      if (message !== "") {
        handleUserMessage(message);
        textbox.val("");
      }
    }
  }

  function handleClickEvent() {
    var message = textbox.val().trim();
    if (message !== "") {
      handleUserMessage(message);
      textbox.val("");
    }
  }

  function handleTrackParcel() {
    if (!isLoggedIn) {
      login();
    } else {
      trackParcel();
    }
  }

  function handleGetQuote() {
    getQuote();
  }

  function handleGetFranchise() {
    getFranchise();
  }

  function handleuploadFile(){
    if (!isLoggedIn) {
      login();
    } else {
      uploadFile();
    }
  }

  function handleOptionMessage() {
    optionmessage();
  }

  function handleDefaultResponse(message) {
    $.get("getresponse.php", { q: message }, function (data) {
      if (data !== "") {
        addBotItem(data);
      } else {
        addBotItem(
          "I'm sorry, I didn't understand. Please select one of the following options: track my parcel, get a quotation, or learn more about our franchise opportunities."
        );
      }
    });
  }

  textbox.keydown(handleKeyDownEvent);
  sendBtn.click(handleClickEvent);
});

function checkData() {
  // make AJAX GET request to getresponse.php to check data
  $.get("getresponse.php", { q: message }, function (data) {
    // Check if the response is not empty
    if (data !== "") {
      addBotItem(data);
    } else {
      // If the response is empty, display the default message
      addBotItem(
        "I'm sorry, I didn't understand. Please select one of the following options: track my parcel, get a quotation, or learn more about our franchise opportunities."
      );
    }
  });
}

function resetChat() {
  conversation.empty();
}

$("#chat-button").click(function () {
  $("#chat-box").toggle();
});

$("#cancel").click(function () {
  $("#chat-box").hide();
});
