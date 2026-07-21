import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import * as WebBrowser from "expo-web-browser";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Linking,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";

import {
  ABOUT,
  ACHIEVEMENTS,
  CERTIFICATIONS,
  CONTACT,
  INTERNSHIPS,
  PORTRAIT_URL,
  PROFILE,
  PROJECTS,
  RESUME_URL,
  ROLES,
  SECTIONS,
  SKILLS,
} from "@/src/portfolio/data";
import {
  ThemeColors,
  ThemeContext,
  ThemeMode,
  darkTheme,
  lightTheme,
  useTheme,
} from "@/src/portfolio/theme";
import { ChatbotFAB } from "@/src/portfolio/components/Chatbot";
import { RecruiterModal } from "@/src/portfolio/components/RecruiterModal";
import { playSound, setSoundEnabled } from "@/src/portfolio/sound";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const HEADER_HEIGHT = 60;

// ---------------------------------------------------------------------------
// Particle Background
// ---------------------------------------------------------------------------
const Particles = React.memo(function Particles({ colors, count = 22 }: { colors: ThemeColors; count?: number }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        x: Math.random() * SCREEN_WIDTH,
        y: Math.random() * 600,
        size: 2 + Math.random() * 4,
        duration: 4000 + Math.random() * 5000,
        delay: Math.random() * 3000,
        color: Math.random() > 0.5 ? colors.primary : colors.secondary,
      })),
    [colors, count]
  );

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {particles.map((p, i) => (
        <Particle key={i} {...p} />
      ))}
    </View>
  );
});

const Particle = ({
  x,
  y,
  size,
  duration,
  delay,
  color,
}: {
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(translateY, {
            toValue: -40,
            duration,
            delay,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.8,
            duration: duration / 2,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.2,
            duration: duration / 2,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [delay, duration, opacity, translateY]);

  return (
    <Animated.View
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity,
        transform: [{ translateY }],
        shadowColor: color,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 6,
      }}
    />
  );
};

// ---------------------------------------------------------------------------
// Floating Tech Icons (Hero background)
// ---------------------------------------------------------------------------
const FLOATING_ICONS: { name: keyof typeof Ionicons.glyphMap; x: number; y: number; size: number }[] = [
  { name: "code-slash", x: 12, y: 40, size: 22 },
  { name: "hardware-chip", x: SCREEN_WIDTH - 60, y: 80, size: 26 },
  { name: "cloud-outline", x: 30, y: 260, size: 24 },
  { name: "analytics", x: SCREEN_WIDTH - 70, y: 320, size: 22 },
  { name: "logo-python", x: SCREEN_WIDTH - 50, y: 470, size: 22 },
  { name: "rocket", x: 25, y: 470, size: 22 },
];

const FloatingIcons = ({ colors }: { colors: ThemeColors }) => {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {FLOATING_ICONS.map((icon, i) => (
        <FloatingIcon key={i} {...icon} colors={colors} index={i} />
      ))}
    </View>
  );
};

const FloatingIcon = ({
  name,
  x,
  y,
  size,
  colors,
  index,
}: {
  name: keyof typeof Ionicons.glyphMap;
  x: number;
  y: number;
  size: number;
  colors: ThemeColors;
  index: number;
}) => {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -10,
          duration: 2200 + index * 300,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 10,
          duration: 2200 + index * 300,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [index, translateY]);

  return (
    <Animated.View
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: [{ translateY }],
        opacity: 0.35,
      }}
    >
      <Ionicons name={name} size={size} color={colors.secondary} />
    </Animated.View>
  );
};

// ---------------------------------------------------------------------------
// Glass Card
// ---------------------------------------------------------------------------
const GlassCard = ({
  children,
  style,
  testID,
}: {
  children: React.ReactNode;
  style?: any;
  testID?: string;
}) => {
  const { colors, mode } = useTheme();
  return (
    <View testID={testID} style={[styles.glassOuter, { borderColor: colors.border }, style]}>
      <BlurView
        intensity={mode === "dark" ? 25 : 40}
        tint={mode === "dark" ? "dark" : "light"}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={colors.cardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.glassInner}>{children}</View>
    </View>
  );
};

// ---------------------------------------------------------------------------
// Section Title
// ---------------------------------------------------------------------------
const SectionTitle = ({ eyebrow, title }: { eyebrow: string; title: string }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.sectionTitleWrap}>
      <Text style={[styles.eyebrow, { color: colors.secondary }]}>{eyebrow}</Text>
      <Text style={[styles.sectionTitle, { color: colors.textMain }]}>{title}</Text>
      <LinearGradient
        colors={[colors.primary, colors.secondary, "transparent"]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.sectionUnderline}
      />
    </View>
  );
};

