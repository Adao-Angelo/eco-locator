import { createClient } from "@/lib/supabase/client";
import { loginSchema } from "@/lib/validations";
import { useCallback, useEffect, useRef, useState } from "react";
import { z } from "zod";

type LoginForm = {
  email: string;
  password: string;
};

export default function useLogin(onSuccess?: () => void) {
  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError("");

      try {
        loginSchema.parse(formData);

        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          setError(error.message);
          return;
        }

        if (data.user) {
          onSuccess?.();
        }
      } catch (err) {
        if (err instanceof z.ZodError) {
          setError(err.issues?.[0]?.message || "Invalid input");
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    },
    [formData, onSuccess]
  );

  return {
    formData,
    setFormData,
    handleChange,
    handleSubmit,
    loading,
    error,
    setError,
  };
}
