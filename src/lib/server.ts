import { createServerFn } from "@tanstack/react-start";
import { db } from "~/db/index";
import { bundles, modules, lessons, quizzes, quizQuestions, users, enrollments, lessonProgress, quizAttempts } from "~/db/schema";
import { eq, and, asc } from "drizzle-orm";

// ── Get all published bundles ────────────────────────────────────────────────

export const getBundles = createServerFn().handler(async () => {
  const d = db();
  const rows = await d
    .select()
    .from(bundles)
    .where(eq(bundles.isPublished, true))
    .orderBy(asc(bundles.id));
  return rows.map((r) => ({
    ...r,
    createdAt: String(r.createdAt),
  }));
});

// ── Get single bundle with modules ───────────────────────────────────────────

export const getBundle = createServerFn()
  .validator((id: number) => id)
  .handler(async ({ data: bundleId }) => {
    const d = db();
    const [bundle] = await d.select().from(bundles).where(eq(bundles.id, bundleId));
    if (!bundle) return null;

    const mods = await d
      .select()
      .from(modules)
      .where(eq(modules.bundleId, bundleId))
      .orderBy(asc(modules.sortOrder));

    return {
      ...bundle,
      createdAt: String(bundle.createdAt),
      modules: mods.map((m) => ({
        ...m,
        createdAt: String(m.createdAt),
      })),
    };
  });

// ── Get module with lessons ──────────────────────────────────────────────────

export const getModuleWithLessons = createServerFn()
  .validator((moduleId: number) => moduleId)
  .handler(async ({ data: moduleId }) => {
    const d = db();
    const [mod] = await d.select().from(modules).where(eq(modules.id, moduleId));
    if (!mod) return null;

    const less = await d
      .select()
      .from(lessons)
      .where(eq(lessons.moduleId, moduleId))
      .orderBy(asc(lessons.sortOrder));

    return {
      ...mod,
      createdAt: String(mod.createdAt),
      lessons: less.map((l) => ({
        ...l,
        createdAt: String(l.createdAt),
      })),
    };
  });

// ── Get enrollment with bundle and modules ───────────────────────────────────

export const getEnrollment = createServerFn()
  .validator((enrollmentId: number) => enrollmentId)
  .handler(async ({ data: enrollmentId }) => {
    const d = db();
    const [enr] = await d.select().from(enrollments).where(eq(enrollments.id, enrollmentId));
    if (!enr) return null;

    const [bundle] = await d.select().from(bundles).where(eq(bundles.id, enr.bundleId));
    const mods = await d
      .select()
      .from(modules)
      .where(eq(modules.bundleId, enr.bundleId))
      .orderBy(asc(modules.sortOrder));

    // Get progress for all lessons
    const allLessons = await d
      .select()
      .from(lessons)
      .where(
        eq(lessons.moduleId, mods[0]?.id ?? 0)
      );

    const allModuleLessons: Record<number, typeof allLessons> = {};
    for (const m of mods) {
      const ls = await d
        .select()
        .from(lessons)
        .where(eq(lessons.moduleId, m.id))
        .orderBy(asc(lessons.sortOrder));
      allModuleLessons[m.id] = ls;
    }

    const progress = await d
      .select()
      .from(lessonProgress)
      .where(eq(lessonProgress.enrollmentId, enrollmentId));

    return {
      ...enr,
      enrolledAt: String(enr.enrolledAt),
      completedAt: enr.completedAt ? String(enr.completedAt) : null,
      bundle: {
        ...bundle,
        createdAt: String(bundle!.createdAt),
      },
      modules: mods.map((m) => ({
        ...m,
        createdAt: String(m.createdAt),
        lessons: (allModuleLessons[m.id] || []).map((l) => ({
          ...l,
          createdAt: String(l.createdAt),
        })),
      })),
      progress: progress.map((p) => ({
        ...p,
        completedAt: p.completedAt ? String(p.completedAt) : null,
      })),
    };
  });

// ── Get lesson ───────────────────────────────────────────────────────────────

export const getLesson = createServerFn()
  .validator((lessonId: number) => lessonId)
  .handler(async ({ data: lessonId }) => {
    const d = db();
    const [lesson] = await d.select().from(lessons).where(eq(lessons.id, lessonId));
    if (!lesson) return null;
    return {
      ...lesson,
      createdAt: String(lesson.createdAt),
    };
  });

// ── Get quiz with questions ──────────────────────────────────────────────────

export const getQuiz = createServerFn()
  .validator((quizId: number) => quizId)
  .handler(async ({ data: quizId }) => {
    const d = db();
    const [quiz] = await d.select().from(quizzes).where(eq(quizzes.id, quizId));
    if (!quiz) return null;

    const questions = await d
      .select({
        id: quizQuestions.id,
        questionText: quizQuestions.questionText,
        options: quizQuestions.options,
        correctIndex: quizQuestions.correctIndex,
        explanation: quizQuestions.explanation,
      })
      .from(quizQuestions)
      .where(eq(quizQuestions.quizId, quizId));

    return {
      ...quiz,
      createdAt: String(quiz.createdAt),
      questions,
    };
  });

