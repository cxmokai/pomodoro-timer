import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAccountLinking } from '../contexts/AccountLinkingContext';
import {
  signInWithGoogle,
  signInWithGithub,
  linkGoogleAccount,
  linkGithubAccount,
  signOut,
  getProviderName,
  getLinkedProviders,
} from '../services/authService';
import type { Theme } from '../utils/themes';
import { LogIn, LogOut, Github, Plus } from './icons';
import { ConfirmModal } from './ConfirmModal';

interface AuthButtonProps {
  theme: Theme;
  currentTheme: string;
}

export function AuthButton({ theme, currentTheme }: AuthButtonProps) {
  const { user, loading } = useAuth();
  const { pendingLink, setPendingLink, completeLinking, clearPendingLink } = useAccountLinking();
  const [isSignOutConfirmOpen, setIsSignOutConfirmOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isLinkProviderModalOpen, setIsLinkProviderModalOpen] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);

  const linkedProviders = user ? getLinkedProviders(user) : [];

  // Handle pending link when user becomes available
  useEffect(() => {
    if (pendingLink && user) {
      completeLinking(user).then((result) => {
        if (result.success) {
          console.log('[Auth] Account linked successfully');
          clearPendingLink();
          setIsLinkModalOpen(false);
        } else {
          setLinkError(result.error || 'Failed to link account');
        }
      });
    }
  }, [user, pendingLink, completeLinking, clearPendingLink]);

  const handleSignOutClick = () => {
    setIsSignOutConfirmOpen(true);
  };

  const handleSignOutConfirm = () => {
    setIsSignOutConfirmOpen(false);
    signOut();
  };

  const handleSignOutCancel = () => {
    setIsSignOutConfirmOpen(false);
  };

  const handleSignInClick = () => {
    setIsSignInModalOpen(true);
  };

  const handleLinkProviderClick = () => {
    setIsLinkProviderModalOpen(true);
    setLinkError(null);
  };

  const handleGoogleSignIn = async () => {
    setIsSignInModalOpen(false);
    const result = await signInWithGoogle();
    if (result.type === 'link-required') {
      setPendingLink(result.pendingLink);
      setIsLinkModalOpen(true);
    }
  };

  const handleGithubSignIn = async () => {
    setIsSignInModalOpen(false);
    const result = await signInWithGithub();
    if (result.type === 'link-required') {
      setPendingLink(result.pendingLink);
      setIsLinkModalOpen(true);
    }
  };

  const handleLinkWithExistingProvider = async () => {
    if (!pendingLink) return;

    const existingProvider = pendingLink.existingProvider;
    const result =
      existingProvider === 'google.com' ? await signInWithGoogle() : await signInWithGithub();

    if (result.type === 'success') {
      // The useEffect will handle the linking once user state updates
    } else {
      console.error('[Auth] Failed to sign in with existing provider');
    }
  };

  const handleLinkGoogle = async () => {
    if (!user) return;
    setLinkError(null);
    const result = await linkGoogleAccount(user);
    if (result.type === 'success') {
      setIsLinkProviderModalOpen(false);
      console.log('[Auth] Google account linked successfully');
    } else if (result.type === 'error') {
      setLinkError(result.message);
    }
  };

  const handleLinkGithub = async () => {
    if (!user) return;
    setLinkError(null);
    const result = await linkGithubAccount(user);
    if (result.type === 'success') {
      setIsLinkProviderModalOpen(false);
      console.log('[Auth] GitHub account linked successfully');
    } else if (result.type === 'error') {
      setLinkError(result.message);
    }
  };

  const handleLinkModalCancel = () => {
    setIsLinkModalOpen(false);
    clearPendingLink();
  };

  const handleLinkProviderModalCancel = () => {
    setIsLinkProviderModalOpen(false);
    setLinkError(null);
  };

  const handleSignInModalCancel = () => {
    setIsSignInModalOpen(false);
  };

  if (loading) {
    return (
      <button
        disabled
        className={`brutal-btn text-sm px-3 py-2 h-10 flex items-center gap-2 cursor-not-allowed opacity-50 no-select`}
        style={{
          background: theme.surfaceHighlight
            .replace('bg-[', '')
            .replace(']', ''),
          color: theme.text.replace('text-[', '').replace(']', ''),
        }}
      >
        <span>...</span>
      </button>
    );
  }

  if (user) {
    const hasGoogle = linkedProviders.includes('google.com');
    const hasGithub = linkedProviders.includes('github.com');
    const canLinkMore = !hasGoogle || !hasGithub;

    return (
      <>
        <div className="flex items-center gap-2">
          {canLinkMore && (
            <button
              onClick={handleLinkProviderClick}
              className={`brutal-btn text-sm px-3 py-2 h-10 flex items-center justify-center cursor-pointer no-select`}
              style={{
                background: theme.surfaceHighlight
                  .replace('bg-[', '')
                  .replace(']', ''),
                color: theme.text.replace('text-[', '').replace(']', ''),
              }}
              title="Link another account"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={handleSignOutClick}
            className={`brutal-btn text-sm px-3 py-2 h-10 flex items-center justify-center cursor-pointer no-select`}
            style={{
              background: theme.surfaceHighlight
                .replace('bg-[', '')
                .replace(']', ''),
              color: theme.text.replace('text-[', '').replace(']', ''),
            }}
            title={`Sign out (${user.email})`}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
        <ConfirmModal
          isOpen={isSignOutConfirmOpen}
          title="SIGN OUT?"
          message="Are you sure you want to sign out? Your local data will still be available."
          confirmText="SIGN OUT"
          cancelText="CANCEL"
          onConfirm={handleSignOutConfirm}
          onCancel={handleSignOutCancel}
          currentTheme={currentTheme}
        />
        <ConfirmModal
          isOpen={isLinkProviderModalOpen}
          title="LINK ACCOUNT"
          message={linkError || 'Connect another sign-in method to your account.'}
          confirmText=""
          cancelText="CANCEL"
          onConfirm={() => {}}
          onCancel={handleLinkProviderModalCancel}
          currentTheme={currentTheme}
          customActions={
            <div className="flex flex-col gap-3 w-full">
              {!hasGoogle && (
                <button
                  onClick={handleLinkGoogle}
                  className="brutal-btn px-4 py-3 cursor-pointer no-select flex items-center justify-center gap-2"
                  style={{
                    background: theme.buttonPrimary
                      .split(' ')
                      .find((c) => c.startsWith('bg-['))
                      ?.replace('bg-[', '')
                      .replace(']', '') || theme.accent,
                    color: theme.buttonPrimary.includes('text-[')
                      ? theme.buttonPrimary
                          .split(' ')
                          .find((c) => c.startsWith('text-['))
                          ?.replace('text-[', '')
                          .replace(']', '') || '#ffffff'
                      : '#ffffff',
                  }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Link Google Account
                </button>
              )}
              {!hasGithub && (
                <button
                  onClick={handleLinkGithub}
                  className="brutal-btn px-4 py-3 cursor-pointer no-select flex items-center justify-center gap-2"
                  style={{
                    background: theme.surfaceHighlight
                      .replace('bg-[', '')
                      .replace(']', ''),
                    color: theme.text.replace('text-[', '').replace(']', ''),
                    border: '2px solid #333',
                  }}
                >
                  <Github className="w-5 h-5" />
                  Link GitHub Account
                </button>
              )}
            </div>
          }
        />
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleSignInClick}
        className={`brutal-btn text-sm px-3 py-2 h-10 flex items-center justify-center cursor-pointer no-select`}
        style={{
          background: theme.surfaceHighlight.replace('bg-[', '').replace(']', ''),
          color: theme.text.replace('text-[', '').replace(']', ''),
        }}
        title="Sign in to sync data across devices"
      >
        <LogIn className="w-4 h-4" />
      </button>
      <ConfirmModal
        isOpen={isSignInModalOpen}
        title="SIGN IN"
        message="Choose a sign-in method to sync your data across devices."
        confirmText=""
        cancelText="CANCEL"
        onConfirm={() => {}}
        onCancel={handleSignInModalCancel}
        currentTheme={currentTheme}
        customActions={
          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={handleGoogleSignIn}
              className="brutal-btn px-4 py-3 cursor-pointer no-select flex items-center justify-center gap-2"
              style={{
                background: theme.buttonPrimary
                  .split(' ')
                  .find((c) => c.startsWith('bg-['))
                  ?.replace('bg-[', '')
                  .replace(']', '') || theme.accent,
                color: theme.buttonPrimary.includes('text-[')
                  ? theme.buttonPrimary
                      .split(' ')
                      .find((c) => c.startsWith('text-['))
                      ?.replace('text-[', '')
                      .replace(']', '') || '#ffffff'
                  : '#ffffff',
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
            <button
              onClick={handleGithubSignIn}
              className="brutal-btn px-4 py-3 cursor-pointer no-select flex items-center justify-center gap-2"
              style={{
                background: theme.surfaceHighlight
                  .replace('bg-[', '')
                  .replace(']', ''),
                color: theme.text.replace('text-[', '').replace(']', ''),
                border: '2px solid #333',
              }}
            >
              <Github className="w-5 h-5" />
              Continue with GitHub
            </button>
          </div>
        }
      />
      <ConfirmModal
        isOpen={isLinkModalOpen}
        title="LINK ACCOUNTS"
        message={`Please sign in with ${getProviderName(pendingLink?.existingProvider || '')} to link your ${getProviderName(pendingLink?.attemptedProvider || '')} account.`}
        confirmText={`Sign in with ${getProviderName(pendingLink?.existingProvider || '')}`}
        cancelText="CANCEL"
        onConfirm={handleLinkWithExistingProvider}
        onCancel={handleLinkModalCancel}
        currentTheme={currentTheme}
      />
    </>
  );
}
