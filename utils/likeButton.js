var likeBtn = document.getElementById('likeBtn');
document.getElementById('like-comment').addEventListener('click', likeComment);
likeBtn.addEventListener('click', likePost);
dislikeBtn.addEventListener('click', dislikePost);

function likePost(e) {
    likeBtn.style.display = "none";
    e.preventDefault();
    var params = "id=" + post_id;
    const xhttp = new XMLHttpRequest();
    xhttp.open('POST', '/post/like', true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.onload = function() {
        dislikeBtn.style.display = "block";
    }
    xhttp.send(params);
}

function dislikePost(e) {
    dislikeBtn.style.display = "none";
    e.preventDefault();
    var params = "id=" + post_id;
    const xhttp = new XMLHttpRequest();
    xhttp.open('POST', '/post/dislike', true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.onload = function() {
        likeBtn.style.display = "block";
    }
    xhttp.send(params);
}

function likeComment(e) {
    var likeButton = document.getElementById('like-comment');
    e.preventDefault();
    var getCommentId = '<%= comment_id  %>';
    console.log(getPostId)
    var params = "id=" + getCommentId;
    const xhttp = new XMLHttpRequest();
    if (likeButton.style.color == "red") {
        xhttp.open('POST', '/comment/like', true);
    } else {
        xhttp.open('POST', '/comment/dislike', true);
    }
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhttp.onload = function() {
        console.log(this.responseText);
    }

    xhttp.send(params);
}

function heart() {
    var likeButton = document.getElementById("like-post");
    var likesCount = parseInt(document.getElementById('likes-post').innerHTML);
    if (likeButton.style.color == "red") {
        likeButton.style.color = "black";
        likesCount -= 1;
        console.log(likesCount)
    } else {
        likeButton.style.color = "red";
        likesCount += 1;
        console.log(likesCount)
    }
    document.getElementById('likes-post').innerHTML = likesCount;
}

function heart2() {
    var likeButton = document.getElementById("like-comment");
    if (likeButton.style.color == "red") likeButton.style.color = "black";
    else likeButton.style.color = "red";
}