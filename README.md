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

## Is it magic?
Nope, it's not so you'll have to specify your project's folder name to make sure rabbits work properly
```
rabbit.project_name = "your_project_folder";
```
### Why?
When you're working with a server like xampp your "/" route will be "htdocs" NOT your project directory so, by doing this rabbits
will be able to look for your files.


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

## Rabbits class
1. Use this function to quickly add classes to an element
```
<div rbt-class="(boolean) true : false">
	content
</div>
```

## Rabbits Content
Ok, this is one of the most interesting functions yet, so there I go.
Rabbits content is a function thought to make html simpler using js, with this you'll be able to use "partials" this way
```
<div rbt-content="name_of_file"></div>
```
Or you can also specify a route
```
<div rbt-content="path/to/file.ext"></div>
```
### rbt-content error handler
If you get an error using this you could handle it by adding the following error codes to your "error_codes" arrays
	01.400 Bad request
	01.404 Not found
	01.500 Server Error

## Rabbits times
This one is easy, is a little module that allows you to repeat the same code many times
```
<div rbt-times="10">Hello</div>
```
will render as
```
hello
hello
hello
hello
hello
hello
hello
hello
hello
hello
```