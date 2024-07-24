"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
exports.Users = {
    slug: "users",
    auth: {
        verify: {
            generateEmailHTML: function (_a) {
                var req = _a.req, token = _a.token, user = _a.user;
                return "<a href='".concat(process.env.NEXT_PUBLIC_SERVER_URL, "/verify-email?token=").concat(token, "'>Please veriify your email</a>");
            }
        }
    },
    access: {
        read: function () { return true; },
        create: function () { return true; }
    },
    fields: [
        {
            name: 'role',
            defaultValue: 'user',
            required: true,
            // admin : {
            //     condition : ({req}) => false
            // },
            type: 'select',
            options: [
                { label: "Admin", value: "admin" },
                { label: "User", value: "user" }
            ]
        }
    ]
};
