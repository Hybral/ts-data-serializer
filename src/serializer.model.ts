import {Serializable} from './serializer.interface';
import {IMapper} from './serializer.interface';

/**
 * A base class to every model that uses the mapper decorator.
 * Handles the deserialize and structuring of the JSON response.
 */

export class Serializer<T> implements Serializable<T> {
  // Structure of JSON response
  private _map: Map<string, IMapper>;

  // Show missing key message
  private _strict: boolean;

  // Getter and setter of strict mode
  get strict(): boolean { return this._strict; }
  set strict(strict: boolean) {
    this._strict = strict;
  }

  // Getter of Map to create on demand
  protected get map(): Map<string, IMapper> {
    this.init();
    return this._map;
  }

  // Array of missing keys
  public missingKeys: Array<string> = [];

  constructor(isStrict?: boolean) {
    this.init();

    if (isStrict !== undefined) {
      this.strict = isStrict;
    }
  }

  init() {
    if (!this._map) { 
      this._map = new Map<string, IMapper>(); 
    }
  }

  private add(key: string, value: IMapper): void {
    if (!this.has(key)) {
      this.map.set(key, value);
    }
  }

  private remove(key: string): void {
    this.map.delete(key);
  }

  has(key: string): boolean {
    return this.map.has(key);
  }

  private errorhandler(key: string) {
    if (this._strict) { this.errorMessage(key); }
    this.missingKeys.push(key);
  }

  private errorMessage(key) {
    console.error('(' + this.constructor.name +') deserialize: "' + key + '" cannot be found');
  }

  private _traverse(input: Object, key: string): any {
    return key.split('.').reduce((a, b) => a ? a[b] : null, input);
  }

  private _stringToObject(key: string, value: any): Object {
    let r = {};
    key.split('.').reduce((a, b, i, arr) => {
      return a[b] = a[b] || arr[i + 1] ? {} : value;
    }, r);

    return r;
  }

  /*
  Iterate through structure to find and add
  every matching value. A map has an object the
  value is passed to the parent.
  */
  deserialize(input: any): any {
    this.missingKeys = [];
    this.map.forEach((map, key) => {
      const value = this._traverse(input, key);
      if (typeof value !== 'undefined') {
        if (map.value) {
          if (!this[map.parent]) { 
            this[map.parent] = {};
          }

          this[map.parent][<string>map.value] = value;
          return;
        }

        this[map.parent] = value;
        return;
      } else {
        this.errorhandler(key);
      }
    });

    return this;
  }


  /*
  Restructure the payload by iterating through
  the mapper and building up the object as it was mapped
  by the class.
   */
  serialize(): Object {
    return Array.from(this.map).reduce((a, b) => {
      return {...a, ...this._stringToObject(b[0], b[1].value
            ? this[b[1].parent][<string>b[1].value]
            : this[b[1].parent])};
    }, {});
  }
}

/**
* A strict version of the serializer model to simplify handling
*/

export class StrictSerializer<T> extends Serializer<T> {
  constructor() {
    super();
    this.strict = true;
  }
}
