import railgun from '../src';
import { Request } from '../src/Request';
import { Response } from '../src/Response';
import { NextFunction } from '../src/Route';
const app = railgun();

interface ReqWithBlah extends Request {
	blah: string
}

const something = (req: ReqWithBlah, res: Response, next: NextFunction) => {
	req.blah = 'ah';
	next();
};

app.get('/', something, (req: ReqWithBlah, res) => {
	res.send(`Yeet: ${req.blah}`);
});

app.listen(80);
