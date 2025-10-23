"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

import useLogin from "./_hooks/use-login";

export default function LoginPage() {
  const router = useRouter();

  const onSuccess = useCallback(() => {
    router.push("/dashboard");
    router.refresh();
  }, [router]);

  const { formData, handleChange, handleSubmit, loading, error } =
    useLogin(onSuccess);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-zinc-900 via-emerald-900 to-zinc-800 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-32 w-64 h-64 bg-emerald-600/20 blur-3xl rounded-full animate-pulse" />
        <div className="absolute bottom-20 right-32 w-72 h-72 bg-emerald-500/20 blur-3xl rounded-full animate-pulse" />
      </div>

      <Card className="relative z-10 w-full max-w-md backdrop-blur-md bg-white/10 border-white/20 shadow-2xl">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-3xl font-bold text-white">
            EcoLocator Admin
          </CardTitle>
          <p className="text-sm text-zinc-300">
            Sign in to your administrator account
          </p>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-2 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-zinc-400 focus-visible:ring-emerald-400"
              />
            </div>
            <div className="space-y-2">
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-zinc-400 focus-visible:ring-emerald-400"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 transition-all duration-300"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
