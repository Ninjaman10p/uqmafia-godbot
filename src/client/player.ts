const getAPI = async (url: string, data: object): Promise<object> => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };
    const response = await fetch(url, options);
    return await response.json();
};

getAPI("/api/echo", { hi: "hi" }).then((res) => console.log(res));
