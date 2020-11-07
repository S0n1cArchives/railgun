import { createServer, IncomingMessage, Server, ServerResponse } from 'http';
import { NextFunction, Route, Routes } from './Route';
import { parse } from 'url';
import { Response } from './Response';
import { Request } from './Request';

export interface methodHandler {
	(path: string, ...middleware: NextFunction[]): void
}

export class Application {
	proxy: Server
	methods = [ 'GET' ]
	routes: Routes = new Routes(this)
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
			if (middleware.length > 0) {
				this.routes.add({ path,
					method,
					middlewares: middleware });
			}

			console.log(method, path, middleware);
		};
	}

	use(path = '/', ...middlewares: NextFunction[]): void {
		if (path === '') {
			throw new Error('please provide a path.');
		}

		if (middlewares.length > 0) {
			this.routes.add({ path,
				method: 'all',
				middlewares });
		}
	}

	private resolveRequest(req: IncomingMessage, res: ServerResponse): NextFunction {
		const { url } = req;
		const path = parse(url).pathname;
		const routes = [ ...this.routes.values() ];
		const findall: Route[] = [];
		for (const route of routes) {
			if (route.method === 'all' && path.startsWith(route.path)) {
				findall.push(route);
			}
		}
		const globalmiddlewares: NextFunction[] = [];
		for (const route of findall) {
			for (const middleware of route.middlewares) {
				globalmiddlewares.push(middleware);
			}
		}
		const find = this.routes.find(route => route.path === path && route.method === req.method);
		const middlewares: NextFunction[] = [];
		let i = 0;
		const newreq = new Request(req, this, find);
		const newres = new Response(req, res);
		const next = () => {
			find.middlewares[i++](newreq, newres, next);
		};
		if (globalmiddlewares.length > 0) {
			for (const middleware of globalmiddlewares) {
				middlewares.push(middleware);
			}
		}
		if (typeof find !== 'undefined') {
			for (const middleware of globalmiddlewares) {
				middlewares.push(middleware);
			}
		}
		return next;
	}


	listen(port: number): Server {
		this.proxy = createServer((req, res) => this.resolveRequest(req, res)());
		return this.proxy.listen(port);
	}
}


export default function Railgun(): Application {
	return new Application();
}
