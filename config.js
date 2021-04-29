"use strict";

let createDocumentDiv = function(coll_name, data){
	let div= document.createElement("div");
	data.collection= coll_name;
	div.innerText = JSON.stringify(data);
	div.id = data.id;
	div.classList.add("document");
	div.data_doc = data;	
	return div;
}




let newDocumentForm= function(){    
    let collection = document.querySelector(".collection.selected");
    let form = new DHtmlForm({collection: collection? collection.id : "change this"});
    form.saveBtn.addEventListener("click",event=>{createDocument(form.data());  editDocumentForm(form.data());});

    let values = document.getElementsByClassName("values")[0];
	values.innerHTML ="";
	values.appendChild(form.editForm);
}

let editDocumentForm = function(data){
	let form = new DHtmlForm(data);
    form.saveBtn.addEventListener("click",event=>{saveDocument(form.data()); editDocumentForm(form.data());});

	let values = document.getElementsByClassName("values")[0];
	values.innerHTML ="";
	values.appendChild(form.editForm);
}

let createDocument = function(data){
	fetchCall("/frs?c="+data.collection,"PUT", data).then(response =>{
		let div = createDocumentDiv(response.collection, response);
		let documents = document.getElementsByClassName("documents")[0];
	    selectElement(documents.appendChild(div));	
	});
}

let saveDocument = function(data){	
	fetchCall("/frs?c="+data.collection,"POST", data).then(response =>{
		let div = document.getElementById(response.id);
		div.innerText = JSON.stringify(response);
		div.data_doc = 	response;
		});	
}

let deleteDocument = function(doc){
	fetchCall("/frs?c="+doc.collection+"&d="+doc.id,"DELETE").then(response =>{
		let element = document.getElementById(doc.id);		
		element.parentElement.removeChild(element);
		});	
}

//fetch collection names
fetchCall("/frs").then(names =>{
	let collections =document.getElementsByClassName("collections")[0];	
	names.forEach(name => {
	  let div= document.createElement("div");
	    div.id = name;
		div.innerText = name;
		div.classList.add("collection");
		div.addEventListener('click', event => {
			document.getElementsByClassName("documents")[0].innerHTML ="";
			document.getElementsByClassName("values")[0].innerHTML ="";
			fetchCall("/frs?c="+name).then(docs => docs.forEach(doc => document.getElementsByClassName("documents")[0].appendChild(createDocumentDiv(name, doc))));
		});		
        collections.appendChild(div);
	});
	collections.firstElementChild.click();
    
});


document.addEventListener("DOMContentLoaded", () => {
    document.getElementsByClassName("documents")[0].addEventListener('mouseover', e =>{
		if (e.target.matches('.document')) {
			let div = e.target;				
	        let actionIcon = document.getElementById("actionIcon");
				if(!actionIcon){
					actionIcon=document.createElement("span");
					actionIcon.classList.add("actionIcon");
					actionIcon.id= "actionIcon";
					actionIcon.innerHTML = '<i class="far fa-edit editIcon" title="edit"></i><i class="far fa-clone cloneIcon" title="clone"></i><i class="far fa-trash-alt deleteIcon" title="delete"></i>';
					div.appendChild(actionIcon);
					actionIcon.getElementsByClassName("editIcon")[0].addEventListener("click", e =>editDocumentForm(e.target.closest("div").data_doc));
					actionIcon.getElementsByClassName("cloneIcon")[0].addEventListener("click", e =>createDocument(e.target.closest("div").data_doc));
					actionIcon.getElementsByClassName("deleteIcon")[0].addEventListener("click", e =>deleteDocument(e.target.closest("div").data_doc));
				} 
				
				div.appendChild(actionIcon.parentElement.removeChild(actionIcon));
	  }
	});

    document.addEventListener('click', e =>{

    	if (e.target.matches('.document') || e.target.matches('.collection') ) {selectElement(e.target);}

    	if (e.target.matches('#newDocumentLink')) {newDocumentForm();}
    });


  });//document onload


