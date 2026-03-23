import { useState } from "react";
import { createRoute } from "../api/routes";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const NewRouteModal = ({ isOpen, onClose, onCreated }: Props) => {
  const [name, setName] = useState("");
  const [startingPosition, setStartingPosition] = useState("");
  const [stops, setStops] = useState([
    { name: "", address: "" },
    { name: "", address: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleAddStop = () => {
    if (stops.length >= 8) return;
    setStops([...stops, { name: "", address: "" }]);
  };

  const handleRemoveStop = (index: number) => {
    if (stops.length <= 2) return;
    setStops(stops.filter((_, i) => i !== index));
  };

  const handleStopChange = (
    index: number,
    field: "name" | "address",
    value: string,
  ) => {
    const updated = [...stops];
    updated[index][field] = value;
    setStops(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      await createRoute({
        name,
        starting_position: startingPosition,
        stops,
      });
      onCreated();
      onClose();
    } catch (e) {
      setError("Something went wrong. Check your addresses and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-[500px] max-h-[85vh] overflow-y-auto p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="font-montserrat font-bold text-xl">New Route</h1>

        <input
          placeholder="Route name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-200 rounded-lg p-2 font-montserrat"
        />

        <input
          placeholder="Starting position (warehouse)"
          value={startingPosition}
          onChange={(e) => setStartingPosition(e.target.value)}
          className="border border-gray-200 rounded-lg p-2 font-montserrat"
        />

        <div className="flex flex-col gap-3">
          <p className="font-montserrat font-semibold text-gray-600 text-sm">
            Stops
          </p>
          {stops.map((stop, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 border border-gray-100 rounded-xl p-3"
            >
              <div className="flex justify-between items-center">
                <p className="font-montserrat text-xs text-gray-400">
                  Stop {index + 1}
                </p>
                {stops.length > 2 && (
                  <button
                    onClick={() => handleRemoveStop(index)}
                    className="text-red-400 text-xs hover:text-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                placeholder="Customer name"
                value={stop.name}
                onChange={(e) =>
                  handleStopChange(index, "name", e.target.value)
                }
                className="border border-gray-200 rounded-lg p-2 font-montserrat text-sm"
              />
              <input
                placeholder="Address"
                value={stop.address}
                onChange={(e) =>
                  handleStopChange(index, "address", e.target.value)
                }
                className="border border-gray-200 rounded-lg p-2 font-montserrat text-sm"
              />
            </div>
          ))}
        </div>

        {stops.length < 8 && (
          <button
            onClick={handleAddStop}
            className="text-lime-600 font-montserrat text-sm hover:text-lime-700"
          >
            + Add Stop
          </button>
        )}

        {error && (
          <p className="text-red-500 text-sm font-montserrat">{error}</p>
        )}

        <div className="flex justify-end gap-3 mt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-200 font-montserrat text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-lime-600 text-white font-montserrat text-sm hover:bg-lime-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Route"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewRouteModal;
