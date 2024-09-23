import { useContext, useState } from "react"
import { Button, Form } from "react-bootstrap"
import cookie from "react-cookies"
import { Link, Navigate } from "react-router-dom"
import API, { authAPI, endpoints } from "../configs/API"
import { UserContext } from "../configs/MyContext"
import Loading from "../layouts/Loading"

const Login = () => {
    const [username, setUsername] = useState()
    const [password, setPassword] = useState()
    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState()
    const [user, dispatch] = useContext(UserContext)

    const login = (evt) => {
        evt.preventDefault()

        const process = async () => {
            try {
                setLoading(true)
                setErr(null)

                const formData = new FormData();
                formData.append('username', username);
                formData.append('password', password);
                formData.append('client_id', 'RdRtHjCe8kucUQot4c2xDlDoYrMIHUg5ay3kKqGA');
                formData.append('client_secret', 'c1t1MseM5OOCkC46Ol7NvpoECyblHyJNKOXz5Zbc5Gj1OQW5tzjXKmEM3l9ai0x6m60uZ2hhXOkHrNOa5uuMtjS5vV7ruLyfyHObwOHBbttHfXHufbIArzbiPQb5uZ79');
                formData.append('grant_type', 'password');

                let res = await API.post(endpoints['login'], formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                //Lưu token vào cookie
                cookie.save("access_token", res.data.access_token)

                //Lưu thông tin người dùng hiện tại vào cookie
                let user = await authAPI().get(endpoints['current-user'])
                cookie.save("current-user", user.data)

                //Cập nhật trạng thái người dùng trong UserContext
                dispatch({
                    "type": "login",
                    "payload": user.data
                })
            } catch (ex) {
                setErr("Username or password is not correct!")
            } finally {
                setLoading(false)
            }
        }

        process()
    }

    if (user !== null)
        return <Navigate to="/" />

    return (
        <div className="max-w-container mx-auto px-4">
            <h1 className="text-5xl text-primeColor font-titleFont text-center font-bold pb-10">SIGN IN</h1>

            {err ? <div className="alert alert-danger">{err}</div> : ""}

            <Form onSubmit={login} className="w-[500px] h-auto py-6 flex flex-col gap-6">
                <Form.Group controlId="formBasicEmail">
                    <Form.Label className="text-base font-titleFont font-semibold px-2">Username</Form.Label>
                    <Form.Control type="text" required
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
                        placeholder="Username (Ex: test1234567)" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label className="text-base font-titleFont font-semibold px-2">Password</Form.Label>
                    <Form.Control type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
                        placeholder="Password" />
                </Form.Group>

                {loading ? <Loading /> :
                    <Button
                        className="w-44 bg-black mx-auto text-gray-200 h-10 font-titleFont text-base tracking-wide font-semibold hover:text-white duration-200"
                        type="submit"
                        variant="primary"
                    >
                        Sign in
                    </Button>}

            </Form>

            <p className="text-sm text-center font-titleFont font-medium">
                Don't have an Account?{" "}
                <Link to="/">
                    <span className="hover:text-blue-600 duration-300">Sign up</span>
                </Link>
            </p>
        </div>
    )
}

export default Login