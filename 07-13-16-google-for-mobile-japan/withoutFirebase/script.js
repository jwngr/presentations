$(document).ready(function() {
  // Get references to DOM elements
  var $usernameInput = $("#username");
  var $newMessageInput = $("#newMessage");
  var $newFileInput = $("#newFile");
  var $messageList = $("#messageList");
  var $submitButton = $("#submitButton");

  // Adds a new message to the message list
  function addMessageToHtml(username, text, downloadURL) {
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
    var username = $usernameInput.val().trim();
    var newMessage = $newMessageInput.val().trim();
    var newFile = $newFileInput.prop("files")[0];

    if (username && newMessage) {
      addMessageToHtml(username, newMessage);

      // Reset new message input
      $newMessageInput.val("");
    }
  });
});
