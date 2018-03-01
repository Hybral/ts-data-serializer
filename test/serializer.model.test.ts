import {Serializer} from '../src/serializer.model';

describe('Serializer Model', () => {
	it ('should be a function', () => {
		expect(typeof Serializer).toBe('function');
	});

	it ('should be able to strict a serializer', () => {
		const model = new Serializer<any>(true);
		expect(model._strict).toBe(true);
	});

	it ('should be able to create a map on demand', () => {
		const model = new Serializer<any>();
		expect(model.map).toBeDefined();
	});

	it ('should be able to create a map by init', () => {
		const model = new Serializer<any>();
		model.init();

		expect(model.map).toBeDefined();
	});

	it ('should be able to add a value to the map', () => {
		const model = new Serializer<any>();
		model.add('test', 'hello');

		expect(model.map.get('test')).toEqual('hello');
	});

	it ('should not be able to add a duplicate', () => {
		const model = new Serializer<any>();
		model.add('test', 'hello');
		model.add('test', 'world');

		expect(model.map.get('test')).toEqual('hello');
	});

	it ('should be able to remove a value to the map', () => {
		const model = new Serializer<any>();
		model.add('test', 'hello');
		model.add('test1', 'world');
		model.remove('test');

		expect(model.map.get('test')).toBeUndefined();
	});

	it ('should be able to look for values in map', () => {
		const model = new Serializer<any>();
		model.add('test', 'hello');

		expect(model.has('test')).toBe(true);
	});

	it ('should be able to show error message', () => {
		global.console = {
			error: jest.fn();
		};

		const model = new Serializer<any>(true);
		model.add('test', 'hello');
		model.errorMessage();

		expect(global.console.error).toHaveBeenCalled();
	});

	it ('should be able to put missing keys in collection', () => {
		const model = new Serializer<any>(true);
		model.add('test', {parent: 't1'});
		model.add('test2', {parent: 't2'});
		model.deserialize({test: 'Hello', test4: 'World'});

		expect(model.missingKeys).toContain('test2');
	});

	it ('should be able to deserialize', () => {
		const model = new Serializer<any>(false);
		model.add('test', {parent: 't1'});
		model.add('test2', {parent: 't2'});
		model.deserialize({test: 'Hello', test2: 'World'});

		expect(model.t1).toBe('Hello');
		expect(model.t2).toBe('World');
	});
});