// ── Find or create user by email ─────────────────────────────────────────────

export const findOrCreateUser = createServerFn()
  .validator((email: string) => email)
  .handler(async ({ data: email }) => {
    const d = db();
    const cleanEmail = email.trim().toLowerCase();
    const [existing] = await d.select().from(users).where(eq(users.email, cleanEmail));
    if (existing) return { ...existing, createdAt: String(existing.createdAt) };

    const [created] = await d.insert(users).values({ email: cleanEmail }).returning();
    return { ...created, createdAt: String(created.createdAt) };
  });

// ── Enroll in bundle ─────────────────────────────────────────────────────────

export const enrollInBundle = createServerFn()
  .validator((input: { email: string; bundleId: number }) => input)
  .handler(async ({ data }) => {
    const d = db();
    const cleanEmail = data.email.trim().toLowerCase();
    let [user] = await d.select().from(users).where(eq(users.email, cleanEmail));
    if (!user) {
      [user] = await d.insert(users).values({ email: cleanEmail }).returning();
    }

    // Check for existing enrollment
    const [existing] = await d
      .select()
      .from(enrollments)
      .where(and(eq(enrollments.userId, user.id), eq(enrollments.bundleId, data.bundleId)));

    if (existing) {
      return {
        ...existing,
        enrolledAt: String(existing.enrolledAt),
        completedAt: existing.completedAt ? String(existing.completedAt) : null,
      };
    }

    const [enrollment] = await d
      .insert(enrollments)
      .values({ userId: user.id, bundleId: data.bundleId })
      .returning();

    return {
      ...enrollment,
      enrolledAt: String(enrollment.enrolledAt),
      completedAt: null,
    };
  });

// ── Mark lesson complete ─────────────────────────────────────────────────────

export const markLessonComplete = createServerFn()
  .validator((input: { enrollmentId: number; lessonId: number }) => input)
  .handler(async ({ data }) => {
    const d = db();
    const [existing] = await d
      .select()
      .from(lessonProgress)
      .where(
        and(
          eq(lessonProgress.enrollmentId, data.enrollmentId),
          eq(lessonProgress.lessonId, data.lessonId),
        )
      );

    if (existing) {
      await d
        .update(lessonProgress)
        .set({ completed: true, completedAt: new Date() })
        .where(eq(lessonProgress.id, existing.id));
      return { success: true };
    }

    await d.insert(lessonProgress).values({
      enrollmentId: data.enrollmentId,
      lessonId: data.lessonId,
      completed: true,
      completedAt: new Date(),
    });

    return { success: true };
  });

// ── Submit quiz attempt ──────────────────────────────────────────────────────

export const submitQuiz = createServerFn()
  .validator(
    (input: { enrollmentId: number; quizId: number; answers: Record<number, number> }) =>
      input,
  )
  .handler(async ({ data }) => {
    const d = db();
    const questions = await d
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.quizId, data.quizId));

    let correct = 0;
    const results = questions.map((q) => {
      const userAnswer = data.answers[q.id];
      const isCorrect = userAnswer === q.correctIndex;
      if (isCorrect) correct++;
      return {
        questionId: q.id,
        questionText: q.questionText,
        userAnswer: userAnswer ?? null,
        correctAnswer: q.correctIndex,
        isCorrect,
        explanation: q.explanation,
      };
    });

    const score = Math.round((correct / questions.length) * 100);
    const [quiz] = await d.select().from(quizzes).where(eq(quizzes.id, data.quizId));
    const passed = score >= (quiz?.passingScore ?? 70);

    await d.insert(quizAttempts).values({
      enrollmentId: data.enrollmentId,
      quizId: data.quizId,
      score,
      passed,
    });

    return { score, passed, total: questions.length, correct, results };
  });

// ── Get all modules for a bundle ─────────────────────────────────────────────

export const getBundleModules = createServerFn()
  .validator((bundleId: number) => bundleId)
  .handler(async ({ data: bundleId }) => {
    const d = db();
    const mods = await d
      .select()
      .from(modules)
      .where(eq(modules.bundleId, bundleId))
      .orderBy(asc(modules.sortOrder));

    // Get quizzes for each module
    const result = [];
    for (const m of mods) {
      const [quiz] = await d.select().from(quizzes).where(eq(quizzes.moduleId, m.id));
      const less = await d
        .select({ id: lessons.id, title: lessons.title, sortOrder: lessons.sortOrder })
        .from(lessons)
        .where(eq(lessons.moduleId, m.id))
        .orderBy(asc(lessons.sortOrder));

      result.push({
        ...m,
        createdAt: String(m.createdAt),
        quizId: quiz?.id ?? null,
        lessons: less,
      });
    }

    return result;
  });
