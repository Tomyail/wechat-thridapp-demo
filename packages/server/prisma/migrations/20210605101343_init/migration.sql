-- CreateTable
CREATE TABLE "Suite" (
    "suiteId" TEXT NOT NULL PRIMARY KEY,
    "suiteTicket" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "authCode" TEXT,
    "corpId" TEXT NOT NULL,
    FOREIGN KEY ("corpId") REFERENCES "Corp" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Corp" (
    "id" TEXT NOT NULL PRIMARY KEY
);

-- CreateIndex
CREATE UNIQUE INDEX "Suite_corpId_unique" ON "Suite"("corpId");
