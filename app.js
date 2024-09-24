const _ = require("lodash")
const path = require("path");
const env = process.env.NODE_ENV || 'development';
const config = require(`./config/env/${env}.config.json`);
const utilities = require("./src/utilities");

// initializing databases and clients
let mongoConn = (new utilities.DBClient.mongoDB.Client(config.mongo_instances.primary_1, null)).connect();
console.log({
    mongoConn
});
 utilities.Registry.set("mongodb", mongoConn);

//  console.log(utilities.Registry);
 

// // initializing models on the mongodb connection
// const schemaList = require("./src/models");
// utilities.Registry.set("schemas", schemaList);
// let models = {};
// _.each(schemaList, (value, key) => {
// 	models[key] = mongoConn.model(key, value.schema);
// });
// utilities.Registry.set("models", models);



const Koa = require('koa');
const { koaBody } = require('koa-body');
const app = new Koa();
require('koa-qs')(app, 'extended');

// koa body middleware
app.use(koaBody());
// CORS middleware
app.use(async (ctx, next) => {
	try {
		ctx.set('Access-Control-Allow-Origin', '*');
		ctx.set('Access-Control-Allow-Methods', '*');
		ctx.set('Access-Control-Allow-Headers', '*');
		await next();
	} catch (error) {
		console.log('Process.Error', error);
		ctx.status = error.status || 500;
		ctx.body = {
			success: false,
			message: 'Internal Server error, dev team has been notified. Please try again after sometime!!'
		};
		ctx.app.emit('error', error);
	}
});
// route middleware and initialization
const routesList = require('./src/routes');
_.each(routesList, (router, key) => {
	app.use(router.routes());
	app.use(router.allowedMethods());
});

let server = app.listen(config.application.port, () => {
	console.log(`[Started] Application started listening on port ${config.application.port} mode`);
});

module.exports = server;