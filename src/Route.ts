import { Application } from '.';
import BaseStore from './BaseStore';
import { Request } from './Request';
import { Response } from './Response';


export interface User {
	username: string
}

export interface NextFunction {
	(req?: Request, res?: Response, next?: NextFunction): NextFunction | void
}

export function genString(length = 10): string {
	var result           = '';
	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

export class Route {
	path: string
	middlewares: NextFunction[]
	method: string
	constructor(data: {path: string, middlewares: NextFunction[], method: string}) {
		this.path = data.path;
		this.method = data.method;
		this.middlewares = data.middlewares;
	}
}

export class Routes extends BaseStore<string, Route> {
	private app = Application
	constructor(app: Application) {
		super();
		Object.defineProperty(this, 'app', {
			value: app,
			configurable: false,
			writable: false
		});
	}

	add(data?: {path: string, middlewares: NextFunction[], method: string}): Routes {
		const route = new Route(data);
		const id = genString();
		this.set(id, route);
		return this;
	}
}
