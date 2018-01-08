/* global describe, it, expect */
import {LazyLoad} from '../src/index.js';

describe('Create a lazy load instance with default option', function() {
	var lazyLoad = new LazyLoad();
	it('root option should be null', function() {
		expect(lazyLoad.options.root).toBeNull();
	});

	it('rootMargin option should be equal to 5%', function() {
		expect(lazyLoad.options.rootMargin).toEqual('5%');
	});

	it('threshold option should be equal to 0', function() {
		expect(lazyLoad.options.threshold).toEqual(0);
	});
});

describe('Create a lazy load instance with custom options', function() {
	var options = {root: null, rootMargin: '10%', threshold: 1};
	var lazyLoad = new LazyLoad(options);
	it('root option should match passed option', function() {
		expect(lazyLoad.options.root).toEqual(options.root);
	});

	it('rootMargin option should match passed option', function() {
		expect(lazyLoad.options.rootMargin).toEqual(options.rootMargin);
	});

	it('threshold option should match passed option', function() {
		expect(lazyLoad.options.threshold).toEqual(options.threshold);
	});
});

describe('Create a lazy load instance should create a IntersectionObserver object', function() {
	var lazyLoad = new LazyLoad();
	it('lazy load should contain an instance of IntersectionObserver class', function() {
		expect(lazyLoad.observer).toBeInstanceOf(IntersectionObserver);
	});
});
