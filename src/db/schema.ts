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

// ── Users ──────────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Bundles ────────────────────────────────────────────────────────────────────

export const bundles = pgTable("bundles", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: varchar("subtitle", { length: 255 }),
  description: text("description").notNull(),
  school: varchar("school", { length: 255 }).notNull().default("School of Applied AI"),
  priceCents: integer("price_cents").notNull(),
  launchPriceCents: integer("launch_price_cents"),
  modulesCount: integer("modules_count").notNull().default(1),
  hours: integer("hours").default(1),
  isPublished: boolean("is_published").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Modules ────────────────────────────────────────────────────────────────────

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

// ── Lessons ────────────────────────────────────────────────────────────────────

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

// ── Quizzes ────────────────────────────────────────────────────────────────────

export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id")
    .notNull()
    .references(() => modules.id),
  title: varchar("title", { length: 255 }).notNull(),
  passingScore: integer("passing_score").default(70).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Quiz Questions ─────────────────────────────────────────────────────────────

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

// ── Enrollments ────────────────────────────────────────────────────────────────

export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  bundleId: integer("bundle_id")
    .notNull()
    .references(() => bundles.id),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

// ── Lesson Progress ────────────────────────────────────────────────────────────

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

// ── Quiz Attempts ──────────────────────────────────────────────────────────────

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

// ── Certificates ───────────────────────────────────────────────────────────────

export const certificates = pgTable("certificates", {
  id: serial("id").primaryKey(),
  enrollmentId: integer("enrollment_id")
    .notNull()
    .references(() => enrollments.id),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  bundleId: integer("bundle_id")
    .notNull()
    .references(() => bundles.id),
  issuedAt: timestamp("issued_at").defaultNow().notNull(),
  verificationCode: varchar("verification_code", { length: 255 }).notNull().unique(),
  metadata: json("metadata"),
});
