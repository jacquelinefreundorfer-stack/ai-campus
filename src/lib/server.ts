import { createServerFn } from "@tanstack/react-start";
import { db } from "~/db/index";
import { bundles, modules, lessons, quizzes, quizQuestions, users, enrollments, lessonProgress, quizAttempts, certificates } from "~/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { auth } from "~/lib/auth";

// ── Auth helper: get current user from request (for server functions) ────────

async function getCurrentUserId(): Promise<string | null> {
  try {
    // Use process-level storage — server functions run in the same request context
    const { getWebRequest } = await import("@tanstack/react-start/server");
    const request = getWebRequest();
    if (!request) return null;
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    return session?.user?.id ?? null;
  } catch {
    return null;
  }
}

// ── Get all published bundles (optionally filtered by locale) ─────────────────

export const getBundles = createServerFn()
  .validator((locale?: string) => locale ?? "en")
  .handler(async ({ data: locale }) => {
    const d = db();
    const rows = await d
      .select()
      .from(bundles)
      .where(and(eq(bundles.isPublished, true), eq(bundles.locale, locale)))
      .orderBy(asc(bundles.id));

    if (rows.length === 0 && locale !== "en") {
      const enRows = await d
        .select()
        .from(bundles)
        .where(and(eq(bundles.isPublished, true), eq(bundles.locale, "en")))
        .orderBy(asc(bundles.id));
      return enRows.map((r) => ({
        ...r,
        createdAt: String(r.createdAt),
      }));
    }

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

    const allLessons = mods.length > 0 ? allModuleLessons[mods[0].id] || [] : [];

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

// ── Enroll in bundle (auth-based) ────────────────────────────────────────────

export const enrollInBundle = createServerFn()
  .validator((input: { bundleId: number }) => input)
  .handler(async ({ data }) => {
    const d = db();
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error("You must be signed in to enroll.");
    }

    // Check for existing enrollment
    const [existing] = await d
      .select()
      .from(enrollments)
      .where(and(eq(enrollments.userId, userId), eq(enrollments.bundleId, data.bundleId)));

    if (existing) {
      return {
        ...existing,
        enrolledAt: String(existing.enrolledAt),
        completedAt: existing.completedAt ? String(existing.completedAt) : null,
      };
    }

    const [enrollment] = await d
      .insert(enrollments)
      .values({ userId, bundleId: data.bundleId })
      .returning();

    return {
      ...enrollment,
      enrolledAt: String(enrollment.enrolledAt),
      completedAt: null,
    };
  });

// ── Get user's enrollments (for dashboard) ───────────────────────────────────

export const getUserEnrollments = createServerFn().handler(async () => {
  const d = db();
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const userEnrollments = await d
    .select()
    .from(enrollments)
    .where(eq(enrollments.userId, userId))
    .orderBy(asc(enrollments.enrolledAt));

  const result = [];
  for (const enr of userEnrollments) {
    const [bundle] = await d.select().from(bundles).where(eq(bundles.id, enr.bundleId));
    if (!bundle) continue;

    const mods = await d
      .select()
      .from(modules)
      .where(eq(modules.bundleId, enr.bundleId));

    let totalLessons = 0;
    let completedLessons = 0;
    for (const m of mods) {
      const ls = await d.select().from(lessons).where(eq(lessons.moduleId, m.id));
      totalLessons += ls.length;
      const prog = await d
        .select()
        .from(lessonProgress)
        .where(
          and(
            eq(lessonProgress.enrollmentId, enr.id),
            eq(lessonProgress.completed, true),
          ),
        );
      completedLessons += prog.length;
    }

    const [cert] = await d
      .select()
      .from(certificates)
      .where(eq(certificates.enrollmentId, enr.id));

    result.push({
      ...enr,
      enrolledAt: String(enr.enrolledAt),
      completedAt: enr.completedAt ? String(enr.completedAt) : null,
      bundle: {
        ...bundle,
        createdAt: String(bundle.createdAt),
      },
      totalLessons,
      completedLessons,
      progressPercent: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
      hasCertificate: !!cert,
    });
  }

  return result;
});

// ── Mark lesson complete ─────────────────────────────────────────────────────

export const markLessonComplete = createServerFn()
  .validator((input: { enrollmentId: number; lessonId: number }) => input)
  .handler(async ({ data }) => {
    const d = db();
    const userId = await getCurrentUserId();

    // Verify ownership
    if (userId) {
      const [enr] = await d
        .select()
        .from(enrollments)
        .where(eq(enrollments.id, data.enrollmentId));
      if (!enr || enr.userId !== userId) {
        throw new Error("You do not own this enrollment.");
      }
    }

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
    } else {
      await d.insert(lessonProgress).values({
        enrollmentId: data.enrollmentId,
        lessonId: data.lessonId,
        completed: true,
        completedAt: new Date(),
      });
    }

    const certResult = await checkAndIssueCertificateInternal(d, data.enrollmentId);

    return { success: true, certificateIssued: certResult?.issued ?? false };
  });

