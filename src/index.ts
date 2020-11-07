import { createServer, Server } from 'http';
import { NextFunction, Route } from './Route';
import { parse } from 'url';
import { Response } from './Response';
import { Request } from './Request';

export interface methodHandler {
	(path: string, ...middleware: NextFunction[]): void
}

export class Application {
	proxy: Server
	methods = [ 'GET' ]
	registeredRoutes: Route[] = []
	GET: methodHandler
	get: methodHandler
	constructor() {
		for (const method of this.methods) {
			const methodHandler = this.handleMethod(method);
			this[method] = methodHandler;
			this[method.toLowerCase()] = methodHandler;
		}
	}

	handleMethod(method: string): methodHandler {
		return (path: string, ...middleware: NextFunction[]): void => {
			if (!this.methods.includes(method)) {
				throw new Error('method not found.');
			}

			if (path === '') {
				throw new Error('Please provide a path.');
			}
			if (middleware.length === 0) {
				throw new Error('No callback provided!');
			}
			this.registeredRoutes.push(new Route({
				path,
				method,
				middlewares: middleware
			}));
			console.log(method, path, middleware);
		};
	}


	listen(port: number): Server {
		this.proxy = createServer((req, res) => {
			const { url } = req;
			const path = parse(url).pathname;
			const find = this.registeredRoutes.find(route => route.path === path && route.method === req.method);
			if (typeof find === 'undefined') {
				res.writeHead(404, 'Not Found', { 'content-type': 'text/html' });
				res.write('404 Not Found');
				return res.end();
			}
			if (find.middlewares.length > 0) {
				let i = 0;
				const newreq = new Request(req, this, find);
				const newres = new Response(req, res);
				const next = () => {
					find.middlewares[i++](newreq, newres, next);
				};


				return next();
			}
		});
		return this.proxy.listen(port);
	}
}


export default function Railgun(): Application {
	return new Application();
}
