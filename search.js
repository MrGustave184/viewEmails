
	//Create object properties
	
		//Create the search overlay div at the end of the body
		this.addSearchHTML();

		//Search field
		this.searchField = $('#search-term');

		//Search button
		this.openButton = $(".js-search-trigger");

		//Close button (X icon)
		this.closeButton = $(".search-overlay__close");

		//Search overlay button
		this.searchOverlay = $(".search-overlay");

		//State of the overlay
		this.isOpenOverlay = false;

		//Timer for the search field
		this.typingTimer;

		//Results's div
		this.resultsDiv = $("#search-overlay__results");

		//State of the spinner loader icon
		this.isSpinnerVisible = false;

		//Previous value of the search string to keep track of important 
		// keystrokes(those who actually change the search string) and ignore keys like arrows, ctrl, shift, etc
		this.previousValue = '';

		//Call events
		this.events();
	


	//Events
	//We use bind(this) because the on() method makes "this" to point towards the targeted HTML element instead of points to our current class
	function events() {
		this.openButton.on('click', this.openOverlay.bind(this));
		this.closeButton.on('click', this.closeOverlay.bind(this));

		//We use keyup because keydawn event fires even before the search field updates his value, 
		//making this.searchField.val() do not work properly
		this.searchField.on('keyup', this.typingLogic.bind(this));

		//Keyboard events
		$(document).on("keydown", this.keyPressDispatcher.bind(this));
	}

	//Methods
	function typingLogic(){
		//If the key pressed actually changed the search string
		if(this.searchField.val() != this.previousValue){

			//This is how you can wait a set amount of time in javascript
			//setTimeout(function, miliseconds to wait before running the function)

			//Clear the timeout of the function to prevent to fire the event in a separate branch each time
			//we press a key, creating an unnecessary function stack. Instead, we use the same function call
			//wich will wait until we stop typing to run after 2 seconds
			clearTimeout(this.typingTimer);

			//If the search field is not empty, do search, else, do not show the loader icon and 
			//clear the results area
			if(this.searchField.val()){
				//Show loading icon
				if(!this.isSpinnerVisible){
					this.resultsDiv.html('<div class="spinner-loader"></div>');
					this.isSpinnerVisible = true;
				}

				//Timer function
				this.typingTimer = setTimeout(this.getResults.bind(this), 750);
			} else {
				//Clear the results area
				this.resultsDiv.html('');

				this.isSpinnerVisible = false;
			}
		}

		//Keep track of the search string value
		this.previousValue = this.searchField.val();
	}


	function keyPressDispatcher(e){
		//console.log(e.keyCode) //shows us the key code of the pressed key 

		//Open the overlay with 's' key
		//if 's' was pressed and the overlay is closed and there is no focused input or text area, then
		//open the overlay
		if(e.keyCode == 83 && !this.isOpenOverlay && !$("input, textarea").is(':focus')){
			this.openOverlay();
			console.log('open');
		}

		//Close the overlay with 'esc' key
		if(e.keyCode == 27 && this.isOpenOverlay){
			this.closeOverlay();
			console.log('close');
		}
	}

	function openOverlay(){
		//Show overlay
		this.searchOverlay.addClass("search-overlay--active");

		//Add overflow: hidden to remove the scroll in the main body
		$("body").addClass("body-no-scroll");

		//Empty out the search bar
		this.searchField.val(''); 

		//Empty out the results div
		this.resultsDiv.html('');

		//Wait until the browser considers the overlay visible, then focus the search bar
		setTimeout(() => this.searchField.focus(), 301);

		this.isOpenOverlay = true;

		/**
		 * If JS is enabled, return false will prevent the <a> element to act as a link, succefully
		 * opening the search overlay. If JS is disabled, the link will behave as normal and take the
		 * user to the search form
		 */
		return false;
	}

	function closeOverlay(){
		//Close overlay
		this.searchOverlay.removeClass('search-overlay--active');
        
		//Return the scroll bar to the main body 
		$("body").removeClass("body-no-scroll");

		this.isOpenOverlay = false;
	}

	//For the anonimous function, we use an arrow function to avoid changing the value of 'this'
	//Alternatively we could have used function(posts){}.bind(this)
	function getResults(){
		//See asynchronous-example.js for the asynchronous way to do this
		/**
		 * results is the object passed as a parameter to the getJSON callback function. It contains the
		 * JSON results of the request to the API. Those were divided in sub arrays, in the $result variable
		 * created in search-route.php 
		 */

		$.getJSON(universityData.root_url + '/wp-json/university/v1/search?term=' + this.searchField.val(), (results) => {
			this.resultsDiv.html(`
				<div class="row">
					<div class="one-third">
						<h2 class="search-overlay__section-title">General Information</h2>
						${results.generalInfo.length ? '<ul class="link-list min-list">' : '<p>No general information match your search.</p>'}
						${results.generalInfo.map(item => `<li><a href="${item.permalink}">${item.title}</a> ${item.postType == 'post' ? `by ${item.authorName}` : ''}</li>`).join('')}
						${results.generalInfo.length ? '</ul>' : ''}
					</div>
					<div class="one-third">
						<h2 class="search-overlay__section-title">Programs</h2>
						${results.programs.length ? '<ul class="link-list min-list">' : `<p>No program matches your search.<a href="${universityData.root_url}/programs">View all programs</a></p>`}
						${results.programs.map(item => `<li><a href="${item.permalink}">${item.title}</a></li>`).join('')}
						${results.programs.length ? '</ul>' : ''}
						<h2 class="search-overlay__section-title">Professors</h2>
						${results.professors.length ? '<ul class="professor-cards">' : `<p>No professors match your search.</p>`}
						<ul class="professor-cards">
							${results.professors.map(item => `
								<li class="professor-card__list-item">
									<a class="professor-card" href="${item.permalink}">
										<img class="professor-card__image" src="${item.image}">
										<span class="professor-card__name">${item.title}</span>
									</a>
								</li>
							`).join('')}
						</ul>
						${results.professors.length ? '</ul>' : ''}
					</div> 
					<div class="one-third">
						<h2 class="search-overlay__section-title">Campuses</h2>
						${results.campuses.length ? '<ul class="link-list min-list">' : `<p>No campuses match your search.<a href="${universityData.root_url}/campuses">View all campuses</a></p>`}
						${results.campuses.map(item => `<li><a href="${item.permalink}">${item.title}</a></li>`).join('')}
						${results.campuses.length ? '</ul>' : ''}
						<h2 class="search-overlay__section-title">Events</h2>
						${results.events.length ? '' : `<p>No events match your search.<a href="${universityData.root_url}/events">View all events</a></p>`}
						${results.events.map(item => `
							<div class="event-summary">
								<a class="event-summary__date t-center" href="${item.permalink}">
									<span class="event-summary__month">${item.month}</span>
									<span class="event-summary__day">${item.day}</span>  
								</a>
								<div class="event-summary__content">
									<h5 class="event-summary__title headline headline--tiny"><a href="${item.permalink}">${item.title}</a></h5>
									<p>${item.description}<a href="${item.permalink}" class="nu gray">Learn more</a></p>
								</div>
							</div>
						`).join('')}
					</div>
				</div>
			`);
		}); 
		this.isSpinnerVisible = false;
	}

	function addSearchHTML(){
		//The append method adds at the end of the selected element(the body in this case)
		$("body").append(`
		<div class="search-overlay">
			<div class="search-overlay__top">
				<div class="container">
					<i class="fa fa-search search-overlay__icon" aria-hidden="true"></i>
					<input class="search-term" id="search-term" type="text" placeholder="What are you looking for?"/>
					<i class="fa fa-window-close search-overlay__close" aria-hidden="true"></i>
				</div>
			</div>
			<div class="container" id="search-overlay__results"></div>
		</div>
		`);
	}
