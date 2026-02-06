"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearToken, fetchWithAuth, getAdminName, getToken, setAdminName } from "@/lib/auth";

interface AdminInfo {
  fullName: string;
}

export default function useAdminAuth(apiBase: string) {
  const router = useRouter();
  const [adminName, setAdminNameState] = useState<string | null>(getAdminName());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      router.replace("/login");
      return;
    }

    const validate = async () => {
      try {
        const response = await fetchWithAuth(`${apiBase}/api/auth/me`);
        if (!response.ok) {
          clearToken();
          setLoading(false);
          router.replace("/login");
          return;
        }
        const data = (await response.json()) as AdminInfo;
        setAdminName(data.fullName);
        setAdminNameState(data.fullName);
      } catch {
        clearToken();
        setLoading(false);
        router.replace("/login");
        return;
      }
      setLoading(false);
    };

    validate();
  }, [apiBase, router]);

  return { adminName, loading };
}
