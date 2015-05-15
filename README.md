# rabbitsJS
routes handler for PHP based on JS, well, it's not only for PHP, but it's the easyer lang to use _.htaccess_
NO JQUERY REQUIRED

# .htaccess @ root

```
Options +FollowSymLinks -MultiViews
RewriteEngine On
RewriteBase /[path]/[to]/[proyect_root]/

RewriteRule ^r/(.*) /[path]/[to]/[proyect_root]/[layout.php or anything]/?path=$1
#DONT REDIRECT / to use rabbits or your assets won't be able

```

# Getting Started
## Adding routes
To set the rabbits routes and callbackso you'll need a JSON, and these most be excecuted in document.ready

```
var routes = [
	{path: "/", callback: home },
	{path: "/menu", callback: menu }, // "menu" it's the name of a function, so this will be called whent "/menu" matches
	{path: "/sum/:n1/:n2", callback: function(a){
	  alert(a[0]+a[1]); //HERE n1 takes the value of a[0] and n2 the value of a[1]
	 } }
];
```

After having that JSON we'll have to initialize a rabbit

```
rabbit = new rabbitsModule(routes);
```
Finally match routes

```
rabbit.match();
```

## Adding and changing error responses
In rabbits you'll be able to update or add errors catching functions for *_404_* and *_500_*
```
var error_codes = [
	 {code: 404, action: callback }, // This function already exists
	 {code: 500, action: function(){alert("500");} } // This is a lambda
];
rabbit.set_error_codes(error_codes);
```
(Yup, it's another JSON);
	

# DOM O:

### Rabbits repeat
1. Takes a json_obj
2. Then it goes ->
```
<div rabbits-repeat="JSON_obj">
	<p>[JSON_obj.name]</p>
	<img src="[JSON_obj.path]" alt="[JSON_obj.name]">
</div>
```
