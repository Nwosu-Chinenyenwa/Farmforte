"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { createClient } from "../../utils/supabase/client";

function AdminLinkContent() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checked, setChecked] = useState(false); 

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          if (mounted) {
            setIsAdmin(false);
            setChecked(true);
          }
          return;
        }

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (!error && profile?.role === "admin") {
          if (mounted) setIsAdmin(true);
        } else {
          if (mounted) setIsAdmin(false);
        }
      } catch {
        if (mounted) setIsAdmin(false);
      } finally {
        if (mounted) setChecked(true);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (!checked) return null;
  if (!isAdmin) return null;

  return (
    <Link href="/admin">
      Admin
    </Link>
  );
}

export default function AdminLink() {
  return (
    <Suspense fallback={null}>
      <AdminLinkContent />
    </Suspense>
  );
}