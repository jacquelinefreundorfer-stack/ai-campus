-- Add slug column to bundles table
ALTER TABLE bundles ADD COLUMN IF NOT EXISTS slug VARCHAR(255);

-- Generate slugs from titles for existing rows
UPDATE bundles SET slug = 
  CASE 
    WHEN id = 1 THEN 'ai-practitioner'
    WHEN id = 100 THEN 'ai-practitioner-de'
    WHEN id = 200 THEN 'ai-practitioner-es'
    ELSE LOWER(REGEXP_REPLACE(REGEXP_REPLACE(title, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'))
  END
WHERE slug IS NULL;

-- Make slug NOT NULL and UNIQUE after populating
ALTER TABLE bundles ALTER COLUMN slug SET NOT NULL;
ALTER TABLE bundles ADD CONSTRAINT bundles_slug_unique UNIQUE (slug);
