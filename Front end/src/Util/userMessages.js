import Message from "./Message";


export async function getContacts (setLoggedOut)  {
    const token = localStorage.getItem("Authentication")
    const res = await fetch("http://localhost:5018/api/contacts", {
      method: "Get",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
    }});
    if(res.status == 401){
        setLoggedOut(true);
    } else {
        const result = {}
        const jsonResult = await res.json();
        jsonResult.forEach(element => {
            result[element.id] = element;
        });
        return result;
    }
}

