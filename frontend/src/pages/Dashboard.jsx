import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="text-center mt-10">
      <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
      <p>Your email: {user?.email}</p>
    </div>
  );
};

export default Dashboard;
