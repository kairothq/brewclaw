"use client";

import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";

// Phone mockup component
const PhoneMockup: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      width: 380,
      height: 820,
      backgroundColor: "#1a1a1a",
      borderRadius: 50,
      padding: 12,
      boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
      position: "relative",
    }}
  >
    {/* Notch */}
    <div
      style={{
        position: "absolute",
        top: 20,
        left: "50%",
        transform: "translateX(-50%)",
        width: 120,
        height: 30,
        backgroundColor: "#000",
        borderRadius: 20,
        zIndex: 10,
      }}
    />
    {/* Screen */}
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#0e0e10",
        borderRadius: 40,
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  </div>
);

// Telegram header
const TelegramHeader: React.FC<{ title: string }> = ({ title }) => (
  <div
    style={{
      height: 90,
      backgroundColor: "#1c1c1e",
      display: "flex",
      alignItems: "flex-end",
      padding: "0 16px 12px",
      borderBottom: "1px solid #333",
    }}
  >
    <span style={{ color: "#007AFF", fontSize: 18 }}>←</span>
    <span
      style={{
        color: "#fff",
        fontSize: 20,
        fontWeight: 600,
        marginLeft: 12,
        flex: 1,
      }}
    >
      {title}
    </span>
  </div>
);

// Search bar animation
const SearchScene: React.FC<{ searchText: string; progress: number }> = ({
  searchText,
  progress,
}) => {
  const visibleChars = Math.floor(progress * searchText.length);
  const displayText = searchText.slice(0, visibleChars);

  return (
    <div style={{ padding: 16 }}>
      <div
        style={{
          backgroundColor: "#2c2c2e",
          borderRadius: 12,
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <span style={{ color: "#666", marginRight: 8 }}>🔍</span>
        <span style={{ color: "#fff", fontSize: 16 }}>
          {displayText}
          <span
            style={{
              borderRight: "2px solid #007AFF",
              marginLeft: 2,
              animation: "blink 1s infinite",
            }}
          />
        </span>
      </div>
    </div>
  );
};

// BotFather chat
const BotFatherChat: React.FC<{ messageIndex: number }> = ({ messageIndex }) => {
  const messages = [
    { type: "user", text: "/newbot" },
    { type: "bot", text: "Alright, a new bot. How are we going to call it? Please choose a name for your bot." },
    { type: "user", text: "My Awesome Bot" },
    { type: "bot", text: "Good. Now let's choose a username for your bot. It must end in `bot`." },
    { type: "user", text: "awesome777bot" },
    {
      type: "bot",
      text: "Done! Congratulations on your new bot.\n\nUse this token to access the HTTP API:\n8679875205:AAExample_Token_Here_xyz\n\nKeep your token secure!",
      highlight: true,
    },
  ];

  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
      {messages.slice(0, messageIndex + 1).map((msg, i) => (
        <div
          key={i}
          style={{
            alignSelf: msg.type === "user" ? "flex-end" : "flex-start",
            maxWidth: "80%",
          }}
        >
          <div
            style={{
              backgroundColor: msg.type === "user" ? "#007AFF" : "#2c2c2e",
              padding: "10px 14px",
              borderRadius: 18,
              border: msg.highlight ? "2px solid #f97316" : "none",
            }}
          >
            <span
              style={{
                color: "#fff",
                fontSize: 15,
                whiteSpace: "pre-wrap",
                lineHeight: 1.4,
              }}
            >
              {msg.text}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

// Copy animation overlay
const CopyOverlay: React.FC<{ opacity: number }> = ({ opacity }) => (
  <div
    style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "rgba(0,0,0,0.8)",
      padding: "20px 40px",
      borderRadius: 16,
      opacity,
    }}
  >
    <span style={{ color: "#fff", fontSize: 20, fontWeight: 600 }}>
      ✓ Token Copied!
    </span>
  </div>
);

// Website paste scene
const WebsitePasteScene: React.FC<{ progress: number; showSuccess: boolean }> = ({
  progress,
  showSuccess,
}) => {
  const token = "8679875205:AAExample_Token_Here_xyz";
  const visibleChars = Math.floor(progress * token.length);
  const displayToken = token.slice(0, visibleChars);

  return (
    <div
      style={{
        backgroundColor: "#0a0a0b",
        height: "100%",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "#1a1a1b",
          borderRadius: 16,
          padding: 24,
          border: "1px solid #333",
        }}
      >
        <h2 style={{ color: "#fff", fontSize: 22, marginBottom: 8 }}>
          Connect your Telegram Bot
        </h2>
        <p style={{ color: "#888", fontSize: 14, marginBottom: 20 }}>
          Paste the token below
        </p>
        <div
          style={{
            backgroundColor: "#0e0e10",
            border: showSuccess ? "2px solid #22c55e" : "1px solid #444",
            borderRadius: 10,
            padding: "14px 16px",
            marginBottom: 16,
          }}
        >
          <span style={{ color: "#fff", fontSize: 15, fontFamily: "monospace" }}>
            {displayToken || "Paste BotFather message here..."}
          </span>
        </div>
        {showSuccess && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#22c55e" }}>✓</span>
            <span style={{ color: "#22c55e", fontSize: 14 }}>Valid bot token</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Main component
export const BotTokenVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene timings (in frames)
  const scenes = {
    searchStart: 0,
    searchEnd: 90,
    chatStart: 120,
    chatMessage1: 150,
    chatMessage2: 210,
    chatMessage3: 270,
    chatMessage4: 330,
    chatMessage5: 390,
    chatMessage6: 450,
    copyStart: 510,
    copyEnd: 570,
    transitionStart: 600,
    pasteStart: 660,
    pasteEnd: 780,
    successStart: 810,
    end: 900,
  };

  // Calculate current message index
  let messageIndex = -1;
  if (frame >= scenes.chatMessage1) messageIndex = 0;
  if (frame >= scenes.chatMessage2) messageIndex = 1;
  if (frame >= scenes.chatMessage3) messageIndex = 2;
  if (frame >= scenes.chatMessage4) messageIndex = 3;
  if (frame >= scenes.chatMessage5) messageIndex = 4;
  if (frame >= scenes.chatMessage6) messageIndex = 5;

  // Search progress
  const searchProgress = interpolate(
    frame,
    [scenes.searchStart, scenes.searchEnd],
    [0, 1],
    { extrapolateRight: "clamp" }
  );

  // Copy overlay
  const copyOpacity = interpolate(
    frame,
    [scenes.copyStart, scenes.copyStart + 15, scenes.copyEnd - 15, scenes.copyEnd],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Transition between phone and website
  const transitionProgress = interpolate(
    frame,
    [scenes.transitionStart, scenes.pasteStart],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Paste progress
  const pasteProgress = interpolate(
    frame,
    [scenes.pasteStart, scenes.pasteEnd],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const showSuccess = frame >= scenes.successStart;

  // Phone scale and position during transition
  const phoneScale = interpolate(transitionProgress, [0, 1], [1, 0.5]);
  const phoneX = interpolate(transitionProgress, [0, 1], [0, -200]);
  const websiteOpacity = interpolate(transitionProgress, [0.5, 1], [0, 1], {
    extrapolateLeft: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Instruction text at top */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <span
          style={{
            color: "#f97316",
            fontSize: 28,
            fontWeight: 700,
          }}
        >
          {frame < scenes.transitionStart
            ? "Step 1: Create Bot with @BotFather"
            : "Step 2: Paste Token on Website"}
        </span>
      </div>

      {/* Phone mockup */}
      <div
        style={{
          transform: `scale(${phoneScale}) translateX(${phoneX}px)`,
          position: "relative",
        }}
      >
        <PhoneMockup>
          {frame < scenes.chatStart ? (
            <>
              <TelegramHeader title="Search" />
              <SearchScene searchText="BotFather" progress={searchProgress} />
            </>
          ) : (
            <>
              <TelegramHeader title="BotFather" />
              <BotFatherChat messageIndex={messageIndex} />
            </>
          )}
          <CopyOverlay opacity={copyOpacity} />
        </PhoneMockup>
      </div>

      {/* Website mockup */}
      {transitionProgress > 0 && (
        <div
          style={{
            position: "absolute",
            right: 100,
            width: 400,
            height: 600,
            opacity: websiteOpacity,
            borderRadius: 20,
            overflow: "hidden",
            border: "1px solid #333",
          }}
        >
          <WebsitePasteScene progress={pasteProgress} showSuccess={showSuccess} />
        </div>
      )}

      {/* Arrow animation during transition */}
      {transitionProgress > 0.3 && transitionProgress < 0.8 && (
        <div
          style={{
            position: "absolute",
            fontSize: 60,
            color: "#f97316",
            opacity: interpolate(transitionProgress, [0.3, 0.5, 0.7, 0.8], [0, 1, 1, 0]),
          }}
        >
          →
        </div>
      )}
    </AbsoluteFill>
  );
};
