-- Add locale support to bundles table
ALTER TABLE bundles ADD COLUMN IF NOT EXISTS locale VARCHAR(5) NOT NULL DEFAULT 'en';

-- Seed German translation of bundle #1
INSERT INTO bundles (id, title, subtitle, description, school, price_cents, launch_price_cents, modules_count, hours, is_published, locale)
VALUES (100, 'AI & Generative AI Practitioner', 'Ihr Weg zur KI-Kompetenz', 'Meistern Sie Prompt Engineering, KI-Agenten, benutzerdefinierte GPTs und LLM-Anwendungsentwicklung. Das essentielle KI-Kompetenzset für jeden Beruf in der modernen Wirtschaft.', 'Fakultät für Angewandte KI', 14900, 7900, 8, 25, true, 'de')
ON CONFLICT (id) DO NOTHING;

-- Seed Spanish translation of bundle #1
INSERT INTO bundles (id, title, subtitle, description, school, price_cents, launch_price_cents, modules_count, hours, is_published, locale)
VALUES (200, 'AI & Generative AI Practitioner', 'Su camino hacia la competencia en IA', 'Domine Prompt Engineering, agentes de IA, GPTs personalizados y desarrollo de aplicaciones con LLM. El conjunto de habilidades de IA esencial para cada profesión en la economía moderna.', 'Facultad de IA Aplicada', 14900, 7900, 8, 25, true, 'es')
ON CONFLICT (id) DO NOTHING;
