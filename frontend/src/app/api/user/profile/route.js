import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function PUT(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return Response.json({ detail: 'Not authenticated' }, { status: 401 });
  }

  const body = await request.json();
  return Response.json({ message: 'Profile updated' });
}