import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Reaction } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRoomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 3; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  code += '-';
  for (let i = 0; i < 3; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'Truth Romantis': 'bg-rose-100 text-rose-700 border-rose-300',
    'Challenge Manis': 'bg-lavender-100 text-lavender-700 border-lavender-300',
    'Memory LDR': 'bg-cream-200 text-amber-800 border-amber-300',
    'This or That': 'bg-blue-50 text-blue-700 border-blue-300',
    'Future Plan': 'bg-emerald-50 text-emerald-700 border-emerald-300',
    'Deep Talk': 'bg-purple-50 text-purple-700 border-purple-300',
    'Fun Dare': 'bg-orange-50 text-orange-700 border-orange-300',
  };
  return colors[category] || 'bg-gray-100 text-gray-700 border-gray-300';
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    'Truth Romantis': '💕',
    'Challenge Manis': '🍬',
    'Memory LDR': '📸',
    'This or That': '🤔',
    'Future Plan': '✨',
    'Deep Talk': '🌙',
    'Fun Dare': '🎲',
  };
  return icons[category] || '🃏';
}

export function getReactionEmoji(reaction: string): string {
  const emojis: Record<string, string> = {
    'Romantis': '❤️',
    'Lucu': '😂',
    'Kangen': '🥺',
    'Berani': '🔥',
  };
  return emojis[reaction] || '👍';
}

export function getReactionLabel(reaction: string): string {
  const labels: Record<string, string> = {
    'Romantis': 'Romantis',
    'Lucu': 'Lucu',
    'Kangen': 'Bikin kangen',
    'Berani': 'Berani',
  };
  return labels[reaction] || reaction;
}

export function calculateLoveMeter(reactions: Reaction[]): number {
  const total = reactions.length;
  if (total === 0) return 0;
  const maxPossible = total * 4;
  const score = reactions.reduce((acc, r) => {
    const values: Record<string, number> = {
      'Romantis': 4,
      'Lucu': 3,
      'Kangen': 4,
      'Berani': 2,
    };
    return acc + (values[r.reaction] || 1);
  }, 0);
  return Math.min(Math.round((score / maxPossible) * 100), 100);
}
