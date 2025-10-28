export type DemoUser = {
  user_id: string;
  role: "consumer" | "farmer" | "manufacturer" | "processor" | "distributor" | "retailer";
  full_name?: string;
  company_name?: string;
};

const LS_KEY = "demoUser";

export function setDemoUser(u: DemoUser) {
  localStorage.setItem(LS_KEY, JSON.stringify(u));
}

export function getDemoUser(): DemoUser | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DemoUser;
  } catch {
    return null;
  }
}

export function clearDemoUser() {
  localStorage.removeItem(LS_KEY);
}
