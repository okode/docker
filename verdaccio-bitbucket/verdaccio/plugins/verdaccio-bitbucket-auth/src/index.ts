import {
  IPluginAuth,
  Callback,
  Logger,
  RemoteUser,
  AllowAccess,
  PackageAccess,
  AuthAccessCallback,
} from "@verdaccio/types";
import { Bitbucket } from "./models/bitbucket";

class AuthPlugin implements IPluginAuth<any> {
  private allow: { [w: string]: string[] } = {};
  private logger: Logger;

  constructor(config: any, options: any) {
    this.allow = parseAllow(config.allow);
    this.logger = options.logger;
  }

  async authenticate(username: string, password: string, cb: Callback): Promise<void> {
    this.logger.info(`[verdaccio-bitbucket-auth] Logging in with ${username}`);

    const bitbucket = new Bitbucket(username, password);

    try {
      const privileges = await bitbucket.getUserPrivileges();

      const workspaces = Object.keys(privileges.workspaces).filter((workspace) => {
        if (this.allow[workspace] === undefined) return false;
        if (!this.allow[workspace].length) return true;

        return this.allow[workspace].includes(privileges.workspaces[workspace]);
      }, this);

      if (workspaces.length === 0) {
        this.logger.warn(`[verdaccio-bitbucket-auth] No workspaces found for user ${username}`);
      }

      return cb(null, workspaces);
    } catch (err: any) {
      this.logger.info(`[verdaccio-bitbucket-auth] Authentication privileges error: ${err.message}`);
      return cb(err);
    }
  }

  allow_access(user: RemoteUser, pkg: AllowAccess & PackageAccess, cb: AuthAccessCallback): void {
    if (!user || !user.name) return cb(null, false);

    const allowedWorkspaces = Object.keys(this.allow);
    const userWorkspaces = user.groups.filter((group) => allowedWorkspaces.includes(group));

    if (userWorkspaces.length <= 0) return cb(null, false);

    return cb(null, true);
  }

  allow_publish(user: RemoteUser, pkg: AllowAccess & PackageAccess, cb: AuthAccessCallback): void {
    if (!user || !user.name) return cb(null, false);

    const allowedWorkspaces = Object.keys(this.allow);
    const userWorkspaces = user.groups.filter((group) => allowedWorkspaces.includes(group));

    if (userWorkspaces.some((workspace) => this.allow[workspace].includes("owner"))) return cb(null, true);

    return cb(null, false);
  }

  allow_unpublish?(user: RemoteUser, pkg: AllowAccess & PackageAccess, cb: AuthAccessCallback): void {
    if (!user || !user.name) return cb(null, false);

    const allowedWorkspaces = Object.keys(this.allow);
    const userWorkspaces = user.groups.filter((group) => allowedWorkspaces.includes(group));

    if (userWorkspaces.some((workspace) => this.allow[workspace].includes("owner"))) return cb(null, true);

    return cb(null, false);
  }
}

function parseAllow(allow: string) {
  const result: any = {};

  allow.split(/\s*,\s*/).forEach((team) => {
    const newTeam = team.trim().match(/^(.*?)(\((.*?)\))?$/);
    if (!newTeam) return;

    result[newTeam[1]] = newTeam[3] ? newTeam[3].split("|") : [];
  });

  return result;
}

export default AuthPlugin;
