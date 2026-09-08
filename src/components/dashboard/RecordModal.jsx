import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { resourceService } from "../../api/resources";
import {
  linkedResources,
  numericFields,
  optionalFields,
  selectOptions,
} from "../../config/resources";
import { human, itemLabel } from "../../utils/formatters";

const buildInitialValues = (config, record) =>
  Object.fromEntries(
    config.fields.map((field) => {
      const value = record?.[field];
      const isDateField = field.toLowerCase().includes("date") && value;
      return [
        field,
        isDateField
          ? new Date(value).toISOString().slice(0, 10)
          : value?._id || value || "",
      ];
    }),
  );

export default function RecordModal({ config, record, close, done }) {
  const [values, setValues] = useState(() => buildInitialValues(config, record));
  const [busy, setBusy] = useState(false);
  const [linkedOptions, setLinkedOptions] = useState({});

  const updateField = (key, value) =>
    setValues((current) => ({ ...current, [key]: value }));

  // Fetch dropdown options for any linked fields (e.g. "teacher" -> Teachers list)
  useEffect(() => {
    const resourceNames = [
      ...new Set(config.fields.map((field) => linkedResources[field]).filter(Boolean)),
    ];

    let isMounted = true;

    Promise.all(
      resourceNames.map(async (name) => {
        try {
          const { data } = await resourceService(`/${name}`).list({ limit: 100 });
          return [name, data[name] || []];
        } catch {
          return [name, []];
        }
      }),
    ).then((entries) => isMounted && setLinkedOptions(Object.fromEntries(entries)));

    return () => {
      isMounted = false;
    };
  }, [config.fields]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);

    try {
      const body = Object.fromEntries(
        Object.entries(values)
          .filter(([, value]) => value !== "")
          .map(([key, value]) => [key, numericFields.has(key) ? Number(value) : value]),
      );

      if (record) {
        await resourceService(config.path).update(record._id, body);
      } else {
        await resourceService(config.path).create(body);
      }

      toast.success(record ? "Record updated" : "Record created");
      done();
      close();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Could not save record. Check linked MongoDB IDs.",
      );
    } finally {
      setBusy(false);
    }
  };

  const hasLinkedField = config.fields.some((field) => linkedResources[field]);

  return (
    <div className="modal-backdrop">
      <form className="modal" onSubmit={handleSubmit}>
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
            This API requires an existing User MongoDB ID. It has no user
            directory endpoint, so create the user through registration and
            paste its ID here.
          </p>
        )}

        {hasLinkedField && (
          <p className="form-note">
            Related records appear as selectors when your role can retrieve
            them. If one is unavailable, enter its MongoDB ID supplied by
            your school administrator.
          </p>
        )}

        <div className="form-grid">
          {config.fields.map((field) => {
            const linkedResourceName = linkedResources[field];
            const options = linkedResourceName
              ? linkedOptions[linkedResourceName]
              : config.options?.[field] || selectOptions[field];

            return (
              <label key={field}>
                {human(field)}
                {options?.length ? (
                  <select
                    required={!optionalFields.has(field)}
                    value={values[field]}
                    onChange={(event) => updateField(field, event.target.value)}
                  >
                    <option value="">Select {human(field)}</option>
                    {options.map((option) => {
                      const id = typeof option === "string" ? option : option._id;
                      const label =
                        typeof option === "string" ? option : itemLabel(option, option._id);
                      return (
                        <option key={id} value={id}>
                          {label}
                        </option>
                      );
                    })}
                  </select>
                ) : (
                  <input
                    required={!optionalFields.has(field)}
                    type={
                      field.toLowerCase().includes("date")
                        ? "date"
                        : numericFields.has(field)
                          ? "number"
                          : "text"
                    }
                    value={values[field]}
                    onChange={(event) => updateField(field, event.target.value)}
                  />
                )}
              </label>
            );
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