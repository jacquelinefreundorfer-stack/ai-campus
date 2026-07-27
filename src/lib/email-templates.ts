// ── Email Templates ───────────────────────────────────────────────────────
// University-styled HTML email templates with inline CSS for compatibility.

export function welcomeEmailTemplate(name: string, email: string) {
  const displayName = name || email.split("@")[0];
  return {
    to: email,
    subject: "Welcome to AI Campus",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to AI Campus</title>
</head>
<body style="margin:0;padding:0;background-color:#faf8f4;font-family:'Georgia','Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#faf8f4;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#0a1628;border-radius:0;">
          <!-- Header -->
          <tr>
            <td style="padding:40px 40px 30px 40px;text-align:center;border-bottom:1px solid rgba(196,164,74,0.3);">
              <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="background-color:#0a1628;border:1px solid rgba(196,164,74,0.4);padding:8px 12px;text-align:center;">
                    <span style="font-family:'Georgia','Times New Roman',serif;font-size:14px;font-weight:bold;color:#ffffff;">AI</span>
                  </td>
                  <td style="padding-left:10px;">
                    <span style="font-family:'Georgia','Times New Roman',serif;font-size:18px;font-weight:bold;color:#ffffff;">AI Campus</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;background-color:#ffffff;">
              <h1 style="font-family:'Georgia','Times New Roman',serif;font-size:28px;color:#0a1628;margin:0 0 16px 0;">Welcome to AI Campus</h1>
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#4a4a4a;line-height:1.6;margin:0 0 20px 0;">
                Dear ${displayName},
              </p>
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#4a4a4a;line-height:1.6;margin:0 0 20px 0;">
                Thank you for joining the AI Campus community. You are now part of an institution dedicated to rigorous, practical education for the age of artificial intelligence.
              </p>
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#4a4a4a;line-height:1.6;margin:0 0 20px 0;">
                As a member of our community, you will receive:
              </p>
              <ul style="font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#4a4a4a;line-height:1.6;padding-left:20px;margin:0 0 20px 0;">
                <li style="margin-bottom:8px;">Early access to new program launches and founding cohort pricing</li>
                <li style="margin-bottom:8px;">Curated insights from our faculty on AI, data science, and digital marketing</li>
                <li style="margin-bottom:8px;">Invitations to exclusive webinars and community events</li>
                <li>Updates on new courses, certifications, and learning pathways</li>
              </ul>
              <!-- Divider -->
              <div style="height:1px;background-color:#c4a44a;width:80px;margin:30px auto;"></div>
              <!-- Programs CTA -->
              <h2 style="font-family:'Georgia','Times New Roman',serif;font-size:20px;color:#0a1628;margin:24px 0 12px 0;">Explore Our Programs</h2>
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#4a4a4a;line-height:1.6;margin:0 0 24px 0;">
                Ready to start learning? Browse our current program offerings and find the right path for your career advancement.
              </p>
              <table cellpadding="0" cellspacing="0" style="margin:0 0 30px 0;">
                <tr>
                  <td style="background-color:#c4a44a;padding:14px 32px;text-align:center;">
                    <a href="https://aicampus.ctonew.app/programs" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;color:#0a1628;text-decoration:none;text-transform:uppercase;letter-spacing:0.05em;">View Programs</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:30px 40px;background-color:#0a1628;text-align:center;">
              <p style="font-family:'Georgia','Times New Roman',serif;font-size:13px;color:rgba(255,255,255,0.6);margin:0 0 8px 0;">
                AI Campus &mdash; An online university for the age of artificial intelligence
              </p>
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:rgba(255,255,255,0.4);margin:0;">
                &copy; 2026 AI Campus. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  };
}

export interface BlogPostDigest {
  title: string;
  excerpt: string | null;
  slug: string;
  publishedAt: string;
}

export function blogDigestTemplate(email: string, posts: BlogPostDigest[]) {
  const postItems = posts
    .map(
      (post, i) => `
              <div style="margin-bottom:${i < posts.length - 1 ? "24px" : "0"};padding-bottom:${i < posts.length - 1 ? "24px" : "0"};border-bottom:${i < posts.length - 1 ? "1px solid #f0ece0" : "none"};">
                <h3 style="font-family:'Georgia','Times New Roman',serif;font-size:18px;color:#0a1628;margin:0 0 8px 0;">
                  <a href="https://aicampus.ctonew.app/blog/${post.slug}" style="color:#0a1628;text-decoration:none;">${post.title}</a>
                </h3>
                <p style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#6b7280;line-height:1.6;margin:0 0 8px 0;">
                  ${post.excerpt || ""}
                </p>
                <p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#c4a44a;margin:0;">
                  <a href="https://aicampus.ctonew.app/blog/${post.slug}" style="color:#c4a44a;text-decoration:none;">Read more &rarr;</a>
                </p>
              </div>`
    )
    .join("");

  return {
    to: email,
    subject: "Latest from AI Campus Journal — New Insights & Articles",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Campus Journal</title>
</head>
<body style="margin:0;padding:0;background-color:#faf8f4;font-family:'Georgia','Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#faf8f4;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#0a1628;border-radius:0;">
          <!-- Header -->
          <tr>
            <td style="padding:40px 40px 30px 40px;text-align:center;border-bottom:1px solid rgba(196,164,74,0.3);">
              <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="background-color:#0a1628;border:1px solid rgba(196,164,74,0.4);padding:8px 12px;text-align:center;">
                    <span style="font-family:'Georgia','Times New Roman',serif;font-size:14px;font-weight:bold;color:#ffffff;">AI</span>
                  </td>
                  <td style="padding-left:10px;">
                    <span style="font-family:'Georgia','Times New Roman',serif;font-size:18px;font-weight:bold;color:#ffffff;">AI Campus</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;background-color:#ffffff;">
              <p style="font-family:'Georgia','Times New Roman',serif;font-size:13px;font-weight:bold;color:#c4a44a;text-transform:uppercase;letter-spacing:0.2em;margin:0 0 8px 0;">The Journal</p>
              <h1 style="font-family:'Georgia','Times New Roman',serif;font-size:26px;color:#0a1628;margin:0 0 12px 0;">Latest Articles from AI Campus</h1>
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#4a4a4a;line-height:1.6;margin:0 0 28px 0;">
                Here are the newest articles from the AI Campus Journal &mdash; practical insights on AI, data science, marketing, and professional development.
              </p>
              <!-- Divider -->
              <div style="height:1px;background-color:#c4a44a;width:80px;margin:0 0 28px 0;"></div>
              <!-- Posts -->
              ${postItems}
              <!-- Programs CTA -->
              <div style="margin-top:30px;padding-top:24px;border-top:1px solid #f0ece0;">
                <p style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#4a4a4a;line-height:1.6;margin:0 0 16px 0;">
                  Ready to put these insights into practice? Explore our programs and earn verifiable certificates.
                </p>
                <table cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="background-color:#0a1628;padding:14px 32px;text-align:center;">
                      <a href="https://aicampus.ctonew.app/programs" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;color:#ffffff;text-decoration:none;">Browse Programs</a>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:30px 40px;background-color:#0a1628;text-align:center;">
              <p style="font-family:'Georgia','Times New Roman',serif;font-size:13px;color:rgba(255,255,255,0.6);margin:0 0 8px 0;">
                AI Campus &mdash; An online university for the age of artificial intelligence
              </p>
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:rgba(255,255,255,0.4);margin:0;">
                &copy; 2026 AI Campus. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  };
}
