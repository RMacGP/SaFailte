const firebaseConfig = {
  apiKey: "AIzaSyAJBGj8cwOfYIo_iUTj0OqkY0qo173KpKk",
  authDomain: "tionscnamh-riomheolaiochta.firebaseapp.com",
  databaseURL: "https://tionscnamh-riomheolaiochta-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "tionscnamh-riomheolaiochta",
  storageBucket: "tionscnamh-riomheolaiochta.appspot.com",
  messagingSenderId: "336451720466",
  appId: "1:336451720466:web:22955d917a37a109678fcb",
  measurementId: "G-HWN1F8GHWZ"
};

firebase.initializeApp(firebaseConfig);

// detection_id is the key for the detection entry.
// this function makes an asynchronous request to firebase for this entry, and if received, inverts the vaule of entry.arvhived;
function cartlannaigh(detection_id){
  const record_ref = firebase.database().ref("detections/user1/"+detection_id);
  record_ref.get().then((snapshot) => {
    if (snapshot.exists()) {
    let new_val = snapshot.val();
    new_val.archived = !new_val.archived;
    record_ref.set(new_val);
    
    window.location.reload();// https://stackoverflow.com/questions/2803655/how-to-force-page-refreshes-or-reloads-in-jquery#2803680
  } else {
    console.log("No data available");
  }}).catch((error) => {
    console.error(error);
  });
}

// set the vaule of users/$user/take_pic to true. The backend will monitor this node and take a picture when set true
function take_pic()
{
  const pic_ref = firebase.database().ref(`users/${getCookie("username")}/take_pic`).set(true);
}

// swaps the style of the container for archived photos from block to none and vice versa (visible to invisible). Also changes the button lable appropriatley
function taispean_cartlannaithe()
{
  let el = document.getElementById("taispean");
  if (el.innerHTML == "Taispeáin íomhánna cartlannaithe")
  {
    el.innerHTML = "Cuir íomhánna cartlannaithe i bhfolach";
    document.getElementById("allArchivedRecords").style.display = "block";
  }
  else
  {
    el.innerHTML = "Taispeán íomhánna cartlannaithe";
    document.getElementById("allArchivedRecords").style.display = "none";
  }
}

// looks for first piece of data starting with cName=, and returns the value following it
function getCookie(cName) {
  const name = cName + "=";
  const cDecoded = decodeURIComponent(document.cookie); // gets rid of any 'encoding traces' in the string - safety
  const cArr = cDecoded .split('; '); // split the cookie into each data piece
  let res;
  // go through each piece of data and try to match name with some substring of val, then return the following value if a match is found
  cArr.forEach(val => {
      if (val.indexOf(name) === 0) res = val.substring(name.length);
  })
  return res;
}

// set a new cookie or update its value
function setCookie(cName, cValue, expDays) {
  let date = new Date();
  date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000)); // the time now + expDays in millisceonds
  const expires = "expires=" + date.toUTCString(); // changes date to a UTC string used by cookies, and preceded by expires=
  document.cookie = cName + "=" + cValue + "; Secure; " + expires + "; path=/";
  // set the cookie with expiry 
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
}

function bad_login()
{
  // let user know if login details are incorrect by revealing a previously hidden div
  document.getElementById("bad-login").style.display = "block";
}

// check login details
function login()
{
  // get the entered username and password
  username = document.getElementById("uname").value;
  password = document.getElementById("pword").value;
  // a lambda function that ensuresonly accepted characters are used in the username
  const isAlphaNumeric = ch => {return ch.match(/^[a-z0-9]+$/i) !==null;} //https://lowrey.me/test-if-a-string-is-alphanumeric-in-javascript/
  if(isAlphaNumeric(username))
  {
    let flag = false;
    let user_ref = firebase.database().ref(`users/${username}`);
    user_ref.get().then((snapshot) =>{ // asynchronous request to firebase of the given users data
    if (snapshot.exists())
    {
      const val = snapshot.val();
      if (password === val.password) // check if passwords are strictly equal (case sensitive)
      {
        // set cookies with a 30 day expiry to be used to avoid repetitive logins
        setCookie("username", username, 30);
        setCookie("token", val.token, 30); 
        document.getElementById("bad-login").style.display = "none";
        document.location.href = "index.html";
      }
      else
      {
        bad_login();
      }
    }
    else
    {
      // this user does not exist
      bad_login();
    }
    }).catch((error) => { // there was an error
      console.error(error);
      bad_login();
    });
  } 
  else
  {
    bad_login();
  }
}

// remove the cookies and return to the homepage
function logout()
  {
    document.cookie = "username=";
    document.cookie = "token=";
    document.location.href = "index.html";
  }

// check every time every page is loaded if user is logged in.
// if logged in, set all elements with class .logged-in to block and .logged-out to none
// opposite if logged out
function hide_elements(keep, remove) // set display of keep to visible and remove to not visible
{
  let keep_els = document.getElementsByClassName(keep);
  let remove_els = document.getElementsByClassName(remove);
  for (let i=0; i<keep_els.length; i++) // iterate through all elements with given class name
    {
      keep_els[i].style.display = "block";
    }
  for (let i=0; i<remove_els.length; i++)
    {
      remove_els[i].style.display = "none";
    }
}

var check_ref = firebase.database().ref(`users/${getCookie("username")}`);
function check_login() {
  check_ref.get().then((snapshot) => { // asynchronous request to firebase with username from cookie
  if (snapshot.exists())
    {
      const val = snapshot.val();
      if (getCookie("token")===val.token) // if token cookie matches database cookie, it's a legit login
      {
        hide_elements("logged-in", "logged-out"); // show all content reserved for logged in users
      }
      else
      {
        hide_elements("logged-out", "logged-in");
      }
      // alert("snapshot exists");
    }
  else
    {
      hide_elements("logged-out", "logged-in");
      // alert("snapshot doesn't exist");
    }
}).catch((error) => {
    console.error(error);
    hide_elements("logged-out", "logged-in");
  });
}


function displayRecords(data) {
  check_login(); // put this here as these functions were running before anything else
  const record = data.val();
  const record_id = data.key;
  const img = record.image;
  const date = record.date;
  const time = record.time;
  // create a html element for each child, with unique data belonging to that child in each element.
  // the image is decoded by the browser as we till it with 'data:image/jpg;base64' that the string must be decoded
  const html = `
<div class="row detection-row justify-content-center align-items-center border border-dark m-2 bg-light">
  <div class="col-sm-6 text-center">
    <h4>${date}, ${time}</h4>
    <button class="btn btn-${record.archived ? 'outline-' : ''}danger" onclick="cartlannaigh('${record_id}')">${record.archived ? 'Tóg as cartlann' : 'Cuir i gcartlann'}</button>
  </div>
  <div class="col-sm-6 d-flex justify-content-center">
    <img class="w-50 m-2" src="data:image/jpg;base64,${img}">
  </div>
</div>
`;
  // check if archived and decided which div to add to
  let destination_div = "allUnarchivedRecords";
  if (record.archived)
      destination_div = "allArchivedRecords";
  let el = document.getElementById(destination_div);
  if (el)
    el.innerHTML += html;
  // document.getElementById(destination_div).innerHTML += html;
}

function load_page() // to ensure all content has loaded before running check_login()
{
  check_login();
  var myDB = firebase.database().ref('detections/user1');
  myDB.on("child_added", displayRecords);
  check_login();
}

window.addEventListener('load', load_page());
