$(document).ready(function() {
  // Get references to DOM elements
  var $usernameInput = $("#username");
  var $newMessageInput = $("#newMessage");
  var $newFileInput = $("#newFile");
  var $messageList = $("#messageList");
  var $submitButton = $("#submitButton");

  // Adds a new message to the message list
  function addMessageToDom(username, text, downloadURL) {
    var el;
    if (downloadURL) {
      el = $("<li class='list-group-item'><b>" + username + ":</b> " + text + "<img src='" + downloadURL + "' /></li>")
    } else {
      el = $("<li class='list-group-item'><b>" + username + ":</b> " + text + "</li>")
    }

    $messageList.append(el);
  }

  // Listen for key presses on the new message input
  $submitButton.click(function() {
    var username = $usernameInput.val();
    var newMessage = $newMessageInput.val().trim();

    if (username.length && newMessage.length) {
      addMessageToDom(username, newMessage);
    }
  });
});
