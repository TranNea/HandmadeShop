import { useContext, useEffect, useState } from "react";
import { UserContext } from "../configs/MyContext";
import { authAPI, endpoints } from "../configs/API";
import Loading from "../layouts/Loading";
import { Navigate } from "react-router-dom";

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const [editPassword, setEditPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");

    //Lấy thông tin user từ context
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
            let updatedData = {
                first_name: firstName,
                last_name: lastName,
                email: email,
                phone: phone,
                address1: address1,
                address2: address2,
            };

            if (newPassword === confirmPassword && newPassword !== "") {
                updatedData.password = newPassword;
            }

            await authAPI().patch(endpoints['current-user'], updatedData);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error(error);
        }
    };

    if (user === null) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="max-w-container mx-auto px-4">
            <h1 className="text-5xl text-primeColor font-titleFont text-center font-bold pb-10">Profile</h1>

            {loading ? (
                <Loading />
            ) : profile ? (
                <div className="bg-gray-100 p-6 rounded-md shadow-md max-w-xl mx-auto">

                    <div className="mb-6">
                        <h2 className="text-xl font-bold">Basic Info</h2>

                        <div className="flex justify-between mb-2">
                            <p className="text-lg">Username: {profile.username}</p>
                            <p className="text-lg">ID: {profile.id}</p>
                        </div>

                        <p className="text-lg">Date Joined: {new Date(profile.date_joined).toLocaleDateString()}</p>

                        <div className="flex justify-between mb-2">
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="border px-2 py-1 w-1/2"
                                placeholder="First Name"
                            />

                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="border px-2 py-1 w-1/2 ml-2"
                                placeholder="Last Name"
                            />
                        </div>

                        <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={() => setEditPassword(!editPassword)}>
                            Change Password
                        </button>

                        {editPassword && (
                            <div className="mt-4">
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="border px-2 py-1 w-full mb-2"
                                    placeholder="Current Password"
                                />
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="border px-2 py-1 w-1/2"
                                    placeholder="New Password"
                                />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="border px-2 py-1 w-1/2 ml-2"
                                    placeholder="Confirm Password"
                                />
                            </div>
                        )}
                    </div>


                    <div className="flex justify-between mb-6">
                        <div className="w-1/2 pr-2">
                            <h2 className="text-xl font-bold">Contacts</h2>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="border px-2 py-1 w-full"
                                placeholder="Email"
                            />
                        </div>

                        <div className="w-1/2 pl-2">
                            <h2 className="text-xl font-bold">Phone</h2>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="border px-2 py-1 w-full"
                                placeholder="Phone"
                            />
                        </div>
                    </div>

                    <div className="flex justify-between mb-6">
                        <div className="w-1/2 pr-2">
                            <h2 className="text-xl font-bold">Address 1</h2>
                            <input
                                type="text"
                                value={address1}
                                onChange={(e) => setAddress1(e.target.value)}
                                className="border px-2 py-1 w-full"
                                placeholder="Address 1"
                            />
                        </div>

                        <div className="w-1/2 pl-2">
                            <h2 className="text-xl font-bold">Address 2</h2>
                            <input
                                type="text"
                                value={address2}
                                onChange={(e) => setAddress2(e.target.value)}
                                className="border px-2 py-1 w-full"
                                placeholder="Address 2"
                            />
                        </div>
                    </div>

                    <button className="bg-green-500 text-white px-4 py-2 rounded-md" onClick={handleSave}> Save </button>
                </div>
            ) : (
                <p className="text-red-600">Could not load profile information.</p>
            )}
        </div>
    );
};

export default Profile;