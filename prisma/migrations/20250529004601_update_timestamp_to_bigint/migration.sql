/*
  Warnings:

  - You are about to alter the column `timestamp` on the `Note` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Note" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "note" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "timestamp" BIGINT NOT NULL
);
INSERT INTO "new_Note" ("category", "id", "note", "timestamp") SELECT "category", "id", "note", "timestamp" FROM "Note";
DROP TABLE "Note";
ALTER TABLE "new_Note" RENAME TO "Note";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
