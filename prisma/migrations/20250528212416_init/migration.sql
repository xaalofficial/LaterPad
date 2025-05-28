-- CreateTable
CREATE TABLE "Note" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "note" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "timestamp" INTEGER NOT NULL
);
