import railgun from '../src';
import { NextFunction } from '../src/Route';
const app = railgun();


app.use('/', (req, res, next) => {
	req.haha = 'gg';
	next();
});

const something: NextFunction = (req, res, next) => {
	req.blah = 'ah';
	next();
};

app.get('/', something, (req, res) => {
	res.send(`Yeet: ${req.blah}\nhaha: ${req.haha}`);
});

app.listen(80);
