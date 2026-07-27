import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Register fonts (using standard PDF fonts as fallbacks — serif for body)
// react-pdf includes Helvetica, Times-Roman, Courier by default
Font.register({
  family: "Times-Roman",
  fonts: [
    { src: "https://fonts.gstatic.com/s/playfairdisplay/v37/nuFiD-vYSZviVYUb_rj3ij__anPXDTzYgA.ttf", fontWeight: 400 },
  ],
});

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Outer page with margin for double border
  page: {
    backgroundColor: "#fdfaf3",
    padding: 24,
    fontFamily: "Times-Roman",
    position: "relative",
  },
  // Double border: outer thin, inner thick gold
  outerBorder: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    bottom: 16,
    border: "1px solid #c4a44a",
  },
  innerBorder: {
    position: "absolute",
    top: 22,
    left: 22,
    right: 22,
    bottom: 22,
    border: "4px solid #c4a44a",
  },
  content: {
    flex: 1,
    paddingHorizontal: 40,
    paddingTop: 50,
    paddingBottom: 40,
    alignItems: "center",
  },
  // Top ornament
  topOrnament: {
    alignItems: "center",
    marginBottom: 16,
  },
  thinLine: {
    width: 48,
    height: 1,
    backgroundColor: "#8b1a2b",
    opacity: 0.6,
  },
  thickLine: {
    width: 80,
    height: 1,
    backgroundColor: "#0a1628",
    opacity: 0.8,
    marginTop: 6,
  },
  // Seal / emblem
  sealContainer: {
    alignItems: "center",
    marginBottom: 28,
  },
  sealCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    border: "2px solid #c4a44a",
    backgroundColor: "#f5f0e8",
    alignItems: "center",
    justifyContent: "center",
  },
  sealMonogram: {
    fontSize: 28,
    fontWeight: 700,
    color: "#0a1628",
    textAlign: "center",
    lineHeight: 1,
  },
  sealLabel: {
    fontSize: 9,
    fontWeight: 600,
    color: "#c4a44a",
    textAlign: "center",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  // Title
  certificateTitle: {
    fontSize: 13,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 4,
    marginBottom: 6,
    textAlign: "center",
  },
  certifiesThat: {
    fontSize: 12,
    color: "#9ca3af",
    fontStyle: "italic",
    marginBottom: 8,
    textAlign: "center",
  },
  // Student name
  studentName: {
    fontSize: 32,
    fontWeight: 700,
    color: "#0a1628",
    marginBottom: 8,
    textAlign: "center",
    textDecoration: "underline",
    textDecorationColor: "#c4a44a",
    textDecorationThickness: 2,
    textUnderlineOffset: 10,
    paddingBottom: 12,
  },
  completedText: {
    fontSize: 12,
    color: "#9ca3af",
    fontStyle: "italic",
    marginBottom: 4,
    textAlign: "center",
  },
  programTitle: {
    fontSize: 19,
    fontWeight: 700,
    color: "#0a1628",
    marginBottom: 18,
    textAlign: "center",
  },
  // Info row
  infoRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 22,
  },
  infoItem: {
    fontSize: 10,
    color: "#6b7280",
    letterSpacing: 1,
    textAlign: "center",
  },
  infoDot: {
    fontSize: 10,
    color: "#c4a44a",
  },
  // Competencies section
  competenciesSection: {
    width: "80%",
    marginBottom: 20,
    alignItems: "center",
  },
  competenciesLabel: {
    fontSize: 10,
    color: "#0a1628",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 8,
    textAlign: "center",
  },
  competencyItem: {
    fontSize: 9,
    color: "#374151",
    marginBottom: 3,
    textAlign: "center",
  },
  // Date
  dateText: {
    fontSize: 10,
    color: "#6b7280",
    letterSpacing: 1,
    marginBottom: 12,
    textAlign: "center",
  },
  // QR code section
  qrSection: {
    alignItems: "center",
    marginTop: 4,
  },
  qrCode: {
    width: 64,
    height: 64,
    marginBottom: 4,
  },
  qrText: {
    fontSize: 7,
    color: "#9ca3af",
    letterSpacing: 1,
    textAlign: "center",
  },
  // Bottom ornament
  bottomOrnament: {
    alignItems: "center",
    marginTop: 10,
  },
  // Signature line
  signatureLine: {
    width: 120,
    height: 1,
    backgroundColor: "#8b1a2b",
    opacity: 0.5,
    marginBottom: 4,
    marginTop: 6,
  },
  signatureLabel: {
    fontSize: 8,
    color: "#6b7280",
    textAlign: "center",
    letterSpacing: 1,
  },
});

