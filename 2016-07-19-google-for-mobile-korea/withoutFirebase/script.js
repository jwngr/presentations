$(document).ready(function() {
  // Get references to DOM elements
  var $nameInput = $("#name");
  var $newMessageInput = $("#newMessage");
  var $newFileInput = $("#newFile");
  var $messageList = $("#messageList");
  var $submitButton = $("#submitButton");

  // Adds a new message to the message list
  function addMessageToHtml(name, text, imageURL) {
    var el;
    if (imageURL) {
      el = $("<li class='list-group-item'><b>" + name + ":</b> " + text + "<img src='" + imageURL + "' /></li>")
    } else {
      el = $("<li class='list-group-item'><b>" + name + ":</b> " + text + "</li>")
    }

    $messageList.append(el);
  }

  // Listen for key presses on the new message input
  $submitButton.click(function() {
    var name = $nameInput.val().trim();
    var newMessage = $newMessageInput.val().trim();
    var newFile = $newFileInput.prop("files")[0];

    if (name && newMessage) {
      addMessageToHtml(name, newMessage);

      // Reset new message input
      $newMessageInput.val("");
    }
  });
});
