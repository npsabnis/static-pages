"use strict";
class MusicNotes{
	constructor(){
		fetchCall("/frs?c=music_tal").then(tal_array =>{this.tal_array = tal_array; this.generateTalOptionList();} );
	   	fetchCall("/frs?c=musicnotes").then(notes_array =>{this.notes_array = notes_array; this.generateMusicNotesNames();} );			   	
        this.musicnotes = document.querySelector(".musicnotes");
        document.querySelector(".newMusicLine").addEventListener('click',e=>{this.musicnotes.appendChild(this.create_musicline(this.selectedTal))} );
        document.querySelector(".saveMusicNote").addEventListener('click',e=>{this.saveMusicNote();});        
	}
	getTal = function(talname){ return this.tal_array.find(tal => tal.name == talname);}
	
	getNote = function(musicname){ return this.notes_array.find(note => note.name == musicname);}
	
    generateTalOptionList = function(){
	    this.dropdown =document.querySelector(".music_tal");
	    this.dropdown.addEventListener('change', e =>{
	    	     this.selectedTal = this.getTal(e.target.value);
	    	     }); 
	    this.tal_array.forEach(tal => {
	       	let option = new Option(tal.name,tal.name);			
			option.id = tal.name;
			this.dropdown.add(option);
		});
	}
	
	generateMusicNotesNames = function(){	this.notes_array.forEach(note => this.createMusicNameDiv(note.name));	}
	
	createMusicNameDiv= function(name){
			let div = document.createElement("div");
			document.querySelector(".musicnames").appendChild(div);			
			div.id = name; div.classList.add("musicname");
			div.innerText = name;
			div.addEventListener('click', e =>{ 
				this.selectedNote= this.getNote(e.target.id)
				this.dropdown.namedItem(this.selectedNote.talname).selected = true;
				this.dropdown.dispatchEvent(new Event('change'));
				this.openMusicNote(); 
			});	
		return div;		
	}	
		
	create_musicline = function(tal, bol){			
		if(!tal) return;
		if(!bol) bol = tal.bol;
		let musicline = document.createElement("div");	
		musicline.classList.add("musicline");
		let matra =1;
		tal.matra_khand.map(k => {
		let khand = document.createElement("div");				
			musicline.appendChild(addClass(khand, "khand"));
			
			for(let i=0; i< k; i++){
				let edt_div = document.createElement("div");
				edt_div.contentEditable = true;			
				if(bol)edt_div.innerText = bol[matra-1];
	
				edt_div.className = "matra"; 
				let wrapper = edt_div;
	
				if(tal.matra_sam == matra) wrapper =  wrapInDiv(wrapper,"", "sam far fa-window-minimize ");
				if(tal.matra_tali.includes(matra+"")) wrapper =  wrapInDiv(wrapper,"", "tali");
				if(tal.matra_kal == matra) wrapper =  wrapInDiv(wrapper,"", "kal far fa-circle");
								
				khand.appendChild(wrapper);
				matra++;
			}			
		});
		
		return musicline;
	}
	
	openMusicNote = function(){		
		this.musicnotes.innerHTML = "";
		document.querySelector(".musictitle").value = this.selectedNote.name;
		this.selectedNote.musiclines.forEach(line => this.musicnotes.appendChild(this.create_musicline(this.selectedTal, line.bol)));
	}
	
	saveMusicNote =function(){
		
		let data={};
		if(!this.selectedNote){
			let dulicate = Array.from(document.querySelectorAll(".musicname")).some(div => div.id == document.querySelector(".musictitle").value);
			if(dulicate){ alert("This name is used. Please use other name."); return;}			
		}else { data.id = this.selectedNote.id;    }
		
		data.collection = "musicnotes";		
		data.talname = this.selectedTal.name;
		data.name = document.querySelector(".musictitle").value;
		if(!data.name) data.name = "changeThis"+Math.random(0);
		
		data.musiclines =[];		
		document.querySelectorAll(".musicline").forEach(line => data.musiclines.push({bol:Array.from(line.querySelectorAll(".matra")).map(matra =>matra.innerText)}));
	    let method = data.id? "POST":"PUT";
	    
		fetchCall("/frs?c="+data.collection,method, data).then(response =>{
			
			if(!this.selectedNote){
				document.querySelector(".musicnames").appendChild(this.createMusicNameDiv(response.name));
				this.notes_array.push(response);
			}else{
                let div = document.getElementById(this.selectedNote.name);
				div.id = response.name;
				div.innerText = response.name;
				let index = this.notes_array.indexOf(this.selectedNote);
				this.notes_array[index] = response;				
			}
			this.selectedNote = this.getNote(response.name);					
		});
	}//saveMusicNote
}//class

document.addEventListener("DOMContentLoaded", () => {

	new MusicNotes();
	//document.addEventListener('change', e =>{if (e.target.matches('.music_tal')) {}});
	
	});//document onload