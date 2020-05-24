// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDYdfcFhJahMq6t_9euBDtkjaHFoYhX7BY",
    authDomain: "chat-app-4633d.firebaseapp.com",
    databaseURL: "https://chat-app-4633d.firebaseio.com",
    projectId: "chat-app-4633d",
    storageBucket: "chat-app-4633d.appspot.com",
    messagingSenderId: "345468561231",
    appId: "1:345468561231:web:2b6c5abdb662866bc1473a",
    measurementId: "G-L7K62MGJY8"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
// Initialize Firestore
var db = firebase.firestore();

// Get the name for the user
if (!localStorage.getItem('name')) {
    name = prompt('What is your name?');
    localStorage.setItem('name', name);
} else {
    name = localStorage.getItem('name');
}
document.querySelector('#name').innerText = name

// Change name
document.querySelector('#change-name').addEventListener('click', () => {
    name = prompt("What is your name?");
    localStorage.setItem('name', name);
    document.querySelector('#name').innerText = name;
});

// Send a message
document.querySelector('#message-form').addEventListener('submit', e => {
    e.preventDefault();

    db.collection('messages')
        .add({
            name: name,
            message: document.querySelector('#message-input').value,
            time: firebase.firestore.Timestamp.now()
        })
        .then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
            document.querySelector('#message-form').reset();
        })
        .catch(function (error) {
            console.error("Error adding document: ", error);
        });
});

// Display chat stream
db.collection('messages')
    .orderBy('time', 'desc')
    .onSnapshot((snapshot) => {
        document.querySelector('#messages').innerHTML = "";
        snapshot.forEach(function (doc) {
            var message = document.createElement('div');
            message.innerHTML = `
            <p class="name">${doc.data().name}</p>
            <p>${doc.data().message}</p>
            `
            // Inserts nodes before the first child of node, while replacing strings in nodes with 
            // equivalent Text nodes.
            // Using prepend()
            document.querySelector('#messages').prepend(message);
        });
    });

// Clear all messages
document.querySelector('#clear').addEventListener('click', e => {
    db.collection('messages')
        .get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                db.collection('messages').doc(doc.id).delete()
                    .then(() => {
                        console.log("Document successfully deleted: ", doc.id);
                    })
                    .catch((error) => {
                        console.error("Error removing document: ", doc.id, error)
                    });
            });
        })
        .catch((error) => {
            console.error("Error getting documents: ", error);
        });
});