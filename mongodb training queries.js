//* mongodb

//* show dbs

//! create new or use one of the databases with use command

//! use <database name>

//! show collections inside a database with show collections command

//! do find operation on one of the collections with db.<collection name>.find()

//! the only difference between json and bson is that there are quotation marks on both key and value in bson and only value on json

//! db.<collection name>.find().pretty()

//! create collection

db.createCollection("cars")

//! insert into collection

db.cars.insert({
	name : 'honda',
	make : 'accord',
	year : '2010'
})

//! update

db.cars.update(
	{
		name: 'honda'
	},
	{
		$set:{
			name: 'ford'
		}
	}
)

//! add something new to the document

db.cars.update(
	{
		name: 'ford'
	},
	{
		$set:{
			transmission: 'automatic'
		}
	}
)

//! remove document

db.cars.remove({
	name: 'ford'
})

//! run javascript
for(var i = 0; i < 10; i++){db.things.insert({"x": i})}


//---------------------------------------------------------

db.student.insert({
    name: 'Joe',
    undergrad: true,
    units: 9,
    classes: ['geography', 'math', 'journalism']
})

db.student.insert({
    name: 'Jane',
    undergrad: false,
    units: 12,
    classes: ['geography', 'science', 'journalism', 'history']
})

db.student.insert({
    name: 'Kevin',
    undergrad: true,
    units: 3,
    classes: ['geography']
})

db.student.insert({
    name: 'Rachel',
    undergrad: false,
    units: 6,
    classes: ['geography', 'history']
})

db.student.find({})
db.student.find({'name': 'Rachel'})
db.student.find({units: {$gt: 6}})
db.student.find({units: {$lt: 7}})
db.student.find({classes: {$in: ['history']}})

db.student.find({classes: {$in: ['history']}}).sort({units: -1})    // ascending
db.student.find({}).sort({name: 1})    // descending

db.student.find({}).sort({name: 1}).limit(2)


//----------
//!Data Import
//----------

/*
mongoimport --db northwind --collection territories --type csv --file territories.csv --headerline
mongoimport --db northwind --collection employees --type csv --file employees.csv --headerline
mongoimport --db northwind --collection categories --type csv --file categories.csv --headerline
mongoimport --db northwind --collection customers --type csv --file customers.csv --headerline
mongoimport --db northwind --collection employee-territories --type csv --file employee-territories.csv --headerline
*/

//----------
//!Querying
//----------

//https://docs.mongodb.com/manual/reference/method/db.collection.find/
//https://docs.mongodb.com/manual/tutorial/query-documents/

db.regions.find({RegionDescription:"Northern"})
db.regions.find({RegionDescription:"Northern",RegionID:3})
db.regions.find({RegionDescription:"Northern",RegionID:3},{_id:0})
db.regions.find({RegionDescription:"Northern",RegionID:3},{_id:0,RegionID:0})
db.regions.find({RegionDescription:"Northern",RegionID:3},{_id:false,RegionID:0})

//!Count
//-----
db.regions.find({RegionDescription:"Northern",RegionID:3},{_id:false,RegionID:0}).count()
db.regions.find().count()

//!Limit
//-----
db.regions.find().limit(2)

//!Skip
//-----
db.regions.find().skip(2)

//!Skip and limit
//--------------
db.regions.find().skip(1).limit(1)

//!Sort
//-----
db.regions.find().sort({ RegionId:1 })
db.regions.find().sort({ RegionId:-1 })

//! Find object with Object Id
//------
db.test.insert({x: 1})
db.test.find({"_id" : ObjectId("4ecc05e55dd98a436ddcc47c")}) // explicit
db.test.find(ObjectId("4ecc05e55dd98a436ddcc47c"))           // shortcut


//----------------------------
//!Comparision Operators in Queries 
//----------------------------

//!Basic Comparision operators - less than, Greater than
//-----------------------
db.products.find({UnitPrice:{$lt:100}})
db.products.find({UnitPrice:{$gt:100}})
db.products.find({UnitPrice:{$eq:123.79}})

