import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { create } from 'express-handlebars'; 
import session from 'express-session';
import userM from './models/user.m.js';

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

const hbs = create({
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    defaultLayout: 'main',
    helpers: {
        ifEquals: function (a, b, options) {
            return a === b ? options.fn(this) : options.inverse(this);
        },
        pages: function (n, options) {
            let accum = '';
            for (let i = 1; i <= n; ++i) {
                options.data.index = i;
                options.data.first = i === 1;
                options.data.last = i === n;
                accum += options.fn(i);
            }
            return accum;
        },
        sum: (a, b) => a + b
    }
});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));
app.use('/imgs', express.static(path.join(__dirname, 'db', 'seeds', 'imgs')));
app.use('/css', express.static(path.join(__dirname, 'assets', 'css')));

app.use(session({
    secret: 'day_la_key_bi_mat_cua_ung_dung', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(async (req, res, next) => {
    res.locals.isAuthenticated = !!req.session.userId;
    if (req.session.userId) {
        const user = await userM.oneById(req.session.userId);
        if (user) {
            user.initials = user.name.split(' ').map(n => n.charAt(0).toUpperCase()).join('');
            res.locals.user = user; 
        }
    }
    next();
});

import homeRouter from './routers/home.r.js';
import categoryRouter from './routers/category.r.js';
import productRouter from './routers/product.r.js';
import authRouter from './routers/auth.r.js';

app.use('/', homeRouter);
app.use('/categories', categoryRouter);
app.use('/products', productRouter);
app.use('/auth', authRouter);

app.listen(port, () => console.log(`Server đang chạy tại http://localhost:${port} !`));