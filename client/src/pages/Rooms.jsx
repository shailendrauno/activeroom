import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get("/rooms/active");
        setRooms(res.data);
      } catch (err) {
        setError("Failed to load rooms");
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading rooms...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Active Rooms</h1>

        {user?.role === "admin" && (
          <button
            onClick={() => navigate("/admin")}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Admin Dashboard
          </button>
        )}
      </div>

      {rooms.length === 0 ? (
        <p className="text-center text-gray-500">No active rooms right now.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room._id}
              className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {room.name}
                </h2>
                <p className="text-gray-500 mt-2">
                  {room.description || "No description"}
                </p>
              </div>

              <button
                onClick={() => navigate(`/chat/${room._id}`)}
                className="mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Join Room
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Rooms;
