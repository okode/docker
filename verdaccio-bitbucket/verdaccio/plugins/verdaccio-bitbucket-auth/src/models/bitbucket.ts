import axios from "axios";

export type role = "owner" | "collaborator" | "member";

export class Bitbucket {
  private API_URL = "https://api.bitbucket.org";
  private API_VERSION = "2.0";
  private username: string;
  private password: string;

  constructor(username: string, app_password: string) {
    this.username = username;
    this.password = app_password;
  }

  async getUserWorkspaces(role: role) {
    const URL = `${this.API_URL}/${this.API_VERSION}/workspaces?role=${role}&pagelen=100`;
    const workspaces: any[] = [];

    const callApi = async (url: string) => {
      const response = await axios.get(url, {
        auth: {
          username: this.username,
          password: this.password,
        },
      });

      workspaces.push(...response.data.values.map((w: any) => w.slug));
      if (response.data?.next) return await callApi(response.data.next);
      return { role, workspaces };
    };

    return await callApi(URL);
  }

  async getUserPrivileges() {
    const values = await Promise.all([
      this.getUserWorkspaces("member"),
      this.getUserWorkspaces("collaborator"),
      this.getUserWorkspaces("owner"),
    ]);

    const result: { [w: string]: string } = {};

    values.forEach(({ role: role_1, workspaces }) => {
      Object.assign(result, ...workspaces.map((w_1: string) => ({ [w_1]: role_1 })));
    });

    return { workspaces: result };
  }
}
