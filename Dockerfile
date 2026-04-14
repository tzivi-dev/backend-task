# 1. שימוש באימג' רשמי של Node.js
FROM node:18

# 2. יצירת תיקיית עבודה בתוך הקונטיינר
WORKDIR /usr/src/app

# 3. העתקת קבצי הגדרות החבילות
COPY package*.json ./
COPY prisma ./prisma/

# 4. התקנת תלויות (dependencies)
RUN npm install

# 5. העתקת שאר קוד המקור
COPY . .

# 6. יצירת ה-Prisma Client בתוך הקונטיינר
RUN npx prisma generate

# 7. פקודת ההרצה (אנחנו נדרוס אותה ב-docker-compose כדי להריץ מיגרציות לפני)
CMD [ "node", "src/main.js" ]