// FIXING THE COLLAPSABLE MENU ON BLUR USING JQUERY

//start when DOM is loaded
$(function() {  //same as document.addEventListener("DOMContentLoaded", function());

	//same as document.querySelector("navbarToggle").addEventListener("blur", function());
	$("#navbarToggle").blur(function(event){

		var screenWidth = window.innerWidth;
		if (screenWidth < 768) {
			$("#collapsable-nav").collapse('hide');  //jquery function with the value 'hide'
		}
	});

	$("#navbarToggle").click(function (event) {
		$(event.target).focus();
	});
});


//IIFE

(function(global){
	var dc = {}; 

	var homeHtml = "snippets/home-snippet.html"; //this will be our requestUrl in sendGetRequest
	var allCategoriesUrl = //json that contains our data
		"https://davids-restaurant.herokuapp.com/categories.json";
	var categoriesTitleHtml = "snippets/categories-title-snippet.html";
	var categoryHtml = "snippets/category-snippet.html";

	//convenience function to insert all our Html back to the pages
	var insertHtml = function(selector, html) { //if you give me a selector I will attach the html string to it
		var targetElem = document.querySelector(selector);
		targetElem.innerHTML = html; //because the snippet comes with tags
	};

	var showLoading = function (selector) { //placeholder selector where you'll be inserting your response/result
		var html = "<div class='text-center'>";  //building a div with an image inside
		html += "<img src='images/ajax-loader.gif'></div>";
		insertHtml(selector, html); //calling insertHtml to insert our div with image
	};

	var insertProperty = function (string, propName, propValue) {
		var propToReplace = "{{" + propName + "}}";
		string = string.replace(new RegExp(propToReplace, "g"), propValue);
		return string;
	};

	//now we start executing our queries for snippets

	document.addEventListener("DOMContentLoaded", function (event) {

		//on first load, show home view
		showLoading("#main-content"); //inserting the ajax-loader icon
		$ajaxUtils.sendGetRequest(homeHtml, 
			function(responseText) { //then issues the request
			document.querySelector("#main-content").innerHTML = responseText; //responseHandler function
			},
			false); //it's not json
	});

	dc.loadMenuCategories = function () {
		showLoading("#main-content");
		$ajaxUtils.sendGetRequest(allCategoriesUrl, buildAndShowCategoriesHTML, true); //it's a json file
	};

	//builds HTML for the categories page based on the data from the server
	function buildAndShowCategoriesHTML (categories){
		//load little snippet of categories page
		$ajaxUtils.sendGetRequest(
			categoriesTitleHtml, 
			function (categoriesTitleHtml) {
			//retrieve single category snippet
			$ajaxUtils.sendGetRequest(
				categoryHtml, 
				function (categoryHtml) {
					var categoriesViewHtml = 
						buildAndShowCategoriesHTML(categories, 
												   categoriesTitleHtml, 
												   categoryHtml);
				insertHtml("#main-content", categoriesViewHtml);
			},
			false);
		},
		false);
	}

	//using categories data and snippets html
	//build categories view html to be inserted into page
	function buildCategoriesViewHtml (categories, categoriesTitleHtml, categoryHtml){
		var finalHtml = categoriesTitleHtml;
		finalHtml += "<section class='row'>";

		//loop over categories
		for (var i = 0; i < categories.length; i++) {
			//insert category values
			var html = categoryHtml;
			var name = "" + categories[i].name;
			var short_name = categories[i].short_name;
			html = insertProperty(html, "name", name);
			html = insertProperty(html, "short_name", short_name);
			finalHtml += html;
		}

		finalHtml += "</section>";
		return finalHtml;
	};

	global.$dc = dc; //exposing our internal namespace
})(window);