import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
  confirmationUrl: string;
}

export function EmailTemplate({ firstName, confirmationUrl }: EmailTemplateProps) {
  return (
    <div style={{ fontFamily: 'sans-serif', lineHeight: 1.5, color: '#111' }}>
      <h2>Welcome to Finora, {firstName}!</h2>
      <p>Thank you for signing up. Click the button below to verify your email and activate your account:</p>
      <a 
        href={confirmationUrl} 
        style={{
          display: 'inline-block',
          background: '#111',
          color: '#fff',
          padding: '12px 20px',
          borderRadius: '6px',
          textDecoration: 'none',
          margin: '10px 0'
        }}
      >
        Verify Email
      </a>
      <p>If you didn't sign up, just ignore this email.</p>
    </div>
  );
}