//!Multiple Conditions
//--------------------
//*this is an and operation between the condition
db.products.find({UnitPrice:{$gt: 50, $lt: 100}})

//*multi condition works a littebit different for arrays

//-----------------------------
//!Logical Operators
//-----------------------------

//!And Operation
//--------------
db.products.find({$and: [{Discontinued:1},{UnitPrice:{$gt: 100}}] })

//!Or Operation
//--------------
db.products.find({$or: [{Discontinued:1},{UnitsInStock:{$eq: 0}}] })


//----------------
//!Update Documents
//----------------
//*this will update the first document and replace the entire document

db.shippers_copy.update({},{Phone:'12345'})

//*right way using $set operator

db.shippers_copy.update({CompanyName:'United Package'},{$set: {Phone:'123456'}});

//*multi updates
db.shippers_copy.update({},{$set: {Phone:'zyx-12345'}},{multi:true})

db.shippers_copy.updateMany({},{$set: {Phone:'abc-12345'}})

db.shippers_copy.updateOne({},{$set: {Phone:'efg-12345'}})

db.shippers_copy.updateOne({CompanyName:'Some Company in Panama'},{$set: {Phone: 'hij-12345'}},{upsert:true})

//----------------
//!Delete Documents
//----------------
db.customers_copy.find({})

db.customers_copy.find({Country:'Mexico'})
db.customers_copy.find({Country:'Germany'})

db.customers_copy.distinct("Country")

db.customers_copy.deleteOne({Country:'Mexico'})

db.customers_copy.deleteMany({Country:'Mexico'})

db.customers_copy.remove({Country:'Germany'},{justOne:true})

db.customers_copy.remove({Country:'Germany'})

//----------------
//!Arrays
//----------------

//https://docs.mongodb.com/manual/tutorial/query-arrays/

db.inventory.insertMany([
   { item: "journal", qty: 25, tags: ["blank", "red"], dim_cm: [ 14, 21 ] },
   { item: "notebook", qty: 50, tags: ["red", "blank"], dim_cm: [ 14, 21 ] },
   { item: "paper", qty: 100, tags: ["red", "blank", "plain"], dim_cm: [ 14, 21 ] },
   { item: "planner", qty: 75, tags: ["blank", "red"], dim_cm: [ 22.85, 30 ] },
   { item: "postcard", qty: 45, tags: ["blue"], dim_cm: [ 10, 15.25 ] }
]);

//!Match an array
//--------------
db.inventory.find( { tags: ["red", "blank"] } )

//!Find an array that contains both the elements "red" and "blank", without regard to order or other elements
//----------------------------------------------------------------------------------------------------------
db.inventory.find( { tags: { $all: ["red", "blank"] } } )


//!All documents where tags is an array that contains the string "red" as one of its elements:
//-------------------------------------------------------------------------------------------
db.inventory.find( { tags: "red" } )
db.inventory.find( {dim_cm:30})
db.inventory.find( {dim_cm:{$eq: 15.25}})

//!Conditions on the elements in the array field
//---------------------------------------------
//*{ <array field>: { <operator1>: <value1>, ... } }

db.inventory.find( { dim_cm: { $gt: 25 } } )

//!Specify Multiple Conditions for array Elements
//----------------------------------------------

/*
 * Query an Array with Compound Filter Conditions on the Array Elements
 * -------------------------------------------------------------------- 
 * The following example queries for documents where the dim_cm array contains elements
 * that in some combination satisfy the query conditions; e.g., one element can satisfy
 * the greater than 15 condition and another element can satisfy the less than 20 condition,
 * or a single element can satisfy both:
*/
db.inventory.find( { dim_cm: { $gt: 15, $lt: 20 } } )

/*
 * Query for an Array Element that Meets Multiple Criteria
 * -------------------------------------------------------
 * Use $elemMatch operator to specify multiple criteria on the elements of an array such
 * that at least one array element satisfies all the specified criteria.
*/
db.inventory.find( { dim_cm: { $elemMatch: { $gt: 22, $lt: 30 } } } )
db.inventory.find( { dim_cm: { $elemMatch: { $gt: 15, $lt: 20 } } } )

