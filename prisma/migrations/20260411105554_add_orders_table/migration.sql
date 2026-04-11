-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "landmark" TEXT NOT NULL DEFAULT '',
    "productId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "productNumber" TEXT NOT NULL,
    "collection" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "material" TEXT NOT NULL DEFAULT '',
    "weight" TEXT NOT NULL DEFAULT '',
    "size" TEXT NOT NULL DEFAULT '',
    "quantity" INTEGER NOT NULL,
    "pricePerItem" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);
