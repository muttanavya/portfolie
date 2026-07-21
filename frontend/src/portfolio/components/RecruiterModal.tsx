import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import {
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CONTACT, PROFILE, RESUME_URL } from "@/src/portfolio/data";
import { useTheme } from "@/src/portfolio/theme";
import { playSound } from "@/src/portfolio/sound";

const TOP_SKILLS = [
  { icon: "sparkles", label: "AI / Machine Learning", detail: "Python · Scikit-learn · Data pipelines" },
  { icon: "cloud", label: "Cloud Engineering", detail: "AWS · Azure AI · Data Engineering" },
  { icon: "code-slash", label: "Software Development", detail: "Java · Python · C · SQL" },
];

const HIGHLIGHTS = [
  "CGPA 8.45 · B.Tech CSE & ML (2023–2027)",
  "5 internships including Agentic AI & AWS Data Engineering",
  "Selected for the CRT Elite Batch at DIET",
  "NPTEL Elite in Joy of Computing (Python)",
];

const PREFERRED_ROLES = ["Software Engineer", "AI/ML Engineer", "Data Analyst"];

export const RecruiterModal = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const { colors, mode } = useTheme();
  const insets = useSafeAreaInsets();

  const openResume = () => {
    playSound("click");
    WebBrowser.openBrowserAsync(RESUME_URL);
  };
  const downloadResume = () => {
    playSound("click");
    Linking.openURL(RESUME_URL);
  };
  const emailMe = () => {
    playSound("click");
    Linking.openURL(
      `mailto:${CONTACT.email}?subject=Opportunity%20for%20Mutta%20Navya&body=Hi%20Navya%2C%0A%0A`
    );
  };
  const handleClose = () => {
    playSound("close");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={styles.centered}>
        <Pressable style={styles.backdrop} onPress={handleClose} />
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.background,
              borderColor: colors.borderStrong,
              maxHeight: "88%",
              marginTop: insets.top + 40,
              marginBottom: insets.bottom + 20,
              shadowColor: colors.glowPrimary,
            },
          ]}
        >
          <BlurView
            intensity={35}
            tint={mode === "dark" ? "dark" : "light"}
            style={StyleSheet.absoluteFill}
          />
          <LinearGradient
            colors={colors.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />

          {/* Ribbon */}
          <View style={styles.ribbonWrap}>
            <LinearGradient
              colors={[colors.primary, colors.tertiary, colors.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.ribbon}
            >
              <Ionicons name="briefcase" size={14} color="#fff" />
              <Text style={styles.ribbonText}>For Recruiters</Text>
            </LinearGradient>
            <TouchableOpacity
              testID="recruiter-close-button"
              onPress={handleClose}
              activeOpacity={0.7}
              style={[
                styles.closeBtn,
                { borderColor: colors.borderStrong, backgroundColor: colors.surface },
              ]}
            >
              <Ionicons name="close" size={16} color={colors.textMain} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            <Text style={[styles.heading, { color: colors.textMain }]}>
              Mutta Navya
            </Text>
            <Text style={[styles.sub, { color: colors.textMuted }]}>
              B.Tech CSE &amp; ML · {PROFILE.college.split("(")[0].trim()}
            </Text>

            {/* Status pills */}
            <View style={styles.pillRow}>
              <View
                style={[
                  styles.pill,
                  { borderColor: "#2EE59D", backgroundColor: "rgba(46,229,157,0.12)" },
                ]}
                testID="recruiter-availability-pill"
              >
                <View style={[styles.pillDot, { backgroundColor: "#2EE59D" }]} />
                <Text style={[styles.pillText, { color: colors.textMain }]}>
                  Open to Internships &amp; Full-Time (Grad. Jun 2027)
                </Text>
              </View>
            </View>

            {/* Key stats grid */}
            <View style={styles.grid}>
              <StatBox
                icon="school"
                label="CGPA"
                value={PROFILE.cgpa}
                colors={colors}
                testID="recruiter-stat-cgpa"
              />
              <StatBox
                icon="location"
                label="Location"
                value="Anakapalli, AP"
                colors={colors}
                testID="recruiter-stat-location"
              />
              <StatBox
                icon="calendar"
                label="Graduation"
                value="Jun 2027"
                colors={colors}
                testID="recruiter-stat-grad"
              />
              <StatBox
                icon="airplane"
                label="Relocation"
                value="Open · India"
                colors={colors}
                testID="recruiter-stat-relocation"
              />
            </View>

            {/* Top 3 skills */}
            <SectionLabel colors={colors} text="TOP 3 STRENGTHS" />
            {TOP_SKILLS.map((s) => (
              <View
                key={s.label}
                style={[
                  styles.strengthRow,
                  { borderColor: colors.border, backgroundColor: colors.surface },
                ]}
              >
                <View
                  style={[
                    styles.strengthIcon,
                    { borderColor: colors.borderStrong, shadowColor: colors.glowSecondary },
                  ]}
                >
                  <Ionicons name={s.icon as any} size={18} color={colors.secondary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.strengthLabel, { color: colors.textMain }]}>{s.label}</Text>
                  <Text style={[styles.strengthDetail, { color: colors.textMuted }]}>{s.detail}</Text>
                </View>
              </View>
            ))}

            {/* Preferred roles */}
            <SectionLabel colors={colors} text="PREFERRED ROLES" />
            <View style={styles.rolesRow}>
              {PREFERRED_ROLES.map((r) => (
                <View
                  key={r}
                  style={[
                    styles.roleChip,
                    { borderColor: colors.borderStrong, backgroundColor: colors.surface },
                  ]}
                >
                  <Text style={[styles.roleText, { color: colors.textMain }]}>{r}</Text>
                </View>
              ))}
            </View>

            {/* Highlights */}
            <SectionLabel colors={colors} text="HIGHLIGHTS" />
            {HIGHLIGHTS.map((h) => (
              <View key={h} style={styles.highlightRow}>
                <View style={[styles.checkDot, { backgroundColor: colors.secondary, shadowColor: colors.secondary }]} />
                <Text style={[styles.highlightText, { color: colors.textMain }]}>{h}</Text>
              </View>
            ))}

            {/* CTAs */}
            <View style={styles.ctaColumn}>
              <TouchableOpacity
                testID="recruiter-view-resume-button"
                activeOpacity={0.85}
                onPress={openResume}
                style={styles.primaryCta}
              >
                <LinearGradient
                  colors={[colors.primary, colors.tertiary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
                <Ionicons name="document-text" size={18} color="#fff" />
                <Text style={styles.primaryCtaText}>View Resume</Text>
              </TouchableOpacity>

              <View style={styles.dualRow}>
                <TouchableOpacity
                  testID="recruiter-download-resume-button"
                  activeOpacity={0.85}
                  onPress={downloadResume}
                  style={[
                    styles.ghostCta,
                    { borderColor: colors.borderStrong, backgroundColor: colors.surface },
                  ]}
                >
                  <Ionicons name="download" size={16} color={colors.textMain} />
                  <Text style={[styles.ghostCtaText, { color: colors.textMain }]}>Download</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  testID="recruiter-email-button"
                  activeOpacity={0.85}
                  onPress={emailMe}
                  style={[
                    styles.ghostCta,
                    { borderColor: colors.borderStrong, backgroundColor: colors.surface },
                  ]}
                >
                  <Ionicons name="mail" size={16} color={colors.textMain} />
                  <Text style={[styles.ghostCtaText, { color: colors.textMain }]}>Email Navya</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const StatBox = ({
  icon,
  label,
  value,
  colors,
  testID,
}: {
  icon: string;
  label: string;
  value: string;
  colors: any;
  testID: string;
}) => (
  <View
    testID={testID}
    style={[
      styles.statBox,
      { borderColor: colors.border, backgroundColor: colors.surface },
    ]}
  >
    <Ionicons name={icon as any} size={16} color={colors.secondary} />
    <Text style={[styles.statLabel, { color: colors.textMuted }]}>{label}</Text>
    <Text style={[styles.statValue, { color: colors.textMain }]}>{value}</Text>
  </View>
);

const SectionLabel = ({ colors, text }: { colors: any; text: string }) => (
  <Text style={[styles.sectionLabel, { color: colors.secondary }]}>{text}</Text>
);

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 16 },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.65)" },
  card: {
    width: "100%",
    borderRadius: 24,
    borderWidth: 1,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.8,
    shadowRadius: 24,
    elevation: 20,
  },

  ribbonWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  ribbon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  ribbonText: { color: "#fff", fontSize: 11, fontWeight: "800", letterSpacing: 1 },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  content: { padding: 20, paddingBottom: 30 },
  heading: { fontSize: 28, fontWeight: "800", letterSpacing: -0.6 },
  sub: { fontSize: 13, fontWeight: "500", marginTop: 4 },

  pillRow: { marginTop: 14 },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
    gap: 8,
  },
  pillDot: { width: 8, height: 8, borderRadius: 4 },
  pillText: { fontSize: 12, fontWeight: "700" },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 16,
  },
  statBox: {
    width: "48%",
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    gap: 4,
  },
  statLabel: { fontSize: 10, fontWeight: "800", letterSpacing: 1, textTransform: "uppercase", marginTop: 4 },
  statValue: { fontSize: 14, fontWeight: "700" },

  sectionLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.6,
    textTransform: "uppercase",
    marginTop: 22,
    marginBottom: 10,
  },

  strengthRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
  },
  strengthIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 4,
  },
  strengthLabel: { fontSize: 14, fontWeight: "700" },
  strengthDetail: { fontSize: 12, marginTop: 2 },

  rolesRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  roleChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
  },
  roleText: { fontSize: 12, fontWeight: "700" },

  highlightRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    gap: 10,
  },
  checkDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 4,
  },
  highlightText: { flex: 1, fontSize: 13, lineHeight: 20, fontWeight: "500" },

  ctaColumn: { marginTop: 20, gap: 10 },
  primaryCta: {
    height: 50,
    borderRadius: 25,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    overflow: "hidden",
  },
  primaryCtaText: { color: "#fff", fontSize: 14, fontWeight: "800", letterSpacing: 0.4 },
  dualRow: { flexDirection: "row", gap: 10 },
  ghostCta: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  ghostCtaText: { fontSize: 13, fontWeight: "700" },
});
