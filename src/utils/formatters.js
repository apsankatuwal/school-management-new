export const date = (value) =>
  value ? new Date(value).toLocaleDateString() : "—";

export const userName = (user) =>
  user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "—";

export const itemLabel = (item, fallback = "—") =>
  item?.admissionNumber ||
  item?.employeeId ||
  item?.subjectName ||
  item?.examName ||
  item?.className ||
  fallback;

// "firstName" -> "First name"
export const human = (key) =>
  key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());