import { Router } from 'express';

export class Route {
  private static v1 = 'v1';
  public route;

  constructor(
    private app: Router,
    private endpoint: string,
    private version?: string
  ) {
    if (version === undefined) {
      this.version = Route.v1;
    }
    this.route = Router();
    this.registerEndpoint();
  }

  private registerEndpoint = (): void => {
    this.app.use(`/${this.version}/${this.endpoint}`, this.route);
  };
}
