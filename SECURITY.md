# Security Policy for MaycoleTechnologies™

## Code Privacy & Protection

This repository contains proprietary code for MaycoleTechnologies™. All code is protected and should remain private.

### Environment Variables

**CRITICAL:** Never commit `.env` or `.env.local` files to version control.

1. Create `.env.local` from `.env.example`:

   ```bash
   cp .env.example .env.local
   ```

2. Add your actual secrets to `.env.local` (not tracked by Git)

3. All environment variables are properly ignored via `.gitignore`

### API Keys & Secrets

The following should NEVER be committed:

- SendGrid API keys
- Mailchimp API keys
- Sentry DSN values
- Database credentials
- Third-party service tokens

These are all safely accessed via environment variables with `.env.local` protection.

### Sensitive Data Handling

- **Authentication**: Handled securely via auth.ts with token-based sessions
- **Email**: Sent through SendGrid API (keys in environment only)
- **Analytics**: Google Analytics tracking ID in environment variables
- **Error Tracking**: Sentry DSN in environment variables

### Configuration Security

The `src/lib/config.ts` file:

- Uses environment variables for all sensitive data
- Provides safe fallback values
- Never logs sensitive information
- Validates environment variable access

### Code Review Guidelines

Before committing:

1. Ensure no API keys are hardcoded
2. Check that all secrets use environment variables
3. Verify `.gitignore` is protecting `.env*` files
4. Never commit authentication tokens or credentials

### Deployment Security

For production deployment:

1. Set environment variables in your hosting platform (Vercel, Azure, Netlify)
2. Use the platform's secrets management system
3. Never store secrets in repository code
4. Rotate API keys regularly

### Reporting Security Issues

If you discover a security vulnerability:

1. DO NOT post it publicly
2. Contact: security@maycoletechnologies.com
3. Include detailed description and reproduction steps
4. Allow reasonable time for patching before disclosure

### Compliance

This codebase handles:

- User authentication data (secure session tokens)
- Email addresses (for contact and newsletter)
- Complies with GDPR, CCPA privacy standards

See `PrivacyPolicy.tsx` and `TermsOfService.tsx` for full legal terms.

## Version Control Security

- Repository is set to **PRIVATE**
- Only authorized team members have access
- Branch protection enabled on main
- All commits are tracked and audited
- `.gitignore` prevents accidental commits of sensitive files

---

Last Updated: December 2024
