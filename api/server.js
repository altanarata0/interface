import { createServer } from '../.output/server/index.mjs';

export default async function handler(req, res) {
  const server = createServer();
  return server(req, res);
}