// ---------------------------------------------------------------------------
// Chip
// ---------------------------------------------------------------------------
const Chip = ({ label, testID }: { label: string; testID?: string }) => {
  const { colors } = useTheme();
  return (
    <View
      testID={testID}
      style={[
        styles.chip,
        {
          borderColor: colors.borderStrong,
          backgroundColor: colors.surface,
          shadowColor: colors.glowPrimary,
        },
      ]}
    >
      <Text style={[styles.chipText, { color: colors.textMain }]}>{label}</Text>
    </View>
  );
};

// ---------------------------------------------------------------------------
// Primary / Ghost Buttons
// ---------------------------------------------------------------------------
const PrimaryButton = ({
  label,
  icon,
  onPress,
  testID,
}: {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  testID: string;
}) => {
  const { colors } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      onPressIn={() => Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start()}
      onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()}
    >
      <Animated.View
        style={[
          styles.primaryBtn,
          {
            shadowColor: colors.glowPrimary,
            transform: [{ scale }],
          },
        ]}
      >
        <LinearGradient
          colors={[colors.primary, colors.tertiary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {icon ? <Ionicons name={icon} size={18} color="#fff" style={{ marginRight: 8 }} /> : null}
        <Text style={styles.primaryBtnText}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
};

const GhostButton = ({
  label,
  icon,
  onPress,
  testID,
}: {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  testID: string;
}) => {
  const { colors } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      onPressIn={() => Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start()}
      onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()}
    >
      <Animated.View
        style={[
          styles.ghostBtn,
          { borderColor: colors.borderStrong, transform: [{ scale }] },
        ]}
      >
        {icon ? (
          <Ionicons name={icon} size={18} color={colors.textMain} style={{ marginRight: 8 }} />
        ) : null}
        <Text style={[styles.ghostBtnText, { color: colors.textMain }]}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
};

const IconButton = ({
  icon,
  onPress,
  testID,
  color,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  testID: string;
  color?: string;
}) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.iconBtn,
        { borderColor: colors.borderStrong, backgroundColor: colors.surface, shadowColor: colors.glowPrimary },
      ]}
    >
      <Ionicons name={icon} size={20} color={color ?? colors.textMain} />
    </TouchableOpacity>
  );
};

// ---------------------------------------------------------------------------
// Hero Portrait
// ---------------------------------------------------------------------------
const HeroPortrait = () => {
  const { colors } = useTheme();
  const translateY = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -8,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 8,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: false,
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [glow, translateY]);

  const shadowRadius = glow.interpolate({ inputRange: [0, 1], outputRange: [18, 32] });

  return (
    // Outer view drives the JS-only shadow animation (shadowRadius)
    <Animated.View
      testID="hero-portrait"
      style={[
        styles.portraitOuter,
        {
          shadowColor: colors.primary,
          shadowRadius: shadowRadius as any,
        },
      ]}
    >
      {/* Inner view drives the native-only transform (translateY) */}
      <Animated.View style={{ transform: [{ translateY }] }}>
        <LinearGradient
          colors={[colors.primary, colors.secondary, colors.tertiary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.portraitRing}
        >
          <View style={[styles.portraitInner, { backgroundColor: colors.background }]}>
            <Image
              source={{ uri: PORTRAIT_URL }}
              style={styles.portraitImage}
              resizeMode="cover"
            />
          </View>
        </LinearGradient>
      </Animated.View>
    </Animated.View>
  );
};

// ---------------------------------------------------------------------------
// Typing Animation
// ---------------------------------------------------------------------------
const TypingRoles = () => {
  const { colors } = useTheme();
  const [display, setDisplay] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [phase, setPhase] = useState<"type" | "hold" | "delete">("type");

  useEffect(() => {
    const current = ROLES[wordIndex];
    let timeout: any;
    if (phase === "type") {
      if (display.length < current.length) {
        timeout = setTimeout(() => setDisplay(current.slice(0, display.length + 1)), 70);
      } else {
        timeout = setTimeout(() => setPhase("hold"), 100);
      }
    } else if (phase === "hold") {
      timeout = setTimeout(() => setPhase("delete"), 1200);
    } else if (phase === "delete") {
      if (display.length > 0) {
        timeout = setTimeout(() => setDisplay(current.slice(0, display.length - 1)), 40);
      } else {
        setWordIndex((wordIndex + 1) % ROLES.length);
        setPhase("type");
      }
    }
    return () => clearTimeout(timeout);
  }, [display, phase, wordIndex]);

  return (
    <View style={styles.typingWrap}>
      <Text style={[styles.typingText, { color: colors.secondary }]} testID="hero-typing-roles">
        {display}
      </Text>
      <BlinkingCursor color={colors.secondary} />
    </View>
  );
};

