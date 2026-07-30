import "server-only";

import { auth } from "@clerk/nextjs/server";
import { AuthenticationRequiredError } from "../../domain/entities/authentication-required.error";
import type { ServerAuthRepository } from "../../domain/interfaces/server-auth.repository";

export class ClerkServerAuthRepository implements ServerAuthRepository {
  async getSession() {
    const { userId } = await auth();
    return userId ? { identityId: userId } : null;
  }

  async requireSession() {
    const session = await this.getSession();

    if (!session) {
      throw new AuthenticationRequiredError();
    }

    return session;
  }

  async getAccessToken() {
    const session = await auth();
    return session.getToken();
  }
}

export const serverAuthRepository: ServerAuthRepository =
  new ClerkServerAuthRepository();
