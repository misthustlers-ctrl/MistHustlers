import RequireAuth from "@/components/RequireAuth";
import SeoAudit from "@/pages/SeoAudit";

export default function ProtectedSeoAudit() {
  return (
    <RequireAuth>
      <SeoAudit />
    </RequireAuth>
  );
}
