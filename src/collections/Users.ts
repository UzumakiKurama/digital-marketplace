import { CollectionConfig } from "payload/types";

export const Users : CollectionConfig = {
    slug : "users",
    auth : {
        verify : {
            generateEmailHTML : ({req, token, user}) => {
                return `<a href='${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${token}'>Please veriify your email</a>`
            }
        }
    },
    access : {
        read : () => true,
        create : () => true
    },
    fields : [
        {
            name : 'role',
            defaultValue : 'user',
            required : true,
            // admin : {
            //     condition : ({req}) => false
            // },
            type : 'select',
            options : [
                {label : "Admin", value: "admin"},
                {label : "User", value: "user"}
            ]
        }
    ]
}