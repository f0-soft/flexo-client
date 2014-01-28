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
var memId, memTs, memName;

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

exports['Find'] = function( t ) {
	catchAll( t );
	t.expect( 5 );

	client.find( {
		name: name,
		fields: fields,
		query: {},
		options: {count: true}
	}, function( err, data ) {
		t.ifError( err );

		t.ok( data );
		t.notStrictEqual( data.result, undefined );
		t.notStrictEqual( data.result.length, undefined );
		t.notStrictEqual( data.idFields, undefined );
		t.notStrictEqual( data.idFields.length, undefined );
		t.notStrictEqual( data.count, undefined );

		t.done();
	} );
};

exports['Insert'] = function( t ) {
	catchAll( t );
	t.expect( 11 );

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
		t.notStrictEqual( data.result, undefined );
		t.notStrictEqual( data.idFields, undefined );

		client.find( {
			name: name,
			fields: fields,
			query: {},
			options: {count: true}
		}, function( err, data ) {
			t.ifError( err );

			t.ok( data );
			t.notStrictEqual( data.result, undefined );
			t.notStrictEqual( data.idFields, undefined );
			t.notStrictEqual( data.count, undefined );
			t.strictEqual( data.result.length, 3 );
			t.strictEqual( data.count, 3 );

			memId = data.result[1]._id;
			memTs = data.result[1].tsUpdate;

			t.done();
		} );
	} )
};

exports['Modify'] = function( t ) {
	catchAll( t );
	t.expect( 10 );
	memName = rnd();

	client.modify( {
		name: name,
		query: [
			{selector: {_id: memId, tsUpdate: memTs}, properties: {name: memName}}
		]
	}, function( err, data ) {
		t.ifError( err );

		t.ok( data );
		t.strictEqual( data.length, 1 );
		t.strictEqual( data[0]._id, memId );
		t.notStrictEqual( data[0].tsUpdate, memTs );

		client.find( {
			name: name,
			fields: fields,
			query: {_id: memId},
			options: {count: true}
		}, function( err, data ) {
			t.ifError( err );

			t.ok( data );
			t.strictEqual( data.result.length, 1 );
			t.strictEqual( data.result[0]._id, memId );
			t.strictEqual( data.result[0].name, memName );

			t.done();
		} );
	} );
};

exports['Delete'] = function( t ) {
	catchAll( t );
	t.expect( 9 );

	client.find( {
		name: name,
		fields: fields,
		query: {},
		options: {count: true}
	}, function( err, data ) {
		t.ifError( err );

		memId = data.result[0]._id;
		memTs = data.result[0].tsUpdate;

		client.delete( {
			name: name,
			query: [
				{_id: memId, tsUpdate: memTs}
			]
		}, function( err, data ) {
			t.ifError( err );

			t.ok( data );
			t.strictEqual( data.length, 1 );
			t.strictEqual( data[0], memId );

			client.find( {
				name: name,
				fields: fields,
				query: {},
				options: {count: true}
			}, function( err, data ) {
				t.ifError( err );

				t.ok( data );
				t.strictEqual( data.result.length, 2 );
				t.strictEqual( data.count, 2 );

				t.done();
			} );
		} )
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