//!Query for an Element by the Array Index Position
//-------------------------------------------------

db.inventory.find( { "dim_cm.1": { $gt: 25 } } )

//!Query an Array by Array Length
//-------------------------------

db.inventory.find( { "tags": { $size: 3 } } )

//----------------------------------
//!Query an Array of Embedded Documents
//----------------------------------

db.inventory.insertMany( [
   { item: "journal", instock: [ { warehouse: "A", qty: 5 }, { warehouse: "C", qty: 15 } ] },
   { item: "notebook", instock: [ { warehouse: "C", qty: 5 } ] },
   { item: "paper", instock: [ { warehouse: "A", qty: 60 }, { warehouse: "B", qty: 15 } ] },
   { item: "planner", instock: [ { warehouse: "A", qty: 40 }, { warehouse: "B", qty: 5 } ] },
   { item: "postcard", instock: [ { warehouse: "B", qty: 15 }, { warehouse: "C", qty: 35 } ] }
]);

//* Equality matches on the whole embedded/nested document require an exact match of the specified document
db.inventory.find( { "instock": { warehouse: "A", qty: 5 } } )
//* The following query does not match any documents in the inventory collection:
db.inventory.find( { "instock": { qty: 5, warehouse: "A" } } )

//* Workarround of the equlity match 
db.inventory.find( { "instock": { $elemMatch: { qty: 5, warehouse: "A" } } } )
db.inventory.find( { "instock": { $elemMatch: { warehouse: "A", qty: 5 } } } )

//! Specify a Query Condition on a Field in an Array of Documents
//---------------------------------------------------------------

//* Specify a Query Condition on a Field Embedded in an Array of Documents
db.inventory.find( { 'instock.qty': { $lte: 20 } } )

//* Use the Array Index to Query for a Field in the Embedded Document
db.inventory.find( { 'instock.0.qty': { $lte: 20 } } )


//! Specify Multiple Conditions for Array of Documents
//------------------------------------------------
/* 
 * Use $elemMatch operator to specify multiple criteria on an array of embedded 
 * documents such that at least one embedded document satisfies all the specified criteria.
*/

//* A Single Nested Document Meets Multiple Query Conditions on Nested Fields
//------------------------------------------------

db.inventory.find( { "instock": { $elemMatch: { qty: 5, warehouse: "A" } } } )
db.inventory.find( { "instock": { $elemMatch: { qty: { $gt: 10, $lte: 20 } } } } )

//* Combination of Elements Satisfies the Criteria
//------------------------------------------------

/**
 * If the compound query conditions on an array field do not use the $elemMatch operator,
 * the query selects those documents whose array contains any combination of elements that
 * satisfies the conditions.
 *  */

 //the following query matches documents where any document nested in the instock array has
 // the qty field greater than 10 and any document (but not necessarily the same embedded
 // document) in the array has the qty field less than or equal to 20:
db.inventory.find( { "instock.qty": { $gt: 10,  $lte: 20 } } )

//The following example queries for documents where the instock array has at least one
// embedded document that contains the field qty equal to 5 and at least one embedded
// document (but not necessarily the same embedded document) that contains the field
// warehouse equal to A:
db.inventory.find( { "instock.qty": 5, "instock.warehouse": "A" } )

//------------------------------------------------
//! How to add values in an array
//------------------------------------------------

//* $push, $position, $each, $addToSet are used to add values in arrays

//to show just array the field
db.inventory.find( {},{dim_cm:true,_id:false})

//! $push
//* The $push operator appends a specified value to an array.
// { $push: { <field1>: <value1>, ... } }
db.inventory.update({},{$push: {dim_cm:95}})

//! $addToSet
//* The $addToSet operator adds a value to an array unless the value 
//* is already present, in which case $addToSet does nothing to that array.
// { $addToSet: { <field1>: <value1>, ... } }
db.inventory.update({}, { $addToSet: { dim_cm: 34 } }, { multi: true })

//! $each
//* Use with the $addToSet operator to add multiple values to an array <field>
//* if the values do not exist in the <field>.
//* Use with the $push operator to append multiple values to an array <field>.

