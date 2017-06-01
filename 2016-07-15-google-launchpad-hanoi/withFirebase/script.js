$(document).ready(function() {
  // Initialize the Firebase SDK
  var config = {
    apiKey: "AIzaSyD9wIdkMgn-hPR8KgBO6iNcnsSRqh8ae2g",
    authDomain: "launchpad-hanoi.firebaseapp.com",
    databaseURL: "https://launchpad-hanoi.firebaseio.com",
    storageBucket: "launchpad-hanoi.appspot.com"
  };
  firebase.initializeApp(config);

  // Get references to Firebase services
  var databaseRef = firebase.database().ref("messages");
  var storageRef = firebase.storage().ref("messages");

  // Get references to DOM elements
  var $newMessageInput = $("#newMessage");
  var $newFileInput = $("#newFile");
  var $messageList = $("#messageList");
  var $submitButton = $("#submitButton");
  var $loginButton = $("#loginButton");
  var $logoutButton = $("#logoutButton");
  var $loggedInName = $("#loggedInName");

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

  // Adds a new message to the Firebase Database
  function addMessageToFirebaseDatabase(newMessageRef, text, downloadURL) {
    newMessageRef.set({
      name: globalFirebaseUser.displayName,
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
    addMessageToHtml(message.name, message.text, message.downloadURL);
  });

  // Listen for key presses on the new message input
  $submitButton.click(function() {
    var newMessage = $newMessageInput.val().trim();
    var newFile = $newFileInput.prop("files")[0];

    if (globalFirebaseUser && newMessage) {
      var newMessageRef = databaseRef.push();

      if (newFile) {
        storageRef.child(newMessageRef.key).put(newFile).then(function(snapshot) {
          var downloadURL = snapshot.downloadURL;
          addMessageToFirebaseDatabase(newMessageRef, newMessage, downloadURL);
        }).catch(function(error) {
          console.log("Error uploading new file to Firebase Storage:", error);
        });
      } else {
        addMessageToFirebaseDatabase(newMessageRef, newMessage);
      }
    }
  });

  // Listen for changes in auth state and show the appropriate buttons and messages
  var globalFirebaseUser;
  firebase.auth().onAuthStateChanged(function(firebaseUser) {
    globalFirebaseUser = firebaseUser;

    if (firebaseUser) {
      // User logged in
      $loginButton.hide();
      $logoutButton.show();
      $loggedInName.text(firebaseUser.displayName);
      $newMessageInput.prop("disabled", false);
    } else {
      // User logged out
      $loginButton.show();
      $logoutButton.hide();
      $loggedInName.text("None");
      $newMessageInput.prop("disabled", true);
    }
  });

  // Login with GitHub when the login button is pressed
  $loginButton.click(function() {
    var provider = new firebase.auth.GithubAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(firebaseUser) {
      console.log("User signed in with GitHub:", firebaseUser);
    }).catch(function(error) {
      console.error("Error authenticating with GitHub:", error);
    });
  });

  // Logout when the logout button is pressed
  $logoutButton.click(function() {
    firebase.auth().signOut();
  });
});