const BlinkingCursor = ({ color }: { color: string }) => {
  const opacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ])
    ).start();
  }, [opacity]);
  return (
    <Animated.View
      style={{
        width: 2,
        height: 22,
        marginLeft: 4,
        backgroundColor: color,
        opacity,
      }}
    />
  );
};

// ---------------------------------------------------------------------------
// Sticky Header + Progress Bar
// ---------------------------------------------------------------------------
const StickyHeader = ({
  scrollY,
  contentHeight,
  viewportHeight,
  onSectionPress,
  onToggleTheme,
  soundOn,
  onToggleSound,
}: {
  scrollY: Animated.Value;
  contentHeight: number;
  viewportHeight: number;
  onSectionPress: (id: string) => void;
  onToggleTheme: () => void;
  soundOn: boolean;
  onToggleSound: () => void;
}) => {
  const { colors, mode } = useTheme();
  const insets = useSafeAreaInsets();

  const scrollable = Math.max(contentHeight - viewportHeight, 1);
  const progressWidth = scrollY.interpolate({
    inputRange: [0, scrollable],
    outputRange: [0, SCREEN_WIDTH],
    extrapolate: "clamp",
  });

  return (
    <View
      style={[
        styles.header,
        {
          paddingTop: insets.top,
          height: HEADER_HEIGHT + insets.top,
          backgroundColor: colors.navBackground,
          borderColor: colors.border,
        },
      ]}
    >
      <BlurView
        intensity={40}
        tint={mode === "dark" ? "dark" : "light"}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.headerRow}>
        <TouchableOpacity
          testID="header-logo"
          onPress={() => onSectionPress("hero")}
          activeOpacity={0.7}
          style={styles.logoWrap}
        >
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoBadge}
          >
            <Text style={styles.logoText}>MN</Text>
          </LinearGradient>
          <Text style={[styles.logoName, { color: colors.textMain }]}>Mutta Navya</Text>
        </TouchableOpacity>

        <View style={styles.headerRight}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.navScroll}
          >
            {SECTIONS.map((s) => (
              <TouchableOpacity
                key={s.id}
                testID={`nav-${s.id}`}
                onPress={() => onSectionPress(s.id)}
                activeOpacity={0.7}
                style={styles.navItem}
              >
                <Text style={[styles.navItemText, { color: colors.textMuted }]}>{s.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            testID="theme-toggle-button"
            onPress={onToggleTheme}
            activeOpacity={0.7}
            style={[
              styles.themeToggle,
              { borderColor: colors.borderStrong, backgroundColor: colors.surface },
            ]}
          >
            <Ionicons
              name={mode === "dark" ? "sunny" : "moon"}
              size={18}
              color={colors.textMain}
            />
          </TouchableOpacity>
          <TouchableOpacity
            testID="sound-toggle-button"
            onPress={onToggleSound}
            activeOpacity={0.7}
            style={[
              styles.themeToggle,
              {
                marginLeft: 6,
                borderColor: soundOn ? colors.secondary : colors.borderStrong,
                backgroundColor: colors.surface,
                shadowColor: colors.glowSecondary,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: soundOn ? 0.9 : 0,
                shadowRadius: soundOn ? 8 : 0,
              },
            ]}
          >
            <Ionicons
              name={soundOn ? "volume-high" : "volume-mute"}
              size={18}
              color={soundOn ? colors.secondary : colors.textMain}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.progressTrack}>
        <Animated.View
          testID="scroll-progress-bar"
          style={{
            height: 3,
            width: progressWidth,
            backgroundColor: colors.secondary,
            shadowColor: colors.secondary,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.9,
            shadowRadius: 6,
          }}
        />
      </View>
    </View>
  );
};

// ---------------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------------
const HeroSection = ({
  onSectionPress,
  onOpenRecruiter,
}: {
  onSectionPress: (id: string) => void;
  onOpenRecruiter: () => void;
}) => {
  const { colors } = useTheme();

  const openResume = () => {
    playSound("click");
    WebBrowser.openBrowserAsync(RESUME_URL);
  };
  const downloadResume = () => {
    playSound("click");
    Linking.openURL(RESUME_URL);
  };
  const openMail = () => {
    playSound("click");
    Linking.openURL(`mailto:${CONTACT.email}`);
  };
  const openGithub = () => {
    playSound("click");
    Linking.openURL(CONTACT.github);
  };
  const openLinkedin = () => {
    playSound("click");
    Linking.openURL(CONTACT.linkedin);
  };

  return (
    <View style={styles.hero}>
      <LinearGradient
        colors={colors.heroGradient}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Particles colors={colors} count={26} />
      <FloatingIcons colors={colors} />

      <View style={styles.heroContent}>
        <HeroPortrait />

        <Text style={[styles.heroGreeting, { color: colors.textMuted }]}>Hello, I&apos;m</Text>
        <Text style={[styles.heroName, { color: colors.textMain }]} testID="hero-name">
          {CONTACT.name}
        </Text>
        <Text style={[styles.heroTitle, { color: colors.textMuted }]}>{CONTACT.title}</Text>

        <View style={styles.heroTypingRow}>
          <Text style={[styles.typingPrefix, { color: colors.textMuted }]}>{`>  `}</Text>
          <TypingRoles />
        </View>

        <View style={styles.heroCtaCol}>
          {/* For Recruiters badge button */}
          <TouchableOpacity
            testID="hero-recruiters-button"
            activeOpacity={0.85}
            onPress={() => {
              playSound("open");
              onOpenRecruiter();
            }}
            style={[
              styles.recruiterCta,
              {
                borderColor: colors.borderStrong,
                backgroundColor: colors.surface,
                shadowColor: colors.glowSecondary,
              },
            ]}
          >
            <View style={[styles.recruiterDot, { backgroundColor: "#2EE59D" }]} />
            <Text style={[styles.recruiterCtaText, { color: colors.textMain }]}>
              For Recruiters — 30-second snapshot
            </Text>
            <Ionicons name="arrow-forward" size={14} color={colors.secondary} />
          </TouchableOpacity>

          <View style={styles.heroCtaRow}>
            <PrimaryButton
              label="View Resume"
              icon="document-text"
              onPress={openResume}
              testID="hero-view-resume-button"
            />
            <GhostButton
              label="Download"
              icon="download"
              onPress={downloadResume}
              testID="hero-download-resume-button"
            />
          </View>
          <View style={styles.heroCtaRow}>
            <PrimaryButton
              label="Contact Me"
              icon="mail"
              onPress={openMail}
              testID="hero-contact-button"
            />
          </View>
          <View style={styles.socialRow}>
            <IconButton icon="logo-github" onPress={openGithub} testID="hero-github-button" />
            <IconButton icon="logo-linkedin" onPress={openLinkedin} testID="hero-linkedin-button" />
            <IconButton
              icon="arrow-down"
              onPress={() => onSectionPress("about")}
              testID="hero-scroll-down-button"
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const AboutSection = () => {
  const { colors } = useTheme();
  return (
    <View style={styles.section} testID="about-section">
      <SectionTitle eyebrow="01 — Introduction" title="About Me" />
      <GlassCard>
        <Text style={[styles.aboutText, { color: colors.textMain }]}>{ABOUT}</Text>
      </GlassCard>
    </View>
  );
};

const EducationSection = () => {
  const { colors } = useTheme();
  const items = [
    { icon: "school", label: "College", value: PROFILE.college },
    { icon: "ribbon", label: "Degree", value: `${PROFILE.degree} • ${PROFILE.branch}` },
    { icon: "calendar", label: "Duration", value: PROFILE.duration },
    { icon: "trophy", label: "CGPA", value: PROFILE.cgpa },
    { icon: "location", label: "Location", value: PROFILE.location },
  ] as const;

  return (
    <View style={styles.section} testID="education-section">
      <SectionTitle eyebrow="02 — Profile" title="Education" />
      <GlassCard>
        {items.map((it, idx) => (
          <View key={it.label} style={[styles.eduRow, idx > 0 && { marginTop: 18 }]}>
            <View
              style={[
                styles.eduIcon,
                { borderColor: colors.borderStrong, backgroundColor: colors.surface, shadowColor: colors.glowPrimary },
              ]}
            >
              <Ionicons name={it.icon as any} size={18} color={colors.secondary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.eduLabel, { color: colors.textMuted }]}>{it.label}</Text>
              <Text style={[styles.eduValue, { color: colors.textMain }]}>{it.value}</Text>
            </View>
          </View>
        ))}
      </GlassCard>
    </View>
  );
};

const SkillsSection = () => {
  const { colors } = useTheme();
  return (
    <View style={styles.section} testID="skills-section">
      <SectionTitle eyebrow="03 — Toolkit" title="Skills" />
      {SKILLS.map((group) => (
        <View key={group.group} style={{ marginBottom: 20 }}>
          <View style={styles.skillHeaderRow}>
            <View style={[styles.skillDot, { backgroundColor: colors.secondary, shadowColor: colors.secondary }]} />
            <Text style={[styles.skillGroupTitle, { color: colors.textMain }]}>{group.group}</Text>
          </View>
          <View style={styles.chipRow}>
            {group.items.map((s) => (
              <Chip key={s} label={s} testID={`skill-chip-${s}`} />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
};

const ProjectsSection = () => {
  const { colors } = useTheme();
  return (
    <View style={styles.section} testID="projects-section">
      <SectionTitle eyebrow="04 — Work" title="Projects" />
      {PROJECTS.map((p, i) => (
        <GlassCard key={p.title} style={{ marginBottom: 16 }} testID={`project-card-${i}`}>
          <View style={styles.projectHeader}>
            <View
              style={[
                styles.projectIndex,
                { borderColor: colors.borderStrong, shadowColor: colors.glowPrimary },
              ]}
            >
              <LinearGradient
                colors={[colors.primary, colors.tertiary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <Text style={styles.projectIndexText}>{String(i + 1).padStart(2, "0")}</Text>
            </View>
            <Text style={[styles.projectTitle, { color: colors.textMain }]}>{p.title}</Text>
          </View>
          <Text style={[styles.projectDesc, { color: colors.textMuted }]}>{p.description}</Text>
          <View style={styles.chipRow}>
            {p.tech.map((t) => (
              <Chip key={t} label={t} testID={`project-tech-${i}-${t}`} />
            ))}
          </View>
          {p.github ? (
            <View style={{ marginTop: 16, alignSelf: "flex-start" }}>
              <GhostButton
                label="GitHub"
                icon="logo-github"
                onPress={() => Linking.openURL(p.github!)}
                testID={`project-github-${i}`}
              />
            </View>
          ) : null}
        </GlassCard>
      ))}
    </View>
  );
};

const InternshipsSection = () => {
  const { colors } = useTheme();
  return (
    <View style={styles.section} testID="internships-section">
      <SectionTitle eyebrow="05 — Journey" title="Internships" />
      <View style={styles.timelineWrap}>
        <LinearGradient
          colors={[colors.primary, colors.secondary, colors.tertiary]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.timelineLine}
        />
        {INTERNSHIPS.map((it, i) => (
          <View key={it.title} style={styles.timelineRow} testID={`internship-item-${i}`}>
            <View
              style={[
                styles.timelineDot,
                {
                  borderColor: colors.secondary,
                  backgroundColor: colors.background,
                  shadowColor: colors.secondary,
                },
              ]}
            >
              <View style={[styles.timelineDotInner, { backgroundColor: colors.secondary }]} />
            </View>
            <GlassCard style={styles.timelineCard}>
              <Text style={[styles.timelineTitle, { color: colors.textMain }]}>{it.title}</Text>
              <Text style={[styles.timelineMeta, { color: colors.secondary }]}>{it.meta}</Text>
            </GlassCard>
          </View>
        ))}
      </View>
    </View>
  );
};

const CertificationsSection = () => {
  const { colors } = useTheme();
  return (
    <View style={styles.section} testID="certifications-section">
      <SectionTitle eyebrow="06 — Learning" title="Certifications" />
      <View style={styles.certGrid}>
        {CERTIFICATIONS.map((c, i) => (
          <GlassCard key={c} style={styles.certCard} testID={`cert-card-${i}`}>
            <View
              style={[
                styles.certIcon,
                { borderColor: colors.borderStrong, shadowColor: colors.glowSecondary },
              ]}
            >
              <Ionicons name="ribbon" size={22} color={colors.secondary} />
            </View>
            <Text style={[styles.certText, { color: colors.textMain }]}>{c}</Text>
          </GlassCard>
        ))}
      </View>
    </View>
  );
};

const AchievementsSection = () => {
  const { colors } = useTheme();
  return (
    <View style={styles.section} testID="achievements-section">
      <SectionTitle eyebrow="07 — Highlights" title="Achievements" />
      <GlassCard>
        {ACHIEVEMENTS.map((a, i) => (
          <View
            key={i}
            style={[styles.achievementRow, i > 0 && { borderTopWidth: 1, borderTopColor: colors.border }]}
          >
            <View
              style={[
                styles.achievementIcon,
                { borderColor: colors.borderStrong, shadowColor: colors.glowPrimary },
              ]}
            >
              <Ionicons name="trophy" size={18} color={colors.tertiary} />
            </View>
            <Text style={[styles.achievementText, { color: colors.textMain }]}>{a}</Text>
          </View>
        ))}
      </GlassCard>
    </View>
  );
};

const ContactSection = () => {
  const { colors } = useTheme();
  const rows = [
    { icon: "mail", label: CONTACT.email, action: () => Linking.openURL(`mailto:${CONTACT.email}`), testID: "footer-email" },
    { icon: "call", label: CONTACT.phone, action: () => Linking.openURL(`tel:${CONTACT.phone.replace(/\s/g, "")}`), testID: "footer-phone" },
    { icon: "logo-github", label: "github.com/muttanavya", action: () => Linking.openURL(CONTACT.github), testID: "footer-github" },
    { icon: "logo-linkedin", label: "linkedin.com/in/muttanavya", action: () => Linking.openURL(CONTACT.linkedin), testID: "footer-linkedin" },
  ] as const;

  return (
    <View style={styles.section} testID="contact-section">
      <SectionTitle eyebrow="08 — Get in Touch" title="Contact" />
      <GlassCard>
        <Text style={[styles.contactPitch, { color: colors.textMain }]}>
          Open to Software Engineer & AI/ML Engineer opportunities. Let&apos;s build something great together.
        </Text>
        {rows.map((r, i) => (
          <TouchableOpacity
            key={r.testID}
            testID={r.testID}
            activeOpacity={0.7}
            onPress={r.action}
            style={[
              styles.contactRow,
              i > 0 && { borderTopWidth: 1, borderTopColor: colors.border },
            ]}
          >
            <View
              style={[
                styles.contactIcon,
                { borderColor: colors.borderStrong, backgroundColor: colors.surface, shadowColor: colors.glowSecondary },
              ]}
            >
              <Ionicons name={r.icon as any} size={18} color={colors.secondary} />
            </View>
            <Text style={[styles.contactValue, { color: colors.textMain }]}>{r.label}</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        ))}
      </GlassCard>
      <Text style={[styles.footerCopy, { color: colors.textMuted }]}>
        © {new Date().getFullYear()} Mutta Navya · Crafted with passion.
      </Text>
    </View>
  );
};

// ---------------------------------------------------------------------------
// Back-to-top FAB
// ---------------------------------------------------------------------------
const BackToTop = ({ visible, onPress }: { visible: boolean; onPress: () => void }) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: visible ? 1 : 0, duration: 200, useNativeDriver: true }),
      Animated.timing(translateY, {
        toValue: visible ? 0 : 30,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY, visible]);

  return (
    <Animated.View
      pointerEvents={visible ? "auto" : "none"}
      style={[
        styles.fab,
        {
          bottom: 20 + insets.bottom,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <TouchableOpacity
        testID="back-to-top-button"
        onPress={onPress}
        activeOpacity={0.85}
        style={[
          styles.fabInner,
          { shadowColor: colors.glowPrimary, borderColor: colors.borderStrong },
        ]}
      >
        <LinearGradient
          colors={[colors.primary, colors.tertiary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <Ionicons name="arrow-up" size={22} color="#fff" />
      </TouchableOpacity>
    </Animated.View>
  );
};

// ---------------------------------------------------------------------------
// Main Portfolio
// ---------------------------------------------------------------------------
const Portfolio = () => {
  const { colors } = useTheme();
  const scrollRef = useRef<ScrollView>(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [scrollValue, setScrollValue] = useState(0);
  const [contentHeight, setContentHeight] = useState(1);
  const [viewportHeight, setViewportHeight] = useState(1);
  const [soundOn, setSoundOn] = useState(false);
  const [recruiterOpen, setRecruiterOpen] = useState(false);
  const insets = useSafeAreaInsets();

  const sectionOffsets = useRef<Record<string, number>>({}).current;

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    scrollY.setValue(y);
    setScrollValue(y);
  };

  const scrollToSection = (id: string) => {
    playSound("whoosh");
    if (id === "hero") {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }
    const y = sectionOffsets[id];
    if (typeof y === "number") {
      scrollRef.current?.scrollTo({
        y: Math.max(0, y - HEADER_HEIGHT - insets.top - 12),
        animated: true,
      });
    }
  };

  const registerSection = (id: string) => (e: any) => {
    sectionOffsets[id] = e.nativeEvent.layout.y;
  };

  const toggleSound = () => {
    const next = !soundOn;
    setSoundEnabled(next);
    setSoundOn(next);
    if (next) playSound("success");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient colors={colors.gradientBg} style={StyleSheet.absoluteFill} />
      <ScrollView
        ref={scrollRef}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={(_, h) => setContentHeight(h)}
        onLayout={(e) => setViewportHeight(e.nativeEvent.layout.height)}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        <View onLayout={registerSection("hero")}>
          <HeroSection
            onSectionPress={scrollToSection}
            onOpenRecruiter={() => setRecruiterOpen(true)}
          />
        </View>
        <View onLayout={registerSection("about")}>
          <AboutSection />
        </View>
        <View onLayout={registerSection("education")}>
          <EducationSection />
        </View>
        <View onLayout={registerSection("skills")}>
          <SkillsSection />
        </View>
        <View onLayout={registerSection("projects")}>
          <ProjectsSection />
        </View>
        <View onLayout={registerSection("internships")}>
          <InternshipsSection />
        </View>
        <View onLayout={registerSection("certifications")}>
          <CertificationsSection />
        </View>
        <View onLayout={registerSection("achievements")}>
          <AchievementsSection />
        </View>
        <View onLayout={registerSection("contact")}>
          <ContactSection />
        </View>
      </ScrollView>

      <StickyHeader
        scrollY={scrollY}
        contentHeight={contentHeight}
        viewportHeight={viewportHeight}
        onSectionPress={scrollToSection}
        onToggleTheme={useTheme().toggle}
        soundOn={soundOn}
        onToggleSound={toggleSound}
      />
      <BackToTop visible={scrollValue > 400} onPress={() => scrollToSection("hero")} />
      <ChatbotFAB />
      <RecruiterModal visible={recruiterOpen} onClose={() => setRecruiterOpen(false)} />
    </View>
  );
};

// ---------------------------------------------------------------------------
// Root with ThemeProvider
// ---------------------------------------------------------------------------
export default function Index() {
  const [mode, setMode] = useState<ThemeMode>("dark");
  const colors = mode === "dark" ? darkTheme : lightTheme;
  const value = useMemo(
    () => ({
      mode,
      colors,
      toggle: () => setMode((m) => (m === "dark" ? "light" : "dark")),
    }),
    [mode, colors]
  );

  return (
    <SafeAreaProvider>
      <ThemeContext.Provider value={value}>
        <StatusBar style={mode === "dark" ? "light" : "dark"} />
        <Portfolio />
      </ThemeContext.Provider>
    </SafeAreaProvider>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  // Header
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    borderBottomWidth: 1,
    zIndex: 100,
  },
  headerRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  logoWrap: { flexDirection: "row", alignItems: "center" },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  logoText: { color: "#fff", fontWeight: "800", fontSize: 13, letterSpacing: 1 },
  logoName: { fontSize: 15, fontWeight: "700", letterSpacing: 0.3 },
  headerRight: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  navScroll: { alignItems: "center", paddingRight: 8 },
  navItem: { paddingHorizontal: 10, paddingVertical: 6 },
  navItemText: { fontSize: 12, fontWeight: "600", letterSpacing: 0.4 },
  themeToggle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 6,
  },
  progressTrack: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 3,
  },

  // Hero
  hero: {
    paddingTop: HEADER_HEIGHT + 60,
    paddingBottom: 60,
    paddingHorizontal: 24,
    overflow: "hidden",
    minHeight: 720,
  },
  heroContent: { alignItems: "center" },
  heroGreeting: { fontSize: 14, fontWeight: "600", letterSpacing: 2, marginTop: 24, textTransform: "uppercase" },
  heroName: { fontSize: 40, fontWeight: "800", letterSpacing: -1, marginTop: 6, textAlign: "center" },
  heroTitle: { fontSize: 15, fontWeight: "500", marginTop: 8, textAlign: "center", maxWidth: 320 },
  heroTypingRow: { flexDirection: "row", alignItems: "center", marginTop: 20, minHeight: 30 },
  typingPrefix: { fontSize: 16, fontWeight: "700", opacity: 0.7 },
  typingWrap: { flexDirection: "row", alignItems: "center" },
  typingText: { fontSize: 18, fontWeight: "700", letterSpacing: 0.4 },
  heroCtaCol: { marginTop: 28, alignItems: "center", width: "100%" },
  heroCtaRow: { flexDirection: "row", justifyContent: "center", gap: 12, marginTop: 10, flexWrap: "wrap" },
  recruiterCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 6,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 4,
  },
  recruiterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  recruiterCtaText: { fontSize: 12, fontWeight: "700", letterSpacing: 0.3 },
  socialRow: { flexDirection: "row", marginTop: 20, gap: 12 },

  // Portrait
  portraitOuter: {
    width: 200,
    height: 200,
    borderRadius: 100,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    elevation: 20,
  },
  portraitRing: {
    width: 200,
    height: 200,
    borderRadius: 100,
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  portraitInner: {
    width: 192,
    height: 192,
    borderRadius: 96,
    overflow: "hidden",
    padding: 3,
  },
  portraitImage: {
    width: "100%",
    height: "100%",
    borderRadius: 90,
  },

  // Buttons
  primaryBtn: {
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 22,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 14,
    elevation: 8,
  },
  primaryBtnText: { color: "#fff", fontSize: 14, fontWeight: "700", letterSpacing: 0.4 },
  ghostBtn: {
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 22,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    backgroundColor: "transparent",
  },
  ghostBtnText: { fontSize: 14, fontWeight: "700", letterSpacing: 0.4 },
  iconBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 6,
  },

  // Section
  section: { paddingHorizontal: 20, paddingTop: 40, paddingBottom: 10 },
  sectionTitleWrap: { marginBottom: 24 },
  eyebrow: { fontSize: 11, fontWeight: "800", letterSpacing: 2, textTransform: "uppercase" },
  sectionTitle: { fontSize: 32, fontWeight: "800", letterSpacing: -0.8, marginTop: 6 },
  sectionUnderline: { height: 3, width: 80, marginTop: 10, borderRadius: 2 },

  // Glass
  glassOuter: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  glassInner: { padding: 20 },

  // About
  aboutText: { fontSize: 15, lineHeight: 24, fontWeight: "400" },

  // Education
  eduRow: { flexDirection: "row", alignItems: "center" },
  eduIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  eduLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 1.4, textTransform: "uppercase" },
  eduValue: { fontSize: 15, fontWeight: "600", marginTop: 2 },

  // Skills
  skillHeaderRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  skillDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 4,
  },
  skillGroupTitle: { fontSize: 16, fontWeight: "700", letterSpacing: 0.4 },

  // Chip
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 6 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 2,
  },
  chipText: { fontSize: 12, fontWeight: "600", letterSpacing: 0.3 },

  // Projects
  projectHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  projectIndex: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  projectIndexText: { color: "#fff", fontWeight: "800", fontSize: 12, letterSpacing: 1 },
  projectTitle: { flex: 1, fontSize: 17, fontWeight: "700", letterSpacing: -0.2 },
  projectDesc: { fontSize: 14, lineHeight: 21, marginBottom: 12 },

  // Timeline
  timelineWrap: { paddingLeft: 8 },
  timelineLine: {
    position: "absolute",
    top: 8,
    bottom: 8,
    left: 18,
    width: 2,
    borderRadius: 1,
  },
  timelineRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 16 },
  timelineDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    marginRight: 14,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 6,
  },
  timelineDotInner: { width: 8, height: 8, borderRadius: 4 },
  timelineCard: { flex: 1 },
  timelineTitle: { fontSize: 15, fontWeight: "700" },
  timelineMeta: { fontSize: 12, fontWeight: "700", marginTop: 4, letterSpacing: 0.8, textTransform: "uppercase" },

  // Certifications
  certGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  certCard: { width: (SCREEN_WIDTH - 40 - 12) / 2, minHeight: 140 },
  certIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 4,
  },
  certText: { fontSize: 13, fontWeight: "600", lineHeight: 18 },

  // Achievements
  achievementRow: { flexDirection: "row", alignItems: "flex-start", paddingVertical: 14 },
  achievementIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  achievementText: { flex: 1, fontSize: 14, lineHeight: 22, fontWeight: "500" },

  // Contact
  contactPitch: { fontSize: 15, lineHeight: 22, marginBottom: 8, fontWeight: "500" },
  contactRow: { flexDirection: "row", alignItems: "center", paddingVertical: 14 },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  contactValue: { flex: 1, fontSize: 14, fontWeight: "600" },
  footerCopy: { textAlign: "center", marginTop: 24, fontSize: 12, letterSpacing: 0.5 },

  // FAB
  fab: {
    position: "absolute",
    right: 20,
  },
  fabInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 14,
    elevation: 10,
  },
});
