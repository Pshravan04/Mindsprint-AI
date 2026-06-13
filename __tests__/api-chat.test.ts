import { POST } from '@/app/api/chat/route';
import { NextRequest } from 'next/server';

// Mock gemini client
jest.mock('@/lib/gemini', () => ({
  geminiClient: {
    models: {
      generateContent: jest.fn().mockResolvedValue({
        text: 'Mock AI Response'
      })
    }
  }
}));

describe('Chat API', () => {
  beforeEach(() => {
    process.env.GEMINI_API_KEY = 'test_key';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return error if no messages provided', async () => {
    const req = new NextRequest('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({})
    });
    
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('should return 400 for too many messages', async () => {
    const messages = Array(51).fill({ role: 'user', content: 'test' });
    const req = new NextRequest('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages })
    });
    
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('should return 500 if GEMINI_API_KEY is missing', async () => {
    delete process.env.GEMINI_API_KEY;
    const req = new NextRequest('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: [{ role: 'user', content: 'test' }] })
    });
    
    const res = await POST(req);
    expect(res.status).toBe(500);
  });

  it('should successfully process a valid request', async () => {
    const req = new NextRequest('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: [{ role: 'user', content: 'Hello' }] })
    });
    
    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.text).toBe('Mock AI Response');
  });
});
