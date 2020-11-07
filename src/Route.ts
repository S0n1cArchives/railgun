import { Request } from './Request';
import { Response } from './Response';


export interface User {
	username: string
}

export interface NextFunction {
	(req?: Request, res?: Response, next?: NextFunction): NextFunction | void
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
