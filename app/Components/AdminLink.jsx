"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../../utils/supabase/client";

export default function AdminLink() {
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
    <>
      <Link href="/admin">
        <li className="hidden lg:block hover:text-[#82b440] transition-all hover:ml-1">
          Admin
        </li>
        <li className="flex lg:hidden justify-between p-3 rounded-sm border-b-1 border-[#8080803f] ">
          <p className="text-[#82b440]">Admin</p>

          <svg
            className="w-6 text-[gray]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 14V22H4C4 17.5817 7.58172 14 12 14ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM21 17H22V22H14V17H15V16C15 14.3431 16.3431 13 18 13C19.6569 13 21 14.3431 21 16V17ZM19 17V16C19 15.4477 18.5523 15 18 15C17.4477 15 17 15.4477 17 16V17H19Z"></path>
          </svg>
        </li>
      </Link>
    </>
  );
}
