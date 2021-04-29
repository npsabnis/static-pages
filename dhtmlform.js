/**
 * The HTML Form Generator
 */
 
 class DHtmlForm{ 
	
	constructor(json, saveBtnHandler){
		this.editForm = document.createElement("form");
	    this.editForm.classList.add("editForm");
	    this.editForm.data_doc = json;
	    this.json = json;

	    this.addBtn = this.newButton("button","Add Key","addBtn", "addBtn", "fa-save");
	    this.editForm.appendChild(this.addBtn);	    
	    this.addBtn.addEventListener("click",e=>{
	    	let key= "change this" + Math.random();
	    	this.editForm.insertBefore(this.newField(key, "change this"), this.editForm.addBtn);
	    	this.editForm.data_doc[key] =  "change this";
	    	});
	   	    
	    Object.keys(json).forEach(key => this.editForm.insertBefore(this.newField(key, json[key]), this.editForm.addBtn));
	    this.saveBtn = this.newButton("button","Save","saveBtn", "saveBtn", "fa-save");
	    this.editForm.appendChild(this.saveBtn);	    
	}

	data =function(){
		let data = {};
		Object.keys(this.editForm.data_doc).forEach(key =>{
			if(this.editForm["new_"+key].value){ //omit key if empty
				data[this.editForm["new_"+key].value] = this.editForm[key].value.includes(",")
				                                        ? this.editForm[key].value.split(",").map(s=>s.trim())
				                                        : this.editForm[key].value;
				}
			});
		if(!data.collection) { data.collection = this.json.collection; }
		return data;
	}
		
	newButton = function(type, value, name, btnClass, iconClass ){
		let btn = document.createElement("input");
		btn.type = type;	
		btn.value = value;
		btn.name = name;
		btn.classList.add(btnClass);
		
		let i = document.createElement("i");
		i.classList.add("far");
		i.classList.add(iconClass);
		if(iconClass) btn.appendChild(i);
		return btn;
	}
	
	newField = function(key, value){
    	let keyInput = document.createElement("input");
        keyInput.classList.add("key");
        keyInput.name = "new_"+key;
        keyInput.value = key;

        let valueInput = document.createElement("input");
        valueInput.classList.add("value");
        valueInput.name = key;
        valueInput.value = value;
        
        let divElm = document.createElement("div");
        divElm.classList.add("row");
        divElm.appendChild(keyInput);  
        divElm.appendChild(valueInput);
        
        return divElm;
    }
	
}