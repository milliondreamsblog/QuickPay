import axios from "axios";
import { useEffect, useState } from "react"

export const Appbar = () => {

    const[name , SetName] = useState("");
    
    useEffect(() => {
        const fetchUser = async () =>{
            try{
                const response = await axios.get("http://localhost:3000/api/v1/user/me",
                    {
                        headers:{
                            Authorization : "Bearer " + localStorage.getItem("token")
                        }
                    }
                )
                SetName(response.data.firstname)
            }catch(err){
                console.error(err);
            }
        }
        fetchUser();
    },[])

    return <div className="shadow h-14 flex justify-between">
        <div className="flex flex-col justify-center h-full ml-4">
            PayTM App
        </div>
        <div className="flex">
            <div className="flex flex-col justify-center h-full mr-4">
                Hello ,{name}
            </div>
            <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                <div className="flex flex-col justify-center h-full text-xl">
                    {name?name[0].toUpperCase() : "U"}
                </div>
            </div>
        </div>
    </div>
}