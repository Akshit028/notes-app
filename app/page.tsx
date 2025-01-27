import AuthButton from "@/components/authButton";
import CheckUser from "@/components/checkUser";

const Home = async () => {
    await CheckUser();
    return (
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
            <AuthButton />
        </div>
    );
};

export default Home;
