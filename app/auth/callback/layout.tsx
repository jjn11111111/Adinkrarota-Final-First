/** PKCE ?code= is sensitive; avoid CDN/static shell cache treating this like generic HTML. */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AuthCallbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
