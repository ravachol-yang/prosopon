import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

async function main() {
  const adminEmail = "prosopon@example.com";
  const adminPassword = "prosopon";

  const userCount = await prisma.user.count();
  if (userCount > 0) {
    console.log("Database already has data, skipping seed.");
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      verified: true,
      role: "ADMIN",
    },
  });

  console.log(`Default admin created: ${adminEmail}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
