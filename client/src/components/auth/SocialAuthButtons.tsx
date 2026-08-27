import React from 'react';

interface SocialAuthButtonsProps {
  isLoading?: boolean;
}

export const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({ isLoading = false }) => {
  // Base backend API URL
  const backendBaseUrl = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

  const handleSocialAuth = (provider: 'google' | 'github' | 'linkedin') => {
    // Redirect directly to the backend OAuth initiation endpoint
    window.location.href = `${backendBaseUrl}/auth/${provider}`;
  };

  return (
    <div className="space-y-3 w-full">
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--border-color)]" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[var(--bg-surface)] px-3 text-[var(--text-muted)] font-semibold tracking-wider">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {/* Google Button */}
        <button
          type="button"
          disabled={isLoading}
          onClick={() => handleSocialAuth('google')}
          className="flex items-center justify-center py-2.5 px-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-black/5 dark:hover:bg-white/5 transition-all text-xs font-medium text-[var(--text-main)] shadow-xs hover:border-[var(--primary)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
          title="Continue with Google"
        >
          <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-1.9z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
            />
          </svg>
          <span>Google</span>
        </button>

        {/* GitHub Button */}
        <button
          type="button"
          disabled={isLoading}
          onClick={() => handleSocialAuth('github')}
          className="flex items-center justify-center py-2.5 px-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-black/5 dark:hover:bg-white/5 transition-all text-xs font-medium text-[var(--text-main)] shadow-xs hover:border-[var(--primary)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
          title="Continue with GitHub"
        >
          <svg className="w-4 h-4 mr-1.5 fill-current" viewBox="0 0 24 24">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
          <span>GitHub</span>
        </button>

        {/* LinkedIn Button */}
        <button
          type="button"
          disabled={isLoading}
          onClick={() => handleSocialAuth('linkedin')}
          className="flex items-center justify-center py-2.5 px-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-black/5 dark:hover:bg-white/5 transition-all text-xs font-medium text-[var(--text-main)] shadow-xs hover:border-[var(--primary)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
          title="Continue with LinkedIn"
        >
          <svg className="w-4 h-4 mr-1.5 fill-[#0A66C2]" viewBox="0 0 24 24">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.66 1.66 0 1 0 0 3.32 1.66 1.66 0 0 0 0-3.32z" />
          </svg>
          <span>LinkedIn</span>
        </button>
      </div>
    </div>
  );
};
