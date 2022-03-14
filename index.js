const http = require("http"); //load http module https://nodejs.org/docs/latest-v16.x/api/http.html
const https = require("https");
const host = 'localhost'; //
const port = 8000;

const requestListener = function (request, result) {
	result.setHeader("Content-Type", "application/json");
	result.setHeader("Content-Disposition", "attachment;filename=outputFile.json"); //name of the file
	result.writeHead(200);
	result.end(`{"message": "This is a JSON response"}`);
	console.log(`request from ${request}`);
};

const server = http.createServer(requestListener);
try{
	server.listen(port, host, () => { //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
		console.log(`Server is running on http://${host}:${port}`);
	});
}catch(e){
	console.log(e);
}


//POST to accept the JSON as input

//For each Recall Number, call to the VRD API to extract the CATEGORY_ETXT and/or CATEGORY_FTXT

//Create a new JSON File that appends the CATEGORY_ETXT / CATEGORY_FTXT to the input JSON.

//GET function to load the resulting JSON file, allowing for Retrieval and Display of all data, and a “Search by Category”. 