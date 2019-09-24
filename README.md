# TypeScript Model Serializer

[![Travis](https://travis-ci.com/Hybral/ts-data-serializer.svg?branch=master)](https://travis-ci.com/Hybral/ts-data-serializer)
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

Map every property in the class that needs to be populated:

```javascript
@Mapper() name: string;
@Mapper() address: string;
@Mapper('companyId') id: string;
@Mapper('person.age') age: number;
```

and run the deserializer:

```javascript
...
this.deserialize({
 name: 'John Doe',
 address: 'John Doe 123 Main St Anytown'
 companyId: '00001',
 person: {
  age: 30
 }
});
```

### Map a single property
An input property will be mapped to a class property.

 ```javascript
 @Mapper() book: Book;
 ```

or if the JSON response has a different name from the property name  

 ```javascript
 @Mapper('test-book') book: Book;
 ```
 
 ### Map an nested property
When a single nested property is needed this can be done by dot notate
the string where every dot is a level in the input.

```javascript
@Mapper('book.author.name') name: string;
```
 
### Merge multiple properties
By using an object in the mapper decorator the values is merged
in a single class property. This can also be used by a setter.

```javascript
@Mapper({width: 'book-width', height: 'book-height'})
size: {width: number, height: number}
```

### Transform value after mapping
By using a setter you are able to transform the deserialized value.

```javascript
@Mapper('book')
set title(book: Book) {
 this._title = book.title.toLowerCase();
}
```

### Run the Deserializer

```javascript
new Test().deserialize(input);
```

Where "input" is the JSON response and "Test" is your model.

### Run the Serializer
By using the serializer you are able to transform the class to its origial state
by lokking at the mapped properties and reverse engineer the process. All mapped
properties are then generated to a single object.

```javascript
let payload = new Test().serialize();
```

**Note**: Only mapped properties are serialized to its original state. 

### Debugging and handling of missing keys
The serializer autodetects missing keys and stores them in "missingKeys".  
This can be used in your custom model to handle the missing keys accordingly.  

```javascript
export class Test extend Serializer<Test> {
  @Mapper('name') name: string;

  greet(): string {
    if (this.missingKeys.includes('name')) {
      return 'missing name :(';
    }

    return this.name;
  }
}
```

By using the strict serializer, an error message will print if a key is missing.  
The strict serializer can be used by adding the "StrictSerializer" mode instead of "Serializer":  

```javascript
export class Test extend StrictSerializer<Test>
```

A normal serializer can also be used as strict by setting the "strict" property  
before deserializing:

 ```javascript
export Test extend Serializer<Test> {
  constructor() {
    super();
    this.strict = true;
  }
}
```
