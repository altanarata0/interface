import { readFileSync } from 'fs';
import { join } from 'path';

export default async function handler(req, res) {
  try {
    // Import the server dynamically to avoid build-time issues
    const serverPath = join(process.cwd(), '.output/server/index.mjs');
    const { default: createServer } = await import(serverPath);
    
    // Create and run the server
    const server = createServer();
    return await server(req, res);
  } catch (error) {
    console.error('Server error:', error);
    
    // Fallback to serving static files if server fails
    try {
      const indexPath = join(process.cwd(), '.output/public/index.html');
      const html = readFileSync(indexPath, 'utf-8');
      res.setHeader('Content-Type', 'text/html');
      return res.send(html);
    } catch (fallbackError) {
      console.error('Fallback error:', fallbackError);
      return res.status(500).json({ 
        error: 'Server Error', 
        message: error.message 
      });
    }
  }
}
