const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * פונקציה לרישום משתמש למשחק
 * @param {number} userId - מזהה המשתמש
 * @param {number} gameId - מזהה המשחק
 */
async function joinGame(userId, gameId) {

  // 1. שליפת המשחק ובדיקת סטטוס
  const game = await prisma.game.findUnique({ where: { id: gameId } });
  
  // בדיקה אם המשחק קיים
  if (!game) throw new Error('Game not found');
  // בדיקה אם המשחק בסטטוס המתנה (Waiting)
  if (game.status !== 'WAITING') throw new Error('Game already started');

  // בדיקה אם המשחק בסטטוס המתנה (Waiting)
  try {
    return await prisma.gameParticipant.create({
      data: { 
        userId: userId, 
        gameId: gameId, 
        role: 'PLAYER' 
      }
    });
  } catch (error) {
    // P2002 זה קוד השגיאה של Prisma לכפילות בערך ייחודי
    if (error.code === 'P2002') {
      throw new Error('User is already registered for this game');
    }
    throw error; // זריקת שגיאות אחרות (כמו בעיית חיבור)
  }
}

module.exports = { joinGame };
