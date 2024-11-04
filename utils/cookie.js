export async function checkCookie(api) {
    const res = await fetch(api, {
        method: "GET",
        credentials: 'include', 
        headers: {
            "Content-Type": "application/json",
        },
          // This allows the browser to send the cookies
    });
    
    if (res.status === 200) {
        const response = await res.json();
        return { statusCode: 200, response };
    } else if (res.status === 401) {
        return { statusCode: 401 };
    }
}