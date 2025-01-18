import options from '@/config/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation';

const requireAuth = async () => {
    const session = await getServerSession(options)

    if (!session?.user) {
        redirect("/");
    }
}

export default requireAuth