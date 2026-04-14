const { PrismaClient } = require('@prisma/client');
const { joinGame } = require('./services/game.service');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("🚀 Starting simulation...");

    // 1. התחברות למסד הנתונים (מתבצעת אוטומטית בפעולה הראשונה)
    
    // 2. יצירת נתוני דמי (User ו-Game)
    // אנחנו משתמשים ב-upsert כדי שלא תיזרק שגיאה אם נריץ את הסקריפט פעמיים
    const user = await prisma.user.upsert({
      where: { username: 'test_user' },
      update: {},
      create: { username: 'test_user' },
    });
    console.log(`👤 User created/found: ${user.username} (ID: ${user.id})`);

    const game = await prisma.game.create({
      data: { status: 'WAITING' },
    });
    console.log(`🎮 Game created in WAITING status (ID: ${game.id})`);

    // 3. קריאה לפונקציית joinGame
    console.log("📝 Attempting to join game...");
    const participation = await joinGame(user.id, game.id);
    
    // 4. הודעת הצלחה
    console.log(`✅ Success: User joined game (Participation ID: ${participation.id})`);

  } catch (error) {
    // הדפסת שגיאה במידה והפעולה נכשלה
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  } finally {
    // סגירת החיבור למסד הנתונים בסיום
    await prisma.$disconnect();
  }
}

main();