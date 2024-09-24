import { useContext, useEffect, useState } from "react";
import { UserContext } from "../configs/MyContext";
import { authAPI, endpoints } from "../configs/API";
import Loading from "../layouts/Loading";
import { Navigate } from "react-router-dom";

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const [editPassword, setEditPassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");

    const [user, dispatch] = useContext(UserContext);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                let res = await authAPI().get(endpoints['current-user']);

                setProfile(res.data);

                setFirstName(res.data.first_name);
                setLastName(res.data.last_name);
                setEmail(res.data.email);
                setPhone(res.data.phone);
                setAddress1(res.data.address1);
                setAddress2(res.data.address2);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    const handleSave = async () => {
        try {
            setPasswordError("");

            if (editPassword && newPassword !== confirmPassword) {
                setPasswordError("New Password and Confirm Password do not match!");
                return;
            }

            let formData = new FormData();
            formData.append('first_name', firstName);
            formData.append('last_name', lastName);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('address1', address1);
            formData.append('address2', address2 || "");

            if (newPassword && newPassword === confirmPassword) {
                formData.append('password', newPassword);
            }

            await authAPI().patch(endpoints['current-user'], formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            alert("Profile updated successfully!");
        } catch (error) {
            console.error(error);
        }
    };


    if (user === null) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="mx-auto">
            <h1 className="text-5xl text-primeColor font-titleFont text-center font-bold pb-10">Profile</h1>

            {loading ? (
                <Loading />
            ) : profile ? (
                <div className="border p-6 rounded-md shadow-md w-full">

                    <div className="mb-6">
                        <h2 className="text-xl font-bold border-b-2 pb-2 mb-4">Basic Info</h2>

                        <div className="flex justify-between mb-2">
                            <p className="px-2 font-medium">Username: {profile.username}</p>
                            <p className="px-2 font-medium">ID: {profile.id}</p>
                        </div>

                        <p className="px-2 font-medium mb-2">Date joined: {new Date(profile.date_joined).toLocaleDateString()}</p>

                        <div className="flex justify-between mb-2" >
                            <div className="pr-2" style={{ minWidth: '500px'}}>
                                <p className="text-base font-titleFont font-semibold px-2">First Name</p>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
                                    placeholder="Enter your first name"
                                />
                            </div>

                            <div className="pl-2" style={{ minWidth: '500px', marginLeft: "150px" }}>
                                <p className="text-base font-titleFont font-semibold px-2">Last Name</p>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
                                    placeholder="Enter your last name"
                                />
                            </div>
                        </div>

                        <button className="bg-black mx-auto text-gray-200 h-10 font-titleFont text-base tracking-wide font-semibold hover:text-white duration-200"
                            onClick={() => setEditPassword(!editPassword)}
                            style={{ marginTop: "10px", width: 'auto', padding:'0 10px'}}>
                            Change Password
                        </button>

                        {editPassword && (
                            <div style={{ margin: "10px"}}>
                                <p className="text-base font-titleFont font-semibold px-2">New Password</p>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-1/2 py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
                                    placeholder="New Password"
                                />

                                <p className="text-base font-titleFont font-semibold px-2" style={{ marginTop: "10px"}}>Confirm Password</p>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-1/2 py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
                                    placeholder="Confirm Password"
                                />
                                {passwordError && <p className="text-red-600">{passwordError}</p>}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between mb-6" style={{ marginTop: '50px'}}>
                        <div className="pr-2" style={{ minWidth: '500px'}}>
                            <h2 className="text-xl font-bold border-b-2 pb-2 mb-4">Contacts</h2>

                            <p className="text-base font-titleFont font-semibold px-2">Email</p>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
                                placeholder="Email"
                            />

                            <p className="text-base font-titleFont font-semibold px-2" style={{ marginTop: "10px"}}>Phone</p>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
                                placeholder="Phone"
                            />
                        </div>

                        <div className="pl-2" style={{ minWidth: '500px', marginLeft: "150px" }}>
                            <h2 className="text-xl font-bold border-b-2 pb-2 mb-4">Address</h2>

                            <p className="text-base font-titleFont font-semibold px-2">Address 1</p>
                            <input
                                type="text"
                                value={address1}
                                onChange={(e) => setAddress1(e.target.value)}
                                className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
                                placeholder="Address 1"
                            />

                            <p className="text-base font-titleFont font-semibold px-2" style={{ marginTop: "10px"}}>Address 2</p>
                            <input
                                type="text"
                                value={address2}
                                onChange={(e) => setAddress2(e.target.value)}
                                className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
                                placeholder="Address 2"
                            />
                        </div>
                    </div>

                    <button className="mx-auto block bg-black text-gray-200 h-10 font-titleFont text-base tracking-wide font-semibold hover:text-white duration-200"
                        onClick={handleSave}
                        style={{ width: 'auto', padding:'0 10px'}}>
                        Save
                    </button>
                </div>
            ) : (
                <p className="text-red-600">Could not load profile information.</p>
            )}
        </div>
    );
};

export default Profile;