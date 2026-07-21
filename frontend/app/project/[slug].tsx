import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";

import { getProjectBySlug } from "@/src/portfolio/data";
import { darkTheme, lightTheme, ThemeContext, ThemeMode } from "@/src/portfolio/theme";
import { playSound } from "@/src/portfolio/sound";
import { StatusBar } from "expo-status-bar";

// A tiny local theme provider that mirrors the root — the route can also be
// deep-linked, so it always mounts its own provider. Dark by default.
const useLocalTheme = () => {
  const [mode, setMode] = React.useState<ThemeMode>("dark");
  const colors = mode === "dark" ? darkTheme : lightTheme;
  const value = React.useMemo(
    () => ({
      mode,
      colors,
      toggle: () => setMode((m) => (m === "dark" ? "light" : "dark")),
    }),
    [mode, colors]
  );
  return value;
};

export default function ProjectDetail() {
  const themeValue = useLocalTheme();
  const { colors, mode } = themeValue;
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const project = getProjectBySlug(slug ?? "");

  const goBack = () => {
    playSound("close");
    if (router.canGoBack()) router.back();
    else router.replace("/");
  };

  if (!project) {
    return (
      <SafeAreaProvider>
        <ThemeContext.Provider value={themeValue}>
          <StatusBar style="light" />
          <View style={[styles.notFoundWrap, { backgroundColor: colors.background }]}>
            <LinearGradient colors={colors.gradientBg} style={StyleSheet.absoluteFill} />
            <Text style={[styles.notFoundText, { color: colors.textMain }]}>
              Project not found
            </Text>
            <TouchableOpacity
              testID="project-detail-back-fallback"
              onPress={goBack}
              style={[styles.ghostBtn, { borderColor: colors.borderStrong }]}
            >
              <Ionicons name="arrow-back" size={16} color={colors.textMain} />
              <Text style={[styles.ghostBtnText, { color: colors.textMain }]}>
                Back to Projects
              </Text>
            </TouchableOpacity>
          </View>
        </ThemeContext.Provider>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeContext.Provider value={themeValue}>
        <StatusBar style={mode === "dark" ? "light" : "dark"} />
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          <LinearGradient colors={colors.gradientBg} style={StyleSheet.absoluteFill} />

          {/* Sticky mini header */}
          <View
            style={[
              styles.miniHeader,
              {
                paddingTop: insets.top + 8,
                borderBottomColor: colors.border,
                backgroundColor: colors.navBackground,
              },
            ]}
          >
            <BlurView
              intensity={40}
              tint={mode === "dark" ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.miniHeaderRow}>
              <TouchableOpacity
                testID="project-detail-back-button"
                onPress={goBack}
                activeOpacity={0.7}
                style={[
                  styles.backBtn,
                  { borderColor: colors.borderStrong, backgroundColor: colors.surface },
                ]}
              >
                <Ionicons name="arrow-back" size={16} color={colors.textMain} />
                <Text style={[styles.backBtnText, { color: colors.textMain }]}>
                  Projects
                </Text>
              </TouchableOpacity>
              <Text
                numberOfLines={1}
                style={[styles.miniHeaderTitle, { color: colors.textMuted }]}
              >
                Case Study
              </Text>
              <View style={{ width: 90 }} />
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingTop: insets.top + 72,
              paddingBottom: 60 + insets.bottom,
              paddingHorizontal: 20,
            }}
            testID={`project-detail-scroll-${project.slug}`}
          >
            {/* Hero block */}
            <View
              style={[
                styles.heroCard,
                { borderColor: colors.borderStrong, shadowColor: project.accent },
              ]}
            >
              <LinearGradient
                colors={[project.accent + "55", "transparent"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <View
                style={[
                  styles.projectBadge,
                  {
                    borderColor: project.accent,
                    backgroundColor: colors.surfaceStrong,
                    shadowColor: project.accent,
                  },
                ]}
              >
                <Ionicons name={project.icon as any} size={22} color={project.accent} />
              </View>
              <Text style={[styles.heroTitle, { color: colors.textMain }]}>
                {project.title}
              </Text>
              <Text style={[styles.heroTagline, { color: colors.textMuted }]}>
                {project.tagline}
              </Text>

              {/* Metrics row */}
              <View style={styles.metricsRow}>
                {project.metrics.map((m) => (
                  <View
                    key={m.label}
                    testID={`project-detail-metric-${m.label}`}
                    style={[
                      styles.metricBox,
                      { borderColor: colors.border, backgroundColor: colors.surface },
                    ]}
                  >
                    <Text style={[styles.metricLabel, { color: colors.textMuted }]}>
                      {m.label}
                    </Text>
                    <Text style={[styles.metricValue, { color: colors.textMain }]}>
                      {m.value}
                    </Text>
                  </View>
                ))}
              </View>

              {/* CTA row */}
              <View style={styles.ctaRow}>
                {project.github ? (
                  <PrimaryCta
                    icon="logo-github"
                    label="GitHub"
                    onPress={() => {
                      playSound("click");
                      Linking.openURL(project.github!);
                    }}
                    accent={project.accent}
                    testID="project-detail-github-button"
                  />
                ) : (
                  <GhostCta
                    icon="logo-github"
                    label="GitHub · Coming Soon"
                    onPress={() => {}}
                    colors={colors}
                    disabled
                    testID="project-detail-github-placeholder"
                  />
                )}
                {project.demo ? (
                  <GhostCta
                    icon="play"
                    label="Live Demo"
                    onPress={() => {
                      playSound("click");
                      Linking.openURL(project.demo!);
                    }}
                    colors={colors}
                    testID="project-detail-demo-button"
                  />
                ) : null}
              </View>
            </View>

            {/* Overview */}
            <Section title="Overview" colors={colors}>
              <Text style={[styles.paragraph, { color: colors.textMain }]}>
                {project.overview}
              </Text>
            </Section>

            {/* Problem */}
            <Section title="Problem Statement" colors={colors} icon="alert-circle" accent={project.accent}>
              <Text style={[styles.paragraph, { color: colors.textMain }]}>
                {project.problem}
              </Text>
            </Section>

            {/* Solution */}
            <Section title="Solution" colors={colors} icon="bulb" accent={project.accent}>
              <Text style={[styles.paragraph, { color: colors.textMain }]}>
                {project.solution}
              </Text>
            </Section>

            {/* Tech */}
            <Section title="Technologies Used" colors={colors} icon="code-slash" accent={project.accent}>
              <View style={styles.chipRow}>
                {project.tech.map((t) => (
                  <View
                    key={t}
                    testID={`project-detail-tech-${t}`}
                    style={[
                      styles.chip,
                      { borderColor: colors.borderStrong, backgroundColor: colors.surface },
                    ]}
                  >
                    <Text style={[styles.chipText, { color: colors.textMain }]}>{t}</Text>
                  </View>
                ))}
              </View>
            </Section>

            {/* Features */}
            <Section title="Key Features" colors={colors} icon="checkmark-circle" accent={project.accent}>
              {project.features.map((f, i) => (
                <View
                  key={i}
                  style={[
                    styles.featureRow,
                    i > 0 && { borderTopWidth: 1, borderTopColor: colors.border },
                  ]}
                >
                  <View
                    style={[
                      styles.featureDot,
                      { backgroundColor: project.accent, shadowColor: project.accent },
                    ]}
                  />
                  <Text style={[styles.featureText, { color: colors.textMain }]}>{f}</Text>
                </View>
              ))}
            </Section>

            {/* Outcome */}
            <Section title="Outcome" colors={colors} icon="trophy" accent={project.accent}>
              <Text style={[styles.paragraph, { color: colors.textMain }]}>
                {project.outcome}
              </Text>
            </Section>

            {/* Screenshots / Demo placeholder — designed so images can be added later */}
            <Section title="Screenshots & Demo" colors={colors} icon="image" accent={project.accent}>
              {project.screenshots && project.screenshots.length > 0 ? (
                <View style={styles.chipRow}>
                  {/* Placeholder — swap for <Image> renders once real screenshots exist */}
                  {project.screenshots.map((url) => (
                    <View
                      key={url}
                      style={[
                        styles.screenshotThumb,
                        { borderColor: colors.borderStrong },
                      ]}
                    />
                  ))}
                </View>
              ) : (
                <View
                  style={[
                    styles.screenshotEmpty,
                    { borderColor: colors.borderStrong, backgroundColor: colors.surface },
                  ]}
                >
                  <Ionicons name="images" size={22} color={colors.textMuted} />
                  <Text style={[styles.screenshotHint, { color: colors.textMuted }]}>
                    Demo screenshots coming soon
                  </Text>
                </View>
              )}
            </Section>

            {/* Back to Projects big CTA */}
            <TouchableOpacity
              testID="project-detail-back-cta"
              activeOpacity={0.85}
              onPress={goBack}
              style={[
                styles.bigBackBtn,
                { borderColor: colors.borderStrong, backgroundColor: colors.surface },
              ]}
            >
              <Ionicons name="arrow-back" size={16} color={colors.textMain} />
              <Text style={[styles.bigBackText, { color: colors.textMain }]}>
                Back to Projects
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </ThemeContext.Provider>
    </SafeAreaProvider>
  );
}

// ---------------------------------------------------------------------------
// Local UI helpers
// ---------------------------------------------------------------------------
const Section = ({
  title,
  colors,
  icon,
  accent,
  children,
}: {
  title: string;
  colors: any;
  icon?: string;
  accent?: string;
  children: React.ReactNode;
}) => (
  <View style={{ marginTop: 22 }}>
    <View style={styles.sectionHead}>
      {icon ? (
        <View
          style={[
            styles.sectionIcon,
            { borderColor: colors.borderStrong, backgroundColor: colors.surface, shadowColor: accent ?? colors.glowPrimary },
          ]}
        >
          <Ionicons name={icon as any} size={14} color={accent ?? colors.secondary} />
        </View>
      ) : null}
      <Text style={[styles.sectionTitle, { color: colors.textMain }]}>{title}</Text>
    </View>
    <View
      style={[
        styles.sectionBody,
        { borderColor: colors.border, backgroundColor: colors.surface },
      ]}
    >
      {children}
    </View>
  </View>
);

const PrimaryCta = ({
  icon,
  label,
  onPress,
  accent,
  testID,
}: {
  icon: string;
  label: string;
  onPress: () => void;
  accent: string;
  testID: string;
}) => (
  <Pressable testID={testID} onPress={onPress} style={styles.ctaBtn}>
    <LinearGradient
      colors={[accent, "#8A2BE2"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFill}
    />
    <Ionicons name={icon as any} size={16} color="#fff" />
    <Text style={styles.ctaBtnText}>{label}</Text>
  </Pressable>
);

const GhostCta = ({
  icon,
  label,
  onPress,
  colors,
  testID,
  disabled,
}: {
  icon: string;
  label: string;
  onPress: () => void;
  colors: any;
  testID: string;
  disabled?: boolean;
}) => (
  <TouchableOpacity
    testID={testID}
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.85}
    style={[
      styles.ctaBtn,
      styles.ctaGhost,
      { borderColor: colors.borderStrong, opacity: disabled ? 0.55 : 1 },
    ]}
  >
    <Ionicons name={icon as any} size={16} color={colors.textMain} />
    <Text style={[styles.ctaBtnText, { color: colors.textMain }]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  notFoundWrap: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  notFoundText: { fontSize: 18, fontWeight: "700", marginBottom: 16 },

  miniHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  miniHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
  },
  backBtnText: { fontSize: 12, fontWeight: "700", letterSpacing: 0.3 },
  miniHeaderTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
  },

  heroCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 22,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 8,
  },
  projectBadge: {
    width: 46,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 4,
  },
  heroTitle: { fontSize: 26, fontWeight: "800", letterSpacing: -0.6 },
  heroTagline: { fontSize: 14, marginTop: 6, lineHeight: 20, fontWeight: "500" },

  metricsRow: { flexDirection: "row", gap: 8, marginTop: 16, flexWrap: "wrap" },
  metricBox: {
    flexGrow: 1,
    flexBasis: "30%",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    minWidth: 92,
  },
  metricLabel: { fontSize: 10, fontWeight: "800", letterSpacing: 1, textTransform: "uppercase" },
  metricValue: { fontSize: 13, fontWeight: "700", marginTop: 4 },

  ctaRow: { flexDirection: "row", gap: 10, marginTop: 18, flexWrap: "wrap" },
  ctaBtn: {
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    overflow: "hidden",
  },
  ctaGhost: { borderWidth: 1, backgroundColor: "transparent" },
  ctaBtnText: { color: "#fff", fontSize: 13, fontWeight: "700", letterSpacing: 0.4 },

  sectionHead: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  sectionIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: { fontSize: 18, fontWeight: "800", letterSpacing: -0.3 },
  sectionBody: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  paragraph: { fontSize: 14, lineHeight: 22 },

  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: { fontSize: 12, fontWeight: "600" },

  featureRow: { flexDirection: "row", alignItems: "flex-start", gap: 10, paddingVertical: 10 },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 7,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 3,
  },
  featureText: { flex: 1, fontSize: 14, lineHeight: 22, fontWeight: "500" },

  screenshotEmpty: {
    borderWidth: 1,
    borderRadius: 14,
    borderStyle: "dashed",
    height: 130,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  screenshotHint: { fontSize: 12, fontWeight: "600" },
  screenshotThumb: {
    width: 120,
    height: 90,
    borderRadius: 10,
    borderWidth: 1,
  },

  bigBackBtn: {
    marginTop: 28,
    height: 48,
    borderWidth: 1,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  bigBackText: { fontSize: 14, fontWeight: "700", letterSpacing: 0.3 },

  ghostBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 22,
  },
  ghostBtnText: { fontSize: 14, fontWeight: "700" },
});
