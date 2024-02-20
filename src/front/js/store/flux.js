const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
            token: null,
			// demo: [
			// 	{
			// 		title: "FIRST",
			// 		background: "white",
			// 		initial: "white"
			// 	},
			// 	{
			// 		title: "SECOND",
			// 		background: "white",
			// 		initial: "white"
			// 	}
			// ]
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},
			login: async (email, password) => {
                    let options = {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email: email, password: password}),
                    };
                    try{
                    const response = await fetch(process.env.BACKEND_URL + "/api/login", options)
                    console.log('Login response:', response);
                    if (response.status === 200) {
                        const data = await response.json();
                        console.log("access token", data);
                        sessionStorage.setItem("token", data.access_token);
                        // sessionStorage.setItem("email", email);
                        setStore({
                            token: data.access_token,
                            email: email,
                        });
                        return true;
                    } else {
                        console.error("Login failed. Please check your credentials.", response.status);
                        return false;
                    }
                } catch (error) {
                    console.error("Login error:", error); 
                    alert("An error occurred during login.");
                    return false;
                }
                
            },
            signup: async (formData) => {
                try {
                    const response = await fetch(process.env.BACKEND_URL + "/api/signup", {
                        method: "POST",
                        mode: "cors",
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*',
                        },
                        body: JSON.stringify({
                            email: formData.email,
                            password: formData.password,
                        })
                    });
                    let data = await response.json();
                    if (data) {
                        console.log(data.message);
                        return true;
                    }
                } catch (error) {
                    console.log(error);

                }
            },
			getUser: async () => {
                try {
                    const token = sessionStorage.getItem("token");
                    const response = await fetch(`${process.env.BACKEND_URL}/api/user`,
                        {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`,
                            }

                        }

                    )
                    let data = await response.json();
                    return await data
                }
                catch (error) {
                    throw new Error(`Error: ${error.message}`);
                }
			},
			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			}
		}
	};
};

export default getState;
