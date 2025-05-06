import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function SectionHeader({ header, description, ...props }) {
    return (_jsxs("div", { ...props, children: [_jsx("h3", { className: "text-xl font-bold", children: header }), _jsx("h4", { className: "text-sm text-muted-fg", children: description })] }));
}
