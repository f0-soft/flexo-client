'use strict';

var upnode = require( 'upnode' );
var next = require( 'next' );


function myErr( text ) {
	return ( new Error( 'f0.flexo-client: ' + text ));
}



var CLIENT;
var container = {};

container.find = function() {
	var args = arguments;
	CLIENT( function( s ) {
		s.find.call( s, args );
	} );
};
container.insert = function() {
	var args = arguments;
	CLIENT( function( s ) {
		s.insert.call( CLIENT, args );
	} );
};
container.modify = function() {
	var args = arguments;
	CLIENT( function( s ) {
		s.modify.call( CLIENT, args );
	} );
};
container.delete = function() {
	var args = arguments;
	CLIENT( function( s ) {
		s.delete.call( CLIENT, args );
	} );
};
container.aggregate = function() {
	var args = arguments;
	CLIENT( function( s ) {
		s.aggregate.call( CLIENT, args );
	} );
};
container.groupCount = function() {
	var args = arguments;
	CLIENT( function( s ) {
		s.groupCount.call( CLIENT, args );
	} );
};



// config = { port:123, host:'123' }
exports.init = function( options, cb ) {
	CLIENT = upnode.connect( options );

	return next( cb, null, container );
};
