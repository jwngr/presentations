$(document).ready(function() {
  // Initialize the Firebase SDK
  var config = {
    apiKey: "AIzaSyABFtaPbOJ2k4TWe2TguEkHDG80ZGYDGSs",
    authDomain: "gfm-chat.firebaseapp.com",
    databaseURL: "https://gfm-chat.firebaseio.com",
    storageBucket: "gfm-chat.appspot.com"
  };
  firebase.initializeApp(config);

  // Get references to Firebase services
  var databaseRef = firebase.database().ref("messages");
  var storageRef = firebase.storage().ref("messages");

  // Get references to DOM elements
  var $usernameInput = $("#username");
  var $newMessageInput = $("#newMessage");
  var $newFileInput = $("#newFile");
  var $messageList = $("#messageList");
  var $submitButton = $("#submitButton");

  // Adds a new message to the message list
  function addMessageToHtml(username, text, imageURL) {
    var el;
    if (imageURL) {
      el = $("<li class='list-group-item'><b>" + username + ":</b> " + text + "<img src='" + imageURL + "' /></li>")
    } else {
      el = $("<li class='list-group-item'><b>" + username + ":</b> " + text + "</li>")
    }

    $messageList.append(el);
  }

  // Adds a new message to the Firebase Database
  function addMessageToFirebaseDatabase(newMessageRef, username, text, downloadURL) {
    newMessageRef.set({
      username: username,
      text: text,
      downloadURL: downloadURL || null
    }).then(function() {
      // Reset new message input
      $newMessageInput.val("");
    }).catch(function(error) {
      console.log("Error adding new message to Firebase Database:", error);
    });
  }

  // Loop through the last ten messages stored in Firebase
  databaseRef.limitToLast(10).on("child_added", function(snapshot) {
    var message = snapshot.val();
    addMessageToHtml(message.username, message.text, message.downloadURL);
  });

  // Listen for key presses on the new message input
  $submitButton.click(function() {
    var username = $usernameInput.val().trim();
    var newMessage = $newMessageInput.val().trim();
    var newFile = $newFileInput.prop("files")[0];

    if (username && newMessage) {
      var newMessageRef = databaseRef.push();

      if (newFile) {
        storageRef.child(newMessageRef.key).put(newFile).then(function(snapshot) {
          var downloadURL = snapshot.downloadURL;
          addMessageToFirebaseDatabase(newMessageRef, username, newMessage, downloadURL);
        }).catch(function(error) {
          console.log("Error uploading new file to Firebase Storage:", error);
        });
      } else {
        addMessageToFirebaseDatabase(newMessageRef, username, newMessage);
      }
    }
  });
});
