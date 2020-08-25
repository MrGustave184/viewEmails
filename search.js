    this.addSearchHTML();

    $('#search-box-btn').click(function () { // on a click on botton
        //$('#myUL').show(); // show the div with the search results
        $('#myUL').css({
            //'margin-left' : -$('#search-box').outerWidth( true )
        }).toggle();
    })

    var li, a, i,filter,txtValue;
    function searchFilter(){
    let input, ul;
    input = document.getElementById('search-box');
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName('li');
    //Timer for the search field
	let typingTimer;
    let previousValue = '';
    //If the key pressed actually changed the search string
		if(input.value != this.previousValue){
			//This is how you can wait a set amount of time in javascript
			//setTimeout(function, miliseconds to wait before running the function)

			//Clear the timeout of the function to prevent to fire the event in a separate branch each time
			//we press a key, creating an unnecessary function stack. Instead, we use the same function call
			//wich will wait until we stop typing to run after 2 seconds
			clearTimeout(typingTimer);

			//If the search field is not empty, do search, else, do not show the loader icon and 
			//clear the results area
			if(input.value){
                
                //------------------------------------------
                //this.typingTimer = setTimeout(this.searchNames(), 9000);
                typingTimer =  setTimeout(()=>{
                    this.searchNames();
                },500);
                console.log(typingTimer)
                //----------------------------------------
				//Timer function
				
			} 
		}

		//Keep track of the search string value
        previousValue = input.value;
    }

    function searchNames(){
        for (i = 0; i < li.length; i++) {
            a = li[i].getElementsByTagName("a")[0];
            txtValue = a.textContent || a.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";
                //console.log('primerIF')
            } else {
                li[i].style.display = "none";
                //console.log('segundoIF')
            }
        }
    } 

    function addSearchHTML(){
    //The append method adds at the end of the selected element(the body in this case)
        $(".container-fluid").append(`
            <div class="row">
                
                <div class="col-8 parent" >
                    
                        <div class="input-group mt-4 ml-2" id="#input-group">
                            <input type="search" class="form-control search-radius" onkeyup="searchFilter()" name="search-template" placeholder="Search or select template " id="search-box">
                            <span class="divider-border"></span>
                            <button type="button" class="btn btn-default dropdown-toggle" id="search-box-btn" data-toggle="dropdown">
                                <span class="caret"></span>
                            </button>
                            <div id="myUL" class="dropdown-menu " role="menu">
                                <li><a href="#">Adele</a></li>
                                <li><a href="#">Agnes</a></li>
                                <li><a href="#">Billy</a></li>
                                <li><a href="#">Bob</a></li>
                                <li><a href="#">Calvin</a></li>
                                <li><a href="#">Christina</a></li>
                                <li><a href="#">Cindy</a></li>
                                <li><a href="#">George</a></li>
                                <li><a href="#">Sam</a></li>
                                <li><a href="#">Alis</a></li>
                                <li><a href="#">Alberto</a></li>
                            </div>
                        </div>
                    
                    
            </div>`);
    }

    this.inputWidth('300px');
    function inputWidth(size) {
        let inputWidth = document.getElementById('#input-group');
        inputWidth.style.width = size;
    }

    this.changeName('hola');
    function changeName(name){
        let inputSearch = document.getElementById('search-box');
        inputSearch.setAttribute("name",name);
    }

    
       
    