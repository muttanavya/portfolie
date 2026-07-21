import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/src/portfolio/theme";
import { playSound } from "@/src/portfolio/sound";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL as string;

type Msg = { role: "user" | "assistant"; text: string };

const SUGGESTIONS = [
  "What ML projects has Navya done?",
  "Does she know AWS?",
  "Summarize her strongest skills",
  "How can I contact her?",
];

export const ChatbotFAB = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1400, useNativeDriver: false }),
        Animated.timing(pulse, { toValue: 0, duration: 1400, useNativeDriver: false }),
      ])
    ).start();
  }, [pulse]);

  const shadowRadius = pulse.interpolate({ inputRange: [0, 1], outputRange: [10, 22] });

  return (
    <>
      <Animated.View
        style={[
          styles.fab,
          {
            bottom: 84 + insets.bottom,
            shadowColor: colors.secondary,
            shadowRadius: shadowRadius as any,
          },
        ]}
      >
        <TouchableOpacity
          testID="chatbot-open-button"
          activeOpacity={0.85}
          onPress={() => {
            playSound("open");
            setOpen(true);
          }}
          style={styles.fabInner}
        >
          <LinearGradient
            colors={[colors.secondary, colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Ionicons name="sparkles" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={[styles.fabLabel, { borderColor: colors.borderStrong, backgroundColor: colors.surfaceStrong }]}>
          <Text style={[styles.fabLabelText, { color: colors.textMain }]}>Ask AI</Text>
        </View>
      </Animated.View>

      <ChatbotModal visible={open} onClose={() => setOpen(false)} />
    </>
  );
};

const ChatbotModal = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
  const { colors, mode } = useTheme();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const scrollRef = useRef<ScrollView>(null);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    playSound("click");
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, session_id: sessionId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || "Failed to reach assistant");
      if (data.session_id) setSessionId(data.session_id);
      setMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
      playSound("success");
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: `Sorry, I couldn't reach the assistant right now. Please try again or email Navya at muttanavya@gmail.com.`,
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
    }
  };

  const handleClose = () => {
    playSound("close");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable style={styles.backdrop} onPress={handleClose} />
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
              paddingBottom: 20 + insets.bottom,
            },
          ]}
        >
          <BlurView
            intensity={40}
            tint={mode === "dark" ? "dark" : "light"}
            style={StyleSheet.absoluteFill}
          />
          <LinearGradient
            colors={colors.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />

          {/* Handle */}
          <View style={styles.handleWrap}>
            <View style={[styles.handle, { backgroundColor: colors.textMuted }]} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <LinearGradient
                colors={[colors.secondary, colors.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.headerBadge}
              >
                <Ionicons name="sparkles" size={16} color="#fff" />
              </LinearGradient>
              <View>
                <Text style={[styles.headerTitle, { color: colors.textMain }]}>Ask Navya-Bot</Text>
                <View style={styles.statusRow}>
                  <View style={[styles.onlineDot, { backgroundColor: "#2EE59D" }]} />
                  <Text style={[styles.headerSub, { color: colors.textMuted }]}>
                    Powered by Claude · Grounded on Navya&apos;s resume
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              testID="chatbot-close-button"
              onPress={handleClose}
              activeOpacity={0.7}
              style={[
                styles.iconBtn,
                { borderColor: colors.borderStrong, backgroundColor: colors.surface },
              ]}
            >
              <Ionicons name="close" size={18} color={colors.textMain} />
            </TouchableOpacity>
          </View>

          {/* Messages */}
          <ScrollView
            ref={scrollRef}
            style={styles.messages}
            contentContainerStyle={{ padding: 16, paddingTop: 4, paddingBottom: 12 }}
            showsVerticalScrollIndicator={false}
          >
            {messages.length === 0 ? (
              <View>
                <Text style={[styles.introText, { color: colors.textMain }]}>
                  👋 Hi! I&apos;m Navya-Bot. Ask me anything about Mutta Navya&apos;s skills,
                  projects, internships, or how to get in touch.
                </Text>
                <View style={styles.suggestions}>
                  {SUGGESTIONS.map((s, i) => (
                    <TouchableOpacity
                      key={s}
                      testID={`chatbot-suggestion-${i}`}
                      activeOpacity={0.7}
                      onPress={() => sendMessage(s)}
                      style={[
                        styles.suggestChip,
                        { borderColor: colors.borderStrong, backgroundColor: colors.surface },
                      ]}
                    >
                      <Ionicons name="flash" size={13} color={colors.secondary} />
                      <Text style={[styles.suggestText, { color: colors.textMain }]}>{s}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ) : null}

            {messages.map((m, i) => (
              <View
                key={i}
                testID={`chatbot-message-${i}`}
                style={[
                  styles.bubbleRow,
                  { justifyContent: m.role === "user" ? "flex-end" : "flex-start" },
                ]}
              >
                <View
                  style={[
                    styles.bubble,
                    m.role === "user"
                      ? { backgroundColor: colors.primary, borderTopRightRadius: 4 }
                      : {
                          backgroundColor: colors.surfaceStrong,
                          borderTopLeftRadius: 4,
                          borderWidth: 1,
                          borderColor: colors.border,
                        },
                  ]}
                >
                  <Text
                    style={[
                      styles.bubbleText,
                      { color: m.role === "user" ? "#fff" : colors.textMain },
                    ]}
                  >
                    {m.text}
                  </Text>
                </View>
              </View>
            ))}

            {loading ? (
              <View style={[styles.bubbleRow, { justifyContent: "flex-start" }]}>
                <View
                  style={[
                    styles.bubble,
                    {
                      backgroundColor: colors.surfaceStrong,
                      borderTopLeftRadius: 4,
                      borderWidth: 1,
                      borderColor: colors.border,
                      flexDirection: "row",
                      alignItems: "center",
                    },
                  ]}
                >
                  <ActivityIndicator size="small" color={colors.secondary} />
                  <Text style={[styles.bubbleText, { color: colors.textMuted, marginLeft: 8 }]}>
                    Thinking…
                  </Text>
                </View>
              </View>
            ) : null}
          </ScrollView>

          {/* Input */}
          <View
            style={[
              styles.inputRow,
              { borderTopColor: colors.border, backgroundColor: colors.surface },
            ]}
          >
            <TextInput
              testID="chatbot-input"
              value={input}
              onChangeText={setInput}
              placeholder="Ask about skills, projects, or contact…"
              placeholderTextColor={colors.textMuted}
              style={[styles.input, { color: colors.textMain }]}
              onSubmitEditing={() => sendMessage(input)}
              returnKeyType="send"
              editable={!loading}
              multiline
              maxLength={800}
            />
            <TouchableOpacity
              testID="chatbot-send-button"
              onPress={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              activeOpacity={0.85}
              style={{ opacity: !input.trim() || loading ? 0.5 : 1 }}
            >
              <LinearGradient
                colors={[colors.secondary, colors.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.sendBtn}
              >
                <Ionicons name="send" size={18} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.9,
    elevation: 12,
  },
  fabInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  fabLabel: {
    position: "absolute",
    right: 62,
    top: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  fabLabelText: { fontSize: 11, fontWeight: "700", letterSpacing: 0.4 },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "80%",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    overflow: "hidden",
  },
  handleWrap: { alignItems: "center", paddingTop: 10, paddingBottom: 6 },
  handle: { width: 40, height: 4, borderRadius: 2, opacity: 0.5 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  headerBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  headerTitle: { fontSize: 16, fontWeight: "800", letterSpacing: -0.2 },
  statusRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  onlineDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  headerSub: { fontSize: 11, fontWeight: "500" },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  messages: { flex: 1 },
  introText: { fontSize: 15, lineHeight: 22, marginBottom: 14 },
  suggestions: { gap: 8 },
  suggestChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  suggestText: { fontSize: 13, fontWeight: "600" },

  bubbleRow: { flexDirection: "row", marginBottom: 10 },
  bubble: {
    maxWidth: SCREEN_WIDTH * 0.78,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
  },
  bubbleText: { fontSize: 14, lineHeight: 21 },

  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderTopWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    maxHeight: 100,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
  },
});
