import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";

import options from "@/config/auth";

const CheckUser = async () => {
    const session = await getServerSession(options);
    if (session?.user) {
        return redirect("/notes");
    }
};

export default CheckUser;
