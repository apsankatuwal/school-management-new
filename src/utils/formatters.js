export const date = (value) =>
  value ? new Date(value).toLocaleDateString() : "—";

export const userName = (user) =>
  user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "—";

export const itemLabel = (item, fallback = "—") => {
  if (!item) return fallback;

  const name = userName(item.user);
  if (name !== "—") {
    const code = item.admissionNumber || item.employeeId;
    return code ? `${name} (${code})` : name;
  }

  return (
    item.subjectName ||
    item.examName ||
    item.className ||
    item.admissionNumber ||
    item.employeeId ||
    fallback
  );
};

export const human = (key) =>
  key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());