//{ $addToSet: { <field>: { $each: [ <value1>, <value2> ... ] } } }
db.inventory.update({}, { $addToSet: {dim_cm:{$each: [94,95,96]}}}, {multi:true})
//{ $push: { <field>: { $each: [ <value1>, <value2> ... ] } } }
db.inventory.update({}, { $push: {dim_cm:{$each: [32,33,34,35]}}}, {multi:true})

//! $position
//* The $position modifier specifies the location in the array at which the $push
//* operator inserts elements. 
db.inventory.update({}, { $push: {dim_cm:{$each: [1,2,3],$position: 0}}}, {multi:true})

//! $pull
//* The $pull operator removes from an existing array all instances of a value or
//* values that match a specified condition.
//{ $pull: { <field1>: <value|condition>, <field2>: <value|condition>, ... } }

db.inventory.update({}, { $pull: {dim_cm:95}},{multi:true})
//* with condition
db.inventory.update({}, { $pull: {dim_cm:{$lt:5}}},{multi:true})
//* with multi condition
db.inventory.update({}, { $pull: {dim_cm:{$lt:90,$gt:33}}},{multi:true})

//! $pop
//{ $pop: { <field>: <-1 | 1>, ... } }

//pop from 0th index
db.inventory.update({},{ $pop: {dim_cm:-1}})
//pop from nth index
db.inventory.update({},{ $pop: {dim_cm:1}})

//! $in Operator
//* The $in operator selects the documents where the value of a field equals any value
//* in the specified array. To specify an $in expression, use the following prototype:
//* { field: { $in: [<value1>, <value2>, ... <valueN> ] } }
db.inventory.update({dim_cm:{$in: [14,32]}},{$push: {dim_cm:2}},{multi:true});

//! $nin Operator
//* opposite of $in operator
db.inventory.update({dim_cm:{$nin:[10,15.25]}},{$push: {dim_cm:7}},{multi:true})

//! $all Operator
//* $all operator selects the documents where the value of a field equals all the values
//* in the specified array.
db.inventory.find({dim_cm:{$all:[32,32,2,7]}},{ dim_cm: true, _id: false })

$push, $position, $each
//https://docs.mongodb.com/manual/reference/operator/update/push/index.html
//https://docs.mongodb.com/manual/reference/operator/update/position/
//https://docs.mongodb.com/manual/reference/operator/update/each/

$in, $nin, $all
https://docs.mongodb.com/manual/reference/operator/query/in/index.html
//https://docs.mongodb.com/manual/reference/operator/query/nin/index.html
//https://docs.mongodb.com/manual/reference/operator/query/all/index.html?searchProperty=current&query=%23

$elemMatch
//https://docs.mongodb.com/manual/reference/operator/query/elemMatch/index.html

$pull,$pop,$addToSet
//https://docs.mongodb.com/manual/reference/operator/update/pull/
//https://docs.mongodb.com/manual/reference/operator/update/pop/
//https://docs.mongodb.com/manual/reference/operator/update/addToSet/


//------------------------------------------------
//! Text Search
//------------------------------------------------

db.stores.insert(
    [
      { _id: 1, name: "Java Hut", description: "Coffee and cakes" },
      { _id: 2, name: "Burger Buns", description: "Gourmet hamburgers" },
      { _id: 3, name: "Coffee Shop", description: "Just coffee" },
      { _id: 4, name: "Clothes Clothes Clothes", description: "Discount clothing" },
      { _id: 5, name: "Java Shopping", description: "Indonesian goods" }
    ]
 )

 db.stores.createIndex( { name: "text", description: "text" } )

 //! $text Operator
 db.stores.find( { $text: { $search: "java coffee shop" } } )

 //! Exact Phrase
 db.stores.find( { $text: { $search: "java \"coffee shop\"" } } )

 //! Term Exclusion
 db.stores.find( { $text: { $search: "java shop -coffee" } } )

//! Sorting

db.stores.find(
    { $text: { $search: "java coffee shop" } },
    { score: { $meta: "textScore" } }
 ).sort( { score: { $meta: "textScore" } } )