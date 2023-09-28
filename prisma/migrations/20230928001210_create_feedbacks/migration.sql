-- CreateTable
CREATE TABLE "feedbacks" (
    "id" SERIAL NOT NULL,
    "author" TEXT NOT NULL,
    "email" TEXT,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feedbacks_pkey" PRIMARY KEY ("id")
);
