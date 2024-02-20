import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const Signup = () => {
  const { store, actions } = useContext(Context);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const Navigate = useNavigate();
  const signup = async (e) => {
    e.preventDefault()
    try {
      let response = await fetch(process.env.BACKEND_URL + "/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password })

      })
      let data = await response.json()
      if (data) {
        Navigate("/login");
      } else {
        console.log(response);
      }
    }
    catch (error) {
      console.log(error)
    }
  }
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };
  const handleSubmit = async () => {
    const requiredFields = ["email", "password"];

    if (password !== confirmPassword) {
      console.error("Passwords do not match");
      return;
    }

    let result = await actions.signup(formData);

    if (result) {
      const destination = result ? "/" : "/signup";
      Navigate(destination);
      setFormData({
        email: "",
        password: ""
      });
      setConfirmPassword(""); // Reset confirmPassword as well
    }
  }
  return (
    <form onSubmit={signup} className="container">
      <div className="mb-3">
        <label htmlFor="exampleInputEmail" className="form-label">
          Email address
        </label>
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          className="form-control"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
        />
        <div id="emailHelp" className="form-text">
          {error}
        </div>
      </div>
      <div className="mb-3">
        <label htmlFor="exampleInputPassword1" className="form-label">
          Password
        </label>
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          placeholder="*******"
          type="password"
          className="form-control"
          id="exampleInputPassword1"
          name="password"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="exampleInputPassword1" className="form-label">
          Confirm Password
        </label>
        <input
          onChange={handleConfirmPasswordChange}
          value={confirmPassword}
          placeholder="*******"
          type="password"
          className="form-control"
          id="exampleConfirmPassword"
          name="confirmPassword"
          required
        />
      </div>
      <div className="mb-3 form-check">
        <input type="checkbox" className="form-check-input" id="exampleCheck" />
        <label className="form-check-label" htmlFor="exampleCheck">
          Remember Me
        </label>
      </div>
      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-success">
          Submit
        </button>
        <Link to="/Login">
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </Link>
      </div>

    </form>
  );
}