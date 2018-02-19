import {Serializable} from './serializer.interface';
import {IMapper} from './serializer.interface';

/**
 * A base class to every model that uses the mapper decorator.
 * Handles the deserialize and structuring of the JSON response.
 */

export class Serializer<T> implements Serializable<T> {
  // Structure of JSON response
  private _map: Map<string, IMapper> = new Map<string, IMapper>();

  // Getter of Map to create on demand
  get map(): Map<string, IMapper> {
    if (!this._map) { this._map = new Map<string, IMapper>(); }
    return this._map;
  }

  constructor() {}

  add(key: string, value: IMapper): void {
    if (!this.has(key)) {
      this.map.set(key, value);
    }
  }

  remove(key: string): void {
    this.map.delete(key);
  }

  has(key: string): boolean {
    return this.map.has(key);
  }

  /*
  Iterate through structure to find and add
  every matching value. A map has an object the
  value is passed to the parent.
  */
  deserialize(input: any): any {
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
      }
    });

    return this;
  }
}
