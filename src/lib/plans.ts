export const plans = {
  free: {
    name: "Free",
    limit: 10,
  },
  pro: {
    name: "Pro",
    limit: 100,
  },
  enterprise: {
    name: "Enterprise",
    limit: Infinity,
  },
};

export const getUserPlan = () => {
  // In a real app, you'd get this from your auth provider or backend
  const storedPlan = localStorage.getItem("userPlan");
  return storedPlan ? JSON.parse(storedPlan) : plans.free;
};

export const setUserPlan = (plan) => {
  localStorage.setItem("userPlan", JSON.stringify(plan));
  window.dispatchEvent(new Event("storage"));
}; 