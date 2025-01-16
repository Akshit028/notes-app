import options from "@/config/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const CheckUser = async() => {
    const session = await getServerSession(options);
    if(session?.user){
        return redirect("/notes");
    }
}   

export default CheckUser;
