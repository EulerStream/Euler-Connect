import { Button } from "@src/components/ui/button";
import { to } from "@src/lib/utils";

export default function NotFound() {
  return (
    <div>
      <h1 className={"text-xl mb-3"}>Page Not Found!</h1>
      <Button onClick={() => to("/")}>Return Home</Button>
    </div>
  );
}
