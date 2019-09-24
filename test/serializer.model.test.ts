import {Serializer, StrictSerializer} from '../src/serializer.model';

describe('Serializer Model', () => {
	it ('should be a function', () => {
		expect(typeof Serializer).toBe('function');
	});

	it ('should be able to strict a normal serializer', () => {
		const model = new Serializer<any>();
		model.strict = true;
		expect(model._strict).toBe(true);
		expect(model.strict).toBe(true);
	});

	it ('should be able to unstrict a normal serializer', () => {
		const model = new Serializer<any>();
		model.strict = true;
		expect(model._strict).toBe(true);
		expect(model.strict).toBe(true);
	});

	it ('should be strict of using a strict serializer', () => {
		const model = new StrictSerializer<any>();
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
			error: jest.fn()
		} as any;

		const model = new StrictSerializer<any>();
		model.add('test', 'hello');
		model.errorMessage();

		expect(global.console.error).toHaveBeenCalled();
	});

	it ('should be able to traverse an object by a string input', () => {
		const model = new Serializer<any>(true);
		expect(model._traverse({test: 'test1'}, 'test')).toBe('test1');
		expect(model._traverse({test: {child: 'child'}}, 'test.child')).toBe('child');
		expect(model._traverse({test: 'test1'}, 'a')).toBeUndefined();
		expect(model._traverse({test: {child: 'child'}}, 'test.a')).toBeUndefined();
	});

	it ('should be able to create an object from string', () => {
		const model = new Serializer<any>(true);
		expect(model._stringToObject('test', 'test1')).toEqual({test: 'test1'});
		expect(model._stringToObject('test.child', 'test1')).toEqual({test: {child: 'test1'}});
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
		model.add('s1', {parent: 't3', value: 's1'});
		model.add('s2', {parent: 't3', value: 's2'});
		model.add('test4.child1', {parent: 't4'});
		model.add('test5.child1.subChild1', {parent: 't5'});
		model.deserialize({
			test: 'Hello',
			test2: 'World',
			s1: 'H1',
			s2: 'H2',
			test4: {child1: 'Child1'},
			test5: {child1: {subChild1: 'SubChild 1'}}
		});

		expect(model.t1).toBe('Hello');
		expect(model.t2).toBe('World');
		expect(model.t3).toEqual({s1: 'H1', s2: 'H2'});
		expect(model.t4).toBe('Child1');
		expect(model.t5).toBe('SubChild 1');
	});

	it ('should be able to serialize', () => {
		const payload = {
			s1: 'H1',
			s2: 'H2',
			test: 'A New Test',
			test2: {child1: {child2: 'A New Hope'}}
		};

		const model = new Serializer<any>(false);
		model.add('test', {parent: 'Test1'});
		model.add('s1', {parent: 'Test3', value: 's1'});
		model.add('s2', {parent: 'Test3', value: 's2'});
		model.add('test2.child1.child2', {parent: 'Test2'});
		model.deserialize(payload);

		const serialized = model.serialize();
		expect(serialized).toEqual(payload);
	});
});
