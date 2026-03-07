"use client";

import { StepTelegram } from "@/components/onboard/step-telegram";

export default function TestTelegramPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            Test: Telegram Connection Step
          </h1>
          <p className="text-muted-foreground mt-2">
            This is a temporary test page. Remove after testing.
          </p>
        </div>

        <StepTelegram
          onContinue={(data) => {
            console.log("Continue with data:", data);
            alert(`Success!\n\nBot Token: ${data.botToken.slice(0, 20)}...\nUser ID: ${data.userId}`);
          }}
          onBack={() => {
            console.log("Back clicked");
            alert("Back button clicked");
          }}
        />
      </div>
    </div>
  );
}
