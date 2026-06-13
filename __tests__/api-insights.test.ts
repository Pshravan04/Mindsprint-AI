import { POST } from '@/app/api/insights/route';
import { NextRequest } from 'next/server';

jest.mock('@/lib/gemini', () => ({
  geminiClient: {
    models: {
      generateContent: jest.fn().mockResolvedValue({
        text: JSON.stringify({
          hidden_triggers: ['test trigger'],
          emotional_pattern: 'test pattern',
          coping_strategy: 'test strategy'
        })
      })
    }
  }
}));

describe('Insights API', () => {
  beforeEach(() => {
    process.env.GEMINI_API_KEY = 'test_key';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return default mock if no journal entries provided', async () => {
    const req = new NextRequest('http://localhost/api/insights', {
      method: 'POST',
      body: JSON.stringify({})
    });
    
    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.hidden_triggers).toBeDefined();
  });

  it('should process valid journal entries and return insights', async () => {
    const req = new NextRequest('http://localhost/api/insights', {
      method: 'POST',
      body: JSON.stringify({ journalEntries: ['I feel stressed today.'] })
    });
    
    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.hidden_triggers[0]).toBe('test trigger');
  });

  it('should return 400 for too many entries', async () => {
    const entries = Array(31).fill('test entry');
    const req = new NextRequest('http://localhost/api/insights', {
      method: 'POST',
      body: JSON.stringify({ journalEntries: entries })
    });
    
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
