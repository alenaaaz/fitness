import { UserRole } from "@prisma/client";
import { auth } from "~/server/auth";

export async function isAdmin() {
    const session = await auth();
    return session?.user?.role === UserRole.ADMIN;
}

export async function isTrainer() {
    const session = await auth();
    return session?.user?.role === UserRole.TRAINER;
}

export async function isAdminOrCurrentTrainer(trainerId: string) {
    const session = await auth();
    if (!session) return false;

    return (
        session.user.role === UserRole.ADMIN ||
        session.user.id === trainerId
    );
}