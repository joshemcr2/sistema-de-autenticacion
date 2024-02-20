import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Private = () => {
    const [isValid, setIsValid] = useState("pending")
    const navigate = useNavigate()
    useEffect(() => {
        const checkToken = async () => {
            try {
                let response = await fetch(process.env.BACKEND_URL + "/api/private",
                    { headers: { Authorization: "Bearer " + sessionStorage.getItem("token") } })
                if (response.status == 200) {
                    setIsValid(true)
                }
                else {
                    setIsValid(false)
                }

            }
            catch (error) {
                console.log(error)
            }
        }
        checkToken()
    }, []);
    switch (isValid) {
        case "pending":
            return ("checking your access status")
        case true:
            return (
                <div>Congrats you have access!</div>
            )
        case false:
            return ("Sorry, you don't have access")
    }

}