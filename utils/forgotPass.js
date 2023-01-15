document.getElementById("submitButton").addEventListener("click", sendEmail);
var alertDiv = document.getElementById("alert");

function alert() {
    alertDiv.style.display = "block";
}

function sendEmail(e) {
    var emailInput = document.getElementById("emailInput");
    var submitButton = document.getElementById('submitButton');
    e.preventDefault();
    var params = "email=" + emailInput.value;
    const xhttp = new XMLHttpRequest();
    xhttp.open('POST', '/user/forgotpassword', true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhttp.onload = function() {
        if (this.responseText == 'signup') {
            alertDiv.classList = "alert alert-danger";
            alertDiv.innerHTML = 'Email not registered. You may <a href="/user/register">Signup</a> with it.';
        } else {
            alertDiv.classList = "alert alert-info";
            alertDiv.innerHTML = "An email will be sent to you shortly containing a link to reset your password."
        }
        alert();
    }
    xhttp.send(params);
    document.getElementById("emailInput").value = "";
}