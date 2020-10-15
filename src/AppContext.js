import React, {useState, createContext} from 'react'

export const AppContext = createContext();

export const AppContextProvider = props =>
{
    const [userId, setUserId] = useState("");
    const [isUserAdmin, setIsUserAdmin] = useState(false);

    const [hasPermissionForSubscriptions, setHasPermissionForSubscriptions] = useState(false);
    const [hasPermissionForCreateSubscriptions, setHasPermissionForCreateSubscriptions] = useState(false);
    const [hasPermissionForEditSubscriptions, setHasPermissionForEditSubscriptions] = useState(false);
    const [hasPermissionForDeleteSubscriptions, setHasPermissionForDeleteSubscriptions] = useState(false);
    
    const [hasPermissionForMovies, setHasPermissionForMovies] = useState(false);
    const [hasPermissionForCreateMovies, setHasPermissionForCreateMovies] = useState(false);
    const [hasPermissionForEditMovies, setHasPermissionForEditMovies] = useState(false);
    const [hasPermissionForDeleteMovies, setHasPermissionForDeleteMovies] = useState(false);

    const [loginUserName, setLoginUserName] = useState(""); 

    const [filterMovieName, setFilterMovieName] = useState("");

    
    return(
        <AppContext.Provider value={
            {
                userId: [userId, setUserId],
                isUserAdmin: [isUserAdmin, setIsUserAdmin],
                
                hasPermissionForSubscriptions: [hasPermissionForSubscriptions, setHasPermissionForSubscriptions],
                hasPermissionForCreateSubscriptions: [hasPermissionForCreateSubscriptions, setHasPermissionForCreateSubscriptions],
                hasPermissionForEditSubscriptions: [hasPermissionForEditSubscriptions, setHasPermissionForEditSubscriptions],
                hasPermissionForDeleteSubscriptions: [hasPermissionForDeleteSubscriptions, setHasPermissionForDeleteSubscriptions],
              
                hasPermissionForMovies: [hasPermissionForMovies, setHasPermissionForMovies],
                hasPermissionForCreateMovies: [hasPermissionForCreateMovies, setHasPermissionForCreateMovies],
                hasPermissionForEditMovies: [hasPermissionForEditMovies, setHasPermissionForEditMovies],
                hasPermissionForDeleteMovies: [hasPermissionForDeleteMovies, setHasPermissionForDeleteMovies],
         
                loginUserName:[loginUserName, setLoginUserName],

                filterMovieName: [filterMovieName, setFilterMovieName],

            }}>
            {props.children}
        </AppContext.Provider>
    )
}