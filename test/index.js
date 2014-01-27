'use strict';

var _ = require( 'underscore' );
var Starter = require( 'f0.starter' );

var starterConfig = _.extend(
	{},
	Starter.config,
	{
		'flexo-client': require( '../' ),
		view: Starter.mock.view,
		controller: Starter.mock.controller,
		flexo_path: __dirname + '/../node_modules/f0.starter/scheme/flexo',
		type_path: __dirname + '/../node_modules/f0.starter/scheme/types',
		link_path: __dirname + '/../node_modules/f0.starter/scheme/link',
		view_path: __dirname + '/../node_modules/f0.starter/scheme/view',
		template_path: __dirname + '/../node_modules/f0.starter/scheme/tpl',
		collection_alias: {
			contacts: 'ct',
			customers: 'cs'
		}
	}
);

var client;
var name = 'customers';
var fields = ['_id', 'tsUpdate', 'tsCreate', 'name', 'm_id'];

function rnd() {
	return parseInt( Math.random() * 10000 ).toString( 10 );
}



exports['Init'] = function( t ) {
	catchAll( t );
	t.expect( 2 );

	Starter.init( starterConfig, function( err, c, all ) {
		t.ifError( err );

		t.ok( all['flexo-client'] );
		client = all['flexo-client'];

		t.done();
	} );
};

exports['Find empty'] = function( t ) {
	catchAll( t );
	t.expect( 2 );

	client.find( {
		name: name,
		fields: fields,
		query: {},
		options: {count: true}
	}, function( err, data ) {
		t.ifError( err );

		t.ok( data );

		t.done();
	} );
};

exports['Insert'] = function( t ) {
	catchAll( t );
	t.expect( 2 );

	client.insert( {
		name: name,
		fields: fields,
		query: [
			{name: rnd(), m_id: rnd()},
			{name: rnd(), m_id: rnd()},
			{name: rnd(), m_id: rnd()}
		],
		options: {}
	}, function( err, data ) {
		t.ifError( err );

		t.ok( data );

		t.done();
	} )
};

exports['Find inserted'] = function( t ) {
	catchAll( t );
	t.expect( 2 );

	client.find( {
		name: name,
		fields: fields,
		query: {},
		options: {count: true}
	}, function( err, data ) {
		t.ifError( err );

		t.ok( data );

		t.done();
	} );
};



/**
 * Available test methods
 */
var t = {
	expect: function( number ) { return number; },
	ok: function( value, message ) { return value;},
	deepEqual: function( actual, expected, message ) { return [actual, expected];},
	notDeepEqual: function( actual, expected, message ) { return [actual, expected];},
	strictEqual: function( actual, expected, message ) { return [actual, expected];},
	notStrictEqual: function( actual, expected, message ) { return [actual, expected];},
	throws: function( block, error, message ) { return block;},
	doesNotThrow: function( block, error, message ) { return block;},
	ifError: function( value ) { return value;},
	done: function() { return true;}
};

function catchAll( test ) {
	process.removeAllListeners( 'uncaughtException' );
	process.on( 'uncaughtException', test.done );
}
