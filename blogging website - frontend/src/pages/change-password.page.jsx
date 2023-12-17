import { useContext, useRef } from "react";
import AnimationWrapper from "../common/page-animation";
import InputBox from "../components/input.component";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { UserContext } from "../App";

const ChangePassword = () => {
  let {
    userAuth: { access_token },
  } = useContext(UserContext);
  let changePasswordForm = useRef();
  let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

  const handleSubmit = (e) => {
    e.preventDefault();
    let form = new FormData(changePasswordForm.current);
    let formData = {};
    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }
    let { currentPassword, newPassword } = formData;
    if (!currentPassword.length || !newPassword.length) {
      return toast.error("Please fill all the fields");
    }
    if (
      !passwordRegex.test(currentPassword) ||
      !passwordRegex.test(newPassword)
    ) {
      return toast.error(
        "Password must be at least 6 characters long and contain at least one number, one lowercase and one uppercase letter"
      );
    }

    e.target.setAttribute("disabled", true);
    let loadingToast = toast.loading("Changing Password...");
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/change-password", formData, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then(() => {
        toast.dismiss(loadingToast);
        e.target.removeAttribute("disabled");
        return toast.success("Password changed successfully");
      })
      .catch(({ response }) => {
        toast.dismiss(loadingToast);
        e.target.removeAttribute("disabled");
        return toast.error(response.data.error);
      });
  };
  return (
    <AnimationWrapper>
      <Toaster />
      <form ref={changePasswordForm}>
        <h1 className="max-md:hidden">Change Password</h1>
        <div className="py-10 w-full md:max-w-[400px]">
          <InputBox
            name="currentPassword"
            type="password"
            className="profile-edit-input"
            placeholder="Current Password"
            icon="fi-rr-unlock"
          />
          <InputBox
            name="newPassword"
            type="password"
            className="profile-edit-input"
            placeholder="New Password"
            icon="fi-rr-unlock"
          />
          <button
            onClick={handleSubmit}
            className="btn-dark px-10"
            type="submit"
          >
            Change Password
          </button>
        </div>
      </form>
    </AnimationWrapper>
  );
};

export default ChangePassword;
