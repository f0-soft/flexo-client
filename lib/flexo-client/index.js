'use strict';

var upnode = require( 'upnode' );
var next = require( 'nexttick' );
var argstype = require( 'f0.argstype' );


function myErr( text ) {
	return ( new Error( 'f0.flexo-client: ' + text ));
}



var CLIENT;
var container = {};
var checks = {};

container.find = function() {
	var args = arguments;
	CLIENT( function( s ) {
		s.find.apply( s, args );
	} );
};
container.insert = function() {
	var args = arguments;
	CLIENT( function( s ) {
		s.insert.apply( CLIENT, args );
	} );
};
container.modify = function() {
	var args = arguments;
	CLIENT( function( s ) {
		s.modify.apply( CLIENT, args );
	} );
};
container.delete = function() {
	var args = arguments;
	CLIENT( function( s ) {
		s.delete.apply( CLIENT, args );
	} );
};
container.aggregate = function() {
	var args = arguments;
	CLIENT( function( s ) {
		s.aggregate.apply( CLIENT, args );
	} );
};
container.groupCount = function() {
	var args = arguments;
	CLIENT( function( s ) {
		s.groupCount.apply( CLIENT, args );
	} );
};



checks.init = argstype.getChecker( myErr, [
	['options', true, 'o', [
		['host', true, 's'],
		['port', true, 'n'],
		['ping', false, 'n'],
		['timeout', false, 'n'],
		['reconnect', false, 'n']
	]],
	['callback', true, 'f']
] );
exports.init = function( options, cb ) {
	var errType = checks.init( arguments );

	if ( errType ) { return next( cb, errType ); }

	// singleton
	if ( !CLIENT ) {
		CLIENT = upnode.connect( options );
	}
	
	return next( cb, null, container );
};
