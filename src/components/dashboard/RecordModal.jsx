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
  const [values, setValues] = useState(() =>
    buildInitialValues(config, record),
  );
  const [busy, setBusy] = useState(false);
  const [linkedOptions, setLinkedOptions] = useState({});

  const updateField = (key, value) => {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));
  };

  useEffect(() => {
    const resourceNames = [
      ...new Set(
        config.fields
          .map((field) => linkedResources[field])
          .filter(Boolean),
      ),
    ];

    let mounted = true;

    const loadOptions = async () => {
      const result = {};

      for (const name of resourceNames) {
        try {
          const response = await resourceService(`/${name}`).list({
            limit: 100,
          });

          const data = response.data;

          if (Array.isArray(data)) {
            result[name] = data;
          } else if (Array.isArray(data?.[name])) {
            result[name] = data[name];
          } else if (Array.isArray(data?.data)) {
            result[name] = data.data;
          } else {
            result[name] = [];
          }
        } catch (error) {
          console.error(`Failed to load ${name}:`, error);
          result[name] = [];
        }
      }

      if (mounted) {
        setLinkedOptions(result);
      }
    };

    loadOptions();

    return () => {
      mounted = false;
    };
  }, [config.fields]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);

    try {
      const body = Object.fromEntries(
        Object.entries(values)
          .filter(([, value]) => value !== "")
          .map(([key, value]) => [
            key,
            numericFields.has(key) ? Number(value) : value,
          ]),
      );

      console.log("Submitting:", body);

      if (record) {
        await resourceService(config.path).update(record._id, body);
      } else {
        await resourceService(config.path).create(body);
      }

      toast.success(record ? "Record updated" : "Record created");

      done();
      close();
    } catch (err) {
      console.error("Save error:", err);

      toast.error(
        err.response?.data?.message ||
          "Could not save record.",
      );
    } finally {
      setBusy(false);
    }
  };

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
            This API requires an existing User MongoDB ID.
          </p>
        )}

        <div className="form-grid">
          {config.fields.map((field) => {
            const linkedResource = linkedResources[field];

            const options = linkedResource
              ? linkedOptions[linkedResource] || []
              : config.options?.[field] || selectOptions[field];

            /*
             * Linked fields MUST use MongoDB IDs.
             * Never fall back to a text input for them.
             */
            if (linkedResource) {
              return (
                <label key={field}>
                  {human(field)}

                  <select
                    required={!optionalFields.has(field)}
                    value={values[field] || ""}
                    onChange={(event) =>
                      updateField(field, event.target.value)
                    }
                  >
                    <option value="">
                      Select {human(field)}
                    </option>

                    {options.map((option) => {
                      if (typeof option === "string") {
                        return (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        );
                      }

                      if (!option?._id) {
                        return null;
                      }

                      return (
                        <option
                          key={option._id}
                          value={option._id}
                        >
                          {itemLabel(option, option._id)}
                        </option>
                      );
                    })}
                  </select>
                </label>
              );
            }

            if (options?.length) {
              return (
                <label key={field}>
                  {human(field)}

                  <select
                    required={!optionalFields.has(field)}
                    value={values[field] || ""}
                    onChange={(event) =>
                      updateField(field, event.target.value)
                    }
                  >
                    <option value="">
                      Select {human(field)}
                    </option>

                    {options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              );
            }

            return (
              <label key={field}>
                {human(field)}

                <input
                  required={!optionalFields.has(field)}
                  type={
                    field.toLowerCase().includes("date")
                      ? "date"
                      : numericFields.has(field)
                        ? "number"
                        : "text"
                  }
                  value={values[field] || ""}
                  onChange={(event) =>
                    updateField(field, event.target.value)
                  }
                />
              </label>
            );
          })}
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="secondary"
            onClick={close}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="primary"
            disabled={busy}
          >
            {busy ? "Saving…" : "Save record"}
          </button>
        </div>
      </form>
    </div>
  );
}