import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";

const map: Record<string, string> = {
  "project-1": project1,
  "project-2": project2,
  "project-3": project3,
};

export function resolveImage(key: string | null | undefined): string | undefined {
  if (!key) return undefined;
  if (key.startsWith("http") || key.startsWith("/")) return key;
  return map[key];
}
