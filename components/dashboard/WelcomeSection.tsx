'use client';

import { useState, useEffect } from 'react';

export function WelcomeSection() {
  const [greeting, setGreeting] = useState('Good morning');
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    // Get current hour for greeting
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting('Good morning');
    } else if (hour >= 12 && hour < 18) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }

    // Get user name from localStorage with graceful fallback
    try {
      const instanceData = localStorage.getItem('brewclaw_instance');
      if (instanceData) {
        const instance = JSON.parse(instanceData);
        if (instance.name && typeof instance.name === 'string' && instance.name.trim()) {
          const nameParts = instance.name.trim().split(' ');
          setFirstName(nameParts[0]);
        } else if (instance.email && typeof instance.email === 'string') {
          // Fallback to email username if name is missing
          const emailName = instance.email.split('@')[0];
          setFirstName(emailName || 'there');
        } else {
          setFirstName('there');
        }
      } else {
        setFirstName('there');
      }
    } catch {
      setFirstName('there');
    }
  }, []);

  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-white">
        {greeting}, {firstName}
      </h1>
      <p className="text-zinc-400">
        Here&apos;s what&apos;s happening with your AI assistant
      </p>
    </div>
  );
}
