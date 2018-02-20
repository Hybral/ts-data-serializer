# TypeScript Model Serializer

[![Travis](https://travis-ci.org/Hybral/ts-model-serializer.svg?branch=master)](https://travis-ci.org/Hybral/ts-model-serializer)
[![Coverage Status](https://coveralls.io/repos/github/Hybral/ts-model-serializer/badge.svg?branch=master)](https://coveralls.io/github/Hybral/ts-model-serializer?branch=master)
[![Donate](https://img.shields.io/badge/donate-paypal-blue.svg)](paypal.me/hybral)

A Model Deserializer for Typescript that maps up JSON response to a class model.

### Usage

```bash
npm install -save ts-model-serializer
```

Extend every model class with the Serializer class:

```javascript
export class Test extend Serializer<Test>
```

### Map a single property

 ```javascript
 @Mapper('book') book: Book;
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
