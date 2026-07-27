import { createFileRoute, Link } from "@tanstack/react-router";
import { getEnrollment, getModuleWithLessons, markLessonComplete } from "~/lib/server";
import { useState, useEffect } from "react";
export const Route = createFileRoute("/learn/$enrollmentId/$moduleId/")({
  component: LessonPlayerPage,
  loader: async ({ params }) => {
    const enrollmentId = parseInt(params.enrollmentId);
    const moduleId = parseInt(params.moduleId);
    const [enrollment, moduleData] = await Promise.all([
      getEnrollment({ data: enrollmentId }),
      getModuleWithLessons({ data: moduleId }),
    ]);
    if (!enrollment || !moduleData) throw new Error("Not found");
    return { enrollment, moduleData };
  },
});
function renderInline(text: string): React.ReactNode {
  let t = text;
  t = t.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  t = t.replace(/\*(.+?)\*/g, "<em>$1</em>");
  t = t.replace(/`([^`]+)`/g, "<code>$1</code>");
  t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-crimson hover:underline">$1</a>');
  const parts = t.split(/(<strong>.*?<\/strong>|<em>.*?<\/em>|<code>.*?<\/code>|<a .*?<\/a>)/g);
  return parts.map((part, i) => {
    if (part.startsWith("<strong>")) return <strong key={i}>{part.replace(/<\/?strong>/g, "")}</strong>;
    if (part.startsWith("<em>")) return <em key={i}>{part.replace(/<\/?em>/g, "")}</em>;
    if (part.startsWith("<code>")) return <code key={i} className="bg-gray-100 px-1 py-0.5 rounded text-sm text-crimson">{part.replace(/<\/?code>/g, "")}</code>;
    if (part.startsWith("<a ")) return <span key={i} dangerouslySetInnerHTML={{ __html: part }} />;
    return <span key={i}>{part}</span>;
  });
}
function renderMarkdown(content: string | null): React.ReactNode {
  if (!content) return <p className="text-gray-500 italic">No content available.</p>;
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0, key = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("# ")) { elements.push(<h1 key={key++} className="font-serif text-3xl font-bold text-navy mt-8 mb-4">{line.slice(2)}</h1>); i++; }
    else if (line.startsWith("## ")) { elements.push(<h2 key={key++} className="font-serif text-2xl font-bold text-navy mt-8 mb-3">{line.slice(3)}</h2>); i++; }
    else if (line.startsWith("### ")) { elements.push(<h3 key={key++} className="font-serif text-xl font-semibold text-navy mt-6 mb-2">{line.slice(4)}</h3>); i++; }
    else if (line.startsWith("#### ")) { elements.push(<h4 key={key++} className="font-serif text-lg font-semibold text-navy mt-4 mb-2">{line.slice(5)}</h4>); i++; }
    else if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) { items.push(lines[i].slice(2)); i++; }
      elements.push(<ul key={key++} className="list-disc pl-6 space-y-1 text-gray-700 mb-4">{items.map((item, idx) => <li key={idx}>{renderInline(item)}</li>)}</ul>);
    }
    else if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) { items.push(lines[i].replace(/^\d+\.\s/, "")); i++; }
      elements.push(<ol key={key++} className="list-decimal pl-6 space-y-1 text-gray-700 mb-4">{items.map((item, idx) => <li key={idx}>{renderInline(item)}</li>)}</ol>);
    }
    else if (line.startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("|")) { tableLines.push(lines[i]); i++; }
      if (tableLines.length >= 2) {
        const parseRow = (l: string) => l.split("|").filter(c => c.trim() !== "").map(c => c.trim());
        const header = parseRow(tableLines[0]);
        const rows = tableLines.slice(2).map(parseRow).filter(r => r.length > 0);
        elements.push(<div key={key++} className="overflow-x-auto mb-4"><table className="min-w-full border border-gray-200 text-sm"><thead className="bg-navy text-white"><tr>{header.map((h, hi) => <th key={hi} className="px-4 py-2 text-left font-medium">{h}</th>)}</tr></thead><tbody>{rows.map((row, ri) => <tr key={ri} className="border-t border-gray-200 even:bg-gray-50">{row.map((cell, ci) => <td key={ci} className="px-4 py-2 text-gray-700">{renderInline(cell)}</td>)}</tr>)}</tbody></table></div>);
      }
    }
    else if (line.startsWith("> ")) { elements.push(<blockquote key={key++} className="border-l-4 border-gold/50 pl-4 italic text-gray-600 my-4">{line.slice(2)}</blockquote>); i++; }
    else if (line.trim() === "") { i++; }
    else {
      const paraLines: string[] = [];
      while (i < lines.length && lines[i].trim() !== "" && !lines[i].startsWith("#") && !lines[i].startsWith("- ") && !lines[i].startsWith("|") && !lines[i].startsWith("> ") && !/^\d+\.\s/.test(lines[i])) { paraLines.push(lines[i]); i++; }
      if (paraLines.length > 0) {
        elements.push(<p key={key++} className="text-gray-700 leading-relaxed mb-4">{paraLines.map((pl, pi) => <span key={pi}>{pi > 0 && <br />}{renderInline(pl)}</span>)}</p>);
      }
    }
  }
  return <div className="prose max-w-none">{elements}</div>;
}
function LessonPlayerPage() {

  // ── Auth guard ──────────────────────────────────────────────────────────
  const [authUser, setAuthUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setAuthUser(data.user);
        setAuthLoading(false);
      })
      .catch(() => setAuthLoading(false));
  }, []);
  if (authLoading) {
    return (
      <div className="min-h-dvh bg-cream flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="flex h-12 w-12 items-center justify-center border-2 border-gold/40 bg-navy mx-auto mb-4">
            <span className="font-serif text-lg font-bold text-white">AI</span>
          </div>
          <p className="text-gray-500 font-serif">Loading...</p>
        </div>
      </div>
    );
  }
  if (!authUser) {
    return (
      <div className="min-h-dvh bg-cream pt-20">
        <div className="max-w-lg mx-auto px-6 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center border-2 border-gold/40 bg-navy mx-auto mb-6">
            <span className="font-serif text-2xl font-bold text-white">AI</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-navy mb-4">
            Sign In Required
          </h1>
          <p className="text-gray-500 mb-8">
            Please sign in to access this page.
          </p>
          <a
            href="/"
            className="inline-block rounded-sm bg-crimson px-8 py-3 text-sm font-medium text-white hover:bg-crimson-dark transition-all"
          >
            Go to Home
          </a>
        </div>
      </div>
    );
  }
  const { enrollment, moduleData } = Route.useLoaderData();
  const [activeLessonId, setActiveLessonId] = useState<number | null>(moduleData.lessons[0]?.id ?? null);
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [certificateIssued, setCertificateIssued] = useState(false);
  useEffect(() => {
    setCompletedLessons(new Set(enrollment.progress.filter((p: any) => p.completed).map((p: any) => p.lessonId)));
  }, [enrollment.progress]);
  const activeLesson = moduleData.lessons.find((l: any) => l.id === activeLessonId);
  const handleMarkComplete = async () => {
    if (!activeLessonId || completedLessons.has(activeLessonId)) return;
    const result = await markLessonComplete({ data: { enrollmentId: enrollment.id, lessonId: activeLessonId } });
    setCompletedLessons((prev) => new Set([...prev, activeLessonId]));
    if (result.certificateIssued) {
      setCertificateIssued(true);
    }
  };
  const allLessonIds = enrollment.modules.flatMap((m: any) => m.lessons.map((l: any) => l.id));
  const totalLessons = allLessonIds.length;
  const completedCount = allLessonIds.filter((id: number) => completedLessons.has(id)).length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const currentLessonIndex = moduleData.lessons.findIndex((l: any) => l.id === activeLessonId);
  const prevLesson = currentLessonIndex > 0 ? moduleData.lessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < moduleData.lessons.length - 1 ? moduleData.lessons[currentLessonIndex + 1] : null;
  const moduleQuiz = enrollment.modules.find((m: any) => m.id === moduleData.id && m.quizId);
  return (
    <div className="min-h-dvh bg-cream">
      <div className="bg-navy px-4 py-3 flex items-center justify-between text-white">
        <div className="flex items-center gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white hover:text-gold lg:hidden">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <span className="font-serif text-sm font-semibold truncate max-w-[200px]">{enrollment.bundle.title}</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/certificate/$enrollmentId" params={{ enrollmentId: String(enrollment.id) }} className="text-xs text-gold/80 hover:text-gold hidden sm:inline">Certificate</Link>
          <span className="text-xs text-gray-400">{progressPercent}% complete</span>
          <div className="w-24 h-1.5 bg-white/20 rounded-full overflow-hidden"><div className="h-full bg-gold rounded-full transition-all" style={{ width: `${progressPercent}%` }} /></div>
        </div>
      </div>

      {/* Certificate issued notification */}
      {certificateIssued && (
        <div className="bg-green-50 border-b border-green-200 px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎓</span>
              <div>
                <p className="font-serif text-lg font-bold text-green-800">Certificate Issued!</p>
                <p className="text-sm text-green-700">Congratulations! You have completed all requirements.</p>
              </div>
            </div>
            <Link
              to="/certificate/$enrollmentId"
              params={{ enrollmentId: String(enrollment.id) }}
              className="inline-flex items-center gap-2 rounded-sm bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-all whitespace-nowrap"
            >
              View Certificate
            </Link>
          </div>
        </div>
      )}

      <div className="flex">
        <aside className={`${sidebarOpen ? "block" : "hidden"} lg:block fixed lg:relative z-20 top-0 left-0 h-full lg:h-auto w-72 bg-white border-r border-gray-200 overflow-y-auto pt-14 lg:pt-0`}>
          <div className="p-4">
            <h3 className="font-serif text-sm font-semibold text-navy uppercase tracking-wider mb-4">Course Content</h3>
            {enrollment.modules.map((mod: any) => (
              <div key={mod.id} className="mb-4">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Module {mod.sortOrder}</p>
                <Link to="/learn/$enrollmentId/$moduleId" params={{ enrollmentId: String(enrollment.id), moduleId: String(mod.id) }} className={`block font-serif text-sm font-medium mb-2 ${mod.id === moduleData.id ? "text-navy" : "text-gray-600 hover:text-navy"}`} onClick={() => setSidebarOpen(false)}>{mod.title}</Link>
                <ul className="space-y-1 ml-3">
                  {mod.lessons.map((lesson: any) => (
                    <li key={lesson.id} className="flex items-center gap-2">
                      <span className={`text-xs ${completedLessons.has(lesson.id) ? "text-green-600" : "text-gray-400"}`}>{completedLessons.has(lesson.id) ? "✓" : "○"}</span>
                      <button onClick={() => { setActiveLessonId(lesson.id); setSidebarOpen(false); }} className={`text-xs text-left ${activeLessonId === lesson.id ? "text-navy font-medium" : "text-gray-500 hover:text-navy"}`}>{lesson.title}</button>
                    </li>
                  ))}
                </ul>
                {mod.quizId && (
                  <Link to="/learn/$enrollmentId/quiz/$quizId" params={{ enrollmentId: String(enrollment.id), quizId: String(mod.quizId) }} className="ml-3 text-xs text-gold hover:underline mt-1 inline-block" onClick={() => setSidebarOpen(false)}>Module Quiz →</Link>
                )}
              </div>
            ))}
          </div>
        </aside>
        {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-10 lg:hidden" onClick={() => setSidebarOpen(false)} />}
        <main className="flex-1 px-6 py-8 max-w-3xl mx-auto">
          <p className="text-xs font-medium uppercase tracking-widest text-gold mb-1">Module {moduleData.sortOrder}</p>
          <h1 className="font-serif text-3xl font-bold text-navy mb-8">{moduleData.title}</h1>
          {activeLesson && (
            <div className="bg-white border border-gray-200 p-6 md:p-10">
              <h2 className="font-serif text-xl font-bold text-navy mb-6">{activeLesson.title}</h2>
              <div className="lesson-content">{renderMarkdown(activeLesson.content)}</div>
              <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <button onClick={handleMarkComplete} disabled={completedLessons.has(activeLesson.id)} className={`px-6 py-2.5 rounded-sm text-sm font-medium transition-all ${completedLessons.has(activeLesson.id) ? "bg-green-50 text-green-700 border border-green-200 cursor-default" : "bg-navy text-white hover:bg-navy-light"}`}>{completedLessons.has(activeLesson.id) ? "✓ Completed" : "Mark as Complete"}</button>
                <div className="flex gap-3">
                  {prevLesson ? <button onClick={() => setActiveLessonId(prevLesson.id)} className="px-4 py-2 rounded-sm border border-gray-300 text-sm text-gray-600 hover:border-navy hover:text-navy transition-all">← Previous</button> : <span />}
                  {nextLesson ? <button onClick={() => setActiveLessonId(nextLesson.id)} className="px-4 py-2 rounded-sm border border-gray-300 text-sm text-gray-600 hover:border-navy hover:text-navy transition-all">Next →</button> : moduleQuiz ? <Link to="/learn/$enrollmentId/quiz/$quizId" params={{ enrollmentId: String(enrollment.id), quizId: String(moduleQuiz.quizId) }} className="px-4 py-2 rounded-sm bg-gold text-white text-sm font-medium hover:bg-gold-light transition-all">Take Quiz →</Link> : null}
                </div>
              </div>
            </div>
          )}
          {moduleData.lessons.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {moduleData.lessons.map((lesson: any) => (
                <button key={lesson.id} onClick={() => setActiveLessonId(lesson.id)} className={`px-3 py-1.5 text-xs rounded-sm border transition-all ${activeLessonId === lesson.id ? "border-navy bg-navy text-white" : completedLessons.has(lesson.id) ? "border-green-200 bg-green-50 text-green-700" : "border-gray-200 text-gray-600 hover:border-navy"}`}>{completedLessons.has(lesson.id) ? "✓ " : ""}{lesson.title}</button>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
