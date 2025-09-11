-- V3: Add pricing to product
ALTER TABLE product
    ADD COLUMN IF NOT EXISTS price_cents INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'CHF';

-- Seed some example prices if products exist and price is 0
UPDATE product SET price_cents = 2490, currency = 'CHF' WHERE slug = 'basic-tshirt' AND (price_cents = 0 OR price_cents IS NULL);
UPDATE product SET price_cents = 6900, currency = 'CHF' WHERE slug = 'leder-geldboerse' AND (price_cents = 0 OR price_cents IS NULL);
