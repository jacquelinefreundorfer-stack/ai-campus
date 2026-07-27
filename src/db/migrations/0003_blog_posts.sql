CREATE TABLE IF NOT EXISTS "blog_posts" (
  "id" serial PRIMARY KEY,
  "title" varchar(255) NOT NULL,
  "slug" varchar(255) NOT NULL UNIQUE,
  "content" text NOT NULL,
  "excerpt" text,
  "author" varchar(255) NOT NULL DEFAULT 'AI Campus',
  "published_at" timestamp DEFAULT now() NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "is_published" boolean DEFAULT false NOT NULL
);
