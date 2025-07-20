'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function EditProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: '',
    city: '',
    state: '',
    zip: '',
    avatar: null,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile/');
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        console.log('Fetched profile data:', data);
        setForm(prev => ({
          ...prev,
          fullName: data.userProfile.name || '',
          city: data.userProfile.city || '',
          state: data.userProfile.state || '',
          zip: data.userProfile.zip || '',
        }));
      } catch (err) {
        console.error('Failed to fetch profile', err);
      }
    };

    if (status === 'authenticated') {
      fetchProfile();
    }
  }, [status]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm(prev => ({ ...prev, avatar: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key]);
    }

    const res = await fetch('/api/profile/update', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      router.push('/profile');
    } else {
      alert('Failed to update profile');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
        <input
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full p-2 border rounded"
        />
        <input
          name="city"
          value={form.city}
          onChange={handleChange}
          placeholder="City"
          className="w-full p-2 border rounded"
        />
        <input
          name="state"
          value={form.state}
          onChange={handleChange}
          placeholder="State"
          className="w-full p-2 border rounded"
        />
        <input
          name="zip"
          value={form.zip}
          onChange={handleChange}
          placeholder="Zip"
          className="w-full p-2 border rounded"
        />
        <input
          name="avatar"
          type="file"
          onChange={handleFileChange}
          className="w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
}
