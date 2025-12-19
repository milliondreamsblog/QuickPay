import { useEffect } from "react"
import { Appbar } from "../components/Appbar"
import { Balance } from "../components/Balance"
import { Users } from "../components/Users"
import axios from "axios"
import { useState } from "react"

export const Dashboard = () => {
    const [balance , setBalance] = useState(0);
    useEffect(() => {
        const fetchBalance  = async () =>{
            try {
                const token = localStorage.getItem("token");
                console.log(token)
                const response = await axios.get("http://localhost:3000/api/v1/account/balance",
                    {
                        headers:{
                            Authorization : `Bearer ${token}`
                        }
                    }
                )

                setBalance(response.data.balance);
            } catch (error) {
                console.error("Failed to fetch balance", err);
            }
        }
        fetchBalance();
    },[])

    return <div>
        <Appbar />
        <div className="m-8">
            <Balance value={balance} />
            <Users />
        </div>
    </div>
}