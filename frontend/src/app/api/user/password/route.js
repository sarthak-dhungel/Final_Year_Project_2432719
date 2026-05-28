import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function PUT(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return Response.json({ detail: 'Not authenticated' }, { status: 401 });
  }

  const body = await request.json();

  if (!body.currentPassword || !body.newPassword) {
    return Response.json({ detail: 'Both fields are required' }, { status: 400 });
  }

  if (body.newPassword.length < 6) {
    return Response.json({ detail: 'New password must be at least 6 characters' }, { status: 400 });
  }

  try {
    const res = await fetch(`${API_URL}/auth/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: session.user.id,
        currentPassword: body.currentPassword,
        newPassword: body.newPassword,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return Response.json({ detail: data.detail || 'Failed to change password' }, { status: res.status });
    }

    return Response.json({ message: 'Password changed successfully' });
  } catch (error) {
    return Response.json({ detail: 'Server error' }, { status: 500 });
  }
}