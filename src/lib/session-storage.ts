import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const SESSIONS_DIR = join(process.cwd(), 'tmp', 'sessions');

// Ensure sessions directory exists
if (!existsSync(SESSIONS_DIR)) {
  mkdirSync(SESSIONS_DIR, { recursive: true });
}

export interface SessionData {
  sessionId: string;
  conversationContext: any;
  messages: any[];
  lastUpdated: Date;
}

export function saveSession(sessionId: string, data: Omit<SessionData, 'sessionId'>): void {
  try {
    const sessionPath = join(SESSIONS_DIR, `${sessionId}.json`);
    const sessionData: SessionData = {
      sessionId,
      ...data,
      lastUpdated: new Date()
    };
    
    writeFileSync(sessionPath, JSON.stringify(sessionData, null, 2));
  } catch (error) {
    console.error('Failed to save session:', error);
  }
}

export function loadSession(sessionId: string): SessionData | null {
  try {
    const sessionPath = join(SESSIONS_DIR, `${sessionId}.json`);
    
    if (!existsSync(sessionPath)) {
      return null;
    }
    
    const data = readFileSync(sessionPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load session:', error);
    return null;
  }
}

export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
}

export function cleanupOldSessions(maxAgeHours = 24): void {
  try {
    const fs = require('fs');
    const files = fs.readdirSync(SESSIONS_DIR);
    const cutoffTime = new Date(Date.now() - maxAgeHours * 60 * 60 * 1000);
    
    files.forEach((file: string) => {
      if (file.endsWith('.json')) {
        const filePath = join(SESSIONS_DIR, file);
        const stats = fs.statSync(filePath);
        
        if (stats.mtime < cutoffTime) {
          fs.unlinkSync(filePath);
        }
      }
    });
  } catch (error) {
    console.error('Failed to cleanup old sessions:', error);
  }
}