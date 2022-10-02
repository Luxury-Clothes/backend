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
	title VARCHAR(255) NOT NULL,
	tags VARCHAR(255) NOT NULL,
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
)

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


INSERT INTO products (title, tags, image, category,
  description, brand, price, count_in_stock, rating) VALUES ('Джинсы-кюлоты с посадкой на талии', 'Женская, Джинсы, Wideleg', 'https://imgur.com/AymQCPe.png', 'Джинсы','Коллекция Committed. Хлопковая ткань в джинсовом стиле. Фасон кюлоты. Укороченная длина. Посадка на талии. Шлевки. Пять карманов. Застежка на молнию и пуговицы. Длина по внутреннему шву 68 см.

Изделия с отметкой Committed изготовлены с использованием экологичных волокон и/или устойчивых производственных процессов, что снижает негативное воздействие на окружающую среду. Mango продолжает поддерживать производственную практику, ориентированную на заботу об окружающей среде, увеличивая таким образом количество экологичных изделий в своих коллекциях.', 'Gucci', 4299, 100, 5);





  INSERT INTO product_image (product_id, image_url) VALUES ('b8500694-6fed-4482-9bf4-9f75a2b49479', 'https://imgur.com/yyxL7m0');