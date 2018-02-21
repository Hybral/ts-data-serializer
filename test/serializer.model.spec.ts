import {Serializer} from '../src/serializer.model';
import * as mocha from 'mocha';
import * as chai from 'chai';

const expect = chai.expect;

describe('Serializer Model', () => {
	it ('should be a function', () => {
		expect(Serializer).to.be.a('function');
	});

	it ('should be able to create a map on demand', () => {
		const model = new Serializer<any>();
		expect(model.map).to.exist;
	});

	it ('should be able to create a map by init', () => {
		const model = new Serializer<any>();
		model.init();

		expect(model.map).to.exist;
	});

	it ('should be able to add a value to the map', () => {
		const model = new Serializer<any>();
		model.add('test', 'hello');

		expect(model.map).to.include('hello');
	});

	it ('should be able to remove a value to the map', () => {
		const model = new Serializer<any>();
		model.add('test', 'hello');
		model.add('test1', 'world');
		model.remove('test');

		expect(model.map).to.not.include('hello');
	});

	it ('should be able to look for values in map', () => {
		const model = new Serializer<any>();
		model.add('test', 'hello');

		expect(model.has('test')).to.equal(true);
	});

	it ('should be able to deserialize', () => {
		const model = new Serializer<any>();
		model.add('test', {parent: 't1'});
		model.add('test2', {parent: 't2'});
		model.deserialize({test: 'Hello', test2: 'World'});

		expect(model.t1).to.equal('Hello');
		expect(model.t2).to.equal('World');
	});
});