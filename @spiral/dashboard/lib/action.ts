//  basic function decorator that passes whatever params are defined but INITIALLY passes an extra param with the val set to null
import {auth, Session, SessionUser} from "@/auth";

interface VerifiedSessionUser extends SessionUser {
  email: string,
  id: string
}

export interface VerifiedSession extends Session {
  user: VerifiedSessionUser
}

export function actionWrapper<T>(
    func: (session: VerifiedSession, ...args: any[]) => Promise<T>
): (...args: any[]) => Promise<T> {

  return async function (...args: any[]) {
    const session = await auth();

    if (session == null) {
      throw new Error("Client authenticated actions require login!");
    }

    const user = session.user;

    if (!user || !user.email || !user.id) {
      throw new Error("Unauthorized!");
    }

    return await func(session as VerifiedSession, ...args);
  }

}