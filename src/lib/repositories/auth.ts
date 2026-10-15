export function mockLogin(email: string, _password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !normalizedEmail.includes("@")) return null;

  const name = normalizedEmail.split("@")[0] ?? "User";
  return {
    id: crypto.randomUUID(),
    name: name.charAt(0).toUpperCase() + name.slice(1),
    email: normalizedEmail,
  };
}

export function mockRegister(name: string, email: string, _password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !normalizedEmail.includes("@") || name.trim().length < 2) return null;

  return {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
  };
}
