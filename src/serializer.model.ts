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
      this.addStrict(isStrict);
    }
  }

  init() {
    if (!this._map) { 
      this._map = new Map<string, IMapper>(); 
    }
  }

  /**
  * @deprecated Will be removed in 1.3.0, please use StrictSerializer or set the strict flag
  */
  private addStrict(value: boolean) {
    this._strict = value;
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

  /*
  Iterate through structure to find and add
  every matching value. A map has an object the
  value is passed to the parent.
  */
  deserialize(input: any): any {
    this.missingKeys = [];
    this.map.forEach((map, key) => {
      if (typeof input[key] !== 'undefined') {
        if (map.value) {
          if (!this[map.parent]) { 
            this[map.parent] = {};
          }

          this[map.parent][<string>map.value] = input[key];
          return;
        }

        this[map.parent] = input[key];
        return;
      } else {
        this.errorhandler(key);
      }
    });

    return this;
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
