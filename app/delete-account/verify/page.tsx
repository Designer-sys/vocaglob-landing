import { Suspense } from "react";
import VerifyDeleteAccountContent from "./VerifyDeleteAccountContent";

export default function VerifyDeleteAccountPage() {
  return (
    <Suspense fallback={<p>Verifying your request...</p>}>
      <VerifyDeleteAccountContent />
    </Suspense>
  );
}