// ── Props ────────────────────────────────────────────────────────────────────

export interface CertificatePDFProps {
  studentName: string;
  programTitle: string;
  school: string;
  dateIssued: string;
  competencies: string[];
  modulesCompleted: number;
  hours: number;
  qrCodeDataUrl: string;
  verificationUrl: string;
  certificateId: string;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function CertificatePDF({
  studentName,
  programTitle,
  school,
  dateIssued,
  competencies,
  modulesCompleted,
  hours,
  qrCodeDataUrl,
  verificationUrl,
  certificateId,
}: CertificatePDFProps) {
  return (
    <Document>
      <Page size="LETTER" orientation="landscape" style={styles.page}>
        {/* Double border */}
        <View style={styles.outerBorder} />
        <View style={styles.innerBorder} />

        {/* Content */}
        <View style={styles.content}>
          {/* Top ornament */}
          <View style={styles.topOrnament}>
            <View style={styles.thinLine} />
            <View style={styles.thickLine} />
          </View>

          {/* Seal */}
          <View style={styles.sealContainer}>
            <View style={styles.sealCircle}>
              <Text style={styles.sealMonogram}>AI</Text>
              <Text style={styles.sealLabel}>Campus</Text>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.certificateTitle}>
            Digital Certificate of Completion
          </Text>
          <Text style={styles.certifiesThat}>This certifies that</Text>

          {/* Student Name */}
          <Text style={styles.studentName}>{studentName}</Text>

          {/* Program */}
          <Text style={styles.completedText}>
            has successfully completed the program
          </Text>
          <Text style={styles.programTitle}>{programTitle}</Text>

          {/* Info row */}
          <View style={styles.infoRow}>
            <Text style={styles.infoItem}>{modulesCompleted} Modules</Text>
            <Text style={styles.infoDot}>·</Text>
            <Text style={styles.infoItem}>{hours} Hours</Text>
            <Text style={styles.infoDot}>·</Text>
            <Text style={styles.infoItem}>Skills Verified</Text>
          </View>

          {/* Competencies */}
          {competencies.length > 0 && (
            <View style={styles.competenciesSection}>
              <Text style={styles.competenciesLabel}>
                Competencies Demonstrated
              </Text>
              {competencies.map((comp, i) => (
                <Text key={i} style={styles.competencyItem}>
                  {comp}
                </Text>
              ))}
            </View>
          )}

          {/* Date */}
          <Text style={styles.dateText}>
            Issued on {dateIssued} · {school}
          </Text>

          {/* QR Code */}
          <View style={styles.qrSection}>
            {qrCodeDataUrl ? (
              <Image src={qrCodeDataUrl} style={styles.qrCode} />
            ) : null}
            <Text style={styles.qrText}>
              Scan to verify · {verificationUrl}
            </Text>
          </View>

          {/* Bottom ornament */}
          <View style={styles.bottomOrnament}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>
              Digitally Verified · Certificate #{certificateId}
            </Text>
            <View style={{ ...styles.thickLine, marginTop: 6 }} />
            <View style={{ ...styles.thinLine, marginTop: 4 }} />
          </View>
        </View>
      </Page>
    </Document>
  );
}
