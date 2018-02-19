# TypeScript Model Deserializer

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Greenkeeper badge](https://badges.greenkeeper.io/alexjoverm/typescript-library-starter.svg)](https://greenkeeper.io/)
[![Travis](https://img.shields.io/travis/alexjoverm/typescript-library-starter.svg)](https://travis-ci.org/alexjoverm/typescript-library-starter)
[![Coveralls](https://img.shields.io/coveralls/alexjoverm/typescript-library-starter.svg)](https://coveralls.io/github/alexjoverm/typescript-library-starter)
[![Dev Dependencies](https://david-dm.org/alexjoverm/typescript-library-starter/dev-status.svg)](https://david-dm.org/alexjoverm/typescript-library-starter?type=dev)
[![Donate](https://img.shields.io/badge/donate-paypal-blue.svg)](https://paypal.me/AJoverMorales)

A Model Deserializer for Typescript that maps up JSON response to a class model.

### Usage

```bash
npm install -save modelserializer
```

Extend every model class with the Serializer class:

```bash
export class Test extend Serializer
```

### Map a single property

 ```bash
 @Mapper('JSON value') property;
 ```
 
### Map an object

```javascript
@Mapper(width: 'book-width', height: 'book-height')
size: {width: number, height: number}
```

### Transform value after mapping

```javascript
@Mapper('book')
set title(book: Book) {
 this._title = book.title.toLowerCase();
}
```
