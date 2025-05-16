import "~/styles/globals.css";
import { auth } from "~/server/auth";
import { Button } from "./_components/ui/button";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <div className="max-w-md space-y-6">
        <h1 className="text-4xl font-bold">Добро пожаловать в FitnessApp!</h1>
        <p className="text-lg">
          {session
            ? "Управляйте тренировками и отслеживайте прогресс"
            : "Войдите в аккаунт, чтобы начать отслеживать тренировки и прогресс"}
        </p>
      </div>
    </div>
  );
}

