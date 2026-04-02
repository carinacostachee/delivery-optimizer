import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../api/routes";

const PageAudit = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/audit").then((result) => setEntries(result.data));
  }, []);

  const filtered = entries.filter((e) =>
    e.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header
        onOpenModal={() => navigate("/")}
        actionLabel="Dashboard"
        showIcon={false}
      />
      <div className="px-4 md:px-10 py-6">
        <h2 className="font-montserrat font-bold text-2xl mb-4">Audit Log</h2>
        <input
          type="text"
          placeholder="Search by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 p-2 border border-lime-600 rounded-sm w-full max-w-md font-montserrat text-sm focus:outline-none bg-white"
        />
        <div className="overflow-x-auto rounded shadow bg-white">
          <table className="w-full text-sm font-montserrat">
            <thead className="bg-lime-600 text-white uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Action</th>
                <th className="px-4 py-3 text-left">Method</th>
                <th className="px-4 py-3 text-left">Path</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">IP</th>
                <th className="px-4 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => (
                <tr className="border-t text-gray-500" key={entry.id}>
                  <td className="px-4 py-3" colSpan={1}>
                    {entry.email}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold text-black ${
                        entry.action === "CREATE_ROUTE"
                          ? "bg-lime-200"
                          : entry.action === "DELETE_ROUTE"
                            ? "bg-red-300"
                            : "bg-cyan-200"
                      }`}
                    >
                      {entry.action}
                    </span>
                  </td>
                  <td
                    className={`px-4 py-3 ${
                      entry.request_method === "POST"
                        ? "text-lime-600"
                        : "text-red-600"
                    }`}
                  >
                    {entry.request_method}
                  </td>
                  <td className="px-4 py-3">{entry.request_path}</td>
                  <td
                    className={`px-4 py-3 font-semibold ${
                      entry.status_code === 200
                        ? "text-lime-600"
                        : entry.status_code < 400
                          ? "text-blue-500"
                          : entry.status_code < 500
                            ? "text-orange-500"
                            : "text-red-500"
                    }`}
                  >
                    {entry.status_code}
                  </td>
                  <td className="px-4 py-3" colSpan={1}>
                    {entry.ip_address}
                  </td>
                  <td className="px-4 py-3" colSpan={1}>
                    {new Date(entry.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PageAudit;
