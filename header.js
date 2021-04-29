function onSignIn(googleUser) {
//  var profile = googleUser.getBasicProfile();
//  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
//  console.log('Name: ' + profile.getName());
//  console.log('Image URL: ' + profile.getImageUrl());
//  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  var id_token = googleUser.getAuthResponse().id_token;

	var xhr = new XMLHttpRequest();
	xhr.open('POST', '/tokensignin');
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.onload = function() {
	  console.log('Signed in as: ' + xhr.responseText);
	};
	xhr.send('idtoken=' + id_token);
	
}
 function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }



 let fetchCall = function(url, method, jsonData){
	if(!url) return;
	if(!method) method = "GET";
    return fetch(url,{
			method:method,
			headers: {'Content-Type': 'application/json;charset=utf-8'},
			body:JSON.stringify(jsonData)
			}).then(async function(response){
					  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
					  return await response.json();
					});
	}//fetchCall

 
 let selectElement = function(elm){
	let selected = elm.parentElement.getElementsByClassName("selected");
    if(selected.length) selected[0].classList.remove("selected");
	elm.classList.add("selected");
}//selectElement

//append element in provided wrapper or new div and return wrapper handle.
let wrapInDiv= function(elm, wrapper, wrapperClassString){      if(!wrapper) wrapper = document.createElement("div"); wrapper.className += wrapperClassString; wrapper.appendChild(elm); return wrapper; }

let	addClass = function(elm, className){elm.classList.add(className); return elm;}