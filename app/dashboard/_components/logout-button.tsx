"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Loader2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

function useAsyncTask<TArgs extends any[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const run = useCallback(
    async (...args: TArgs) => {
      setLoading(true);
      setError(null);
      try {
        const result = await fn(...args);
        return result;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fn]
  );

  return { run, loading, error };
}

export default function LogoutButton() {
  const router = useRouter();

  const signOut = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }, [router]);

  const { run: handleLogout, loading } = useAsyncTask(signOut);

  return (
    <Button
      onClick={() => handleLogout()}
      disabled={loading}
      aria-busy={loading}
    >
      {loading ? <Loader2 className="animate-spin" /> : <LogOut />}
    </Button>
  );
}
