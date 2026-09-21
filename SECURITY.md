# Security Policy

Tab Saver is designed to keep session data on the user's device using the browser's `storage.local` API. It does not transmit browsing data, include analytics, or require credentials.

## Supported version

Security fixes are applied to the latest version on `main`.

## Reporting a vulnerability

Please use GitHub's private vulnerability reporting feature when available. Do not publish sensitive proof-of-concept data in a public issue.

## Security model

- Only `http` and `https` URLs are accepted into saved/imported sessions.
- Imported backups are capped at 5 MB and validated before persistence.
- Restored links come only from sanitized session records.
- The extension requests only `tabs` and `storage` permissions.
- Exported JSON can reveal browsing history. Store and share backups carefully.

Browser local storage is not an encrypted secret vault. Anyone with access to the browser profile may be able to read saved sessions.
