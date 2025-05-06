import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "@src/lib/utils";
export default function Divider(props) {
    const { className, ...rest } = props;
    return (_jsx("hr", { className: cn("bg-white border-0.5 bg-background my-6", className || ""), ...rest }));
}
