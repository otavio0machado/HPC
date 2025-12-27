
import { toast } from "sonner";

// Types
export interface UserLevel {
    level: number;
    currentXP: number;
    nextLevelXP: number; // XP needed for next level
    totalXP: number;
}

const LEVEL_BASE_XP = 1000;
const LEVEL_MULTIPLIER = 1.2;

export const gamificationService = {
    getLevelData(userId: string): UserLevel {
        const key = `hpc_gamification_${userId}`;
        const data = localStorage.getItem(key);
        if (data) {
            return JSON.parse(data);
        }
        return {
            level: 1,
            currentXP: 0,
            nextLevelXP: LEVEL_BASE_XP,
            totalXP: 0
        };
    },

    saveLevelData(userId: string, data: UserLevel) {
        const key = `hpc_gamification_${userId}`;
        localStorage.setItem(key, JSON.stringify(data));
        // Dispatch custom event for real-time UI updates
        window.dispatchEvent(new CustomEvent('xp-update', { detail: data }));
    },

    addXP(userId: string, amount: number, source: string) {
        const data = this.getLevelData(userId);
        let xp = data.currentXP + amount;
        let total = data.totalXP + amount;
        let level = data.level;
        let nextXP = data.nextLevelXP;

        let leveledUp = false;

        // Level Up Logic
        while (xp >= nextXP) {
            xp -= nextXP;
            level++;
            nextXP = Math.floor(nextXP * LEVEL_MULTIPLIER);
            leveledUp = true;
        }

        const newData = {
            level,
            currentXP: xp,
            nextLevelXP: nextXP,
            totalXP: total
        };

        this.saveLevelData(userId, newData);

        if (leveledUp) {
            this.triggerLevelUpEffect(level);
            toast.success(`LEVEL UP! Você alcançou o nível ${level}! 🚀`, {
                style: { background: '#22c55e', color: 'white', fontWeight: 'bold' }
            });
        } else {
            // Small toast for XP gain if significant
            if (amount >= 50) {
                toast.success(`+${amount} XP (${source})`, {
                    icon: '⭐'
                });
            }
        }

        return newData;
    },

    triggerLevelUpEffect(newLevel: number) {
        // We can dispatch an event that a global Confetti component listens to
        window.dispatchEvent(new CustomEvent('level-up', { detail: { level: newLevel } }));
    }
};
