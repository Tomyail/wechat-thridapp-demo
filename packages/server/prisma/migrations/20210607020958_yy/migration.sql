/*
  Warnings:

  - You are about to drop the column `authCode` on the `Suite` table. All the data in the column will be lost.
  - Added the required column `name` to the `Corp` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Corp" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "permanentCode" TEXT,
    "name" TEXT NOT NULL,
    "agentId" TEXT
);
INSERT INTO "new_Corp" ("id") SELECT "id" FROM "Corp";
DROP TABLE "Corp";
ALTER TABLE "new_Corp" RENAME TO "Corp";
CREATE TABLE "new_Suite" (
    "suiteId" TEXT NOT NULL PRIMARY KEY,
    "suiteTicket" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Suite" ("createdAt", "suiteId", "suiteTicket", "updatedAt") SELECT "createdAt", "suiteId", "suiteTicket", "updatedAt" FROM "Suite";
DROP TABLE "Suite";
ALTER TABLE "new_Suite" RENAME TO "Suite";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
