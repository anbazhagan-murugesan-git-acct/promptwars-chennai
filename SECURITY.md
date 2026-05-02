# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability within AuraSpace, please report it responsibly:

1. **Do NOT** open a public GitHub issue.
2. Email security concerns to: security@auraspace.dev
3. Include a detailed description of the vulnerability.
4. Allow 48 hours for an initial response.

## Security Measures Implemented

- **Input Sanitization**: All user inputs are validated and sanitized server-side before processing.
- **Rate Limiting**: API endpoints implement in-memory rate limiting to prevent abuse.
- **CORS**: Strict Cross-Origin Resource Sharing headers on all API routes.
- **CSP**: Content Security Policy headers enforced via Next.js middleware.
- **HSTS**: HTTP Strict Transport Security enabled with a 1-year max-age.
- **Environment Variables**: All secrets are stored in environment variables, never in source code.
- **Dependency Auditing**: Regular `npm audit` checks integrated into CI pipeline.
