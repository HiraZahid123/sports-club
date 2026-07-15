function getDateForDayOfWeek(dayName) {
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const targetDayIndex = daysOfWeek.findIndex((d) => d.toLowerCase() === dayName.toLowerCase());
  if (targetDayIndex === -1) return (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const today = /* @__PURE__ */ new Date();
  const currentDayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;
  const diff = targetDayIndex - currentDayIndex;
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + diff);
  return targetDate.toISOString().split("T")[0];
}
export {
  getDateForDayOfWeek as g
};
