export interface SessionStore {
  save(serverId: string, profileId: string, profileName: string, ip?: string): Promise<void>;

  get(serverId: string): Promise<Session | null>;
}

export interface Session {
  profileId: string;
  profileName: string;
  ip?: string;
  createdAt?: Date;
}
