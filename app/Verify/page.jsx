'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { verifyOtpSchema } from '@/lib/utils/validation';
import { verifyOtp } from '@/lib/utils/auth-helpers';

export default function VerifyForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState(null);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { otp: '' },
  });

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('verificationEmail');
    if (!storedEmail) {
      router.push('/Signup');
      return;
    }

    const passwordResetFlag = sessionStorage.getItem('isPasswordReset');
    setIsPasswordReset(passwordResetFlag === 'true');
    setEmail(storedEmail);
  }, [router]);

  async function onSubmit(data) {
    if (!email) return;

    setIsLoading(true);
    setError(null);

    try {
      await verifyOtp(email, data.otp);
      sessionStorage.removeItem('verificationEmail');

      if (isPasswordReset) {
        router.push('/ResetPassword');
      } else {
        sessionStorage.removeItem('isPasswordReset');

        await fetch('/api/resend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'welcome',
            email: email,
            origin: window.location.origin,
          }),
        });

        router.push('/Login');
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred during verification'
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function resendOtp() {
    if (!email) return;

    setIsLoading(true);
    setError(null);

    try {
      await fetch('/api/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'verification',
          email,
          isPasswordReset: isPasswordReset,
        }),
      });

      setError('A new verification code has been sent to your email.');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to resend verification code'
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (!email) return null;

  return (
    <div
      style={{
        maxWidth: 400,
        margin: '60px auto',
        padding: 20,
        border: '1px solid #ddd',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      }}
    >
      {error && (
        <div
          style={{
            backgroundColor: error.includes('sent') ? '#e6ffed' : '#ffe6e6',
            color: error.includes('sent') ? '#0a7d25' : '#a40000',
            border: `1px solid ${
              error.includes('sent') ? '#b0e8b6' : '#f5b0b0'
            }`,
            padding: '10px',
            borderRadius: 6,
            marginBottom: 15,
          }}
        >
          {error}
        </div>
      )}

      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <p>
          We’ve sent a verification code to <strong>{email}</strong>
        </p>
        <p style={{ fontSize: 14, color: '#666' }}>
          {isPasswordReset
            ? 'Enter the code to continue with your password reset.'
            : 'Enter the code to verify your account.'}
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div style={{ marginBottom: 15 }}>
          <label
            htmlFor="otp"
            style={{
              display: 'block',
              marginBottom: 5,
              fontWeight: 'bold',
            }}
          >
            Verification Code
          </label>
          <input
            id="otp"
            name="otp"
            className='outline-0 shadow-sm focus:shadow-none focus:border-1 focus:border-[#209e2e]'
            placeholder="Enter 6-digit code"
            maxLength={6}
            {...form.register('otp')}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: 16,
              textAlign: 'center',
              letterSpacing: '4px',
              borderRadius: 6,
            }}
          />
          {form.formState.errors.otp && (
            <p style={{ color: 'red', fontSize: 13, marginTop: 5 }}>
              {form.formState.errors.otp.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#209e2e',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontSize: 16,
            cursor: 'pointer',
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          {isLoading
            ? 'Verifying...'
            : isPasswordReset
            ? 'Continue Password Reset'
            : 'Verify Email'}
        </button>
      </form>

      <div
        style={{
          textAlign: 'center',
          marginTop: 15,
          fontSize: 14,
          color: "#7a7e9a"
        }}
      >
        Didn’t receive the code?{' '}
        <button
          type="button"
          onClick={resendOtp}
          disabled={isLoading}
          style={{
            background: 'none',
            border: 'none',
            color: '#209e2e',
            textDecoration: 'underline',
            cursor: 'pointer',
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          Resend
        </button>
      </div>
    </div>
  );
}
