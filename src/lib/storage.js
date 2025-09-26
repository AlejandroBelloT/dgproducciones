// Server-side JSON storage utilities for simple persistence.
// Note: For production, replace with a real database. This is file-based.

import { promises as fs } from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');

async function ensureDir() {
    try {
        await fs.mkdir(dataDir, { recursive: true });
    } catch { }
}

async function ensureFile(filePath, defaultContent = '[]') {
    try {
        await fs.access(filePath);
    } catch {
        await fs.writeFile(filePath, defaultContent);
    }
}

export async function readJson(fileName) {
    await ensureDir();
    const filePath = path.join(dataDir, fileName);
    await ensureFile(filePath);
    const raw = await fs.readFile(filePath, 'utf8');
    try {
        return JSON.parse(raw || '[]');
    } catch {
        return [];
    }
}

export async function writeJson(fileName, data) {
    await ensureDir();
    const filePath = path.join(dataDir, fileName);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

export function slugify(str) {
    return String(str)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
}
