/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { resourceService } from "../../api/resources";
import RecordModal from "./RecordModal";

export default function ResourcePage({ config, role }) {
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null); // null = closed, true = "add", object = "edit"

  const api = useMemo(() => resourceService(config.path), [config.path]);
  const canWrite = (config.writeRoles || config.roles).includes(role);
  const canDelete = (config.deleteRoles || config.writeRoles || config.roles).includes(role);

  const loadRows = async () => {
    setLoading(true);
    try {
      const params = config.search ? { page, limit: 10, search: query } : undefined;
      const { data } = await api.list(params);
      setRows(data[config.key] || []);
      setPagination(data.pagination || null);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not load records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRows();
  }, [config.path, page]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this record?")) return;

    try {
      await api.remove(id);
      toast.success("Record deleted");
      loadRows();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete record.");
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (page === 1) loadRows();
    else setPage(1);
  };

  const showActionsColumn = canWrite || canDelete;

  return (
    <div className="content">
      <div className="toolbar">
        {config.search ? (
          <form className="search" onSubmit={handleSearchSubmit}>
            <Search size={18} />
            <input
              value={query}
              placeholder={`Search ${config.label.toLowerCase()}…`}
              onChange={(event) => setQuery(event.target.value)}
            />
          </form>
        ) : (
          <div />
        )}

        {canWrite && (
          <button className="primary" onClick={() => setModal(true)}>
            <Plus size={18} />
            Add {config.singular || config.label.slice(0, -1)}
          </button>
        )}
      </div>

      {pagination && (
        <div className="pagination" aria-label="Pagination">
          <span>
            Page {pagination.page} of {pagination.totalPages || 1}
          </span>
          <button disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>
            <ChevronLeft size={16} /> Previous
          </button>
          <button
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((value) => value + 1)}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}

      {error && (
        <div className="api-error">
          {error}
          <button onClick={loadRows}>Retry</button>
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
                {config.cols.map(([header]) => (
                  <th key={header}>{header}</th>
                ))}
                {showActionsColumn && <th />}
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
                rows.map((row) => (
                  <tr key={row._id}>
                    {config.cols.map(([header, accessor]) => (
                      <td key={header}>
                        {typeof accessor === "function" ? accessor(row) : row[accessor] || "—"}
                      </td>
                    ))}
                    {showActionsColumn && (
                      <td className="actions">
                        {canWrite && (
                          <button aria-label="Edit" onClick={() => setModal(row)}>
                            <Pencil size={16} />
                          </button>
                        )}
                        {canDelete && (
                          <button aria-label="Delete" onClick={() => handleDelete(row._id)}>
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
          done={loadRows}
        />
      )}
    </div>
  );
}
