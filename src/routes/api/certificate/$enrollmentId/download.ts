import { createAPIFileRoute } from "@tanstack/react-start/api";
import { db } from "~/db/index";
import { certificates, users, bundles, modules, lessons } from "~/db/schema";
import { eq, asc } from "drizzle-orm";
import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import QRCode from "qrcode";
import CertificatePDF from "~/components/CertificatePDF";

export const APIRoute = createAPIFileRoute("/api/certificate/$enrollmentId/download")({
  GET: async ({ params }) => {
    const enrollmentId = parseInt(params.enrollmentId);
    if (isNaN(enrollmentId)) {
      return new Response("Invalid enrollment ID", { status: 400 });
    }

    const d = db();

    const [cert] = await d
      .select()
      .from(certificates)
      .where(eq(certificates.enrollmentId, enrollmentId));

    if (!cert) {
      return new Response("Certificate not found", { status: 404 });
    }

    const [user] = await d.select().from(users).where(eq(users.id, cert.userId));
    const [bundle] = await d.select().from(bundles).where(eq(bundles.id, cert.bundleId));
    const mods = await d
      .select()
      .from(modules)
      .where(eq(modules.bundleId, cert.bundleId));

    const metadata = cert.metadata as any;

    const verificationUrl = `https://aicampus.ctonew.app/verify/${cert.verificationCode}`;
    const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
      width: 150,
      margin: 1,
      color: { dark: "#0a1628", light: "#fdfaf3" },
    });

    const issuedDate = new Date(cert.issuedAt as string).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const pdfBuffer = await renderToBuffer(
      React.createElement(CertificatePDF, {
        studentName: user?.name || metadata?.studentName || "Student",
        programTitle: bundle?.title || metadata?.bundleTitle || "Program",
        school: metadata?.school || "School of Applied AI",
        dateIssued: issuedDate,
        competencies: metadata?.competencies || mods.map((m) => m.title),
        modulesCompleted: metadata?.modulesCompleted || mods.length,
        hours: metadata?.hours || bundle?.hours || 0,
        qrCodeDataUrl,
        verificationUrl,
        certificateId: String(cert.id),
      }),
    );

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="AI-Campus-Certificate-${cert.id}.pdf"`,
        "Cache-Control": "no-cache",
      },
    });
  },
});
