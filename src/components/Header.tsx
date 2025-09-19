import { logoutUser } from "@/api/auth";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "@tanstack/react-router";
import { Lightbulb } from "lucide-react";

function Header() {
  const { user, setUser, setAccessToken } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      setAccessToken(null);
      setUser(null);
      navigate({ to: "/" });
    } catch (err) {
      console.log("Logout failed", err);
    }
  };
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2 text-gray-800">
          <Link to="/" className="flex items-center space-x-2 text-gray-800">
            <Lightbulb className="w-6 h-6 text-yellow-500" />
            <h1 className="text-2xl font-bold">IdeaDrop</h1>
          </Link>
        </div>

        <nav className="flex items-center space-x-4">
          <Link
            to="/ideas"
            className="text-gray-600 hover:text-gray-900 font-medium transition px-3 py-2 leading-none [&.active]:text-blue-600"
          >
            Ideas
          </Link>
          {user && (
            <Link
              to="/ideas/new"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium transition px-4 py-2 rounded-md leading-none"
            >
              +New Idea
            </Link>
          )}
        </nav>
        <div className="flex items-center space-x-2">
          {!user ? (
            <>
              <Link
                className="text-gray-600 hover:text-gray-700 font-medium transition px-3 py-2 leading-none [&.active]:text-blue-600"
                to="/login"
              >
                Login
              </Link>
              <Link
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium transition px-4 py-2 rounded-md leading-none [&.active]:text-blue-600"
                to="/register"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <span className="text-gray-700 font-medium px-2 hidden sm:block">
                Welcome, {user.name}
              </span>
              <button
                className="text-red-600 font-medium transition px-3 py-2 leading-none hover:text-red-900 cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
