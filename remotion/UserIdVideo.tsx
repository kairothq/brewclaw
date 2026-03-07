"use client";

import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
} from "remotion";

// Configuration
const FAKE_USER_ID = "528934761";
const FAKE_USERNAME = "alexsmith";
const FAKE_FIRST_NAME = "Alex";
const FAKE_LAST_NAME = "Smith";

// Telegram dark theme colors
const colors = {
  background: "#17212b",
  headerBg: "#232e3c",
  bubbleIncoming: "#182533",
  bubbleOutgoing: "#2b5278",
  textPrimary: "#ffffff",
  textSecondary: "#6c7883",
  accent: "#3390ec",
  link: "#6ab3f3",
  inputBg: "#242f3d",
};

// Telegram Header
const TelegramHeader: React.FC<{ botName: string }> = ({ botName }) => (
  <div
    style={{
      height: 56,
      backgroundColor: colors.headerBg,
      display: "flex",
      alignItems: "center",
      padding: "0 12px",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
    }}
  >
    {/* Back arrow */}
    <div style={{ padding: "8px 12px 8px 0" }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill={colors.accent}>
        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
      </svg>
    </div>

    {/* Bot avatar */}
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#5eb5f7",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
      }}
    >
      <span style={{ color: "#fff", fontSize: 18, fontWeight: 600 }}>U</span>
    </div>

    {/* Bot info */}
    <div style={{ flex: 1 }}>
      <div style={{ color: colors.textPrimary, fontSize: 16, fontWeight: 500 }}>
        {botName}
      </div>
      <div style={{ color: colors.textSecondary, fontSize: 13 }}>bot</div>
    </div>

    {/* Menu icons */}
    <div style={{ display: "flex", gap: 16 }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill={colors.accent}>
        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
      </svg>
      <svg width="24" height="24" viewBox="0 0 24 24" fill={colors.accent}>
        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
      </svg>
    </div>
  </div>
);

// Message bubble (outgoing - user)
const OutgoingMessage: React.FC<{ text: string; time: string; opacity?: number }> = ({
  text,
  time,
  opacity = 1,
}) => (
  <div
    style={{
      alignSelf: "flex-end",
      maxWidth: "75%",
      opacity,
      transform: `translateY(${(1 - opacity) * 10}px)`,
    }}
  >
    <div
      style={{
        backgroundColor: colors.bubbleOutgoing,
        padding: "8px 12px",
        borderRadius: "12px 12px 4px 12px",
        position: "relative",
      }}
    >
      <span style={{ color: colors.textPrimary, fontSize: 15 }}>{text}</span>
      <span
        style={{
          color: colors.textSecondary,
          fontSize: 11,
          marginLeft: 8,
          float: "right",
          marginTop: 4,
        }}
      >
        {time}
        <span style={{ marginLeft: 4, color: colors.accent }}>✓✓</span>
      </span>
    </div>
  </div>
);

// Message bubble (incoming - bot response)
const IncomingMessage: React.FC<{
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  time: string;
  opacity?: number;
  highlightId?: boolean;
}> = ({ userId, username, firstName, lastName, time, opacity = 1, highlightId = false }) => (
  <div
    style={{
      alignSelf: "flex-start",
      maxWidth: "80%",
      opacity,
      transform: `translateY(${(1 - opacity) * 10}px)`,
    }}
  >
    <div
      style={{
        backgroundColor: colors.bubbleIncoming,
        padding: "8px 12px",
        borderRadius: "12px 12px 12px 4px",
        border: highlightId ? "2px solid #f97316" : "none",
      }}
    >
      <div style={{ color: colors.link, fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
        @{username}
      </div>
      <div style={{ color: colors.textPrimary, fontSize: 15, lineHeight: 1.5 }}>
        <div>
          <span style={{ color: colors.textSecondary }}>Id: </span>
          <span
            style={{
              color: highlightId ? "#f97316" : colors.link,
              fontWeight: highlightId ? 700 : 400,
              fontSize: highlightId ? 16 : 15,
            }}
          >
            {userId}
          </span>
        </div>
        <div>
          <span style={{ color: colors.textSecondary }}>First: </span>
          <span>{firstName}</span>
        </div>
        <div>
          <span style={{ color: colors.textSecondary }}>Last: </span>
          <span>{lastName}</span>
        </div>
        <div>
          <span style={{ color: colors.textSecondary }}>Lang: </span>
          <span>en</span>
        </div>
      </div>
      <span
        style={{
          color: colors.textSecondary,
          fontSize: 11,
          float: "right",
          marginTop: 4,
        }}
      >
        {time}
      </span>
    </div>
  </div>
);

// Input bar
const InputBar: React.FC = () => (
  <div
    style={{
      height: 52,
      backgroundColor: colors.headerBg,
      display: "flex",
      alignItems: "center",
      padding: "0 8px",
      borderTop: "1px solid rgba(255,255,255,0.1)",
    }}
  >
    <div style={{ padding: 8 }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill={colors.accent}>
        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
      </svg>
    </div>
    <div
      style={{
        flex: 1,
        backgroundColor: colors.inputBg,
        borderRadius: 20,
        padding: "8px 16px",
        color: colors.textSecondary,
        fontSize: 15,
      }}
    >
      Write a message...
    </div>
    <div style={{ padding: 8 }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill={colors.accent}>
        <path d="M12 15c1.66 0 2.99-1.34 2.99-3L15 6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 15 6.7 12H5c0 3.42 2.72 6.23 6 6.72V22h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
      </svg>
    </div>
  </div>
);

// Copy indicator
const CopyIndicator: React.FC<{ opacity: number }> = ({ opacity }) => (
  <div
    style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "rgba(0,0,0,0.85)",
      padding: "16px 32px",
      borderRadius: 12,
      opacity,
      display: "flex",
      alignItems: "center",
      gap: 12,
    }}
  >
    <svg width="28" height="28" viewBox="0 0 24 24" fill="#22c55e">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
    <span style={{ color: "#fff", fontSize: 18, fontWeight: 600 }}>
      Copied to clipboard!
    </span>
  </div>
);

// Website paste scene (fills entire screen)
const WebsitePasteScene: React.FC<{
  progress: number;
  showSuccess: boolean;
  opacity: number;
}> = ({ progress, showSuccess, opacity }) => {
  const visibleChars = Math.floor(progress * FAKE_USER_ID.length);
  const displayId = FAKE_USER_ID.slice(0, visibleChars);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#0a0a0b",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 24,
        opacity,
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 600, marginBottom: 8 }}>
          Your Telegram User ID
        </h2>
        <p style={{ color: "#888", fontSize: 14 }}>
          Send /start to @userinfobot and paste the message
        </p>
      </div>

      {/* Input field */}
      <div
        style={{
          backgroundColor: "#1a1a1b",
          border: showSuccess ? "2px solid #22c55e" : "1px solid #444",
          borderRadius: 12,
          padding: "16px 18px",
          marginBottom: 16,
        }}
      >
        <span
          style={{
            color: displayId ? "#fff" : "#666",
            fontSize: 16,
            fontFamily: "monospace",
          }}
        >
          {displayId || "Paste @userinfobot message or ID here"}
          {!showSuccess && displayId && (
            <span
              style={{
                borderRight: "2px solid #f97316",
                marginLeft: 2,
                animation: "blink 1s infinite",
              }}
            />
          )}
        </span>
      </div>

      {/* Validation feedback */}
      {showSuccess && (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#22c55e">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
          <span style={{ color: "#22c55e", fontSize: 15, fontWeight: 500 }}>
            Valid user ID
          </span>
        </div>
      )}

      {/* Check button */}
      <div style={{ marginTop: 24 }}>
        <div
          style={{
            display: "inline-block",
            backgroundColor: showSuccess ? "#22c55e" : "#333",
            padding: "12px 32px",
            borderRadius: 8,
            color: "#fff",
            fontSize: 15,
            fontWeight: 500,
          }}
        >
          {showSuccess ? "Validated" : "Check"}
        </div>
      </div>
    </div>
  );
};

