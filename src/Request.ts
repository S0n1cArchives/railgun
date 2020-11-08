import { IncomingHttpHeaders, IncomingMessage } from 'http';
import { Application } from '.';
import { Route } from './Route';

export interface Headers extends IncomingHttpHeaders {
	server?: string
}

export class Request {
	// eslint-disable-next-line no-undef
	[k: string]: any
	private req: IncomingMessage
	app: Application
	route: Route
	headers: Headers
	method: string
	originalUrl: string
	ip: string
	constructor(req: IncomingMessage, app: Application, route: Route) {
		Object.defineProperty(this, 'req', {
			value: req,
			writable: false,
			configurable: false
		});
		this.app = app;
		this.route = route;
		this.headers = req.headers;
		this.method = route.method;
		this.originalUrl = req.url;
		this.ip = req.headers.location;
	}
}
