import { Spinner } from "./ui/spinner";

export default function LoadingPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Spinner />
    </div>
  );
}
