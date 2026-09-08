import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { resourceService } from "../../api/resources";
import { linkedResources, numericFields, optionalFields, selectOptions } from "../../config/resources";
import { human, itemLabel } from "../../utils/formatters";
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
    [links, setLinks] = useState({}),
    set = (k, v) => setValues((x) => ({ ...x, [k]: v }));
  useEffect(() => {
    const resourceNames = [...new Set(config.fields.map((field) => linkedResources[field]).filter(Boolean))];
    let active = true;
    Promise.all(resourceNames.map(async (name) => {
      try {
        const { data } = await resourceService(`/${name}`).list({ limit: 100 });
        return [name, data[name] || []];
      } catch {
        return [name, []];
      }
    })).then((entries) => active && setLinks(Object.fromEntries(entries)));
    return () => { active = false; };
  }, [config.fields]);
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
            This API requires an existing User MongoDB ID. It has no user directory endpoint, so create the user through registration and paste its ID here.
          </p>
        )}
        {config.fields.some((field) => linkedResources[field]) && (
          <p className="form-note">
            Related records appear as selectors when your role can retrieve them. If one is unavailable, enter its MongoDB ID supplied by your school administrator.
          </p>
        )}
        <div className="form-grid">
          {config.fields.map((f) => {
            const linked = linkedResources[f];
            const options = linked ? links[linked] : config.options?.[f] || selectOptions[f];
            return <label key={f}>
              {human(f)}
              {options?.length ? <select required={!optionalFields.has(f)} value={values[f]} onChange={(e) => set(f, e.target.value)}>
                <option value="">Select {human(f)}</option>
                {options.map((option) => {
                  const id = typeof option === "string" ? option : option._id;
                  return <option key={id} value={id}>{typeof option === "string" ? option : itemLabel(option, option._id)}</option>;
                })}
              </select> : <input
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
              }
            </label>;
          })}
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
