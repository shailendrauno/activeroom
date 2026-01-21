import { useEffect, useState } from "react";
import api from "../api/axios";

const Admin = () => {
  const [rooms, setRooms] = useState([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRooms = async () => {
    try {
      const res = await api.get("/rooms/all");
      setRooms(res.data);
    } catch (err) {
      setError("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const createRoom = async () => {
    if (!name.trim()) return;
    try {
      await api.post("/rooms", { name, description: desc });
      setName("");
      setDesc("");
      loadRooms();
    } catch {
      alert("Failed to create room");
    }
  };

  const toggleRoom = async (id) => {
    await api.patch(`/rooms/${id}/toggle`);
    loadRooms();
  };

  const deleteRoom = async (id) => {
    if (!confirm("Delete this room?")) return;
    await api.delete(`/rooms/${id}`);
    loadRooms();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-500">Manage chat rooms</p>
      </div>

      {/* Create Room */}
      <div className="bg-white rounded-xl shadow p-5 mb-10">
        <h2 className="font-semibold mb-4">Create New Room</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            className="border p-2 rounded"
            placeholder="Room name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="border p-2 rounded"
            placeholder="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <button
            onClick={createRoom}
            className="bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create Room
          </button>
        </div>
      </div>

      {/* Rooms */}
      <h2 className="text-xl font-semibold mb-4">All Rooms</h2>

      {loading && <p>Loading rooms...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((r) => (
          <div
            key={r._id}
            className="bg-white rounded-xl shadow p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">{r.name}</h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    r.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {r.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="text-gray-500 text-sm">
                {r.description || "No description"}
              </p>
            </div>

            <div className="flex justify-between mt-5">
              <button
                onClick={() => toggleRoom(r._id)}
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Toggle
              </button>
              <button
                onClick={() => deleteRoom(r._id)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
