export interface BackendUserProfile {
  id: string;
  [key: string]: unknown;
}

export type BackendProfileState =
  | { status: 'loading'; profile: null; error: null }
  | { status: 'anonymous'; profile: null; error: null }
  | { status: 'provisioning'; profile: null; error: null }
  | { status: 'authenticated'; profile: BackendUserProfile; error: null }
  | { status: 'unauthorized'; profile: null; error: Error }
  | { status: 'error'; profile: null; error: Error };
