import * as fs from "node:fs";

// Helper: insert auth guard into a route component
function addAuthGuard(filePath: string, componentName: string) {
  let content = fs.readFileSync(filePath, "utf-8");
  
  // Check if auth guard already exists
  if (content.includes("checkingAuth") || content.includes("useAuthGuard")) {
    console.log(`  Auth guard already in ${filePath}, skipping`);
    return;
  }

  // Step 1: Add useState/useEffect imports if not present
  if (!content.includes("useEffect")) {
    content = content.replace(
      'import { useState } from "react";',
      'import { useState, useEffect } from "react";'
    );
  }
  
  // If neither useState nor useEffect are imported yet, add them
  if (!content.includes("useState") && !content.includes("useEffect")) {
    content = content.replace(
      'import {',
      'import { useState, useEffect,'
    );
  }
  
  // Step 2: Add auth check state and useEffect at the beginning of the component function
  // Find the component function body (after useState/useRef declarations)
  const componentStart = `function ${componentName}() {`;
  
  // Find the first line after component function declaration
  const funcIdx = content.indexOf(componentStart);
  if (funcIdx === -1) {
    console.log(`  Could not find component ${componentName} in ${filePath}`);
    return;
  }
  
  // Find the line after the opening brace
  const afterBrace = content.indexOf("\n", content.indexOf("{", funcIdx)) + 1;
  
  const authGuardCode = `
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
`;

  content = content.slice(0, afterBrace) + authGuardCode + content.slice(afterBrace);
  
  fs.writeFileSync(filePath, content);
  console.log(`  ✓ Added auth guard to ${filePath}`);
}

// Apply to three files
const base = "/home/team/shared/site";

addAuthGuard(`${base}/src/routes/learn/$enrollmentId/$moduleId/index.tsx`, "LessonPlayerPage");
addAuthGuard(`${base}/src/routes/learn/$enrollmentId/quiz/$quizId/index.tsx`, "QuizPage");
addAuthGuard(`${base}/src/routes/certificate/$enrollmentId/index.tsx`, "CertificatePage");

console.log("Done adding auth guards.");
