import {Mapper} from '../src/serializer.decorator';
import {Serializer} from '../src/serializer.model';
import * as mocha from 'mocha';
import * as chai from 'chai';

const expect = chai.expect;
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
		expect(Mapper).to.be.a('function');
	});

	it('should return a function', () => {
		expect(Mapper()).to.be.a('function');
	});

	it ('should map a property', () => {
		const model = new Test().deserialize({prop: 'Test1'});

		expect(model.map).to.exist;
		expect(model.map).to.not.be.empty;
		expect(model.map).to.have.keys('prop', 't1', 't2', 'transform');
		expect(model.map.get('prop').parent).to.equal('testProp');
		expect(model.testProp).to.equal('Test1');
	});

	it ('should map an object', () => {
		const model = new Test().deserialize({t1: 'hello', t2: 'world'});

		expect(model.map).to.exist;
		expect(model.map).to.not.be.empty;
		expect(model.map).to.have.keys('prop', 't1', 't2', 'transform');
		expect(model.map.get('t1').parent).to.equal('testObj');
		expect(model.map.get('t1').value).to.equal('test1');
		expect(model.testObj).to.deep.equal({test1: 'hello', test2: 'world'});
	});

	it ('should transform a value after mapping', () => {
		const model = new Test().deserialize({'transform': 'Hello World'});

		expect(model.map).to.exist;
		expect(model.map).to.not.be.empty;
		expect(model.map).to.have.keys('prop', 't1', 't2', 'transform');
		expect(model.map.get('transform').parent).to.equal('testTran');
		expect(model.testTran).to.equal('dlroW olleH');
	});
});