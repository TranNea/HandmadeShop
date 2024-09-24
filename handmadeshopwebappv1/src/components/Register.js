import { useState } from "react"
import { Button, Form } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import API, { endpoints } from "../configs/API"
import Loading from "../layouts/Loading"

const Register = () => {
    const [user, setUser] = useState({
        "username": "",
        "password": "",
        "confirmPassword": "",
        "email": "",
        "firstName": "",
        "lastName": "",
        "address1": "",
    })
    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState()
    const nav = useNavigate()

    const register = (evt) => {
        evt.preventDefault()

        const process = async () => {
            let form = new FormData()
            form.append("username", user.username)
            form.append("password", user.password)
            form.append("email", user.email)
            form.append("first_name", user.firstName)
            form.append("last_name", user.lastName)
            form.append("address1", user.address1)
            form.append("is_active", true)

            try {
                setLoading(true)

                let res = await API.post(endpoints['register'], form, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })

                if (res.status === 201)
                    nav("/login")
            } catch (ex) {
                let e = ""
                for (let d of Object.values(ex.response.data))
                    e += `${d} <br />`
                setErr(e)
            } finally {
                setLoading(false)
            }

        }

        setErr(null)
        if (user.username === "" || user.password === "")
            setErr("Username and password are required!")
        else if (user.password !== user.confirmPassword)
            setErr("The passwords don't match!")
        else {
            setLoading(true)
            process()
        }
    }

    const setValue = (value, key) => {
        setUser({ ...user, [key]: value })
    }

    return (
        <div className="max-w-container mx-auto px-4">
            <h1 className="text-5xl text-primeColor font-titleFont text-center font-bold pb-10">SIGN UP</h1>

            {err ? <div className="alert text-red-600">{err}</div> : ""}

            <Form onSubmit={register} className="w-[500px] h-auto py-6 flex flex-col gap-6">
                <Form.Group controlId="username">
                    <Form.Label className="text-base font-titleFont font-semibold px-2">Username <span className="text-red-600">(*)</span></Form.Label>
                    <Form.Control type="text" required
                        value={user.username}
                        onChange={e => setValue(e.target.value, "username")}
                        className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
                        placeholder="Username (Ex: test1234567)" />
                </Form.Group>

                <Form.Group controlId="password">
                    <Form.Label className="text-base font-titleFont font-semibold px-2">Password <span className="text-red-600">(*)</span></Form.Label>
                    <Form.Control type="password" required
                        value={user.password}
                        onChange={e => setValue(e.target.value, "password")}
                        className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
                        placeholder="Password" />
                </Form.Group>

                <Form.Group controlId="confirm">
                    <Form.Label className="text-base font-titleFont font-semibold px-2">Confirm Password <span className="text-red-600">(*)</span></Form.Label>
                    <Form.Control type="password" required
                        value={user.confirmPassword}
                        onChange={e => setValue(e.target.value, "confirmPassword")}
                        className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
                        placeholder="Re-Enter Password" />
                </Form.Group>

                <Form.Group controlId="email">
                    <Form.Label className="text-base font-titleFont font-semibold px-2">Email <span className="text-red-600">(*)</span></Form.Label>
                    <Form.Control type="email" required
                        value={user.email}
                        onChange={e => setValue(e.target.value, "email")}
                        className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
                        placeholder="Your Email" />
                </Form.Group>

                <Form.Group controlId="first_name">
                    <Form.Label className="text-base font-titleFont font-semibold px-2">First Name</Form.Label>
                    <Form.Control type="text"
                        value={user.firstName}
                        onChange={e => setValue(e.target.value, "firstName")}
                        className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
                        placeholder="Your First Name" />
                </Form.Group>

                <Form.Group controlId="last_name">
                    <Form.Label className="text-base font-titleFont font-semibold px-2">Last Name</Form.Label>
                    <Form.Control type="text"
                        value={user.lastName}
                        onChange={e => setValue(e.target.value, "lastName")}
                        className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
                        placeholder="Your Last Name" />
                </Form.Group>

                <Form.Group controlId="address1">
                    <Form.Label className="text-base font-titleFont font-semibold px-2">Address</Form.Label>
                    <Form.Control type="text"
                        value={user.address1}
                        onChange={e => setValue(e.target.value, "address1")}
                        className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
                        placeholder="Your Address" />
                </Form.Group>

                {loading ? <Loading /> :
                    <Button
                        className="w-44 bg-black mx-auto text-gray-200 h-10 font-titleFont text-base tracking-wide font-semibold hover:text-white duration-200"
                        type="submit"
                        variant="primary"
                    >
                        Sign up
                    </Button>}
            </Form>

            <p className="text-sm text-center font-titleFont font-medium">
                Already have an Account?{" "}
                <Link to="/login">
                    <span className="hover:text-blue-600 duration-300">Sign in</span>
                </Link>
            </p>
        </div>
    )
}

export default Register