/*
  Warnings:

  - You are about to drop the column `corpId` on the `Suite` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Suite_corpId_unique";

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Suite" (
    "suiteId" TEXT NOT NULL PRIMARY KEY,
    "suiteTicket" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "authCode" TEXT
);
INSERT INTO "new_Suite" ("authCode", "createdAt", "suiteId", "suiteTicket", "updatedAt") SELECT "authCode", "createdAt", "suiteId", "suiteTicket", "updatedAt" FROM "Suite";
DROP TABLE "Suite";
ALTER TABLE "new_Suite" RENAME TO "Suite";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
