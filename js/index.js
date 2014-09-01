document.getElementById("filter_td").style.marginTop = -1*document.getElementById("filter_td").offsetHeight/2;

page_params = {
	"pageSize": 10,
	"page": 1,
	"sort": "salesRankMediumTerm"
};

function updateResults(callbackFn) {
	if (callbackFn == "myCallback") {
		page_params["page"] = 1;
	} else if (callbackFn == "appendCallback") {
		page_params["page"] += 1;
	}

	//console.log(page_params["page"]);

	var manufacturer = document.getElementsByName("manufacturer");
	var display_res = document.getElementsByName("display_res");

	var manufacturer_list = [];
	var display_res_list = [];

	for (var i=0; i<manufacturer.length; ++i) {
		if (manufacturer[i].checked)
			manufacturer_list.push(manufacturer[i].value);
	}

	for (i=0; i<display_res.length; ++i) {
		if (display_res[i].checked)
			display_res_list.push(display_res[i].value);
	}

	var min_ram = document.getElementById("min_ram").value;
	var min_battery = document.getElementById("min_battery").value * 60; // battery life in minutes
	
	var API_KEY = "rycx7478fv7jq5fa8e34zs9v";

	var search_string = "(class=mobile computing*";

	if (manufacturer_list.length) {
		search_string += "&("
		for (i=0; i<manufacturer_list.length; ++i) {
			search_string += "search=" + manufacturer_list[i] + "|";
		}
		search_string = search_string.substr(0, search_string.length-1) + ")";
	}

	if (display_res_list.length) {
		search_string += "&(";
		for (i=0; i<display_res_list.length; ++i) {
			search_string += "search=" + display_res_list[i] + "|";
		}
		search_string = search_string.substr(0, search_string.length-1) + ")";
	}

	search_string += ")";
	search_string += "?show=all";

	for (var param in page_params) {
		if (page_params.hasOwnProperty(param)) {
			search_string += "&" + param + "=" + page_params[param];
		}
	}

	search_string += "&format=json&apiKey=" + API_KEY;

	//console.log(search_string);

	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = "http://api.remix.bestbuy.com/v1/products" + search_string + "&callback=" + callbackFn;

	//console.log(script.src);

	document.getElementsByTagName("head")[0].appendChild(script);
}

function populateRows(tableBody, products) {
	for (var i=0; i<products.length; ++i) {
		var tr = document.createElement("tr");

		var td = document.createElement("td");
		td.appendChild(laptopBasic(products[i]));
		tr.appendChild(td);

		td = document.createElement("td");
		td.appendChild(laptopPrice(products[i]));
		tr.appendChild(td);

		tr.className += " results_row";
		tableBody.appendChild(tr);
	}
}

function myCallback(data) {
	var tableBody = document.getElementById("results_table");
	var products = data.products;

	var totalPages = data.totalPages;
	if (page_params["page"] > totalPages + 1)
		return;

	var newTableBody = document.createElement("tbody");
	newTableBody.id = "results_table";

	populateRows(newTableBody, products);

	tableBody.parentNode.replaceChild(newTableBody, tableBody);
}

function appendCallback(data) {
	//console.log(data.from + " " + data.to);
	var tableBody = document.getElementById("results_table");
	var products = data.products;

	var totalPages = data.totalPages;
	if (page_params["page"] > totalPages + 1)
		return;

	populateRows(tableBody, products);
}

function laptopBasic (product) {
	var basicDiv = document.createElement("div");
	var splitName = product.name.split("-");
	var laptopDescription = splitName[0] + "<br/>" + splitName[1] + "<br/>" + product.modelNumber;

	var laptopImage = document.createElement("img");
	laptopImage.src = product.image;
	laptopImage.style.display = "block";
	laptopImage.style.margin = "auto";

	textDiv = document.createElement("div");
	textDiv.innerHTML = laptopDescription;
	textDiv.style.textAlign = "center";

	basicDiv.appendChild(laptopImage);
	basicDiv.appendChild(textDiv);

	return basicDiv;
}

function laptopPrice (product) {
	return document.createTextNode(product.salePrice);
}

function appendRows() {
	updateResults("appendCallback");
}