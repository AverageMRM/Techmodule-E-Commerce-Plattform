-- V2: categories table, product_category join, and seed data

-- Category table
CREATE TABLE IF NOT EXISTS category (
    id BIGSERIAL PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL
);

-- Join table
CREATE TABLE IF NOT EXISTS product_category (
    product_id BIGINT NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    category_id BIGINT NOT NULL REFERENCES category(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, category_id)
);

-- Seed categories
INSERT INTO category (slug, name) VALUES
    ('bekleidung', 'Bekleidung'),
    ('accessoires', 'Accessoires'),
    ('haushalt', 'Haushalt')
ON CONFLICT (slug) DO NOTHING;

-- Seed example products if not present
INSERT INTO product (slug, title, description, status)
SELECT 'basic-tshirt', 'Basic T‑Shirt', 'Ein bequemes Basic T‑Shirt aus Bio‑Baumwolle.', 'ACTIVE'
WHERE NOT EXISTS (SELECT 1 FROM product WHERE slug = 'basic-tshirt');

INSERT INTO product (slug, title, description, status)
SELECT 'leder-geldboerse', 'Leder Geldbörse', 'Kompakte Geldbörse aus echtem Leder.', 'ACTIVE'
WHERE NOT EXISTS (SELECT 1 FROM product WHERE slug = 'leder-geldboerse');

-- Relate products to categories
WITH p AS (
    SELECT id FROM product WHERE slug = 'basic-tshirt'
), c AS (
    SELECT id FROM category WHERE slug = 'bekleidung'
)
INSERT INTO product_category (product_id, category_id)
SELECT p.id, c.id FROM p, c
ON CONFLICT DO NOTHING;

WITH p AS (
    SELECT id FROM product WHERE slug = 'leder-geldboerse'
), c AS (
    SELECT id FROM category WHERE slug = 'accessoires'
)
INSERT INTO product_category (product_id, category_id)
SELECT p.id, c.id FROM p, c
ON CONFLICT DO NOTHING;
