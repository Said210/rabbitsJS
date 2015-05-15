/*
	Rabbits, by Notion. 0.1a
	Rabbits it's a JS based (As you already may know) routes manager, that's it :3
	
	CC-BY, Notion
*/

var params = [];
var route = function (r){
	this.route = r;
	this.params_indices = [];
	this.params_types = [];
	this.has_params = false;
	

	for (var i = 0; i < this.route.length; i++) {  // Get the parameter position and the variable name 
		if( this.route[i].match(/\:(\w+)/) != null){
			
			this.params_indices.push([0, ""]);
			this.params_indices[this.params_indices.length - 1][0] = i;
			this.params_indices[this.params_indices.length - 1][1] = this.route[i].match(/\:(\w+)/)[0];
			this.has_params = true;
		}
	};

	
};


var rabbitsModule = function (r) {
	this.routes = r;
	this.regex_routes = [];
	this.routes_obj = [];
	this.padding = 3; // Distance until where rabbits it's going to start to read.
	this.error_code = null;
	this.rabbits_elements = [];
	this.error_codes = [
		{code: 404, action: function(){alert("This is not the page you're looking for... ");} }
	];

	this.prerender = function (){ // This guy here is in charge to do the thing

		var _paths = [];
		
		for (var i = 0; i < this.routes.length; i++) {
			_paths.push(this.routes[i].path);
			this.routes_obj.push( new route(this.routes[i].path.split("/")) );
		}; // Pass the route to the route obj for it's future use

		//console.log(this.routes_obj);

		for (var i = 0; i < _paths.length; i++) {
			_paths[i] = _paths[i].replace(/\//g, "\\/" );
			_paths[i] = "/" + _paths[i] + "/";
			_paths[i] = _paths[i].replace(/\:(\w+)/g, "([a-zA-Z0-9]{0,})" ); // the bunny should look for letters and numbers
		}

		for (var i = 0; i < _paths.length; i++) {
			this.regex_routes.push(_paths[i]);  // Add the partial path to the paths that we'll use to match routes
		}

		// console.log(this.regex_routes); // Uncomment for debugging
	}

	this.match = function(){
		var has_match = false;
		this.prerender(); // prerender the routes
		var _path = window.location.pathname.split("/");
		var path = "";
		for(var i = this.padding; i < _path.length; i++){
			path += "/" + _path[i];
		}			
		// console.log(path); //uncomment for debugging

		for (var i = 0; i < this.routes.length; i++) { // Go through the routes
			var compiled = "'" + path + "'.match(" + this.regex_routes[i] + ")"; // Build the match
			console.log(compiled);
			if( eval(compiled) != null ){ // The route matched?
				if (i != 0 || path == "/") {
					has_match = true;
				};				

				if( !this.routes_obj[i].has_params ){		// Is there any parameter?				
					if ( typeof(this.routes[i].callback) == "string" ){ // Is it an string or a function
						var f = this.routes[i].callback + "()";
						eval(f); //Ejecute string
					}else{	//Then it's a lambda
						this.routes[i].callback();  //Ejecute function or lambda
					}
				}else{
					var local = [];
					for (var j = 0; j < this.routes_obj[i].params_indices.length; j++) {
						console.log(this.routes_obj[i].params_indices[j][1]);
						window.params[ this.routes_obj[i].params_indices[j][1] ] = window.location.pathname.split("/")[this.routes_obj[i].params_indices[j][0] + (this.padding - 1)];
						local.push(window.location.pathname.split("/")[this.routes_obj[i].params_indices[j][0] + (this.padding - 1)] );
					};
					this.routes[i].callback(local);
				}				
			}

		};
		if (!has_match) {
			this.error_code = 404; //As any page was found we set the error code as 404
		};	
		if(this.error_code != null)
			this.error_catcher();

		return this.error_code;
	};


	this.error_catcher = function(){  
		for (var i = 0; i < this.error_codes.length; i++) {
			if(this.error_codes[i].code == this.error_code){
				if ( typeof(this.error_codes[i].action) == "string" ){ // Is it an string or a function
					var f = this.error_codes[i].action + "()";
					eval(f); //Ejecute string
				}else{	//Then it's a lambda
					this.error_codes[i].action();  //Ejecute function or lambda
				}
			}
		};
	};

	this.set_error_codes = function(errors){ //We overwrite the default error codes.
		for (var i = 0; i < this.error_codes.length; i++) {
			var done = false;
			for (var j = 0; j < errors.length; j++) {
				if(this.error_codes[i].code == errors[j].code){
					done = true;
					this.error_codes[i].action = errors[j].action;
				}
				if (!done) {
					this.error_codes.push(errors[j]);
				};
			}
		}
	}

	/* This little function is used to redirect things when you're using rabbits */
	this.push = function(title, url, callback){
		history.pushState(null, title, "/barbarossa/r"+url);
		callback();
	}
	
	this.get_elements_by_attr = function(attribute, context){ //The original version of this functions it's in http://stackoverflow.com/questions/9496427/can-i-get-elements-by-attribute-selector-when-queryselectorall-is-not-available
	  var nodeList = (context || document).getElementsByTagName('*');
	  var nodeArray = [];
	  var i = 0;
	  var j = 0;
	  var node = null;
	  var attr = null;
	  while(node = nodeList[i++]){
	  	j = 0;
	  	while(attr = node.attributes[j++]){
	  		var tmp = attr.name; // Use a tmp variable to save the value of the attribute because it's an object
		    if (eval("'" + tmp + "'.match(" + attribute + ")")) // check regex
		    	nodeArray.push(node);
		
		}
	  }

	  return nodeArray;
	}

	this.function_tail = function( elements ){
		var attr = null;
		var self = null;
		var j = 0;
		for (var i = 0; i < elements.length; i++) {
			j = 0;
			self = elements[i];
			while(attr = elements[i].attributes[j++]){
		  		var tmp = attr.name; // Use a tmp variable to save the value of the attribute because it's an object
			    if (eval("'" + tmp + "'.match(/rabbit-*/g)")) { // check regex
			    	tmp = tmp.substr(tmp.indexOf("-") + 1, tmp.length - 1); // Here we get the function name and so on
			    	this.rabbits_elements.push(self);
			    	eval("this." + tmp + "(" + (this.rabbits_elements.length - 1) + "," + attr.value + ")"); // We execute the function with it's value as a parameter
			    }
			    	
			}
		};
	}

	this.init = function(){
		this.function_tail( this.get_elements_by_attr("/rabbit-*/g") );
	}

	this.repeat = function(index, json){
		var template = this.rabbits_elements[index].innerHTML;
		template = template.replace(/\t/g, "");
		var element = this.rabbits_elements[index];
		var num_of_params = 
		element.innerHTML = "";
		for (var i = 0; i < json.length; i++) {
			var tmp = template;
			for (var j = 0; j < template.length; j++) {
				if(template[j] == "]"){  // 
					var found = false;
					
					for (var k = j; k >= 0; k--) {
						
						if( template[k] == "["){
							var part = template.substring(k+1, j );
							part = part.replace(/\s/g, "");
							console.log(part);
							
							var part_ = part.substring(0, part.indexOf("."));

							var _part = part.substring(part.indexOf(".") + 1, part.length);
							_part = _part.replace(/\]/g, "");

							console.log(eval("json["+i+"]." + _part));

							tmp = tmp.replace(eval("/\\[" + part_ + "\\." + _part + "\\]/g"), eval("json["+i+"]." + _part));
							console.log(tmp, k, j, i);;;;
							
							found = true;
							k = 0;
						}
						
					};
				}
				if(!found){
					this.error_code = 500;
					console.log("Could not find the start of the sentece, check your code");
				}
			};
			//element.innerHTML += template;
			element.innerHTML += tmp;
		};
	}
}

/* This little function is used to redirect things when you're using rabbits */
var push = function(title, url, callback) {
	history.pushState(null, title, "/barbarossa/r"+url);
	callback();
}
