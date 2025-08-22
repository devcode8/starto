import { NextRequest, NextResponse } from 'next/server';
import { saveSession, loadSession, generateSessionId, cleanupOldSessions } from '@/lib/session-storage';

export async function POST(request: NextRequest) {
  try {
    const { action, sessionId, data } = await request.json();
    
    if (action === 'save') {
      if (!sessionId || !data) {
        return NextResponse.json({ error: 'Session ID and data are required' }, { status: 400 });
      }
      
      saveSession(sessionId, data);
      return NextResponse.json({ success: true, sessionId });
    }
    
    if (action === 'load') {
      if (!sessionId) {
        return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
      }
      
      const sessionData = loadSession(sessionId);
      if (!sessionData) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
      }
      
      return NextResponse.json({ data: sessionData });
    }
    
    if (action === 'create') {
      const newSessionId = generateSessionId();
      return NextResponse.json({ sessionId: newSessionId });
    }
    
    if (action === 'cleanup') {
      cleanupOldSessions();
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Session API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}