// Main component
export const UserIdVideo: React.FC = () => {
  const frame = useCurrentFrame();

  // Scene timings (total 600 frames at 30fps = 20 seconds)
  const scenes = {
    startCommandAppear: 30,
    responseStart: 90,
    highlightIdStart: 180,
    copyStart: 270,
    copyEnd: 330,
    transitionStart: 360,
    pasteStart: 420,
    pasteEnd: 510,
    successStart: 540,
    end: 600,
  };

  // Message appearances
  const startOpacity = interpolate(
    frame,
    [scenes.startCommandAppear, scenes.startCommandAppear + 15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const responseOpacity = interpolate(
    frame,
    [scenes.responseStart, scenes.responseStart + 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const highlightId = frame >= scenes.highlightIdStart && frame < scenes.transitionStart;

  // Copy overlay
  const copyOpacity = interpolate(
    frame,
    [scenes.copyStart, scenes.copyStart + 15, scenes.copyEnd - 15, scenes.copyEnd],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Scene transition
  const telegramOpacity = interpolate(
    frame,
    [scenes.transitionStart, scenes.transitionStart + 30],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const websiteOpacity = interpolate(
    frame,
    [scenes.transitionStart + 15, scenes.transitionStart + 45],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Paste animation
  const pasteProgress = interpolate(
    frame,
    [scenes.pasteStart, scenes.pasteEnd],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const showSuccess = frame >= scenes.successStart;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      {/* Telegram UI */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          opacity: telegramOpacity,
        }}
      >
        <TelegramHeader botName="User Info - Get ID - idbot" />

        {/* Chat area */}
        <div
          style={{
            flex: 1,
            padding: 12,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            justifyContent: "flex-end",
          }}
        >
          {/* Date separator */}
          <div
            style={{
              alignSelf: "center",
              backgroundColor: "rgba(0,0,0,0.3)",
              padding: "4px 12px",
              borderRadius: 12,
              marginBottom: 8,
            }}
          >
            <span style={{ color: colors.textSecondary, fontSize: 13 }}>Today</span>
          </div>

          {/* /start message */}
          <OutgoingMessage text="/start" time="4:22 PM" opacity={startOpacity} />

          {/* Bot response */}
          {frame >= scenes.responseStart && (
            <IncomingMessage
              userId={FAKE_USER_ID}
              username={FAKE_USERNAME}
              firstName={FAKE_FIRST_NAME}
              lastName={FAKE_LAST_NAME}
              time="4:22 PM"
              opacity={responseOpacity}
              highlightId={highlightId}
            />
          )}
        </div>

        <InputBar />

        {/* Copy indicator */}
        <CopyIndicator opacity={copyOpacity} />
      </div>

      {/* Website paste scene */}
      {frame >= scenes.transitionStart && (
        <WebsitePasteScene
          progress={pasteProgress}
          showSuccess={showSuccess}
          opacity={websiteOpacity}
        />
      )}
    </AbsoluteFill>
  );
};
