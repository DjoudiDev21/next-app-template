const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export function requireClerkPublishableKey() {
  if (!publishableKey) {
    throw new Error(
      'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is required. Clerk keyless mode is disabled.',
    );
  }

  return publishableKey;
}
