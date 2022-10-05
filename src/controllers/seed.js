"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTable = void 0;
const db_1 = require("../db/db");
const createTable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.query)(`
	CREATE TABLE users (
	id UUID DEFAULT gen_random_uuid () PRIMARY KEY,
	username VARCHAR(50) NOT NULL,
	email VARCHAR(50) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL,
	image_url VARCHAR(255) DEFAULT '',
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
   

CREATE TABLE reviews (
	id UUID DEFAULT gen_random_uuid () PRIMARY KEY,
	author UUID NOT NULL,
	comment text NOT NULL,
	rating smallint NOT NULL,
	FOREIGN KEY (author) REFERENCES users(id)
);

CREATE TABLE products (
	id UUID DEFAULT gen_random_uuid () PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	slug VARCHAR(255) NOT NULL,
	image VARCHAR(255) DEFAULT '',
	category VARCHAR(255) NOT NULL,
	description text NOT NULL,
	brand VARCHAR(255) NOT NULL,
	price integer NOT NULL,
	count_in_stock integer NOT NULL,
	rating numeric NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE table product_review (
	product_id UUID NOT NULL,
	review_id UUID NOT NULL,
	FOREIGN KEY (product_id) REFERENCES products(id),
	FOREIGN KEY (review_id) REFERENCES reviews(id)
);

CREATE table payments (
	id UUID DEFAULT gen_random_uuid () PRIMARY KEY,
	status VARCHAR(255) NOT NULL,
	update_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	email_address VARCHAR(255) NOT NULL
);


CREATE TABLE orders (
	id UUID DEFAULT gen_random_uuid () PRIMARY KEY,
	full_name VARCHAR(255) NOT NULL,
	address VARCHAR(255) NOT NULL,
	country VARCHAR(255) NOT NULL,
	postal_code VARCHAR(255) NOT NULL,
	city VARCHAR(255) NOT NULL,
	payment_method VARCHAR(255) NOT NULL,
	payment_id UUID NOT NULL,
	items_price numeric NOT NULL,
	shipping_price numeric NOT NULL,
	tax_price numeric NOT NULL,
	total_price numeric NOT NULL,
	user_id UUID NOT NULL,
	is_paid BOOLEAN DEFAULT FALSE,
	paid_at TIMESTAMPTZ DEFAULT NOW(),
	is_delivered BOOLEAN DEFAULT FALSE,
	delivered_at TIMESTAMPTZ DEFAULT NOW(),
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	FOREIGN KEY (payment_id) REFERENCES payments(id),
	FOREIGN KEY (user_id) REFERENCES users(id)
);


CREATE table order_product (
	order_id UUID NOT NULL,
	product_id UUID NOT NULL,
	FOREIGN KEY (order_id) REFERENCES orders(id),
	FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE table product_image (
	product_id UUID NOT NULL,
	image_url VARCHAR(255) NOT NULL,
	FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO products (name, slug, image, category,
  description, brand, price, count_in_stock, rating) VALUES ('Printed cotton poplin bowling shirt', 'cotton-bowling-shirt', 'https://res.cloudinary.com/dxf7urmsh/image/upload/v1662573185/694125_ZAJSS_7371_004_100_0000_Light-Printed-cotton-poplin-bowling-shirt_wkjsln.jpg', 'Shirts', 'Pursuing the concept of escapism and faraway destination, Gucci Love Parade presents a series of pieces inspired by travel to warm places. Prints recalling typical souvenir designs, create playful yet elegant ready-to-wear pieces.', 'Gucci', 999, 1, 4 );


  INSERT INTO products (name, slug, image, category,
  description, brand, price, count_in_stock, rating) VALUES ('Wool sweater with Gucci patch', 'pullover-gucci', 'https://res.cloudinary.com/dxf7urmsh/image/upload/v1662572729/694786_XKCD5_4804_002_100_0000_Light--Gucci_fjoia2.jpg', 'Sweaters', 'A blue crewneck sweater crafted from knitted wool. Refreshed sweater styles instill a contemporary feel into traditional silhouettes, the knit Gucci patch gives a subtle nod the House heritage.', 'Gucci', 499, 10, 5 );
    `, []);
    res.send('Tables created!');
});
exports.createTable = createTable;
