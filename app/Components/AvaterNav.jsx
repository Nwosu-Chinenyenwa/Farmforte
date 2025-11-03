'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from "../../utils/supabase/client";
import Image from 'next/image';

export default function AvatarNav() {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [initials, setInitials] = useState('UR'); 

  useEffect(() => {
    async function fetchProfile() {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('avatar_url, full_name, email')
          .eq('id', session.user.id)
          .single();

        if (profile?.avatar_url) setAvatarUrl(profile.avatar_url);

        if (profile?.full_name) {
          const nameParts = profile.full_name.trim().split(' ');
          const firstInitial = nameParts[0]?.charAt(0).toUpperCase() || '';
          const secondInitial = nameParts[1]?.charAt(0).toUpperCase() || '';
          setInitials(`${firstInitial}${secondInitial}`);
        } 
        else if (profile?.email) {
          const namePart = profile.email.split('@')[0];
          setInitials(namePart.substring(0, 2).toUpperCase());
        }
      }
    }

    fetchProfile();
  }, []);

  return (
    <Link href="/Profile" style={{ textDecoration: 'none' }}>
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt="Avatar"
          title='view profile'
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            objectFit: 'cover',
            cursor: 'pointer',
          }}
        />
      ) : (
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: '#209e2e',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          {initials}
        </div>
      )}
    </Link>
  );
}
