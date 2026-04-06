/** ?reason= is user-specific; do not serve a shared cached shell from the edge. */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AuthErrorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
