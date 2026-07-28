import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  boolean,
  json,
  varchar,
} from "drizzle-orm/pg-core";

// ── Users (compatible with Better Auth) ──────────────────────────────────────

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── Better Auth: Session ─────────────────────────────────────────────────────

export const sessions = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── Better Auth: Account (stores password hash etc.) ─────────────────────────

export const accounts = pgTable("account", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  idToken: text("id_token"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── Better Auth: Verification (email verification tokens) ───────────────────

export const verifications = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── Bundles ──────────────────────────────────────────────────────────────────

export const bundles = pgTable("bundles", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  subtitle: varchar("subtitle", { length: 255 }),
  description: text("description").notNull(),
  school: varchar("school", { length: 255 }).notNull().default("School of Applied AI"),
  priceCents: integer("price_cents").notNull(),
  launchPriceCents: integer("launch_price_cents"),
  modulesCount: integer("modules_count").notNull().default(1),
  hours: integer("hours").default(1),
  isPublished: boolean("is_published").default(false).notNull(),
  locale: varchar("locale", { length: 5 }).notNull().default("en"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Modules ──────────────────────────────────────────────────────────────────

export const modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  bundleId: integer("bundle_id")
    .notNull()
    .references(() => bundles.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Lessons ──────────────────────────────────────────────────────────────────

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id")
    .notNull()
    .references(() => modules.id),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Quizzes ──────────────────────────────────────────────────────────────────

export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id")
    .notNull()
    .references(() => modules.id),
  title: varchar("title", { length: 255 }).notNull(),
  passingScore: integer("passing_score").default(70).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Quiz Questions ───────────────────────────────────────────────────────────

export const quizQuestions = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id")
    .notNull()
    .references(() => quizzes.id),
  questionText: text("question_text").notNull(),
  options: json("options").$type<string[]>().notNull(),
  correctIndex: integer("correct_index").notNull(),
  explanation: text("explanation"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Enrollments ──────────────────────────────────────────────────────────────

export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  bundleId: integer("bundle_id")
    .notNull()
    .references(() => bundles.id),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

// ── Lesson Progress ──────────────────────────────────────────────────────────

export const lessonProgress = pgTable("lesson_progress", {
  id: serial("id").primaryKey(),
  enrollmentId: integer("enrollment_id")
    .notNull()
    .references(() => enrollments.id),
  lessonId: integer("lesson_id")
    .notNull()
    .references(() => lessons.id),
  completed: boolean("completed").default(false).notNull(),
  completedAt: timestamp("completed_at"),
});

// ── Quiz Attempts ────────────────────────────────────────────────────────────

export const quizAttempts = pgTable("quiz_attempts", {
  id: serial("id").primaryKey(),
  enrollmentId: integer("enrollment_id")
    .notNull()
    .references(() => enrollments.id),
  quizId: integer("quiz_id")
    .notNull()
    .references(() => quizzes.id),
  score: integer("score").notNull(),
  passed: boolean("passed").notNull(),
  attemptedAt: timestamp("attempted_at").defaultNow().notNull(),
});

// ── Blog Posts ─────────────────────────────────────────────────────────────

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  author: varchar("author", { length: 255 }).notNull().default("AI Campus"),
  publishedAt: timestamp("published_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isPublished: boolean("is_published").default(false).notNull(),
});

// ── Certificates ─────────────────────────────────────────────────────────────

export const certificates = pgTable("certificates", {
  id: serial("id").primaryKey(),
  enrollmentId: integer("enrollment_id")
    .notNull()
    .references(() => enrollments.id),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  bundleId: integer("bundle_id")
    .notNull()
    .references(() => bundles.id),
  issuedAt: timestamp("issued_at").defaultNow().notNull(),
  verificationCode: varchar("verification_code", { length: 255 }).notNull().unique(),
  metadata: json("metadata"),
});
