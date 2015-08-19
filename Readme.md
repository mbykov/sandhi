# node.js sanskrit sandhi rules

## Installation

With node.js:

````javascript
$ npm install sandhi
````

## API

````javascript
var sandhi = require('sandhi');
````

````javascript
sandhi.del(samasa, second)
sandhi.add(first, second)
sandhi.int(form, flex, cflex)
````

View more examples in [test suite](https://github.com/mbykov/sandhi/tree/master/test/node)

## Running node tests

````javascript
$ make test
````

## License

  GNU GPL
