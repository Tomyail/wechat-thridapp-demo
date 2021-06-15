-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Suite" (
    "suiteId" TEXT NOT NULL PRIMARY KEY,
    "suiteTicket" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "authCode" TEXT,
    "corpId" TEXT,
    FOREIGN KEY ("corpId") REFERENCES "Corp" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Suite" ("authCode", "corpId", "createdAt", "suiteId", "suiteTicket", "updatedAt") SELECT "authCode", "corpId", "createdAt", "suiteId", "suiteTicket", "updatedAt" FROM "Suite";
DROP TABLE "Suite";
ALTER TABLE "new_Suite" RENAME TO "Suite";
CREATE UNIQUE INDEX "Suite_corpId_unique" ON "Suite"("corpId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
