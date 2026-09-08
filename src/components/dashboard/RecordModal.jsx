import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { resourceService } from "../../api/resources";
import { numericFields, optionalFields } from "../../config/resources";
import { human } from "../../utils/formatters";
export default function RecordModal({ config, record, close, done }) {
  const [values, setValues] = useState(() =>
      Object.fromEntries(
        config.fields.map((f) => {
          const v = record?.[f];
          return [
            f,
            f.toLowerCase().includes("date") && v
              ? new Date(v).toISOString().slice(0, 10)
              : v?._id || v || "",
          ];
        }),
      ),
    ),
    [busy, setBusy] = useState(false),
    set = (k, v) => setValues((x) => ({ ...x, [k]: v }));
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const body = Object.fromEntries(
        Object.entries(values)
          .filter(([, v]) => v !== "")
          .map(([k, v]) => [k, numericFields.has(k) ? Number(v) : v]),
      );
      record
        ? await resourceService(config.path).update(record._id, body)
        : await resourceService(config.path).create(body);
      toast.success(record ? "Record updated" : "Record created");
      done();
      close();
    } catch (e) {
      toast.error(
        e.response?.data?.message ||
          "Could not save record. Check linked MongoDB IDs.",
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="modal-backdrop">
      <form className="modal" onSubmit={submit}>
        <div className="modal-head">
          <h2>
            {record ? "Update" : "Add"} {config.label.slice(0, -1)}
          </h2>
          <button type="button" onClick={close}>
            <X />
          </button>
        </div>
        {config.fields.includes("user") && (
          <p className="form-note">
            Requires an existing User MongoDB ID; the API has no user directory.
          </p>
        )}
        <div className="form-grid">
          {config.fields.map((f) => (
            <label key={f}>
              {human(f)}
              <input
                required={!optionalFields.has(f)}
                type={
                  f.toLowerCase().includes("date")
                    ? "date"
                    : numericFields.has(f)
                      ? "number"
                      : "text"
                }
                value={values[f]}
                onChange={(e) => set(f, e.target.value)}
              />
            </label>
          ))}
        </div>
        <div className="modal-actions">
          <button type="button" className="secondary" onClick={close}>
            Cancel
          </button>
          <button className="primary" disabled={busy}>
            {busy ? "Saving…" : "Save record"}
          </button>
        </div>
      </form>
    </div>
  );
}
