var config = {
    apiKey: "AIzaSyBsyIA8XdBKCaX5UJm9QCa7qW2lwp1SZI4",
    authDomain: "project-bloodbank1.firebaseapp.com",
    databaseURL: "https://project-bloodbank1.firebaseio.com",
    projectId: "project-bloodbank1",
    storageBucket: "project-bloodbank1.appspot.com",
    messagingSenderId: "240032509933"
  };
  firebase.initializeApp(config);
  let userUid;

  window.addEventListener('load', async e =>{
    
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('../sw.js')
          .then(() => {
              console.log('service worker')
          })
          .catch(error =>{
            console.log(error)
          })
    }
    else{
      console.log('no serviceWorker')
    }
  })


  function signUp(){
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const phoneno = document.getElementById('phoneno').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const usertype = document.getElementById('usertype').value;
    const bloodtype = document.getElementById('bloodtype').value;
    const genderElement = document.querySelector('input[name="radioOption"]:checked');
    const imgUrl = "undefined";

    if(name !== '' && address!=='' && city!=='' && phoneno!=='' && email!=='' && password!=='' && usertype!=="" && bloodtype!=="" && genderElement!==null && usertype!=='' && bloodtype!=='')
    {

      const gender = genderElement.value;
      firebase.auth().createUserWithEmailAndPassword(email,password)
      .then((result)=>{
        userUid = firebase.auth().currentUser.uid;
      let userObj={
        name,
        usertype,
        bloodtype,
        email,
        password
      }
      firebase.database().ref('users/' + userUid).set(userObj)
      .then((success)=>{
        let userDetails ={
          name,
          address,
          city,
          phoneno,
          email,
          bloodtype,
          usertype,
          imgUrl,
          gender
        }
        firebase.database().ref(usertype).child(bloodtype).child(userUid).set(userDetails)
        .then((succ)=>{
          window.location='./signin.html';
        })
      })
    })
    .catch((error)=>{
      swal({
        icon: 'error',
        title: 'Error',
        text: `${error.message}`
      });
      console.log(error.message);
    })
  }
  else{
    swal({
      icon: 'info',
      title: 'Warning!',
      text: 'Please fill all fields with proper information!'
    })
  }
  }

async function signIn(){
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if(email!==null && password!==null){
      firebase.auth().signInWithEmailAndPassword(email,password)
      .then((success)=>{
        localStorage.setItem("userAuth",JSON.stringify(success))  
        window.location = '../pages/loading.html'
      })
      .catch((error)=>{
        swal({
          icon: 'error',
          title: 'Error',
          text: `${error.message}`
        });
        console.log(error.message);
      })
    }
    else{
      swal({
        icon: 'info',
        title: 'Warning!',
        text: 'Please fill all fields with proper information!'
      });
    }

  } 


  function checkAuth(){
    let get = localStorage.getItem('userAuth');
    let data = JSON.parse(get);
    if(data === null || data.user === 'null'){
      document.getElementById('login').style.display = "block";
    }
    else{
        location = '../pages/profile.html'
    }
}
  