import AuthButton from "@/components/authButton";
import CheckUser from "@/components/checkUser";

const Home = async() => {
  await CheckUser();
  return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <AuthButton />
      </div>
  );
}

export default Home;