#Oh all!

>Light weight console based tool for front-end developers. Fast access to most important js libraries(jQuery, Angular.js etc.)

![Oh all!](http://s4.pikabu.ru/post_img/2014/11/08/0/1415395460_1317738278.jpg)

##Motivation
1. ```Bower``` and etc product is great and powerful tools, but sometimes I just need last jquery. I don't need documentation sources or jquery sources in strange 'bower_components' folder.
2. ```Bower``` request for work git, I think this isn't always comfortable, when I just want receive ```angular.js``` build
3. Also I wanted to level up my ```node.js```
4. I think ```bower``` too powerful product for many tasks.
5. Oh all!

##Installing
```
npm install ohall --global
```

##Using

**ohall!** support commamds which very similar to npm(and bower) commands.
> Hm... do u think this is similar? - you and my grandmother

> Ohh all! - me

###Commands
- ```ohall get name``` - getting property value from global settings
- ```ohall list``` - getting all packages which ohall 'know'
- ```ohall install package``` or ```ohall install package1 package2 packageN``` - installing packages into current directory
- ```ohall set name value``` - save property for global settings(example : CDN_URL)
- ```ohall pack query``` - packing new package by query
- ```ohall find query``` - finding packages by string query
- ```ohall tell package``` - telling about concrete package name, descriptions, available versions, builds etc.

### Flags
- ```ohall --dev``` - starting ohall without loading package.json from server, starting with empty repository, for development only