import "../css/DeviceForm.css";
export default function Login() {
  //   const [formData, setFormData] = useState({
  //     user_name: "",
  //     password: "",
  //   });
  return (
    <div className="Form-table bg-[#fff]  min-h-screen text-white poppins-bold">
      <form className="Form-container bg-[#3C5B6F] w-25 h-75 mr-25 text-center">
        <h3 className="Form-head">Login</h3>
        <div className="Form">
          <label className="Form-label">User name</label>
          <input
            type="text"
            name="user_name"
            placeholder={`Enter User name`}
            // value={formData.user_name}
            className="Form-input"
          />
          <label className="Form-label">Password</label>
          <input
            type="password"
            name="password"
            placeholder={`Enter Password`}
            // value={formData.password}
            className="Form-input"
          />
        </div>

        <button type="submit" className="Form-button bg-[#948979]">
          Login
        </button>
      </form>
    </div>
  );
}
