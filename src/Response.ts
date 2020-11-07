import { IncomingMessage, ServerResponse } from 'http';


export class Response {
	req: IncomingMessage
	res: ServerResponse
	constructor(req: IncomingMessage, res: ServerResponse) {
		this.req = req;
		this.res = res;
	}

	send(input: string | Array<unknown> | Record<string, unknown> | Buffer): void {
		this.res.write(input);
		return this.res.end();
	}
}