// ── Submit quiz attempt ──────────────────────────────────────────────────────

export const submitQuiz = createServerFn()
  .validator(
    (input: { enrollmentId: number; quizId: number; answers: Record<number, number> }) =>
      input,
  )
  .handler(async ({ data }) => {
    const d = db();
    const userId = await getCurrentUserId();

    // Verify ownership
    if (userId) {
      const [enr] = await d
        .select()
        .from(enrollments)
        .where(eq(enrollments.id, data.enrollmentId));
      if (!enr || enr.userId !== userId) {
        throw new Error("You do not own this enrollment.");
      }
    }

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

    const certResult = await checkAndIssueCertificateInternal(d, data.enrollmentId);

    return { score, passed, total: questions.length, correct, results, certificateIssued: certResult?.issued ?? false };
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

// ── Get lesson progress ──────────────────────────────────────────────────────

export const getLessonProgress = createServerFn()
  .validator((enrollmentId: number) => enrollmentId)
  .handler(async ({ data: enrollmentId }) => {
    const d = db();
    const progress = await d
      .select()
      .from(lessonProgress)
      .where(eq(lessonProgress.enrollmentId, enrollmentId));
    return progress.map((p) => ({
      ...p,
      completedAt: p.completedAt ? String(p.completedAt) : null,
    }));
  });

// ── Certificate: internal check-and-issue logic ──────────────────────────────

async function checkAndIssueCertificateInternal(
  d: ReturnType<typeof db>,
  enrollmentId: number,
): Promise<{ issued: boolean; certificate?: any } | null> {
  const [enr] = await d.select().from(enrollments).where(eq(enrollments.id, enrollmentId));
  if (!enr) return null;

  const [existingCert] = await d
    .select()
    .from(certificates)
    .where(eq(certificates.enrollmentId, enrollmentId));
  if (existingCert) {
    return { issued: false, certificate: existingCert };
  }

  const [bundle] = await d.select().from(bundles).where(eq(bundles.id, enr.bundleId));
  if (!bundle) return null;

  const [user] = await d.select().from(users).where(eq(users.id, enr.userId));
  if (!user) return null;

  const mods = await d
    .select()
    .from(modules)
    .where(eq(modules.bundleId, enr.bundleId));

  let allLessons: typeof lessons.$inferSelect[] = [];
  for (const m of mods) {
    const ls = await d.select().from(lessons).where(eq(lessons.moduleId, m.id));
    allLessons = [...allLessons, ...ls];
  }

  const totalLessons = allLessons.length;
  if (totalLessons === 0) return null;

  const progress = await d
    .select()
    .from(lessonProgress)
    .where(eq(lessonProgress.enrollmentId, enrollmentId));
  const completedLessonIds = new Set(progress.filter((p) => p.completed).map((p) => p.lessonId));

  const allLessonsComplete = allLessons.every((l) => completedLessonIds.has(l.id));
  if (!allLessonsComplete) return { issued: false };

  let allQuizzes: typeof quizzes.$inferSelect[] = [];
  for (const m of mods) {
    const qs = await d.select().from(quizzes).where(eq(quizzes.moduleId, m.id));
    allQuizzes = [...allQuizzes, ...qs];
  }

  const attempts = await d
    .select()
    .from(quizAttempts)
    .where(eq(quizAttempts.enrollmentId, enrollmentId));

  const allQuizzesPassed = allQuizzes.every((q) => {
    return attempts.some((a) => a.quizId === q.id && a.passed);
  });

  if (!allQuizzesPassed) return { issued: false };

  const verificationCode = uuidv4();
  const competencies = mods.map((m) => m.title);

  const metadata = {
    bundleTitle: bundle.title,
    studentName: user.name || user.email,
    modulesCompleted: mods.length,
    hours: bundle.hours,
    competencies,
    school: bundle.school,
  };

  const [cert] = await d
    .insert(certificates)
    .values({
      enrollmentId,
      userId: enr.userId,
      bundleId: enr.bundleId,
      issuedAt: new Date(),
      verificationCode,
      metadata,
    })
    .returning();

  await d
    .update(enrollments)
    .set({ completedAt: new Date(), status: "completed" })
    .where(eq(enrollments.id, enrollmentId));

  return {
    issued: true,
    certificate: {
      ...cert,
      issuedAt: String(cert.issuedAt),
    },
  };
}

// ── Check and issue certificate (public server function) ─────────────────────

export const checkAndIssueCertificate = createServerFn()
  .validator((enrollmentId: number) => enrollmentId)
  .handler(async ({ data: enrollmentId }) => {
    const d = db();
    return await checkAndIssueCertificateInternal(d, enrollmentId);
  });

// ── Get certificate for enrollment ───────────────────────────────────────────

export const getCertificate = createServerFn()
  .validator((enrollmentId: number) => enrollmentId)
  .handler(async ({ data: enrollmentId }) => {
    const d = db();
    const [cert] = await d
      .select()
      .from(certificates)
      .where(eq(certificates.enrollmentId, enrollmentId));

    if (!cert) return null;

    const [user] = await d.select().from(users).where(eq(users.id, cert.userId));
    const [bundle] = await d.select().from(bundles).where(eq(bundles.id, cert.bundleId));

    return {
      ...cert,
      issuedAt: String(cert.issuedAt),
      metadata: cert.metadata as any,
      user: user ? { ...user, createdAt: String(user.createdAt) } : null,
      bundle: bundle ? { ...bundle, createdAt: String(bundle.createdAt) } : null,
    };
  });

// ── Get certificate by verification code (public) ────────────────────────────

export const getCertificateByCode = createServerFn()
  .validator((code: string) => code)
  .handler(async ({ data: code }) => {
    const d = db();
    const [cert] = await d
      .select()
      .from(certificates)
      .where(eq(certificates.verificationCode, code));

    if (!cert) return null;

    const [user] = await d.select().from(users).where(eq(users.id, cert.userId));
    const [bundle] = await d.select().from(bundles).where(eq(bundles.id, cert.bundleId));

    return {
      ...cert,
      issuedAt: String(cert.issuedAt),
      metadata: cert.metadata as any,
      user: user ? { name: user.name, email: user.email } : null,
      bundle: bundle ? { title: bundle.title } : null,
    };
  });

// ── Seed translated bundles ──────────────────────────────────────────────────

export const seedTranslatedBundles = createServerFn().handler(async () => {
  const d = db();

  const [existingDe] = await d
    .select()
    .from(bundles)
    .where(and(eq(bundles.id, 100), eq(bundles.locale, "de")));

  if (!existingDe) {
    await d.insert(bundles).values({
      id: 100,
      title: "AI & Generative AI Practitioner",
      subtitle: "Ihr Weg zur KI-Kompetenz",
      description: "Meistern Sie Prompt Engineering, KI-Agenten, benutzerdefinierte GPTs und LLM-Anwendungsentwicklung. Das essentielle KI-Kompetenzset für jeden Beruf in der modernen Wirtschaft.",
      school: "Fakultät für Angewandte KI",
      priceCents: 14900,
      launchPriceCents: 7900,
      modulesCount: 8,
      hours: 25,
      isPublished: true,
      locale: "de",
    });
  }

  const [existingEs] = await d
    .select()
    .from(bundles)
    .where(and(eq(bundles.id, 200), eq(bundles.locale, "es")));

  if (!existingEs) {
    await d.insert(bundles).values({
      id: 200,
      title: "AI & Generative AI Practitioner",
      subtitle: "Su camino hacia la competencia en IA",
      description: "Domine Prompt Engineering, agentes de IA, GPTs personalizados y desarrollo de aplicaciones con LLM. El conjunto de habilidades de IA esencial para cada profesión en la economía moderna.",
      school: "Facultad de IA Aplicada",
      priceCents: 14900,
      launchPriceCents: 7900,
      modulesCount: 8,
      hours: 25,
      isPublished: true,
      locale: "es",
    });
  }

  return { success: true, message: "Translated bundles seeded" };
});
