# 1. שימוש באימג' רשמי של Node.js
FROM node:18

# 2. פתרון לבעיות סינון אינטרנט (SSL) - מוסיפים הגדרות סביבה
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

# 3. יצירת תיקיית עבודה
WORKDIR /usr/src/app

# 4. העתקת קבצי הגדרות
COPY package*.json ./
COPY prisma ./prisma/

# 5. הגדרת npm להתעלם מ-SSL והתקנה
RUN npm config set strict-ssl false
RUN npm install

# 6. העתקת שאר הקוד
COPY . .

# 7. יצירת ה-Prisma Client
RUN npx prisma generate

# 8. פקודת הרצה
CMD [ "node", "src/main.js" ]