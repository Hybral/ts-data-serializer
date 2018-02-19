import {IMapper} from './data-mapper.interface';

/**
 * A Mapper decorator used by a BaseMapper class.
 * The decorator adds the target and property to a Map structure
 * used by the deserializer in BaseMapper.
 *
 * Ex. of direct use:
 * @Mapper('book-title') title: string;
 *
 * Ex. of object match:
 * @Mapper({width: 'book-width', height: 'book-height'})
 * size: {width: number, height: number}
 *
 * Ex. of value transforming:
 * @Mapper('book-author')
 * set author(author: any) {
 *    this._author = author.firstName + ' ' + author.lastName;
 * }
 *
 * @param {string | any} mappedTarget Target JSON name
 * @returns {any} A decorator function
 */
export function Mapper(mappedTarget: string | any): any {
  return (target: any, propertyKey: string) => {
    if (mappedTarget instanceof Object) {
      Object.keys(mappedTarget).map(key => target.add(mappedTarget[key], <IMapper>{
        parent: propertyKey,
        value: key
      }));
      return;
    }

    target.add(mappedTarget, <IMapper>{parent: propertyKey});
  };
}
