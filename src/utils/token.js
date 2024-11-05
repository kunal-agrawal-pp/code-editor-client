export const getUUID = () => {
    // return uuid form cookie of user browser
    // if uuid value is null or not present in cookie than return null
    try {
        const cookieUUID = document.cookie.split(";").find(c => c.trim().startsWith("uuid=")).split("=")[1];
        return cookieUUID;
    } catch (error) {
        return null;
    }
}

export const getToken = () => {
    // return uuid form cookie of user browser
    // if uuid value is null or not present in cookie than return null
    try {
        const cookieUUID = document.cookie.split(";").find(c => c.trim().startsWith("token=")).split("=")[1];
        return cookieUUID;
    } catch (error) {
        return null;
    }
}

export const getCookieValue = (key) => {
    // return uuid form cookie of user browser
    // if uuid value is null or not present in cookie than return null
    try {
        const cookieUUID = document.cookie.split(";").find(c => c.trim().startsWith(`${key}=`)).split("=")[1];
        return cookieUUID;
    } catch (error) {
        return null;
    }
}