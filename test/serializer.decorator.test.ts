import {Mapper} from '../src/serializer.decorator';
import {Serializer} from '../src/serializer.model';

const decorate = new Mapper();

class Test extends Serializer<Test> {
	@Mapper('prop')
	testProp: string;

	@Mapper({test1: 't1', test2: 't2'})
	testObj: {test1: string, test2: string}

	@Mapper('transform')
	get testTran() { return this._prop; }
	set testTran(value: string) {
		this._prop = value.split("").reverse().join("");
	}

	private _prop: string;
}

describe('Serializer Decorator', () => {
	it ('should be a function', () => {
		expect(typeof Mapper).toBe('function');
	});

	it('should return a function', () => {
		expect(typeof Mapper()).toBe('function');
	});

	it ('should map a property', () => {
		const model = new Test().deserialize({prop: 'Test1'});

		expect(model.map).toBeDefined();
		expect(model.map.size).not.toEqual(0);
		expect(Array.from(model.map.keys())).toEqual(expect.arrayContaining(['prop']));
		expect(model.map.get('prop').parent).toBe('testProp');
		expect(model.testProp).toBe('Test1');
	});

	it ('should map an object', () => {
		const model = new Test().deserialize({t1: 'hello', t2: 'world'});

		expect(model.map).toBeDefined();
		expect(model.map.size).not.toEqual(0);
		expect(Array.from(model.map.keys())).toEqual(expect.arrayContaining(['t1', 't2']));
		expect(model.map.get('t1').parent).toBe('testObj');
		expect(model.map.get('t1').value).toBe('test1');
		expect(model.testObj).toEqual({test1: 'hello', test2: 'world'});
	});

	it ('should transform a value after mapping', () => {
		const model = new Test().deserialize({'transform': 'Hello World'});

		expect(model.map).toBeDefined();
		expect(model.map.size).not.toEqual(0);
		expect(Array.from(model.map.keys())).toEqual(expect.arrayContaining(['transform']));
		expect(model.map.get('transform').parent).toBe('testTran');
		expect(model.testTran).toBe('dlroW olleH');
	});
});