// ACCOUNT.EJS

document.getElementById("follow-button").addEventListener("click", changeFollowButton);

function changeFollowButton() {
    var follow_button = document.getElementById("follow-button");
    if (follow_button.innerHTML == "Follow") follow_button.innerHTML = "Unfollow";
    else follow_button.innerHTML = "Follow";
}

$(document).ready(function() {
    $('.content').click(function() {
        $('.content').toggleClass("heart-active")
        $('.text').toggleClass("heart-active")
        $('.numb').toggleClass("heart-active")
        $('.heart').toggleClass("heart-active")
    });
});

// $(function() {
//     $('#edit_box').click(function() {
//         $('#edit_image').show();
//         return false;
//     });
// });

$('#OpenImgUpload').click(function() {
    $('#image').trigger('click');
});

$(function() {
    $('#show_box').click(function() {
        $('#edit_box').show();
        return false;
    });
});

// document.getElementById('link').addEventListener('click', function() {
//     document.getElementById('text').style.display = 'none';
// });

// document.getElementById('edit_box').addEventListener('click', function() {
//     document.getElementById("overlay").style.display = "block";
// });

function off() {
    document.getElementById("overlay").style.display = "none";
}

document.getElementById('follow-button').addEventListener('click', followUser);

function followUser(event) {
    event.preventDefault();
    const xhttp = new XMLHttpRequest();
    xhttp.open('POST', '/user/follow', true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhttp.onload = function() {
        console.log(this.responseText);
    }
    xhttp.send();
}