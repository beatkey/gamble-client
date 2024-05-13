import Header from "@/components/shared/Header.jsx";
import {Button, Form, Input} from "antd";
import {useState} from "react";
import axios from "axios";

export default function Login() {
    const onFinish = async (values) => {
        try {
            const res = await axios.post(import.meta.env.VITE_API_URL + "login")
            console.log(res)
            /*await signIn("credentials", {
                email,
                password,
                redirect: false
            }).then((result) => {
                if (result.status === 200) {
                    router.push("/")
                } else {
                    if (result.error === "CredentialsSignin") {
                        toast("Email or password is wrong", {
                            type: "error",
                            position: "top-right",
                        });
                    } else {
                        toast("Server Error", {
                            type: "error",
                            position: "top-right",
                        });
                    }
                }
            })*/
        } catch (e) {
            console.error(e)
        }
    };

    return <>
        <Header/>

        <Form className="w-3/12 mx-auto mt-10" onFinish={onFinish}>
            <Form.Item
                label="Email"
                name="email"
                rules={[
                    {
                        required: true,
                        message: 'Please input your email!',
                    },
                ]}
            >
                <Input/>
            </Form.Item>
            <Form.Item
                label="Password"
                name="password"
                rules={[
                    {
                        required: true,
                        message: 'Please input your password!',
                    },
                ]}
            >
                <Input.Password/>
            </Form.Item>
            <Form.Item
                wrapperCol={{
                    offset: 8,
                    span: 16,
                }}
            >
                <Button type="primary" htmlType="submit">
                    Login
                </Button>
            </Form.Item>
        </Form>
    </>
}