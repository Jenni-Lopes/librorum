"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { sair } from "@/services/auth.services";

export default function LogoutButton()
{
    const router =
        useRouter();

    async function handleLogout()
    {
        try {

            await sair();

            toast.success("Logout realizado");

            router.push("/login");

            router.refresh();
        } catch {
            toast.error("Erro ao realizar logout");
        }
    }

    return (
        <button onClick={handleLogout}>
            Logout
        </button>
    );
}