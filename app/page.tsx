import AuthButton from "@/components/auth-button";
import CheckUser from "@/components/check-user";

const Home = async() => {
  await CheckUser();
  return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <AuthButton />
      </div>
  );
}

export default Home;