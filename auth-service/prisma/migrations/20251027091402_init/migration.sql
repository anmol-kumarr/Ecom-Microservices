-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "mobileNumber" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "otp" INTEGER NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);
