/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { resourceService } from "../../api/resources";
import RecordModal from "./RecordModal";
export default function ResourcePage({ config, role }) {
  const [rows, setRows] = useState([]),
    [query, setQuery] = useState(""),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [modal, setModal] = useState(null);
  const api = useMemo(() => resourceService(config.path), [config.path]),
    write = (config.writeRoles || config.roles).includes(role),
    del = (config.deleteRoles || config.writeRoles || config.roles).includes(
      role,
    );
  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.list(
        config.search ? { page: 1, limit: 10, search: query } : undefined,
      );
      setRows(data[config.key] || []);
      setError("");
    } catch (e) {
      setError(e.response?.data?.message || "Could not load records.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, [config.path]);
  const remove = async (id) => {
    if (!confirm("Delete this record?")) return;
    try {
      await api.remove(id);
      toast.success("Record deleted");
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Could not delete record.");
    }
  };
  return (
    <div className="content">
      <div className="toolbar">
        {config.search ? (
          <form
            className="search"
            onSubmit={(e) => {
              e.preventDefault();
              load();
            }}
          >
            <Search size={18} />
            <input
              value={query}
              placeholder={`Search ${config.label.toLowerCase()}…`}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
        ) : (
          <div />
        )}
        {write && (
          <button className="primary" onClick={() => setModal(true)}>
            <Plus size={18} />
            Add {config.label.slice(0, -1)}
          </button>
        )}
      </div>
      {error && (
        <div className="api-error">
          {error}
          <button onClick={load}>Retry</button>
        </div>
      )}
      <div className="table-card">
        <div className="table-head">
          <h2>All {config.label}</h2>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {config.cols.map(([h]) => (
                  <th key={h}>{h}</th>
                ))}
                {(write || del) && <th />}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="empty" colSpan="10">
                    Loading…
                  </td>
                </tr>
              ) : rows.length ? (
                rows.map((r) => (
                  <tr key={r._id}>
                    {config.cols.map(([h, a]) => (
                      <td key={h}>
                        {typeof a === "function" ? a(r) : r[a] || "—"}
                      </td>
                    ))}
                    {(write || del) && (
                      <td className="actions">
                        {write && (
                          <button aria-label="Edit" onClick={() => setModal(r)}>
                            <Pencil size={16} />
                          </button>
                        )}
                        {del && (
                          <button
                            aria-label="Delete"
                            onClick={() => remove(r._id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="empty" colSpan="10">
                    No {config.label.toLowerCase()} found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {modal && (
        <RecordModal
          config={config}
          record={modal === true ? null : modal}
          close={() => setModal(null)}
          done={load}
        />
      )}
    </div>
  );
}
