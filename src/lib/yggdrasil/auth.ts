import prisma from "@/lib/prisma";
import { checkPassword } from "@/lib/password";

export async function checkCredentials(username: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email: username },
    select: {
      id: true,
      password: true,
      verified: true,
      profiles: {
        include: {
          cape: true,
          skin: true,
        },
      },
    },
  });

  if (user) return checkPassword(password, user.password) ? user : null;

  const profile = await prisma.profile.findUnique({
    where: {
      name: username,
    },
    include: {
      user: {
        select: {
          id: true,
          password: true,
          verified: true,
          profiles: true,
        },
      },
      cape: true,
      skin: true,
    },
  });

  if (profile && profile.user && checkPassword(password, profile.user.password)) {
    const user = profile.user;
    user.profiles = [profile];

    return user;
  }
  return null;
}
