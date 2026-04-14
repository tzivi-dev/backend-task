# פרויקט הערכה - מערכת ניהול משחקים (Prisma & Docker)

פרויקט זה מדגים סימולציה של יצירת משתמש, פתיחת משחק והצטרפות אליו, תוך שימוש ב-Node.js, Prisma ו-PostgreSQL בסביבת Docker.

## טכנולוגיות בשימוש
* **Node.js** - סביבת הריצה של האפליקציה.
* **Prisma** - ORM לניהול מסד הנתונים והמיגרציות.
* **PostgreSQL** - מסד הנתונים.
* **Docker & Docker Compose** - להרצה קלה ומבודדת של כל הסביבה.

## איך מריצים את הפרויקט?

היופי בדוקר הוא שאין צורך להתקין PostgreSQL או Node מקומית על המחשב. כל מה שצריך זה ש-Docker Desktop יהיה פתוח.

1. **שיכפול הפרויקט:**
   ```bash
   git clone <https://github.com/tzivi-dev/backend-task>
   cd project-root2. **הרצה:**
```bash
   docker-compose up --build
```

## פלט צפוי
✅ Success: User joined game (Participation ID: 1)
app-1 exited with code 0


