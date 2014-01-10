'use strict';

var dnode = require( 'dnode' );
var next = require( 'next' );


function myErr( text ) {
	return ( new Error( 'f0.flexo-client: ' + text ));
}



var CONNECTION;
var TIMEOUT_MIN = 10;
var TIMEOUT_MAX = 10 * 60 * 1000;
var TIMEOUT = TIMEOUT_MIN;



var container = {};

container.find = function() {
	CONNECTION.find.call( CONNECTION, arguments );
};
container.insert = function() {
	CONNECTION.insert.call( CONNECTION, arguments );
};
container.modify = function() {
	CONNECTION.modify.call( CONNECTION, arguments );
};
container.delete = function() {
	CONNECTION.delete.call( CONNECTION, arguments );
};
container.aggregate = function() {
	CONNECTION.aggregate.call( CONNECTION, arguments );
};
container.groupCount = function() {
	CONNECTION.groupCount.call( CONNECTION, arguments );
};



// config = { port:123, host:'123' }
exports.init = function( config, cb ) {

	connect( config, function( err, remote ) {
		if ( err ) { return cb( err ); }

		CONNECTION = remote;

		return cb( null, container );
	} );
};

function connect( config, cb ) {
	var errHandler, client;
	cb = cb || thrower;

	errHandler = function() {
		TIMEOUT = TIMEOUT * 2;

		if ( TIMEOUT > TIMEOUT_MAX ) {
			return next( cb, myErr( 'не удалось восстановить соединение' ) );
		}

		setTimeout( connect, TIMEOUT, config );
		return undefined;
	};

	client = dnode.connect( config );

	client.once( 'end', errHandler );
	client.once( 'error', errHandler );
	client.once( 'remote', function( remote ) {
		TIMEOUT = TIMEOUT_MIN;
		return cb( null, remote );
	} );
}

function thrower( err ) {
	if ( err ) {
		throw err;
	}
}
