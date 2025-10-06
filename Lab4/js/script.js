document.querySelector("#zip").addEventListener("change", displayCity);
document.querySelector("#usernameInput").addEventListener("input", displayUsername);
document.querySelector("#passwordInput").addEventListener("focus", displayPasswords);
document.querySelector("#state").addEventListener("change", displayCounty);
document.querySelector("#submitBtn").addEventListener("click", validateForm);

displayStates();


async function displayCity() {
  let zipCode = document.querySelector("#zip").value;
  let url = "https://csumb.space/api/cityInfoAPI.php?zip=" + zipCode;
  try {
    let response = await fetch(url);
    let data = await response.json();

    if (data.city) {
      document.querySelector("#city").textContent = data.city;
      document.querySelector("#latitude").textContent = data.latitude;
      document.querySelector("#longitude").textContent = data.longitude;
      document.querySelector("#zipMsg").textContent = "";
    } else {
      document.querySelector("#zipMsg").textContent = "Zip code not found";
      document.querySelector("#city").textContent = "";
      document.querySelector("#latitude").textContent = "";
      document.querySelector("#longitude").textContent = "";
    }
  } catch (error) {
    document.querySelector("#zipMsg").textContent = "Zip code not found";
  }
}

async function displayUsername() {
  let username = document.querySelector("#usernameInput").value;
  if (username.length < 1) {
    document.querySelector("#usernameMsg").textContent = "";
    return;
  }
  let url = "https://csumb.space/api/usernamesAPI.php?username=" + username;
  try {
    let response = await fetch(url);
    let data = await response.json();

    if (data.available === "false") {
      document.querySelector("#usernameMsg").textContent = "Not Available";
      document.querySelector("#usernameMsg").style.color = "red";
    } else {
      document.querySelector("#usernameMsg").textContent = "Available";
      document.querySelector("#usernameMsg").style.color = "green";
    }
  } catch (error) {
    console.log("Error: " + error);
  }
}

async function displayStates() {
  let url = "https://csumb.space/api/allStatesAPI.php";
  try {
    let response = await fetch(url);
    let data = await response.json();

    for (let i of data) {
      let optionElement = document.createElement("option");
      optionElement.textContent = i.state;
      optionElement.value = i.usps;
      document.querySelector("#state").append(optionElement);
    }
  } catch (error) {
    console.log("Error: " + error);
  }
}

async function displayCounty() {
  let stateCode = document.querySelector("#state").value;
  let url = "https://csumb.space/api/countyListAPI.php?state=" + stateCode;
  document.querySelector("#county").innerHTML = ""; 
  try {
    let response = await fetch(url);
    let data = await response.json();

    for (let i of data) {
      let optionElement = document.createElement("option");
      optionElement.textContent = i.county;
      optionElement.value = i.county;
      document.querySelector("#county").append(optionElement);
    }
  } catch (error) {
    console.log("Error: " + error);
  }
}

async function displayPasswords() {
  let url = "https://csumb.space/api/suggestedPassword.php?length=8";
  try {
    let response = await fetch(url);
    let data = await response.json();

    document.querySelector("#passwordSuggest").textContent = "Suggested: " + data.password;
    
  } catch (error) {
    console.log("Error: " + error);
  }
}

function validateForm() {
  let username = document.querySelector("#usernameInput").value.trim();
  let password = document.querySelector("#passwordInput").value.trim();
  let passwordAgain = document.querySelector("#passwordAgain").value.trim();
  let msg = "";

  if (username.length < 3) {
    msg += "Username must be at least 3 characters.<br>";
  }
  if (password.length < 6) {
    msg += "Password must be at least 6 characters.<br>";
  }
  if (password !== passwordAgain) {
    msg += "Passwords do not match.<br>";
  }

  if (msg === "") {
    msg = "<span class='text-success'>Form submitted successfully!</span>";
  } else {
    msg = "<span class='text-danger'>" + msg + "</span>";
  }
  document.querySelector("#formMsg").innerHTML = msg;
}
