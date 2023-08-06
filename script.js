
//Get Reference for both the Forms
const SignUpForm = document.getElementById('SignUpForm');
const LoginForm = document.getElementById('LoginForm');
//Event Listener for SignUp
SignUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const UserName1 = document.getElementById('SignUpUserName').value;
    const Email1 = document.getElementById('SignUpEmail').value;
    const Password1 = document.getElementById('SignUpPassword').value;
    //Store the Information in IndexedDB
    SaveDataToIndexedDB(UserName1, Email1, Password1);
});
//Event Listener for Login
LoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const Email2 = document.getElementById('LoginEmail').value;
    const Password2 = document.getElementById('LoginPassword').value;
    //Read the Information from IndexedDB
    CheckDataInIndexedDB(Email2, Password2);
});
//Function to Store Data in IndexedDB
function SaveDataToIndexedDB(UserName, Email, Password) {
    const User = { username: UserName, email: Email, password: Password };
    const request = window.indexedDB.open('UserDB', 1);
    request.onerror = (event) => { console.error('Sorry. Error Creating IndexedDB Database'); };
    request.onsuccess = (event) => {
        console.log('Database opened Successfully!')
        const db = event.target.result;
        const transaction = db.transaction(['Users'], 'readwrite');
        const objectstore = transaction.objectStore('Users');
        const addUserRequest = objectstore.add(User);
        addUserRequest.onsuccess = () => {
            console.log('User Data Saved Successfully!');
            SignUpForm.reset();
        };
        transaction.onsuccess = () => { db.close(); };
    };
    request.onupgradeneeded = (event) => {
        const db = event.target.result;
        db.createObjectStore('Users', { keyPath: 'email' });
    };
}
//Function to Checking User Data in the IndexedDB
function CheckDataInIndexedDB(Email2, Password) {
    const request = window.indexedDB.open('UserDB', 1);
    request.onerror = (event) => { console.error('Error while Reading!'); };
    request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['Users'], 'readonly');
        const objectstore = transaction.objectStore('Users');
        const getUserRequest = objectstore.get(Email2);
        getUserRequest.onsuccess = () => {
            const User = getUserRequest.result;
            if (User && User.password === Password) {
                document.getElementById("lnote").innerHTML = `login successfull!`
                document.getElementById("lnote").style.color = "green";
            }
            else {
                document.getElementById("lnote").innerHTML = `Username or Password Incorrect`
                document.getElementById("lnote").style.color = "red";
            }
        };
        transaction.oncomplete = () => { db.close(); };
    };
    request.onupgradeneeded = (event) => {
        const db = event.target.result;
        db.createObjectStore('Users', { keyPath: 'UserName' });
    };
}